import React, { useEffect, useState } from "react";
import Layout from "./Layout";
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
import { CiCircleMore } from "react-icons/ci";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import MoreInfoBorrowedItem from "../../components/DashboardComponents/MoreInfoBorrowedItem";
import { useDispatch, useSelector } from "react-redux";
import { getAllLoanTransactions } from "../../features/loanTransaction/loanSlice";

const BorrowedItems = () => {
  const TABLE_HEAD = [
    "No.",
    "Binusian ID",
    "Borrower Name",
    "Email",
    "Address",
    "Program",
    "Borrow Date",
    "Return Date",
    "Loan Status",
    "",
  ];

  const { loanData } = useSelector((state) => state.loan);
  const { user } = useSelector((state) => state.auth);
  const { allUsersInfor } = useSelector((state) => state.user);
  const { inventories } = useSelector((state) => state.inventory);
  const { items } = inventories;
  const { users } = allUsersInfor;
  const data = loanData;
  // console.log(data?.loanTransactions);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const findAuthorDetails = (authorId) => {
    const author = users?.find((user) => user._id === authorId);
    return { ...author?.personal_info };
  };

  // const findItemDetails = (itemId) => {
  //   const itemData = items?.find((item) => item._id === itemId);
  //   return { ...itemData };
  // };

  const dispatch = useDispatch();

  const handleOpenDialog = (id) => {
    const selectedData = data?.loanTransactions?.find(
      (item) => item._id === id
    );

    if (selectedData) {
      const borrowerInfo = findAuthorDetails(selectedData.borrower_id);
      const itemDetails = {
        ...selectedData,
        ...borrowerInfo,
        borrow_date: new Date(selectedData.borrow_date).toLocaleDateString(),
        return_date: new Date(selectedData.return_date).toLocaleDateString(),
      };
      setSelectedItem(itemDetails);
    }
    setOpenDialog(!openDialog);
  };

  useEffect(() => {
    if (user?.selectedRole === 1 || user?.selectedRole === 2) {
      dispatch(getAllLoanTransactions());
    }
  }, [dispatch]);

  return (
    <Layout>
      <h1 className="text-gray-700 text-md md:text-2xl">Borrowed Items List</h1>
      <hr className="my-2 border-blue-gray-50" />

      <div className="mt-4 ">
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
          <CardBody className="max-h-[400px] overflow-y-auto px-0">
            <table className="w-full table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-y border-blue-gray-100 bg-indigo-100 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold text-indigo-600 leading-none opacity-80"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.loanTransactions?.map(
                  (
                    { _id, borrower_id, borrow_date, return_date, loan_status },
                    index
                  ) => {
                    const isLast = index === items.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    const statusLoanColors = {
                      Pending: "blue-gray",
                      Borrowed: "blue",
                      "Partially Consumed": "purple",
                      Consumed: "orange",
                      Returned: "green",
                      Cancelled: "red",
                    };

                    const {
                      binusian_id,
                      name: borrowerName,
                      email,
                      address,
                      program,
                    } = findAuthorDetails(borrower_id);

                    return (
                      <tr key={index}>
                        <td className={classes}>
                          <h1 className="font-normal text-blue-gray-800 text-sm">
                            {index + 1}
                          </h1>
                        </td>

                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <h1 className="font-normal text-blue-gray-800 text-sm">
                              {binusian_id}
                            </h1>
                          </div>
                        </td>

                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <h1 className="font-normal text-blue-gray-800 text-sm">
                              {borrowerName}
                            </h1>
                          </div>
                        </td>

                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <h1 className="font-normal text-blue-gray-800 text-sm">
                              {email}
                            </h1>
                          </div>
                        </td>

                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <h1 className="font-normal text-blue-gray-800 text-sm">
                              {address || "-"}
                            </h1>
                          </div>
                        </td>

                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <h1 className="font-normal text-blue-gray-800 text-sm">
                              {program || "-"}
                            </h1>
                          </div>
                        </td>

                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <h1 className="font-normal text-blue-gray-800 text-sm">
                              {new Date(borrow_date).toLocaleDateString()}
                            </h1>
                          </div>
                        </td>

                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <h1 className="font-normal text-blue-gray-800 text-sm">
                              {new Date(return_date).toLocaleDateString()}
                            </h1>
                          </div>
                        </td>

                        <td className={classes}>
                          <div className="w-max">
                            <Chip
                              size="sm"
                              variant="ghost"
                              value={loan_status}
                              color={statusLoanColors[loan_status]}
                            />
                          </div>
                        </td>

                        <td className={classes}>
                          <Tooltip content="More Info">
                            <IconButton
                              variant="text"
                              onClick={() => handleOpenDialog(_id)}
                            >
                              <CiCircleMore className="h-5 w-5" />
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
        </Card>
      </div>

      {/* Open Dialog More Info */}
      <MoreInfoBorrowedItem
        open={openDialog}
        handleOpenDialog={() => setOpenDialog(false)}
        selectedItem={selectedItem}
      />
    </Layout>
  );
};

export default BorrowedItems;
