import express from "express";
import { auth } from "../middleware/auth.js";
import { authStaff } from "../middleware/authStaff.js";
import { checkUserProgram } from "../middleware/checkUserProgram.js";
import { createMeeting, getAllMeetings, getMeetingByLoanId } from "../controllers/meeting.js";

const router = express.Router()

router.get("/all_meetings", auth, authStaff, checkUserProgram, getAllMeetings)
router.get("/get_meeting_by_loan/:id", auth, getMeetingByLoanId)

router.post("/create_meeting/:id", auth, createMeeting)

export default router