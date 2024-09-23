import express from "express";
import { auth } from "../middleware/auth.js";
import { authAdminOrStaff } from "../middleware/authAdminOrStaff.js";
import { cancelLoanTransaction, createLoanTransaction, getAllLoanTransactions, getLoanTransactionsByUser, updateStatusToBorrowed, updateStatusToReturned } from "../controllers/loanTransaction.js";

const router = express.Router()

router.get("/all_loan", auth, authAdminOrStaff, getAllLoanTransactions)
router.get("/user_loan", auth, getLoanTransactionsByUser)

router.post("/create_loan", auth, createLoanTransaction)

router.patch("/borrowed_loan/:id", auth, authAdminOrStaff, updateStatusToBorrowed)
router.patch("/returned_loan/:id", auth, authAdminOrStaff, updateStatusToReturned)
router.patch("/cancelled_loan/:id", auth, cancelLoanTransaction)

export default router