import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// icons and material-tailwind
import {
  Dialog,
  DialogHeader,
  Typography,
  DialogBody,
  IconButton,
} from "@material-tailwind/react";
import { IoClose } from "react-icons/io5";
import { IoOpenOutline } from "react-icons/io5";

// components
import LoanUserInfoComponent from "./LoanUserInfoComponent";
import TableLoanItemInfoComponent from "./TableLoanItemInfoComponent";
import { getFullDay } from "../../common/Date";

// features
import { getMeetingByLoanId } from "../../features/meeting/meetingSlice";

const MoreInfoBorrowedItemComponent = ({
  open,
  handleOpenDialog,
  selectedItem,
}) => {
  const { meetingInfoByLoanId } = useSelector((state) => state.meeting);

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedItem?.id) {
      dispatch(getMeetingByLoanId(selectedItem.id));
    }
  }, [selectedItem]);

  return (
    <div className="max-h-max">
      <Dialog open={open} size="xl" className="overflow-y-auto">
        <DialogHeader className="relative flex w-full justify-between">
          <div className="flex flex-col justify-center items-center w-full">
            <Typography className="text-xs text-blue-gray-700 mb-2">
              Item borrowing information
            </Typography>
            <Typography className="font-semibold text-base md:text-xl bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent animate-gradient">
              Loan of Equipment
            </Typography>

            <p className="text-[10px] md:text-xs text-blue-gray-800 mt-1">
              <a
                href={`user-loan/detail-loan/${selectedItem?.id}`}
                target="_blank"
                className="flex justify-center items-center gap-0.5 text-indigo-500 hover:text-indigo-800 underline transition-all"
              >
                {selectedItem?.transactionId}
                <IoOpenOutline className="text-sm" />
              </a>
            </p>

            <div className="absolute flex top-0 right-0 p-4">
              <IconButton
                color="blue-gray"
                size="sm"
                variant="text"
                onClick={handleOpenDialog}
              >
                <IoClose className="h-5 w-5" />
              </IconButton>
            </div>
          </div>
        </DialogHeader>

        <DialogBody divider className="overflow-y-auto max-h-[80vh] md:mx-4">
          {(!selectedItem?.borrow_confirmed_date_by_staff &&
            selectedItem?.loan_status === "Ready to Pickup" &&
            meetingInfoByLoanId &&
            meetingInfoByLoanId?.status === "Approved") ||
            (selectedItem?.borrow_confirmed_by &&
              !selectedItem?.borrow_confirmed_date_by_user && (
                <div className="font-semibold text-xs w-full text-center px-3 py-2 rounded-lg bg-indigo-100/20 border border-indigo-800">
                  <p className="text-indigo-800 italic">
                    Inform the borrower to confirm the receipt of the loan item.
                    Waiting for the borrower's confirmation...
                  </p>
                </div>
              ))}

          {/* loan user info */}
          <LoanUserInfoComponent
            loanItemInfo={selectedItem}
            userInfor={selectedItem}
            meetingInfoByLoanId={meetingInfoByLoanId}
          />

          <div className="grid gap-2 my-4">
            {/* table loan item detail */}
            <TableLoanItemInfoComponent loanItemInfo={selectedItem} />
          </div>

          <div className="flex w-full justify-center items-center">
            <span className=" text-xs text-blue-800 font-semibold">
              Borrower Confirm Date
            </span>
            <span className=" text-blue-900 text-xs">
              :{" "}
              {selectedItem?.borrow_confirmed_date_by_user
                ? getFullDay(selectedItem?.borrow_confirmed_date_by_user)
                : "-"}
            </span>
          </div>

          <div className="flex w-full justify-center items-center mt-2">
            <span className=" text-xs text-green-800 font-semibold">
              Returned Confirmation Date
            </span>
            <span className=" text-green-900 text-xs">
              :{" "}
              {selectedItem?.return_date
                ? getFullDay(selectedItem?.return_date)
                : "-"}
            </span>
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
};

export default MoreInfoBorrowedItemComponent;
