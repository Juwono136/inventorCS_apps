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
      <div className="flex justify-center items-center flex-col rounded-lg bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between w-full">
          <Typography color="red" className="text-xl font-semibold">
            Confirm Loan Item!
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={closeDrawerBottom}
          >
            <IoClose className="text-lg" />
          </IconButton>
        </div>
        <Typography color="gray" className="mb-8 pr-4 font-semibold text-sm">
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
            <p className="text-sm text-gray-900">I have received the items</p>
          </label>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-gradient-to-r from-cyan-500 to-lime-800 text-xs py-3 px-6 rounded-lg capitalize"
            onClick={(e) => handleConfirm(e, true)}
            disabled={!itemReceived}
          >
            Yes, I received it
          </Button>
          <Button
            size="sm"
            color="red"
            className="capitalize"
            variant="outlined"
            onClick={(e) => handleConfirm(e, false)}
          >
            No, I haven't
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmDrawerComponent;
