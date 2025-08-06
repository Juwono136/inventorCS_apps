import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// icons and material-tailwind
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";

// components
import LoanUserInfoComponent from "./LoanUserInfoComponent";
import TableLoanItemInfoComponent from "./TableLoanItemInfoComponent";
import { getFullDay } from "../../common/Date";

// features
import { getMeetingByLoanId } from "../../features/meeting/meetingSlice";

const LoanDetailforStaffComponent = ({
  handleOpenDialog,
  handleOpenMeetingDialog,
  handleOpenHandoverModal,
  handleOpenConfirmReturnModal,
}) => {
  const [open, setOpen] = useState(0);

  const { loanData } = useSelector((state) => state.loan);
  const { userById } = useSelector((state) => state.user);
  const { meetingInfoByLoanId } = useSelector((state) => state.meeting);

  const dispatch = useDispatch();

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  useEffect(() => {
    if (loanData?._id) {
      dispatch(getMeetingByLoanId(loanData._id));
    }
  }, [loanData]);

  return (
    <>
      {(!loanData?.borrow_confirmed_date_by_staff &&
        loanData?.loan_status === "Ready to Pickup" &&
        meetingInfoByLoanId &&
        meetingInfoByLoanId?.status === "Approved") ||
        (loanData?.borrow_confirmed_by && !loanData?.borrow_confirmed_date_by_user && (
          <div className="font-semibold text-xs w-full text-center px-3 py-2 rounded-lg bg-indigo-100/20 border border-indigo-800">
            <p className="text-indigo-800 italic">
              Inform the borrower to confirm the receipt of the loan item. Waiting for the
              borrower's confirmation...
            </p>
          </div>
        ))}

      {loanData?.returned_confirmed_by && !loanData?.return_date && (
        <div className="font-semibold text-xs w-full text-center px-3 py-2 rounded-lg bg-orange-100/20 border border-orange-800">
          <p className="text-orange-800 italic">
            Inform the borrower to confirm the returned loan item. Waiting for the borrower's
            confirmation...
          </p>
        </div>
      )}

      <Card className="my-3">
        <div className="flex flex-col justify-center items-center w-full gap-2 mb-2">
          {/* ready to pickup button */}
          {loanData?.loan_status === "Pending" && (
            <Button
              className="bg-gradient-to-r from-indigo-500 to-purple-800 text-xs py-3 px-6 rounded-lg capitalize"
              onClick={handleOpenDialog}
            >
              Change status to Ready to Pickup
            </Button>
          )}

          {/* approve request meeting button */}
          {meetingInfoByLoanId?.status === "Need Approval" && (
            <Button
              className="bg-gradient-to-r from-green-300 to-orange-400 text-xs py-3 px-6 rounded-lg capitalize"
              onClick={handleOpenMeetingDialog}
            >
              Approve Request Meeting
            </Button>
          )}

          {/* confirm handover loan item button */}
          {!loanData?.borrow_confirmed_date_by_staff &&
            loanData?.loan_status === "Ready to Pickup" &&
            meetingInfoByLoanId &&
            meetingInfoByLoanId?.status === "Approved" && (
              <Button
                className="bg-gradient-to-r from-indigo-500 to-green-600 text-xs py-3 px-6 rounded-lg capitalize"
                onClick={handleOpenHandoverModal}
              >
                Check Loan Item Handover
              </Button>
            )}

          {/* check loan items for return button */}
          {(loanData?.loan_status === "Borrowed" ||
            loanData?.loan_status === "Partially Consumed") &&
            !loanData?.returned_confirmed_date_by_staff && (
              <Button
                className="bg-gradient-to-r from-blue-800 to-purple-800 text-xs py-3 px-6 rounded-lg capitalize"
                onClick={handleOpenConfirmReturnModal}
              >
                Check Loan Items For Return
              </Button>
            )}

          <Typography className="font-semibold text-xl bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent animate-gradient">
            Loan of Equipment
          </Typography>
          <p className="text-xs text-blue-gray-800">{loanData?.transaction_id}</p>
        </div>

        <CardBody>
          {/* loan user info */}
          <LoanUserInfoComponent
            loanItemInfo={loanData}
            userInfor={userById}
            handleOpen={handleOpen}
            open={open}
            meetingInfoByLoanId={meetingInfoByLoanId}
          />
          <hr className="border-indigo-100 my-2" />

          <div className="grid gap-2 my-4">
            <span className="font-medium text-xs text-blue-800 w-full">Item List:</span>
            {/* table loan item detail */}
            <TableLoanItemInfoComponent loanItemInfo={loanData} />
          </div>

          {/* Button change loan status */}
          <div className="flex w-full flex-col items-center justify-center text-white mt-8 gap-4">
            {/* ready to pickup button */}
            {loanData?.loan_status === "Pending" && (
              <Button
                className="bg-gradient-to-r from-indigo-500 to-purple-800 text-xs py-3 px-6 rounded-lg capitalize"
                onClick={handleOpenDialog}
              >
                Change status to Ready to Pickup
              </Button>
            )}

            {/* approve request meeting button */}
            {meetingInfoByLoanId?.status === "Need Approval" && (
              <Button
                className="bg-gradient-to-r from-green-300 to-orange-400 text-xs py-3 px-6 rounded-lg capitalize"
                onClick={handleOpenMeetingDialog}
              >
                Approve Request Meeting
              </Button>
            )}

            {/* confirm handover loan item button */}
            {!loanData?.borrow_confirmed_date_by_staff &&
              loanData?.loan_status === "Ready to Pickup" &&
              meetingInfoByLoanId &&
              meetingInfoByLoanId?.status === "Approved" && (
                <Button
                  className="bg-gradient-to-r from-indigo-500 to-green-600 text-xs py-3 px-6 rounded-lg capitalize"
                  onClick={handleOpenHandoverModal}
                >
                  Check Loan Item Handover
                </Button>
              )}

            {/* check loan items for return button */}
            {(loanData?.loan_status === "Borrowed" ||
              loanData?.loan_status === "Partially Consumed") &&
              !loanData?.returned_confirmed_date_by_staff && (
                <Button
                  className="bg-gradient-to-r from-blue-800 to-purple-800 text-xs py-3 px-6 rounded-lg capitalize"
                  onClick={handleOpenConfirmReturnModal}
                >
                  Check Loan Items For Return
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
                    {loanData?.borrow_confirmed_by ? loanData?.borrow_confirmed_by : "-"}
                  </span>
                </div>

                <div className="flex w-full flex-col justify-center items-center">
                  <span className=" text-xs text-gray-800">Borrowed Confirmed Date:</span>
                  <span className=" text-gray-900 text-xs">
                    {loanData?.borrow_confirmed_date_by_user
                      ? getFullDay(loanData?.borrow_confirmed_date_by_user)
                      : "-"}
                  </span>
                </div>

                <div className="flex w-full flex-col justify-center items-center">
                  <span className=" text-xs text-gray-800">Returned Confirmed Date:</span>
                  <span className=" text-gray-900 text-xs">
                    {loanData?.return_date ? getFullDay(loanData?.return_date) : "-"}
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
                    {loanData?.borrow_confirmed_date_by_staff
                      ? getFullDay(loanData?.borrow_confirmed_date_by_staff)
                      : "-"}
                  </span>
                </div>

                <div className="flex w-full flex-col justify-center items-center">
                  <span className=" text-xs text-gray-800">Returned Confirmed Date:</span>
                  <span className=" text-gray-900 text-xs">
                    {loanData?.returned_confirmed_date_by_staff
                      ? getFullDay(loanData?.returned_confirmed_date_by_staff)
                      : "-"}
                  </span>
                </div>

                <div className="flex w-full flex-col justify-center items-center">
                  <span className=" text-xs text-gray-800">Returned Confirmed By:</span>
                  <span className=" text-gray-900 text-xs">
                    {loanData?.returned_confirmed_by ? loanData?.returned_confirmed_by : "-"}
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

export default LoanDetailforStaffComponent;
