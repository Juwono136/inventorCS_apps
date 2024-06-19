import React from "react";
import {
  Dialog,
  DialogHeader,
  Typography,
  DialogBody,
  DialogFooter,
  Button,
  IconButton,
  Card,
  Chip,
} from "@material-tailwind/react";
import { IoClose } from "react-icons/io5";

const TABLE_HEAD = ["No", "Description of equipment borrowed", "Serial Number"];

const MoreInfoBorrowedItem = ({ open, handleOpenDialog, item }) => {
  return (
    <Dialog open={open}>
      <DialogHeader className="justify-between">
        <div className="flex flex-col justify-center items-center w-full">
          <Typography variant="h5" color="blue-gray">
            Loan of Equipment
          </Typography>
          <Typography color="gray" variant="paragraph">
            Computer Science Program
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
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-800 w-full">Date:</span>
            <span className="col-span-2">{item.date}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-800 w-full">
              Borrower Name:
            </span>
            <span className="col-span-2">{item.borrower_name}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-800 w-full">
              Binusian ID:
            </span>
            <span className="col-span-2">{item.binusian_id}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-800 w-full">
              Home Address:
            </span>
            <span className="col-span-2">{item.address}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-800 w-full">Phone:</span>
            <span className="col-span-2">{item.phone}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-800 w-full">Email:</span>
            <span className="col-span-2">{item.email}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-800 w-full">
              Purpose of Loan:
            </span>
            <span className="col-span-2">{item.purpose}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-800 w-full">Status:</span>
            <span className="flex gap-2 items-center col-span-2">
              <Chip
                size="sm"
                variant="ghost"
                className="max-w-max"
                value={item.status || ""}
                color={item.status === "borrowed" ? "red" : "green"}
              />
              <p>{item.status === "borrowed" ? "" : item.return_date}</p>
            </span>
          </div>

          <div className="grid gap-2 h-[300px]">
            <Card className="w-full overflow-scroll">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
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
                  {item.product?.name.map((name, i) => (
                    <tr key={i}>
                      <td className="border-b border-blue-gray-50 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {i + 1}
                        </Typography>
                      </td>
                      <td className="border-b border-blue-gray-50 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {name}
                        </Typography>
                      </td>
                      <td className="border-b border-blue-gray-50 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {item.product.serial_number[i]}
                        </Typography>
                      </td>
                    </tr>
                  ))}
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
