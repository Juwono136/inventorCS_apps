import Meetings from '../models/meeting.js'
import LoanTransactions from '../models/loanTransaction.js';
import { createNotification } from './notification.js';
import { getStaffsForProgram } from './loanTransaction.js';
import { sendMail } from '../utils/sendMail.js';
import { getChannel } from '../utils/rabbitmq.js';

const { CLIENT_URL } = process.env

// create a request meeting
export const createMeeting = async (req, res) => {
    try {
        const { meeting_date, meeting_time, location } = req.body
        const loanTransactionId = req.params.id

        const loanTransaction = await LoanTransactions.findById(loanTransactionId)

        if (!loanTransaction) {
            return res.status(404).json({ message: "Loan transaction not found." });
        }

        const existingMeeting = await Meetings.findOne({ loanTransaction_id: loanTransactionId });
        if (existingMeeting) {
            return res.status(400).json({ message: "A meeting request has already been created for this loan transaction." })
        }

        if (loanTransaction.borrower_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to create a meeting for this loan transaction.",
            })
        }

        if (loanTransaction.loan_status !== "Ready to Pickup") {
            return res.status(404).json({ message: "Invalid loan transaction status for meeting request" })
        }

        if (!location || !meeting_date || !meeting_time) {
            return res.status(400).json({ message: "Invalid request meeting format." })
        }

        // validate and format meeting_date and meeting_time
        const now = new Date();
        now.setSeconds(0, 0);
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        const formattedMeetingDate = new Date(meeting_date)
        if (isNaN(formattedMeetingDate.getTime())) {
            return res.status(400).json({ message: "Invalid meeting date format." })
        }

        const meetingDay = formattedMeetingDate.getDay();
        if (meetingDay === 0 || meetingDay === 6) {
            return res.status(400).json({ message: "Meeting date must be on a weekday (Monday - Friday)." });
        }

        const expectedReturnDate = new Date(loanTransaction.expected_return_date);
        expectedReturnDate.setHours(23, 59, 59, 999);

        const [hours, minutes] = meeting_time.split(':').map(Number)

        const meetingDateTime = formattedMeetingDate
        meetingDateTime.setHours(hours, minutes, 0, 0)

        if (formattedMeetingDate < today) {
            return res.status(400).json({ message: "Meeting date cannot be earlier than today." })
        }

        if (formattedMeetingDate <= loanTransaction.pickup_time) {
            return res.status(400).json({ message: "Meeting Date or time must be after pickup date." })
        }

        if (formattedMeetingDate > expectedReturnDate) {
            return res.status(400).json({ message: "Meeting date cannot exceed the expected return date." });
        }

        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/ //HH:mm format
        if (!timeRegex.test(meeting_time)) {
            return res.status(400).json({ message: "Invalid meeting time format." })
        }

        // validate meeting date between 09:00 and 17:00
        if (hours < 9 || (hours === 9 && minutes < 0) || hours > 17 || (hours === 17 && minutes > 0)) {
            return res.status(400).json({
                message: "Meeting time must be between 09:00 and 17:00.",
            });
        }

        // meeting time cannot be earlier than current time
        if (meetingDateTime < now) {
            return res.status(400).json({
                message: "Meeting time cannot be earlier than the current time.",
            });
        }

        const uniquePrograms = [
            ...new Set(loanTransaction.borrowed_item.map(item => item.item_program))
        ];

        const newMeeting = await Meetings.create({
            loanTransaction_id: loanTransaction._id,
            meeting_date: formattedMeetingDate,
            meeting_time,
            location,
        })

        // create notification to borrower
        await createNotification(loanTransaction.borrower_id, loanTransaction._id, `Meeting request for transaction ID: ${loanTransaction.transaction_id} has been successfully cre ated. Next, please meet with our staff soon to pick up your loan item.`)

        // create notification to user staff
        const notificationPromises = uniquePrograms.map(async (program) => {
            const staffMembers = await getStaffsForProgram(req, program);
            const staffIds = staffMembers.map(staff => staff._id);

            // Send email notifications to staff
            // const staffEmails = staffMembers
            //     .filter(staff => staff.personal_info.program === program)
            //     .map(staff => staff.personal_info.email);

            // if (staffEmails.length > 0) {
            //     const url = `${CLIENT_URL}/user-loan/meeting-detail/${newMeeting._id}`;
            //     const emailSubject = "New Meeting Request Created";
            //     const emailTitle = "Meeting Request Notification";
            //     const emailText = `A meeting request has been created for transaction ID: ${loanTransaction.transaction_id}. Please review the meeting details and prepare to meet with the borrower.`;
            //     const btnEmailText = "View Meeting Details";

            //     sendMail(staffEmails, url, emailSubject, emailTitle, emailText, btnEmailText);
            // }

            if (staffIds.length > 0) {
                return createNotification(
                    staffIds,
                    loanTransaction._id,
                    `A meeting request has been created for transaction ID: ${loanTransaction.transaction_id}. Please review the details and meet with the borrower to complete the process.`
                );
            }

        })

        await Promise.all(notificationPromises);

        // stop auto-cancel in rabbitMQ
        const uniqueRoutingKey = `loan_auto_cancel_${loanTransactionId}`;
        const channel = getChannel();
        if (!channel) {
            console.error("RabbitMQ channel is not available.");
            return;
        }

        if (channel) {
            await channel.deleteQueue(uniqueRoutingKey);
            console.log(`Auto-cancel stopped for Loan Transaction ID: ${loanTransactionId}`);
        }

        res.json({
            message: "Meeting request created successfully.",
            newMeeting,
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// get all meeting request
export const getAllMeetings = async (req, res) => {
    try {
        const userProgram = req.userData.personal_info.program;

        if (!userProgram) {
            return res.status(400).json({ message: "User is not allowed for this request." })
        }

        // Query params
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        let sort = req.query.sort || "meeting_date";
        let status = req.query.meetingStatus || "All";
        let { meeting_date_start, meeting_date_end } = req.query;

        // Sorting
        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
        let sortBy = {};
        const sortField = sort[0];
        const sortOrder = sort[1] && sort[1].toLowerCase() === "asc" ? 1 : -1;
        sortBy[sortField] = sortOrder;

        // Status filter
        const matchStage = {
            "loanTransaction_info.borrowed_item.item_program": userProgram
        };

        const validStatuses = ["Need Approval", "Approved", "Meeting Cancelled"]
        if (status !== "All") {
            status = status.split(",");
            matchStage["status"] = { $in: status };
        }

        // Date filter
        if (meeting_date_start || meeting_date_end) {
            matchStage["meeting_date"] = {};
            if (meeting_date_start) matchStage["meeting_date"].$gte = new Date(meeting_date_start);
            if (meeting_date_end) matchStage["meeting_date"].$lte = new Date(meeting_date_end);
        }

        // Apply search filter (loanTransaction_id, meeting_time, location, status)
        const searchStage = [];
        if (search) {
            searchStage.push({
                $match: {
                    $or: [
                        { "loanTransaction_info.transaction_id": { $regex: search, $options: "i" } },
                        { "meeting_date": { $regex: search, $options: "i" } },
                        { "meeting_time": { $regex: search, $options: "i" } },
                        { "location": { $regex: search, $options: "i" } },
                        { "status": { $regex: search, $options: "i" } }
                    ]
                }
            });
        }

        // Count total documents
        const countAggregation = await Meetings.aggregate([
            {
                $lookup: {
                    from: "loantransactions",
                    localField: "loanTransaction_id",
                    foreignField: "_id",
                    as: "loanTransaction_info"
                }
            },
            {
                $unwind: "$loanTransaction_info"
            },
            {
                $match: matchStage
            },
            ...searchStage,
            {
                $count: "total"
            }
        ]);

        const totalMeetings = countAggregation[0]?.total || 0;

        // Main aggregation with pagination
        const meetings = await Meetings.aggregate([
            {
                $lookup: {
                    from: "loantransactions",
                    localField: "loanTransaction_id",
                    foreignField: "_id",
                    as: "loanTransaction_info"
                }
            },
            {
                $unwind: "$loanTransaction_info"
            },
            {
                $match: matchStage
            },
            ...searchStage,
            {
                $sort: sortBy
            },
            {
                $skip: page * limit
            },
            {
                $limit: limit
            },
            {
                $project: {
                    meeting_date: 1,
                    meeting_time: 1,
                    location: 1,
                    status: 1,
                    "loanTransaction_info._id": 1,
                    "loanTransaction_info.transaction_id": 1,
                    "loanTransaction_info.borrower_id": 1,
                    "loanTransaction_info.staff_id": 1,
                    "loanTransaction_info.borrowed_item": 1
                }
            }
        ]);

        return res.json({
            totalMeetings,
            totalPages: Math.ceil(totalMeetings / limit),
            page: page + 1,
            limit,
            statuses: validStatuses,
            meetings
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// get request meeting by loan id
export const getMeetingByLoanId = async (req, res) => {
    try {
        const loanTransactionId = req.params.id

        const meeting = await Meetings.findOne({ loanTransaction_id: loanTransactionId }).populate({
            path: "loanTransaction_id",
            model: "LoanTransactions",
            select: "_id transaction_id borrower_id staff_id borrowed_item"
        })

        // if (!meeting) {
        //     return res.status(404).json({ message: "Request Meeting not found" })
        // }

        res.json(meeting)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// change meeting status to approved by staff
export const approveMeeting = async (req, res) => {
    try {
        const meetingId = req.params.id

        const meeting = await Meetings.findById(meetingId).populate({
            path: "loanTransaction_id",
            model: "LoanTransactions",
            select: "transaction_id borrower_id staff_id borrowed_item",
        })

        if (!meeting) {
            return res.status(404).json({ message: "Meeting not found." });
        }

        if (meeting.status === "Approved") {
            return res.status(400).json({ message: "Meeting is already approved." });
        }

        meeting.status = "Approved";
        meeting.meeting_confirmed_date = new Date();
        await meeting.save();

        // create notification to borrower
        await createNotification(
            meeting.loanTransaction_id.borrower_id,
            meeting.loanTransaction_id.transaction_id,
            `Your meeting request (Transaction ID: ${meeting.loanTransaction_id.transaction_id}) has been approved. Please meet the staff on ${meeting.meeting_date.toDateString()} at ${meeting.meeting_time}.`
        )

        return res.json({
            message: "Meeting approved successfully.",
            meeting
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}