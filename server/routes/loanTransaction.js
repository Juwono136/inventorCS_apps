import express from "express";
import { auth } from "../middleware/auth.js";
import { authAdminOrStaff } from "../middleware/authAdminOrStaff.js";
import { createLoanTransaction } from "../controllers/loanTransaction.js";

const router = express.Router()

router.post("/create_loan", auth, createLoanTransaction)

export default router