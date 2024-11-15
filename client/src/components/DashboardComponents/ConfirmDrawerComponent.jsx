import React from "react";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
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
    <>
      <Drawer
        placement="bottom"
        open={openBottom}
        onClose={closeDrawerBottom}
        className="p-4"
      >
        <div className="mb-6 flex items-center justify-between">
          <Typography variant="h5" color="red">
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
        <Typography color="gray" className="mb-8 pr-4 font-semibold">
          Please check the items you wish to borrow first. Have you received the
          item you borrowed from our staff?
        </Typography>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={itemReceived}
              onChange={(e) => setItemReceived(e.target.checked)}
              className="mr-2"
            />
            <p className="text-sm">I have received the items</p>
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
      </Drawer>
    </>
  );
};

export default ConfirmDrawerComponent;
