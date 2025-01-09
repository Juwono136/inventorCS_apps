import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

// icons and material-tailwind
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";

// components
import TableLoanItemInfoComponent from "./TableLoanItemInfoComponent";
import LoanUserInfoComponent from "./LoanUserInfoComponent";

const LoanDetailByUserComponent = ({
  openDrawerBottom,
  openDrawerReturned,
}) => {
  const [open, setOpen] = useState(0);

  const { loanData } = useSelector((state) => state.loan);
  const { userInfor } = useSelector((state) => state.user);

  const { id } = useParams();
  const foundLoan = loanData?.loanTransactions?.find((loan) => loan._id === id);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <>
      <Card className="my-3">
        <div className="flex flex-col justify-center items-center w-full gap-2 mb-2">
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
          <div className="flex w-full flex-col items-center justify-center text-white mt-8 gap-4">
            {(foundLoan?.loan_status === "Borrowed" ||
              foundLoan?.loan_status === "Partially Consumed" ||
              foundLoan?.loan_status === "Consumed") && (
              <Button
                className="bg-gradient-to-r from-cyan-500 to-lime-800 text-xs py-3 px-6 rounded-lg capitalize"
                onClick={openDrawerBottom}
                disabled={foundLoan?.borrower_confirmed_date ? true : false}
              >
                Confirm loan items
              </Button>
            )}

            {foundLoan?.loan_status === "Returned" && (
              <Button
                className="bg-gradient-to-r from-lime-500 to-green-800 text-xs py-3 px-6 rounded-lg capitalize"
                onClick={openDrawerReturned}
                disabled={foundLoan?.return_date ? true : false}
              >
                Confirm loan item has already returned
              </Button>
            )}

            <div className="flex w-full justify-center items-center">
              <span className=" text-xs text-blue-800">
                Borrower Confirm Date
              </span>
              <span className=" text-blue-900 text-xs">
                :{" "}
                {foundLoan?.borrower_confirmed_date
                  ? new Date(
                      foundLoan?.borrower_confirmed_date
                    ).toLocaleDateString()
                  : "-"}
              </span>
            </div>

            <div className="flex w-full justify-center items-center">
              <span className=" text-xs text-green-800">
                Returned Date Confirmation
              </span>
              <span className=" text-green-900 text-xs">
                :{" "}
                {foundLoan?.return_date
                  ? new Date(foundLoan?.return_date).toLocaleDateString()
                  : "-"}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default LoanDetailByUserComponent;
