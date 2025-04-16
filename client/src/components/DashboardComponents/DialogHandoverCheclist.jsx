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
} from "@material-tailwind/react";
import { IoClose } from "react-icons/io5";

// components
import AlertNotification from "../../common/AlertNotification";

const DialogHandoverChecklist = ({
  open,
  handleClose,
  handleConfirm,
  loanData,
  isError = false,
  message = "",
}) => {
  const [checkedItems, setCheckedItems] = useState(new Set());

  useEffect(() => {
    if (open) {
      setCheckedItems(new Set());
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
    // send the array from checked item id
    handleConfirm(loanData?._id, Array.from(checkedItems));
  };
  return (
    <Dialog open={open} size="md">
      <DialogHeader className="justify-between">
        <h1 className="font-semibold text-base md:text-xl bg-gradient-to-r from-indigo-400 via-green-500 to-green-800 bg-clip-text text-transparent animate-gradient">
          Confirm Handover Items by Staff
        </h1>
        <IconButton
          color="blue-gray"
          size="sm"
          variant="text"
          onClick={handleClose}
        >
          <IoClose className="h-5 w-5" />
        </IconButton>
      </DialogHeader>
      <DialogBody divider className="p-4 max-h-[60vh] overflow-y-auto">
        {/* Display error message */}
        {isError && <AlertNotification message={message} type="error" />}

        <p className="text-sm mb-4 text-gray-700 italic">
          Please check the item first before handing it over to the borrower.
        </p>
        <div className="flex flex-col gap-2">
          {loanData?.borrowed_item && loanData?.borrowed_item.length > 0 ? (
            loanData?.borrowed_item?.map((item) => (
              <div
                key={item._id}
                className="flex items-center p-2 border rounded-lg border-blue-gray-100 hover:bg-blue-gray-50 transition-colors"
              >
                <Checkbox
                  id={`item-${item._id}`}
                  color="green"
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
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button
          variant="gradient"
          className="bg-gradient-to-r from-indigo-500 to-green-600 text-xs py-3 px-6 rounded-lg capitalize"
          onClick={onConfirm}
          disabled={checkedItems.size === 0} // Nonaktifkan jika tidak ada item yang dipilih
        >
          Confirm ({checkedItems.size} items)
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default DialogHandoverChecklist;
