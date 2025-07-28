import axios from "axios";

const API_URL = "/service/loan";

// get all loan transaction
const getAllLoanTransactions = async (token, params) => {
  const response = await axios.get(API_URL + "/all_loan", {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  return response.data;
};

// get loan transaction by id
const getLoanTransactionById = async (token, loanId) => {
  const response = await axios.get(API_URL + `/loanTransactions/${loanId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// get user's loan transaction
const getLoanTransactionsByUser = async (token, params) => {
  const response = await axios.get(API_URL + "/user_loan", {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  return response.data;
};

// create loan transaction
const createLoanTransaction = async (loanData, token) => {
  const response = await axios.post(API_URL + "/create_loan", loanData, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// mark transaction is new or not
const markTransactionIsNew = async (id, token) => {
  const response = await axios.patch(
    API_URL + `/transaction_is_new/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

// update loan status to ready to pickup
const updateStatusToReadyToPickup = async (data, token) => {
  const response = await axios.patch(API_URL + `/ready_to_loan/${data._id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// staff confirm handover loan items
const staffConfirmHandover = async (loanId, checkedItemIds, token) => {
  const response = await axios.patch(
    API_URL + `/confirm_handover/${loanId}`,
    { checkedItemIds },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

// borrower confirms the loan items (update loan status to borrowed)
const userConfirmReceipt = async (data, token) => {
  const response = await axios.patch(API_URL + `/user_confirm_receipt/${data._id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// staff confirms receiving returned loan items
const staffConfirmReturn = async (loanId, checkedReturnedItemIds, loan_note, token) => {
  const response = await axios.patch(
    API_URL + `/confirm_return_by_staff/${loanId}`,
    { checkedReturnedItemIds, loan_note },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

// confirm loan item has already returned by borrower
const confirmReturnedByBorrower = async (data, token) => {
  const response = await axios.patch(API_URL + `/user_confirm_returned/${data._id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// cancel loan transaction by user
const cancelLoanTransaction = async (data, token) => {
  const response = await axios.patch(API_URL + `/cancelled_loan/${data._id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

const loanService = {
  getAllLoanTransactions,
  getLoanTransactionsByUser,
  getLoanTransactionById,
  createLoanTransaction,
  markTransactionIsNew,
  updateStatusToReadyToPickup,
  staffConfirmHandover,
  userConfirmReceipt,
  staffConfirmReturn,
  confirmReturnedByBorrower,
  cancelLoanTransaction,
};

export default loanService;
