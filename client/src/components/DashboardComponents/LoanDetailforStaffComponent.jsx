import React, { useState } from "react";
import { useSelector } from "react-redux";

// icons and material-tailwind
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";

// components
import LoanUserInfoComponent from "./LoanUserInfoComponent";
import TableLoanItemInfoComponent from "./TableLoanItemInfoComponent";

const LoanDetailforStaffComponent = ({ handleOpenDialog }) => {
  const [open, setOpen] = useState(0);

  const { loanData } = useSelector((state) => state.loan);
  const { userById } = useSelector((state) => state.user);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <>
      <Card className="my-3">
        <div className="flex flex-col justify-center items-center w-full gap-2 mb-2">
          <Typography className="font-semibold text-xl bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent animate-gradient">
            Loan of Equipment
          </Typography>
          <p className="text-xs text-blue-gray-800">
            {loanData?.transaction_id}
          </p>
        </div>

        <CardBody>
          {/* loan user info */}
          <LoanUserInfoComponent
            loanItemInfo={loanData}
            userInfor={userById}
            handleOpen={handleOpen}
            open={open}
          />
          <hr className="border-indigo-100 my-2" />

          <div className="grid gap-2 my-4">
            <span className="font-medium text-xs text-blue-800 w-full">
              Item List:
            </span>
            {/* table loan item detail */}
            <TableLoanItemInfoComponent loanItemInfo={loanData} />
          </div>

          {/* Button changeloan status */}
          <div className="flex w-full flex-col items-center justify-center text-white mt-8 gap-4">
            {loanData?.loan_status === "Pending" && (
              <Button
                className="bg-gradient-to-r from-indigo-500 to-purple-800 text-xs py-3 px-6 rounded-lg capitalize"
                onClick={handleOpenDialog}
              >
                Change status to Ready to Pickup
              </Button>
            )}

            {loanData?.loan_status === "Ready to Pickup" && (
              <Button
                className="bg-gradient-to-r from-red-500 to-orange-800 text-xs py-3 px-6 rounded-lg capitalize"
                onClick={handleOpenDialog}
              >
                Change status to Borrowed
              </Button>
            )}

            {(loanData?.loan_status === "Borrowed" ||
              loanData?.loan_status === "Partially Consumed") && (
              <Button
                className="bg-gradient-to-r from-indigo-500 to-green-800 text-xs py-3 px-6 rounded-lg capitalize"
                onClick={handleOpenDialog}
              >
                Change status to Returned
              </Button>
            )}

            <div className="flex w-full justify-center items-center">
              <span className=" text-xs text-blue-800">
                Borrower Confirm Date
              </span>
              <span className=" text-blue-900 text-xs">
                :{" "}
                {loanData?.borrower_confirmed_date
                  ? new Date(
                      loanData?.borrower_confirmed_date
                    ).toLocaleDateString()
                  : "-"}
              </span>
            </div>

            <div className="flex w-full justify-center items-center">
              <span className=" text-xs text-green-800">
                Return Date Confirmation
              </span>
              <span className=" text-green-900 text-xs">
                :{" "}
                {loanData?.return_date
                  ? new Date(loanData?.return_date).toLocaleDateString()
                  : "-"}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default LoanDetailforStaffComponent;
