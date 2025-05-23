import express from "express";
import { auth } from "../middleware/auth.js";
import { authStaff } from "../middleware/authStaff.js";
import { checkUserProgram } from "../middleware/checkUserProgram.js";
import { cancelLoanTransaction, confirmReturnedByBorrower, createLoanTransaction, getAllLoanTransactions, getLoanTransactionById, getLoanTransactionsByUser, markTransactionIsNew, staffConfirmHandover, staffConfirmReturn, updateStatusToReadyToPickup, userConfirmReceipt } from "../controllers/loanTransaction.js";

const router = express.Router()

router.get("/user_loan", auth, getLoanTransactionsByUser)
router.get("/all_loan", auth, authStaff, checkUserProgram, getAllLoanTransactions)
router.get("/loanTransactions/:id", auth, authStaff, getLoanTransactionById)

router.post("/create_loan", auth, createLoanTransaction)

router.patch("/transaction_is_new/:id", auth, authStaff, markTransactionIsNew)
router.patch("/ready_to_loan/:id", auth, authStaff, updateStatusToReadyToPickup)
router.patch("/confirm_handover/:id", auth, authStaff, staffConfirmHandover)
router.patch("/user_confirm_receipt/:id", auth, userConfirmReceipt)
router.patch("/confirm_return_by_staff/:id", auth, authStaff, staffConfirmReturn)
router.patch("/user_confirm_returned/:id", auth, confirmReturnedByBorrower)
router.patch("/cancelled_loan/:id", auth, cancelLoanTransaction)

export default router