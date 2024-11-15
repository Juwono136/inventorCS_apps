import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  Input,
} from "@material-tailwind/react";
import { CiSearch } from "react-icons/ci";
import { HiArrowDownTray } from "react-icons/hi2";
import MoreInfoBorrowedItem from "../../components/DashboardComponents/MoreInfoBorrowedItem";
import { useDispatch, useSelector } from "react-redux";
import { getAllLoanTransactions } from "../../features/loanTransaction/loanSlice";
import { getUserById } from "../../features/user/userSlice";
import Loader from "../../common/Loader";

const BorrowedItems = () => {
  const TABLE_HEAD = [
    "No.",
    "Binusian ID",
    "Borrower Name",
    "Email",
    "Borrow Date",
    "Return Date",
    "Loan Status",
  ];

  const { loanData, isLoading } = useSelector((state) => state.loan);
  const data = loanData;

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [borrowerInfo, setBorrowerInfo] = useState({});

  const dispatch = useDispatch();

  const handleOpenDialog = (id) => {
    const selectedData = data?.loanTransactions?.find(
      (item) => item._id === id
    );

    if (selectedData) {
      const borrower = borrowerInfo[selectedData.borrower_id] || {};
      const itemDetails = {
        ...selectedData,
        ...borrower.personal_info,
        borrow_date: new Date(selectedData.borrow_date).toLocaleDateString(),
        return_date: new Date(selectedData.return_date).toLocaleDateString(),
      };
      setSelectedItem(itemDetails);
    }
    setOpenDialog(!openDialog);
  };

  useEffect(() => {
    dispatch(getAllLoanTransactions());
  }, [dispatch]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (data?.loanTransactions) {
        for (const transaction of data.loanTransactions) {
          const res = await dispatch(getUserById(transaction?.borrower_id));
          if (res) {
            setBorrowerInfo((prev) => ({
              ...prev,
              [transaction.borrower_id]: res.payload,
            }));
          }
        }
      }
    };

    fetchUsers();
  }, [dispatch, data?.loanTransactions]);

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
                  Recent Loan of Equipment Transactions
                </Typography>
                <Typography
                  color="gray"
                  className="mt-1 font-normal text-xs md:text-sm"
                >
                  These are details about the last loan of equipment
                  transactions
                </Typography>
              </div>
              <div className="flex w-full shrink-0 gap-6 flex-col-reverse md:flex-row md:w-max md:gap-2">
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
            {isLoading ? (
              <div className="flex justify-center">
                <Loader />
              </div>
            ) : (
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
                      {
                        _id,
                        borrower_id,
                        borrow_date,
                        return_date,
                        loan_status,
                      },
                      index
                    ) => {
                      const borrower =
                        borrowerInfo[borrower_id]?.personal_info || {};
                      const {
                        binusian_id,
                        name: borrowerName,
                        email,
                      } = borrower;

                      const isLast = index === data.loanTransactions.length - 1;
                      const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50";

                      const statusLoanColors = {
                        Pending: "blue-gray",
                        "Ready to Pickup": "lime",
                        Borrowed: "blue",
                        "Partially Consumed": "purple",
                        Consumed: "orange",
                        Returned: "green",
                        Cancelled: "red",
                      };

                      return (
                        <tr
                          key={_id}
                          onClick={() => handleOpenDialog(_id)}
                          className="hover:bg-blue-gray-50 hover:cursor-pointer"
                        >
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
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            )}
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
