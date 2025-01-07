import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { QRCode } from "react-qrcode-logo";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// icons and material-tailwind
import { Typography, Chip } from "@material-tailwind/react";
import { FaArrowRight } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa6";
import { LuClipboardCheck } from "react-icons/lu";

// components
import Layout from "./Layout";
import Loader from "../../common/Loader";
import DynamicBreadcrumbs from "../../common/DynamicBreadcrumbs";
import UseDocumentTitle from "../../common/UseDocumentTitle";

// features
import { getLoanTransactionsByUser } from "../../features/loanTransaction/loanSlice";

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

  const { loanData, isLoading } = useSelector((state) => state.loan);

  const dispatch = useDispatch();

  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    dispatch(getLoanTransactionsByUser());
  }, [dispatch]);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

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
        <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
          {loanData?.loanTransactions?.map(
            (
              { _id, borrow_date, expected_return_date, loan_status },
              index
            ) => {
              return (
                <div
                  className="flex gap-2 w-full flex-col items-center rounded-xl border border-indigo-100 bg-indigo-100/30 p-4 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm"
                  key={index}
                >
                  <div className="flex w-max">
                    <QRCode
                      value={`${window.location.origin}/user-loan/detail-loan/${_id}`}
                      size={120}
                      logoWidth={16}
                      eyeRadius={10}
                      eyeColor="#161D6F"
                      fgColor="#161D6F"
                      qrStyle="dots"
                    />
                  </div>
                  <div className="flex flex-col justify-center lg:justify-start">
                    <div className="flex flex-col py-2 gap-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
                          Transaction ID: {_id}
                        </h4>
                        <button
                          onClick={() => handleCopy(_id)}
                          onTouchStart={() => handleCopy(_id)}
                          className="text-indigo-500 hover:text-indigo-700 transition-all hidden md:inline"
                        >
                          {copiedId === _id ? (
                            <LuClipboardCheck />
                          ) : (
                            <FaRegCopy />
                          )}
                        </button>
                      </div>

                      <Typography className="text-xs text-gray-700">
                        Borrow Date:{" "}
                        {new Date(borrow_date).toLocaleDateString()}
                      </Typography>

                      <Typography className="text-xs text-gray-700">
                        Expected Return Date:{" "}
                        {new Date(expected_return_date).toLocaleDateString() ||
                          "-"}
                      </Typography>
                    </div>

                    <div className="flex w-full">
                      <Chip
                        size="sm"
                        value={loan_status}
                        color={statusLoanColors[loan_status]}
                        variant="ghost"
                        className="rounded-full"
                      />
                    </div>

                    <Link
                      className="bg-gradient-to-r flex items-center gap-2 hover:text-white hover:from-indigo-500 hover:to-purple-800 text-xs py-2 w-max mt-4 px-2 rounded-lg capitalize transition-all"
                      to={`detail/${_id}`}
                    >
                      See Detail
                      <FaArrowRight />
                    </Link>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </Layout>
  );
};

export default MyLoanTransactionPage;
