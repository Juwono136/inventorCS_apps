import React from "react";
import {
  Dialog,
  DialogHeader,
  Typography,
  DialogBody,
  IconButton,
  Card,
  Chip,
} from "@material-tailwind/react";
import { IoClose } from "react-icons/io5";

const MoreInfoBorrowedItem = ({ open, handleOpenDialog, selectedItem }) => {
  const TABLE_HEAD = ["No", "Item Name", "Quantity", "Is Consumable?"];

  const statusLoanColors = {
    Pending: "blue-gray",
    Borrowed: "blue",
    "Partially Consumed": "purple",
    Consumed: "orange",
    Returned: "green",
    Cancelled: "red",
  };

  // console.log(selectedItem);

  return (
    <Dialog open={open}>
      <DialogHeader className="justify-between">
        <div className="flex flex-col justify-center items-center w-full">
          <Typography className="font-semibold text-xl bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent animate-gradient">
            Loan of Equipment
          </Typography>
          <Typography className="text-sm text-blue-gray-800">
            Item borrowing information
          </Typography>
        </div>

        <IconButton
          color="blue-gray"
          size="sm"
          variant="text"
          onClick={handleOpenDialog}
        >
          <IoClose className="h-5 w-5" />
        </IconButton>
      </DialogHeader>

      <DialogBody divider className="grid gap-4 md:m-4">
        <div className="space-y-2 text-sm ">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-800 w-full">
              Binusian ID:
            </span>
            <span className="col-span-2 text-gray-900">
              {selectedItem?.binusian_id}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-800 w-full">
              Borrower Name:
            </span>
            <span className="col-span-2 text-gray-900">
              {selectedItem?.name}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-800 w-full">Email:</span>
            <span className="col-span-2 text-gray-900">
              {selectedItem?.email}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-800 w-full">Phone:</span>
            <span className="col-span-2 text-gray-900">
              {selectedItem?.phone || "-"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-800 w-full">Address:</span>
            <span className="col-span-2 text-gray-900">
              {selectedItem?.address || "-"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-800 w-full">Program:</span>
            <span className="col-span-2 text-gray-900">
              {selectedItem?.program || "-"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-800 w-full">
              Borrow Date:
            </span>
            <span className="col-span-2 text-gray-900">
              {selectedItem?.borrow_date}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-800 w-full">
              Return Date:
            </span>
            <span className="col-span-2 text-gray-900">
              {selectedItem?.return_date}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-800 w-full">
              Purpose of Loan:
            </span>
            <span className="col-span-2 text-gray-900">
              {selectedItem?.purpose_of_loan}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-800 w-full">Status:</span>
            <span className="flex gap-2 items-center col-span-2">
              <Chip
                size="sm"
                variant="ghost"
                className="max-w-max "
                value={selectedItem?.loan_status || ""}
                color={statusLoanColors[selectedItem?.loan_status]}
              />
              {/* <p className="text-gray-900">
                {item.status === "borrowed" ? "" : item.return_date}
              </p> */}
            </span>
          </div>

          <div className="grid gap-2">
            <Card className="w-full max-h-[250px] overflow-y-auto">
              <table className="w-full table-auto text-left">
                <thead className="sticky top-0">
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedItem?.borrowed_item?.map(
                    ({ inventory_id, quantity, is_consumable }, index) => {
                      const { asset_name } = inventory_id;

                      return (
                        <tr key={index}>
                          <td className="border-b border-blue-gray-50 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {index + 1}
                            </Typography>
                          </td>
                          <td className="border-b border-blue-gray-50 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {asset_name}
                            </Typography>
                          </td>

                          <td className="border-b border-blue-gray-50 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {quantity}
                            </Typography>
                          </td>

                          <td className="border-b border-blue-gray-50 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {is_consumable === true ? "Yes" : "No"}
                            </Typography>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </DialogBody>

      {/* <DialogFooter className="space-x-2">
        <Button variant="text" color="blue-gray" onClick={handleOpenDialog}>
          Back
        </Button>
        <Button className="bg-indigo-700">Logout</Button>
      </DialogFooter> */}
    </Dialog>
  );
};

export default MoreInfoBorrowedItem;
