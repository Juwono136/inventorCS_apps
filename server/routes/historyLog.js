import express from "express";
import { auth } from "../middleware/auth.js";
import { authAdmin } from "../middleware/authAdmin.js";
import { checkUserProgram } from "../middleware/checkUserProgram.js";
import { getHistoryLogs } from "../controllers/historyLog.js";

const router = express.Router();

router.get("/get_logs", auth, authAdmin, checkUserProgram, getHistoryLogs);

export default router;
