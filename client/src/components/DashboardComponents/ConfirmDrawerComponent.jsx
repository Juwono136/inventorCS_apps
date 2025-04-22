import React from "react";

// icons and material-tailwind
import {
  Button,
  Dialog,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { IoClose } from "react-icons/io5";

const ConfirmDrawerComponent = ({
  openBottom,
  closeDrawerBottom,
  itemReceived,
  setItemReceived,
  handleConfirm,
}) => {
  return (
    <Dialog open={openBottom} onClose={closeDrawerBottom} size="xs">
      <div className="flex justify-center items-center flex-col rounded-lg bg-white p-4 shadow-2xl">
        <div className="mb-2 flex items-center justify-between w-full">
          <h2 className="text-base font-semibold text-purple-800">
            Confirm Loan Item Receipt!
          </h2>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={closeDrawerBottom}
          >
            <IoClose className="text-lg" />
          </IconButton>
        </div>
        <Typography
          color="gray"
          className="mb-8 pr-4 text-xs md:text-sm italic"
        >
          Please check the items you wish to borrow first. Have you received the
          item you borrowed from our staff?
        </Typography>

        <div className="mb-4 flex w-full justify-start">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={itemReceived}
              onChange={(e) => setItemReceived(e.target.checked)}
              className="mr-2"
            />
            <p className="text-sm text-gray-900 font-semibold">
              I have received the items
            </p>
          </label>
        </div>
        <div className="flex gap-2 w-full justify-end">
          <Button
            className="bg-gradient-to-r from-purple-500 to-blue-800 text-xs py-2 px-3 rounded-lg capitalize"
            onClick={(e) => handleConfirm(e, true)}
            disabled={!itemReceived}
          >
            Yes, I received it
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmDrawerComponent;
