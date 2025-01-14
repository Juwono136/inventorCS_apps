import React from "react";

// icons and material-tailwind
import {
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

// components
import TimelineLoanStatusComponent from "../../components/DashboardComponents/TimelineLoanStatusComponent";
import IconArrowRotate from "../../common/IconArrowRotate";
import { getFullDay } from "../../common/Date";

const LoanUserInfoComponent = ({
  loanItemInfo,
  userInfor,
  handleOpen = null,
  open = false,
}) => {
  const statusLoanColors = {
    Pending: "blue-gray",
    "Ready to Pickup": "lime",
    Borrowed: "blue",
    "Partially Consumed": "purple",
    Consumed: "orange",
    Returned: "green",
    Cancelled: "red",
  };

  return (
    <>
      <div className="grid gap-4 md:m-2">
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-xs text-blue-800 w-full">
              Borrower Name
            </span>
            <span className="col-span-2 font-semibold text-gray-900 text-xs">
              : {userInfor?.personal_info?.name}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-xs text-blue-800 w-full">
              Personal ID
            </span>
            <span className="col-span-2 font-semibold text-gray-900 text-xs">
              : {userInfor?.personal_info?.binusian_id}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-xs text-blue-800 w-full">
              Email
            </span>
            <span className="col-span-2 font-semibold text-gray-900 text-xs">
              : {userInfor?.personal_info?.email}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-blue-800 w-full text-xs">
              Address
            </span>
            <span className="col-span-2 font-semibold text-gray-900 text-xs ">
              : {userInfor?.personal_info?.address || "-"}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-xs text-blue-800 w-full">
              Program
            </span>
            <span className="col-span-2 font-semibold text-gray-900 text-xs">
              : {userInfor?.personal_info?.program || "-"}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-xs text-blue-800 w-full">
              Phone
            </span>
            <span className="col-span-2 font-semibold text-gray-900 text-xs">
              : {userInfor?.personal_info?.phone || "-"}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-xs text-blue-800 w-full">
              Borrow Date
            </span>
            <span className="col-span-2 font-semibold text-gray-900 text-xs">
              : {getFullDay(loanItemInfo?.borrow_date)}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-xs text-blue-800 w-full">
              Expected Return Date
            </span>
            <span className="col-span-2 font-semibold text-gray-900 text-xs">
              : {getFullDay(loanItemInfo?.expected_return_date)}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-xs text-blue-800 w-full">
              Purpose of Loan
            </span>
            <span className="col-span-2 font-semibold text-gray-900 text-xs">
              : {loanItemInfo?.purpose_of_loan}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-xs text-blue-800 w-full">
              Loan Status
            </span>
            <span className="flex gap-2 items-center col-span-2">
              :{" "}
              <Chip
                size="sm"
                variant="ghost"
                className="max-w-max "
                value={loanItemInfo?.loan_status || ""}
                color={statusLoanColors[loanItemInfo?.loan_status]}
              />
            </span>
          </div>
        </div>

        {/* loan status history */}
        {handleOpen !== null && (
          <div className="space-y-2 text-sm">
            <Accordion
              open={open === 1}
              icon={<IconArrowRotate id={1} open={open} />}
              className="w-max"
            >
              <AccordionHeader
                onClick={() => handleOpen(1)}
                className="text-sm text-blue-gray-600"
              >
                <span className="font-semibold text-xs underline text-blue-gray-800 w-full">
                  Loan Status History:
                </span>
              </AccordionHeader>

              <AccordionBody className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-6">
                <TimelineLoanStatusComponent
                  loanData={loanItemInfo}
                  currentStatus={loanItemInfo?.loan_status}
                  updatedAt={loanItemInfo?.updatedAt}
                  statusColors={statusLoanColors}
                />
              </AccordionBody>
            </Accordion>
          </div>
        )}
      </div>
    </>
  );
};

export default LoanUserInfoComponent;
