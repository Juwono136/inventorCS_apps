import express from 'express';
import { auth } from '../middleware/auth.js';
import { getNotificationByUser, markNotificationAsRead } from '../controllers/notification.js';

const router = express.Router()

router.get("/user_notification", auth, getNotificationByUser)

router.patch("/read_notification/:id", auth, markNotificationAsRead)

export default router