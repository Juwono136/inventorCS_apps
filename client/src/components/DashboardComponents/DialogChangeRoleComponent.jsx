import { Button, Dialog } from "@material-tailwind/react";
import React from "react";

const DialogChangeRoleComponent = ({
  openDialogChangeRole,
  handleDialogChangeRole,
  handleChangeRole,
  handleRoleSelect,
  roles,
  roleOptions,
  selectedRole,
}) => {
  return (
    <Dialog open={openDialogChangeRole} size="xs">
      <div className="flex justify-center items-center flex-col rounded-lg bg-white p-4 shadow-2xl">
        <div className="w-full mb-4 grid bg-gradient-to-r from-indigo-500 to-purple-800 py-4 place-items-center rounded-md">
          <h2 className="flex items-center justify-center text-sm md:text-base text-center font-bold text-gray-200">
            Select your role status
          </h2>
        </div>

        <div className="flex gap-4 w-full justify-center items-center max-h-full py-2">
          {roles.map((role) => (
            <Button
              key={role}
              color="indigo"
              variant={selectedRole === role ? "gradient" : "outlined"}
              className={`w-max py-2 rounded-full ${
                selectedRole === role
                  ? "bg-gradient-to-r from-indigo-500 to-blue-400 text-white"
                  : "text-indigo-600 bg-indigo-50"
              }`}
              onClick={() => handleRoleSelect(role)}
            >
              {roleOptions[role]}
            </Button>
          ))}
        </div>

        <hr className="border-1 border-indigo-500 w-full mt-6" />

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="rounded bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 disabled:text-blue-200 disabled:cursor-not-allowed"
            onClick={handleChangeRole}
            disabled={selectedRole === null}
          >
            Select
          </button>

          <button
            className="rounded bg-gray-50 px-4 py-2 text-sm font-medium text-red-600"
            onClick={handleDialogChangeRole}
          >
            Back
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogChangeRoleComponent;
