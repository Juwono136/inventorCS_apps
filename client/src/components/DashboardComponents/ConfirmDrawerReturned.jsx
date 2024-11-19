import React from "react";
import {
  Button,
  Dialog,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { IoClose } from "react-icons/io5";

const ConfirmDrawerReturned = ({
  openReturned,
  closeDrawerReturned,
  itemReturned,
  setItemReturned,
  handleConfirmReturned,
}) => {
  return (
    <Dialog open={openReturned} onClose={closeDrawerReturned} size="xs">
      <div className="flex justify-center items-center flex-col rounded-lg bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between w-full">
          <Typography color="red" className="text-sm font-semibold">
            Confirm Returned loan item!
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={closeDrawerReturned}
          >
            <IoClose className="text-lg" />
          </IconButton>
        </div>
        <Typography color="gray" className="mb-8 pr-4 font-semibold text-sm">
          Have you returned the loan item that you borrowed from our staff
          before?
        </Typography>

        <div className="mb-4 flex w-full justify-start">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={itemReturned}
              onChange={(e) => setItemReturned(e.target.checked)}
              className="mr-2"
            />
            <p className="text-xs text-gray-900">
              I've already returned the loan item
            </p>
          </label>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-gradient-to-r from-lime-500 to-green-800 text-xs py-3 px-6 rounded-lg capitalize"
            onClick={(e) => handleConfirmReturned(e, true)}
            disabled={!itemReturned}
          >
            Yes, I Returned it
          </Button>
          <Button
            size="sm"
            color="red"
            className="capitalize"
            variant="outlined"
            onClick={(e) => handleConfirmReturned(e, false)}
          >
            No, I haven't
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmDrawerReturned;
