import React, { useEffect, useState } from "react";

// icons and material-tailwind
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Checkbox,
  Typography,
  IconButton,
  Textarea,
} from "@material-tailwind/react";
import { IoClose } from "react-icons/io5";

// components
import AlertNotification from "../../common/AlertNotification";

const DialogStaffConfirmReturn = ({
  open,
  handleClose,
  handleConfirm,
  loanData,
  isError = false,
  message = "",
}) => {
  const characterLimit = 500;

  const [checkedItems, setCheckedItems] = useState(new Set());
  const [loanNote, setLoanNote] = useState("");

  useEffect(() => {
    if (open) {
      setCheckedItems(new Set());
      setLoanNote("");
    }
  }, [open]);

  const handleCheckboxChange = (itemId) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = new Set(prevCheckedItems);
      if (newCheckedItems.has(itemId)) {
        newCheckedItems.delete(itemId);
      } else {
        newCheckedItems.add(itemId);
      }
      return newCheckedItems;
    });
  };

  const onConfirm = (e) => {
    e.preventDefault();
    // send the array from checked item id and loan_note
    handleConfirm(loanData?._id, Array.from(checkedItems), loanNote);
  };
  return (
    <Dialog open={open} size="md" className="bg-gray-50">
      <DialogHeader className="justify-between">
        <h1 className="font-semibold text-sm md:text-xl bg-gradient-to-r from-blue-800 via-purple-700 to-indigo-800 bg-clip-text text-transparent animate-gradient">
          Confirm Return Loan Items by Staff
        </h1>
        <IconButton color="blue-gray" size="sm" variant="text" onClick={handleClose}>
          <IoClose className="h-5 w-5" />
        </IconButton>
      </DialogHeader>
      <DialogBody divider className="p-4 max-h-[60vh] overflow-y-auto">
        {/* Display error message */}
        {isError && <AlertNotification message={message} type="error" />}

        <p className="text-sm mb-4 text-gray-700 italic">
          Please check each loan item before confirming the return of the loan items.
        </p>
        <div className="flex flex-col gap-2">
          {loanData?.borrowed_item && loanData?.borrowed_item.length > 0 ? (
            loanData?.borrowed_item
              ?.filter((item) => !item.is_consumable)
              ?.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center p-2 border rounded-lg border-blue-gray-100 hover:bg-blue-gray-50 transition-colors"
                >
                  <Checkbox
                    id={`item-${item._id}`}
                    color="indigo"
                    ripple={false}
                    checked={checkedItems.has(item._id)}
                    onChange={() => handleCheckboxChange(item._id)}
                    className="rounded-full"
                    label={
                      <p className="text-sm text-gray-800">
                        {item.inventory_id.asset_name} ({item.quantity} pcs)
                      </p>
                    }
                    containerProps={{
                      className: "-ml-2.5", // Adjust spacing if needed
                    }}
                  />
                </div>
              ))
          ) : (
            <Typography color="blue-gray" className="text-center">
              No items found for this loan transaction.
            </Typography>
          )}
        </div>

        <div className="mt-4">
          <Textarea
            maxLength={characterLimit}
            label="Loan Note"
            value={loanNote}
            onChange={(e) => setLoanNote(e.target.value)}
            required
            rows={3}
          />

          <p className="mb-1 text-gray-600 text-xs text-right">
            {characterLimit - loanNote.length}/{characterLimit} characters left
          </p>
        </div>
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button
          variant="gradient"
          className="bg-gradient-to-r from-blue-700 to-purple-800 text-xs py-3 px-6 rounded-lg capitalize"
          onClick={onConfirm}
          disabled={checkedItems.size === 0 || loanNote.trim() === ""}
        >
          Confirm ({checkedItems.size} items)
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default DialogStaffConfirmReturn;
