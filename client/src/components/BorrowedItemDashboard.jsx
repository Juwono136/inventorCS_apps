import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import { CiSearch } from "react-icons/ci";
import { HiArrowDownTray } from "react-icons/hi2";
import { IoIosMore } from "react-icons/io";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import MoreInfoBorrowedItem from "./MoreInfoBorrowedItem";
import { items } from "../assets/data/items";

const TABLE_HEAD = [
  "No.",
  "Binusian ID",
  "Borrower Name",
  "Date",
  "Address",
  "Phone",
  "Email",
  "Status",
  "Item Name",
  "",
];

const BorrowedItemDashboard = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);

  const handleOpenDialog = (item) => {
    setSelectedItem(item);
    setOpenDialog(!openDialog);
  };

  return (
    <div className="px-8 py-6">
      <h1 className="text-gray-700 text-md md:text-2xl">Borrowed Items List</h1>
      <hr className="my-2 border-blue-gray-50" />

      <div className="mt-4">
        <Card className="w-full overflow-y-hidden">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div>
                <Typography className="text-indigo-800 text-sm font-semibold md:text-xl">
                  Recent Loan of Equitment Transactions
                </Typography>
                <Typography
                  color="gray"
                  className="mt-1 font-normal text-xs md:text-sm"
                >
                  These are details about the last loan of equitment
                  transactions
                </Typography>
              </div>
              <div className="flex w-full shrink-0 gap-6  flex-col-reverse md:flex-row md:w-max md:gap-2">
                <div className="w-full md:w-72">
                  <Input
                    label="Search"
                    icon={<CiSearch className="h-5 w-5" />}
                  />
                </div>
                <Button
                  className="flex items-center justify-center gap-2 bg-indigo-800"
                  size="sm"
                >
                  <HiArrowDownTray className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-scroll px-0">
            <table className="w-full table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
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
                {items.map(
                  (
                    {
                      binusian_id,
                      borrower_name,
                      date,
                      address,
                      phone,
                      email,
                      status,
                      purpose,
                      product,
                      return_date,
                    },
                    index
                  ) => {
                    const isLast = index === items.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={borrower_name}>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {index + 1}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {binusian_id}
                            </Typography>
                          </div>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {borrower_name}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {date}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {address}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {phone}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {email}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <div className="w-max">
                            <Chip
                              size="sm"
                              variant="ghost"
                              value={status}
                              color={status === "borrowed" ? "red" : "green"}
                            />
                          </div>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant="small"
                            className="font-semibold text-indigo-700"
                          >
                            {product.name.length > 2
                              ? `${product.name.slice(0, 2).join(", ")}, etc.`
                              : product.name.join(", ")}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Tooltip content="More Info">
                            <IconButton
                              variant="text"
                              onClick={() =>
                                handleOpenDialog({
                                  binusian_id,
                                  borrower_name,
                                  date,
                                  address,
                                  phone,
                                  email,
                                  status,
                                  purpose,
                                  product,
                                  return_date,
                                })
                              }
                            >
                              <IoIosMore className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
          <CardFooter className="flex items-center justify-center border-t border-blue-gray-50 p-4">
            <IconButton variant="outlined" size="sm">
              <FaArrowLeft />
            </IconButton>
            <div className="flex items-center gap-1 md:gap-2">
              <IconButton variant="text" size="sm">
                1
              </IconButton>
              <IconButton variant="text" size="sm">
                2
              </IconButton>
              <IconButton variant="text" size="sm">
                3
              </IconButton>
              <IconButton variant="text" size="sm">
                ...
              </IconButton>
              <IconButton variant="text" size="sm">
                8
              </IconButton>
              <IconButton variant="text" size="sm">
                9
              </IconButton>
              <IconButton variant="text" size="sm">
                10
              </IconButton>
            </div>
            <IconButton variant="outlined" size="sm">
              <FaArrowRight />
            </IconButton>
          </CardFooter>
        </Card>
      </div>

      {/* Open Dialog More Info */}
      <MoreInfoBorrowedItem
        open={openDialog}
        handleOpenDialog={() => setOpenDialog(false)}
        item={selectedItem}
      />
    </div>
  );
};

export default BorrowedItemDashboard;
