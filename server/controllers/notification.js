import Notification from '../models/notification.js'

// create notification
export const createNotification = async (user_id, loan_transaction, message) => {
    try {
        const notification = await Notification.create({
            user_id,
            loan_transaction,
            message,
            is_read: false
        })

        return notification
    } catch (error) {
        throw new Error(error.message);
    }
}

// get all notification by user
export const getNotificationByUser = async (req, res) => {
    try {
        const notification = await Notification.find({ user_id: { $in: [req.user._id] } })
            .populate('loan_transaction')
            .sort({ createdAt: -1 })
            .exec();

        res.json({ message: "User notifications retrieved successfully.", notification })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// mark a notification as read
export const markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id
        const notification = await Notification.findByIdAndUpdate(notificationId, { is_read: true }, { new: true })

        if (!notification) {
            return res.status(404).json({ message: "Notification not found." })
        }

        res.json({ message: "Notification marked as read", notification })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const markAllNotiticationAsRead = async (req, res) => {
    try {
        const userId = req.user._id

        const result = await Notification.updateMany(
            { user_id: { $in: [userId] }, is_read: false },
            { is_read: true }
        );

        res.json({
            message: "All notifications marked as read.",
            result
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}