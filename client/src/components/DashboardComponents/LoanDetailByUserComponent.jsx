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
    ? new Date(
        new Date(foundLoan.pickup_time).getTime() + 3 * 24 * 60 * 60 * 1000
      ) // 3 days
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
                Please wait, your loan transaction is currently being
                processed...
              </p>
            </div>
          )}

          {meetingInfoByLoanId?.status === "Need Approval" && (
            <div className="font-semibold text-xs w-full text-center px-3 py-2 rounded-lg bg-orange-100/20 border border-orange-800">
              <p className="text-orange-800 italic">
                Please wait, our staff will review your meeting request.
              </p>
            </div>
          )}

          {meetingInfoByLoanId?.status === "Approved" &&
            !foundLoan?.borrow_confirmed_by && (
              <div className="font-semibold text-xs w-full text-center px-3 py-2 rounded-lg bg-blue-100/20 border border-blue-gray-800">
                <p className="text-blue-gray-800 italic">
                  Your meeting request has been successfully approved. Please
                  meet with our staff to pick up the loan item.
                </p>
              </div>
            )}

          <Typography className="font-semibold text-xl bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent animate-gradient">
            Loan of Equipment
          </Typography>
          <p className="text-xs text-blue-gray-800">
            {foundLoan?.transaction_id}
          </p>
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
            <span className="font-medium text-xs text-blue-800 w-full">
              Item List:
            </span>
            {/* table loan item detail */}
            <TableLoanItemInfoComponent loanItemInfo={foundLoan} />
          </div>

          {/* Button changeloan status */}
          <div className="flex w-full flex-col items-center justify-center mt-8 gap-4">
            <div className="flex flex-col gap-2 bg-indigo-400/10 px-10 py-2 rounded-md border border-indigo-500/30">
              <div className="flex w-full justify-center items-center">
                <span className=" text-xs text-blue-800">
                  Borrower Confirm Date
                </span>
                <span className=" text-blue-900 text-xs">
                  :{" "}
                  {foundLoan?.borrower_confirmed_date
                    ? getFullDay(foundLoan?.borrower_confirmed_date)
                    : "-"}
                </span>
              </div>

              <div className="flex w-full justify-center items-center">
                <span className=" text-xs text-green-800">
                  Returned Confirmation Date
                </span>
                <span className=" text-green-900 text-xs">
                  :{" "}
                  {foundLoan?.return_date
                    ? getFullDay(foundLoan?.return_date)
                    : "-"}
                </span>
              </div>
            </div>

            {/* {foundLoan?.loan_status === "Pending" && (
              <p className="text-xs italic text-indigo-800 text-center">
                Please wait, your loan transaction is currently being
                processed...
              </p>
            )} */}

            {foundLoan?.loan_status === "Ready to Pickup" &&
              !meetingInfoByLoanId && (
                <Button
                  className="bg-gradient-to-r from-red-500 to-orange-800 text-xs py-2.5 px-6 rounded-lg capitalize"
                  onClick={handleOpenDialog}
                >
                  Create request meeting
                </Button>
              )}

            {!foundLoan?.borrow_confirmed_date_by_user &&
              foundLoan?.borrow_confirmed_by && (
                <Button
                  className="bg-gradient-to-r from-purple-500 to-blue-800 text-xs py-2.5 px-6 rounded-lg capitalize"
                  onClick={openDrawerBottom}
                >
                  Confirm Receipt Loan Item
                </Button>
              )}

            {(foundLoan?.loan_status === "Borrowed" ||
              foundLoan?.loan_status === "Partially Consumed" ||
              foundLoan?.loan_status === "Consumed") && (
              <Button
                className="bg-gradient-to-r from-cyan-500 to-lime-800 text-white text-xs py-3 px-6 rounded-lg capitalize"
                onClick={openDrawerBottom}
                disabled={foundLoan?.borrower_confirmed_date ? true : false}
              >
                Confirm loan items
              </Button>
            )}

            {foundLoan?.loan_status === "Returned" && (
              <Button
                className="bg-gradient-to-r from-lime-500 to-green-800 text-white text-xs py-3 px-6 rounded-lg capitalize"
                onClick={openDrawerReturned}
                disabled={foundLoan?.return_date ? true : false}
              >
                Confirm loan item has already returned
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default LoanDetailByUserComponent;
