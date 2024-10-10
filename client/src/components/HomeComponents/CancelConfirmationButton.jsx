import React from 'react';
import { Button, Typography } from "@material-tailwind/react";

const CancelConfirmationButton = ({ onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-11/12 sm:w-3/4 lg:w-1/2 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        <Typography variant="h5" className="font-bold mb-4">Confirm Cancellation</Typography>
        <Typography variant="body2" className="mb-4">Are you sure you want to cancel this item?</Typography>
        <div className="flex justify-end space-x-4">
          <Button color="gray" onClick={onClose}>No</Button>
          <Button color="red" onClick={onConfirm}>Yes, Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default CancelConfirmationButton;