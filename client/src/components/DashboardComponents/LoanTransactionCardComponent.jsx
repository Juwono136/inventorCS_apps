import React, { useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { Link } from "react-router-dom";

// icons and material-tailwind
import { Button, Chip } from "@material-tailwind/react";
import { FaArrowRight } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa6";
import { LuClipboardCheck } from "react-icons/lu";
import { BsPatchCheck } from "react-icons/bs";

// components
import DialogOpenComponent from "./DialogOpenComponent";
import FullScreenQRCode from "../../common/FullScreenQRCode";
import { getFullDay } from "../../common/Date";

const LoanTransactionCardComponent = ({
  statusLoanColors,
  copiedId,
  handleCopy,
  loanData,
  selectedId,
  openCancelLoan,
  handleOpenCancelLoan,
  handleCancelLoan,
}) => {
  const [isQRCodeModalOpen, setQRCodeModalOpen] = useState(false);
  const [qrCodeValue, setQRCodeValue] = useState("");
  const [qrCodeTransactionId, setQRCodeTransactionId] = useState("");

  const handleOpenQRCodeModal = (value, transactionId) => {
    setQRCodeModalOpen(true);
    setQRCodeValue(value);
    setQRCodeTransactionId(transactionId);
  };

  const handleCloseQRCodeModal = () => {
    setQRCodeModalOpen(false);
    setQRCodeValue("");
  };

  const sortedTransactions = loanData?.loanTransactions
    ? [...loanData?.loanTransactions].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    : [];

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
      {sortedTransactions?.map(
        (
          { _id, transaction_id, borrow_date, loan_status, borrowed_item },
          index
        ) => {
          return (
            <div
              className="flex flex-col gap-3 p-3 md:p-4 rounded-md border border-indigo-100 bg-indigo-100/30 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm"
              key={index}
            >
              <div className="flex flex-col gap-4 h-full justify-between">
                <div className="flex flex-col-reverse md:flex-row gap-4">
                  {/* pending and transaction_id info */}
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-col 2xl:flex-row gap-2 items-center w-max">
                      <div className="flex w-full">
                        <Chip
                          size="sm"
                          value={loan_status}
                          color={statusLoanColors[loan_status]}
                          variant="ghost"
                          className="rounded-md"
                        />
                      </div>
                      <div className="flex gap-2 text-xs text-gray-600 text-left w-full">
                        {transaction_id}

                        <button
                          onClick={() => handleCopy(transaction_id)}
                          onTouchStart={() => handleCopy(transaction_id)}
                          className="text-indigo-500 text-sm hover:text-indigo-800 transition-all hidden md:inline"
                        >
                          {copiedId === transaction_id ? (
                            <LuClipboardCheck />
                          ) : (
                            <FaRegCopy />
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Borrow Date: {getFullDay(borrow_date)}
                    </p>

                    {/* Item info card */}
                    {borrowed_item
                      ?.slice(0, 1)
                      .map(
                        (
                          {
                            inventory_id,
                            quantity,
                            is_consumable,
                            item_program,
                          },
                          index
                        ) => {
                          const {
                            asset_name,
                            asset_img,
                            _id: item_id,
                          } = inventory_id;
                          return (
                            <div
                              className="flex flex-col gap-3 w-full mt-3"
                              key={index}
                            >
                              <div className="flex items-center gap-1.5">
                                <BsPatchCheck className="font-bold text-xs text-purple-900" />
                                <h2 className="font-semibold text-xs bg-gradient-to-r from-blue-400 via-purple-800 to-red-700 bg-clip-text text-transparent animate-gradient">
                                  {item_program}
                                </h2>
                              </div>
                              <div className="flex flex-col md:flex-row gap-2">
                                <img
                                  src={asset_img}
                                  alt="item-image"
                                  className="rounded-lg object-cover object-center h-24 w-24 shadow-md shadow-blue-gray-700/20"
                                />
                                <div className="flex flex-col gap-1">
                                  <a
                                    href={`/item_detail/${item_id}`}
                                    target="_blank"
                                    className="w-max"
                                  >
                                    <h2 className="text-sm text-indigo-900 hover:underline">
                                      {asset_name}
                                    </h2>
                                  </a>
                                  <p className="text-xs text-gray-500">
                                    Quantity: {quantity}
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    Is Consumable?:{" "}
                                    {is_consumable === false ? "No" : "Yes"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}

                    {borrowed_item?.length > 1 && (
                      <div className="text-xs font-semibold text-gray-600 italic">
                        and {borrowed_item.length - 1} more borrowed item
                        {borrowed_item.length - 1 > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>

                  {/* Transaction QR code */}
                  <div className="flex justify-center items-center md:w-max">
                    <div
                      className="w-max rounded-lg p-2 border border-indigo-100 bg-indigo-100/30 hover:cursor-pointer hover:bg-indigo-100/60 transition-all"
                      onClick={() =>
                        handleOpenQRCodeModal(
                          `${window.location.origin}/user-loan/detail-loan/${_id}`,
                          transaction_id
                        )
                      }
                    >
                      <QRCode
                        value={`${window.location.origin}/user-loan/detail-loan/${_id}`}
                        size={90}
                        logoWidth={16}
                        eyeRadius={5}
                        eyeColor="#161D6F"
                        fgColor="#161D6F"
                        qrStyle="dots"
                      />

                      <p className="text-[8px] mt-1 text-gray-600 italic w-max">
                        Click the QR Code to scan
                      </p>
                    </div>
                  </div>
                </div>

                {/* See detail an cancel button */}
                <div className="flex w-full justify-end items-center gap-2">
                  {["Pending", "Ready to Pickup"].includes(loan_status) && (
                    <Button
                      className="bg-red-400 text-xs py-2 px-3 rounded-lg capitalize transition-all"
                      onClick={() => handleOpenCancelLoan(_id)}
                    >
                      Cancel Loan
                    </Button>
                  )}

                  <Link
                    className="bg-gradient-to-r flex items-center gap-2 text-indigo-900 font-semibold hover:text-white hover:from-indigo-500 hover:to-purple-800 text-xs py-2 w-max px-2 rounded-lg capitalize transition-all"
                    to={`detail/${_id}`}
                  >
                    See Detail
                    <FaArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          );
        }
      )}

      {/* Cancel loan transaction dialog component */}
      <DialogOpenComponent
        openDialog={openCancelLoan}
        handleFunc={() => handleCancelLoan(selectedId)}
        handleOpenDialog={handleOpenCancelLoan}
        message="Are you sure want to cancel this loan transaction?"
        btnText="Yes"
      />

      {/* Fullscreen QR Code Modal */}
      <FullScreenQRCode
        isOpen={isQRCodeModalOpen}
        onClose={handleCloseQRCodeModal}
        qrValue={qrCodeValue}
        transactionId={qrCodeTransactionId}
        text="Scan the loan transaction "
      />
    </div>
  );
};

export default LoanTransactionCardComponent;
