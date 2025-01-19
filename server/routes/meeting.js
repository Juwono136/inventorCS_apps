import express from "express";
import { auth } from "../middleware/auth.js";
import { authStaff } from "../middleware/authStaff.js";
import { createMeeting, getAllMeetings } from "../controllers/meeting.js";

const router = express.Router()

router.get("/all_meeting", auth, authStaff, getAllMeetings)

router.post("/create_meeting/:id", auth, createMeeting)

export default router