import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

// components
import Layout from "./Layout";
import LoanTransactionCardComponent from "../../components/DashboardComponents/LoanTransactionCardComponent";
import Loader from "../../common/Loader";
import DynamicBreadcrumbs from "../../common/DynamicBreadcrumbs";
import UseDocumentTitle from "../../common/UseDocumentTitle";

// features
import {
  cancelLoanTransaction,
  getLoanTransactionsByUser,
  loanReset,
} from "../../features/loanTransaction/loanSlice";

const MyLoanTransactionPage = () => {
  UseDocumentTitle("My Loan Transactions");

  const statusLoanColors = {
    Pending: "blue-gray",
    "Ready to Pickup": "lime",
    Borrowed: "blue",
    "Partially Consumed": "purple",
    Consumed: "orange",
    Returned: "green",
    Cancelled: "red",
  };

  const { loanData, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.loan
  );
  const [openCancelLoan, setOpenCancelLoan] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const dispatch = useDispatch();

  const [copiedId, setCopiedId] = useState(null);

  const handleOpenCancelLoan = (id) => {
    setOpenCancelLoan(!openCancelLoan);
    setSelectedId(id);
  };

  const handleCancelLoan = (id) => {
    const data = {
      _id: id,
    };

    dispatch(cancelLoanTransaction(data));

    setOpenCancelLoan(!openCancelLoan);
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      dispatch(loanReset());
    }

    dispatch(getLoanTransactionsByUser());
  }, [isError, isSuccess, message]);

  return (
    <Layout>
      <DynamicBreadcrumbs />
      <h3 className="text-base text-center md:text-left font-bold text-indigo-500/60 pointer-events-none sm:text-xl">
        My Loan Transactions
      </h3>
      <hr className="w-full border-indigo-100 my-4" />

      {isLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : loanData?.loanTransactions?.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="text-sm text-gray-700 bg-gray-300 rounded-full p-2">
            There is no loan transactions.
          </p>

          <p className="mt-8 text-sm text-indigo-900">
            Want to borrow an item?{" "}
            <a
              href="/inventory-list"
              className="text-blue-gray-900 underline hover:font-semibold"
            >
              Click here.
            </a>
          </p>
        </div>
      ) : (
        <LoanTransactionCardComponent
          statusLoanColors={statusLoanColors}
          copiedId={copiedId}
          handleCopy={handleCopy}
          loanData={loanData}
          selectedId={selectedId}
          openCancelLoan={openCancelLoan}
          handleOpenCancelLoan={handleOpenCancelLoan}
          handleCancelLoan={handleCancelLoan}
        />
      )}
    </Layout>
  );
};

export default MyLoanTransactionPage;
