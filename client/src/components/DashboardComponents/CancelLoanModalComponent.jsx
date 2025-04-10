import React from "react";

// icons and material-tailwind
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";

const CancelLoanModalComponent = ({
  open,
  handleOpen,
  reason,
  setReason,
  onConfirm,
}) => {
  const characterLimit = 500;

  return (
    <Dialog open={open} size="xs" className="p-2">
      <DialogHeader className="flex items-center">
        <h1 className="text-base md:text-xl bg-gradient-to-r from-red-800 via-orange-600 to-red-600 bg-clip-text text-transparent animate-gradient">
          Cancel Loan Transaction
        </h1>
      </DialogHeader>

      <DialogBody className="text-sm text-gray-700 flex flex-col gap-4">
        <p className="text-sm text-red-600 font-semibold italic">
          Please provide a reason why you want to cancel this loan transaction:
        </p>
        <textarea
          maxLength={characterLimit}
          name="cancelation_reason"
          id="cancelation_reason"
          className="p-3 rounded-md outline-none text-xs w-full text-blue-gray-900 bg-red-100/50 placeholder:text-gray-600 sm:text-sm resize-none"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter your reason..."
          rows="4"
        />
        <p className="mb-1 text-gray-600 text-xs text-right">
          {characterLimit - reason.length}/{characterLimit} characters left
        </p>
      </DialogBody>

      <DialogFooter className="flex justify-end gap-2">
        <Button variant="text" color="gray" onClick={handleOpen}>
          Back
        </Button>
        <Button
          color="red"
          disabled={!reason.trim()}
          onClick={onConfirm}
          className="capitalize"
        >
          Yes, Cancel
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default CancelLoanModalComponent;
