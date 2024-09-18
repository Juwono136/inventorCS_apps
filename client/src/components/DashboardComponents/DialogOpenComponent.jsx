import React from "react";
import { Dialog } from "@material-tailwind/react";

const DialogOpenComponent = ({
  openDialog,
  handleFunc,
  handleOpenDialog,
  message,
  btnText,
}) => {
  return (
    <Dialog open={openDialog} size="xs">
      <div className="flex justify-center items-center flex-col rounded-lg bg-white p-6 shadow-2xl">
        <h2 className="flex items-center justify-center text-base text-center font-bold">
          {message}
        </h2>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="rounded bg-red-50 px-4 py-2 text-sm font-medium text-red-600"
            onClick={handleFunc}
          >
            {btnText}
          </button>

          <button
            className="rounded bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600"
            onClick={handleOpenDialog}
          >
            Back
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogOpenComponent;
