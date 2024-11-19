import express from "express";
import { auth } from "../middleware/auth.js";
import { authStaff } from "../middleware/authStaff.js";
import { cancelLoanTransaction, confirmReceiveByBorrower, confirmReturnedByBorrower, createLoanTransaction, getAllLoanTransactions, getLoanTransactionById, getLoanTransactionsByUser, updateStatusToBorrowed, updateStatusToReadyToPickup, updateStatusToReturned } from "../controllers/loanTransaction.js";

const router = express.Router()

router.get("/user_loan", auth, getLoanTransactionsByUser)
router.get("/all_loan", auth, authStaff, getAllLoanTransactions)
router.get("/loanTransactions/:id", auth, authStaff, getLoanTransactionById)

router.post("/create_loan", auth, createLoanTransaction)

router.patch("/ready_to_loan/:id", auth, authStaff, updateStatusToReadyToPickup)
router.patch("/borrowed_loan/:id", auth, authStaff, updateStatusToBorrowed)
router.patch("/confirm_receive/:id", auth, confirmReceiveByBorrower)
router.patch("/returned_loan/:id", auth, authStaff, updateStatusToReturned)
router.patch("/confirm_returned/:id", auth, confirmReturnedByBorrower)
router.patch("/cancelled_loan/:id", auth, cancelLoanTransaction)

export default router