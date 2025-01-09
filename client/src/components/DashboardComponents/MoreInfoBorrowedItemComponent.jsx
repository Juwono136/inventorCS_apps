import React from "react";

// icons and material-tailwind
import {
  Dialog,
  DialogHeader,
  Typography,
  DialogBody,
  IconButton,
  Card,
} from "@material-tailwind/react";
import { IoClose } from "react-icons/io5";
import { IoOpenOutline } from "react-icons/io5";

// components
import LoanUserInfoComponent from "./LoanUserInfoComponent";
import TableLoanItemInfoComponent from "./TableLoanItemInfoComponent";

const MoreInfoBorrowedItemComponent = ({
  open,
  handleOpenDialog,
  selectedItem,
}) => {
  const TABLE_HEAD = ["No", "Item Name", "Quantity", "Is Consumable?"];

  return (
    <div className="max-h-max">
      <Dialog open={open} size="xl" className="overflow-y-auto">
        <DialogHeader className="justify-between">
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
          </div>

          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={handleOpenDialog}
          >
            <IoClose className="h-5 w-5" />
          </IconButton>
        </DialogHeader>

        <DialogBody divider className="grid gap-3 md:mx-4">
          {/* loan user info */}
          <LoanUserInfoComponent
            loanItemInfo={selectedItem}
            userInfor={selectedItem}
          />

          <div className="grid gap-2">
            {/* table loan item detail */}
            <TableLoanItemInfoComponent loanItemInfo={selectedItem} />
          </div>

          <div className="flex w-full justify-center items-center">
            <span className=" text-xs text-blue-800">
              Borrower Confirm Date
            </span>
            <span className=" text-blue-900 text-xs">
              :{" "}
              {selectedItem?.borrower_confirmed_date
                ? new Date(
                    selectedItem?.borrower_confirmed_date
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
              {selectedItem?.return_date
                ? new Date(selectedItem?.return_date).toLocaleDateString()
                : "-"}
            </span>
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
};

export default MoreInfoBorrowedItemComponent;
