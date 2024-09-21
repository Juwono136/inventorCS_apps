import express from "express";
import { auth } from "../middleware/auth.js";
import { authAdminOrStaff } from "../middleware/authAdminOrStaff.js";
import { createLoanTransaction, getAllLoanTransactions, getLoanTransactionsByUser, updateStatusToBorrowed, updateStatusToReturned } from "../controllers/loanTransaction.js";

const router = express.Router()

router.get("/all_loan", auth, authAdminOrStaff, getAllLoanTransactions)
router.get("/all_user_loan", auth, getLoanTransactionsByUser)

router.post("/create_loan", auth, createLoanTransaction)

router.patch("/borrowed_loan/:id", auth, authAdminOrStaff, updateStatusToBorrowed)
router.patch("/returned_loan/:id", auth, authAdminOrStaff, updateStatusToReturned)

export default router