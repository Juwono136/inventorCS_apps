// icons and material-tailwind
import { Button, Dialog, IconButton } from "@material-tailwind/react";
import { IoClose } from "react-icons/io5";

const ConfirmDrawerReturnedComponent = ({
  openReturned,
  closeDrawerReturned,
  itemReturned,
  setItemReturned,
  handleConfirmReturned,
}) => {
  return (
    <Dialog open={openReturned} onClose={closeDrawerReturned} size="xs">
      <div className="flex justify-center items-center flex-col rounded-lg bg-white p-4 shadow-2xl">
        <div className="mb-6 flex items-center justify-between w-full">
          <h2 className="text-base font-semibold text-green-800">
            Confirm Returned Loan Item!
          </h2>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={closeDrawerReturned}
          >
            <IoClose className="text-lg" />
          </IconButton>
        </div>
        <p className="text-gray-700 italic mb-8 pr-4 font-semibold text-xs md:text-sm">
          Have you returned the loan item that you borrowed from our staff?
        </p>

        <div className="mb-4 flex w-full justify-start">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={itemReturned}
              onChange={(e) => setItemReturned(e.target.checked)}
              className="mr-2"
            />
            <p className="text-sm text-green-900">
              I've already returned the loan item
            </p>
          </label>
        </div>
        <div className="flex justify-end w-full gap-2">
          <Button
            className="bg-gradient-to-r from-teal-500 to-green-800 text-xs py-2 px-4 rounded-lg capitalize"
            onClick={(e) => handleConfirmReturned(e, true)}
            disabled={!itemReturned}
          >
            Yes, I Returned it
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmDrawerReturnedComponent;
