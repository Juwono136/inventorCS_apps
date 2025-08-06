import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

// icons and material-tailwind
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";

// components
import TableLoanItemInfoComponent from "./TableLoanItemInfoComponent";
import LoanUserInfoComponent from "./LoanUserInfoComponent";
import { getFullDay } from "../../common/Date";
import LoanCountDown from "../../common/LoanCountDown";

const LoanDetailByUserComponent = ({
  openDrawerBottom,
  openDrawerReturned,
  meetingInfoByLoanId,
  handleOpenDialog,
  userInfor,
}) => {
  const [open, setOpen] = useState(0);

  const { loanData } = useSelector((state) => state.loan);

  const { id } = useParams();
  const foundLoan = loanData?.loanTransactions?.find((loan) => loan._id === id);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  // Calculate expiry date for countdown (3 days from borrow_date)
  const expiryDate = foundLoan?.pickup_time
    ? new Date(new Date(foundLoan.pickup_time).getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days
    : null;

  return (
    <>
      <Card>
        <div className="flex flex-col justify-center items-center w-full gap-2 mb-2">
          {/* Countdown for Ready to Pickup */}
          {!meetingInfoByLoanId && (
            <LoanCountDown
              expiryDate={expiryDate}
              txtError="Time to pick up the loan has expired! Loan status change to 'Cancelled'"
              txtRender="Time remaining to request meeting for pick up the loan item:"
            />
          )}

          {foundLoan?.loan_status === "Pending" && (
            <div className="font-semibold text-xs w-full text-center px-3 py-2 rounded-lg bg-gray-100/20 border border-gray-800">
              <p className="text-gray-800 italic">
                Please wait, your loan transaction is currently being processed...
              </p>
            </div>
          )}

          {meetingInfoByLoanId?.status === "Need Approval" && (
            <div className="font-semibold text-xs w-full text-center px-3 py-2 rounded-lg bg-orange-100/20 border border-orange-800">
              <p className="text-orange-800 italic">
                Please wait, our staff will process your meeting request.
              </p>
            </div>
          )}

          {meetingInfoByLoanId?.status === "Approved" && !foundLoan?.borrow_confirmed_by && (
            <div className="font-semibold text-xs w-full text-center px-3 py-2 rounded-lg bg-blue-100/20 border border-blue-gray-800">
              <p className="text-blue-gray-800 italic">
                Your meeting request has been successfully approved. Please meet with our staff to
                pick up the loan item, or you can contact our staff via email or phone number for
                futher information.
              </p>
            </div>
          )}

          {/* request meeting button */}
          {foundLoan?.loan_status === "Ready to Pickup" && !meetingInfoByLoanId && (
            <Button
              className="bg-gradient-to-r from-red-500 to-orange-800 text-xs py-2.5 px-6 rounded-lg capitalize mt-1.5"
              onClick={handleOpenDialog}
            >
              Create request meeting
            </Button>
          )}

          {/* confirm receipt loan item button */}
          {!foundLoan?.borrow_confirmed_date_by_user && foundLoan?.borrow_confirmed_by && (
            <Button
              className="bg-gradient-to-r from-purple-500 to-blue-800 text-xs py-2.5 px-6 rounded-lg capitalize"
              onClick={openDrawerBottom}
            >
              Confirm Receipt Loan Item
            </Button>
          )}

          {/* confirm returned loan item button */}
          {(foundLoan?.loan_status === "Borrowed" ||
            foundLoan?.loan_status === "Partially Consumed") &&
            foundLoan?.returned_confirmed_date_by_staff &&
            !foundLoan?.returned_confirmed_date_by_user && (
              <Button
                className="bg-gradient-to-r from-teal-500 to-green-800 text-white text-xs py-3 px-6 rounded-lg capitalize"
                onClick={openDrawerReturned}
              >
                Confirm Returned Loan Item
              </Button>
            )}

          <Typography className="font-semibold text-xl bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent animate-gradient">
            Loan of Equipment
          </Typography>
          <p className="text-xs text-blue-gray-800">{foundLoan?.transaction_id}</p>
        </div>

        <CardBody>
          {/* loan user info */}
          <LoanUserInfoComponent
            loanItemInfo={foundLoan}
            userInfor={userInfor}
            meetingInfoByLoanId={meetingInfoByLoanId}
            handleOpen={handleOpen}
            open={open}
          />

          <hr className="border-indigo-100 my-2" />

          <div className="grid gap-2 my-4">
            <span className="font-medium text-xs text-blue-800 w-full">Item List:</span>
            {/* table loan item detail */}
            <TableLoanItemInfoComponent loanItemInfo={foundLoan} />
          </div>

          {/* Button change loan status */}
          <div className="flex w-full flex-col items-center justify-center mt-8 gap-4">
            {/* request meeting button */}
            {foundLoan?.loan_status === "Ready to Pickup" && !meetingInfoByLoanId && (
              <Button
                className="bg-gradient-to-r from-red-500 to-orange-800 text-xs py-2.5 px-6 rounded-lg capitalize"
                onClick={handleOpenDialog}
              >
                Create request meeting
              </Button>
            )}

            {/* confirm receipt loan item button */}
            {!foundLoan?.borrow_confirmed_date_by_user && foundLoan?.borrow_confirmed_by && (
              <Button
                className="bg-gradient-to-r from-purple-500 to-blue-800 text-xs py-2.5 px-6 rounded-lg capitalize"
                onClick={openDrawerBottom}
              >
                Confirm Receipt Loan Item
              </Button>
            )}

            {/* confirm returned loan item button */}
            {(foundLoan?.loan_status === "Borrowed" ||
              foundLoan?.loan_status === "Partially Consumed") &&
              foundLoan?.returned_confirmed_date_by_staff &&
              !foundLoan?.returned_confirmed_date_by_user && (
                <Button
                  className="bg-gradient-to-r from-teal-500 to-green-800 text-white text-xs py-3 px-6 rounded-lg capitalize"
                  onClick={openDrawerReturned}
                >
                  Confirm Returned Loan Item
                </Button>
              )}

            {/* confirm user and staff information */}
            <div className="flex gap-4 flex-col md:flex-row w-full justify-center">
              {/* confirm user information */}
              <div className="flex flex-col gap-2 bg-indigo-400/10 px-10 py-4 w-full font-semibold rounded-md border border-indigo-500/30">
                <p className="text-xs text-indigo-800 w-full text-center bg-indigo-100/40 p-1 rounded-md">
                  Confirm User Information:
                </p>

                <hr className="border-1 mb-2 border-indigo-800" />

                <div className="flex w-full flex-col justify-center items-center">
                  <span className=" text-xs text-gray-800">Borrowed Confirmed By Staff:</span>
                  <span className=" text-gray-900 text-xs">
                    {foundLoan?.borrow_confirmed_by ? foundLoan?.borrow_confirmed_by : "-"}
                  </span>
                </div>

                <div className="flex w-full flex-col justify-center items-center">
                  <span className=" text-xs text-gray-800">Borrowed Confirmed Date:</span>
                  <span className=" text-gray-900 text-xs">
                    {foundLoan?.borrow_confirmed_date_by_user
                      ? getFullDay(foundLoan?.borrow_confirmed_date_by_user)
                      : "-"}
                  </span>
                </div>

                <div className="flex w-full flex-col justify-center items-center">
                  <span className=" text-xs text-gray-800">Returned Confirmed Date:</span>
                  <span className=" text-gray-900 text-xs">
                    {foundLoan?.return_date ? getFullDay(foundLoan?.return_date) : "-"}
                  </span>
                </div>
              </div>

              {/* confirm staff information */}
              <div className="flex flex-col gap-2 bg-orange-400/10 px-10 py-4 w-full font-semibold rounded-md border border-orange-500/30">
                <p className="text-xs text-orange-800 w-full text-center bg-orange-100/40 p-1 rounded-md">
                  Confirm Staff Information:
                </p>

                <hr className="border-1 mb-2 border-orange-800" />

                <div className="flex w-full flex-col justify-center items-center">
                  <span className=" text-xs text-gray-800">Borrowed Confirmed Date:</span>
                  <span className=" text-gray-900 text-xs">
                    {foundLoan?.borrow_confirmed_date_by_staff
                      ? getFullDay(foundLoan?.borrow_confirmed_date_by_staff)
                      : "-"}
                  </span>
                </div>

                <div className="flex w-full flex-col justify-center items-center">
                  <span className=" text-xs text-gray-800">Returned Confirmed Date:</span>
                  <span className=" text-gray-900 text-xs">
                    {foundLoan?.return_date ? getFullDay(foundLoan?.return_date) : "-"}
                  </span>
                </div>

                <div className="flex w-full flex-col justify-center items-center">
                  <span className=" text-xs text-gray-800">Returned Confirmed By:</span>
                  <span className=" text-gray-900 text-xs">
                    {foundLoan?.returned_confirmed_by ? foundLoan?.returned_confirmed_by : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default LoanDetailByUserComponent;
