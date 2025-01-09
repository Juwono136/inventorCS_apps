import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// icons and material-tailwind
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Chip,
  Input,
} from "@material-tailwind/react";
import { CiSearch } from "react-icons/ci";

// components
import Layout from "./Layout";
import MoreInfoBorrowedItemComponent from "../../components/DashboardComponents/MoreInfoBorrowedItemComponent";
import Loader from "../../common/Loader";
import DynamicBreadcrumbs from "../../common/DynamicBreadcrumbs";
import UseDocumentTitle from "../../common/UseDocumentTitle";

// features
import { getAllLoanTransactions } from "../../features/loanTransaction/loanSlice";
import { getAllUsersInfor } from "../../features/user/userSlice";

const BorrowedItemsPage = () => {
  UseDocumentTitle("Borrowed Item");

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
  const { allUsersInfor } = useSelector((state) => state.user);
  const { users } = allUsersInfor;
  const data = loanData;

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const dispatch = useDispatch();

  const handleOpenDialog = (id) => {
    const selectedData = data?.loanTransactions?.find(
      (item) => item._id === id
    );

    const borrower = getBorrowerInfo(selectedData.borrower_id);

    const itemDetails = {
      ...selectedData,
      id: selectedData?._id,
      transactionId: selectedData?.transaction_id,
      ...borrower,
    };

    setSelectedItem(itemDetails);

    setOpenDialog(!openDialog);
  };

  const getBorrowerInfo = (borrowerId) => {
    const borrower = users?.find((user) => user._id === borrowerId);
    return borrower || {};
  };

  useEffect(() => {
    dispatch(getAllLoanTransactions());
    dispatch(getAllUsersInfor({ all: true }));
  }, [dispatch]);

  return (
    <Layout>
      <DynamicBreadcrumbs />
      <h3 className="text-base font-bold text-indigo-500/60 pointer-events-none sm:text-xl mb-2 md:mb-0">
        Borrowed Items List
      </h3>
      <hr className="my-2 border-blue-gray-50" />

      <div className="mt-2">
        <Card className="w-full overflow-y-hidden">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <Typography className="text-indigo-400 text-sm font-semibold md:text-xl">
                  Recent Loan Transactions
                </Typography>
                <Typography
                  color="gray"
                  className="mt-1 font-normal text-xs md:text-sm"
                >
                  These are details about the last loan of equipment
                  transactions
                </Typography>
              </div>
              <div className="flex w-full shrink-0 gap-4 flex-col-reverse md:flex-row md:w-max md:gap-2">
                <div className="w-full md:w-72">
                  <Input
                    label="Search"
                    icon={<CiSearch className="h-5 w-5" />}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardBody className="max-h-[450px] md:max-h-[500px] overflow-y-auto p-0">
            {isLoading ? (
              <div className="flex justify-center">
                <Loader />
              </div>
            ) : (
              <table className="w-full table-auto text-left">
                <thead className="sticky top-0 z-30">
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

                      const borrower = getBorrowerInfo(borrower_id);

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
                                {borrower.personal_info?.binusian_id}
                              </h1>
                            </div>
                          </td>

                          <td className={classes}>
                            <div className="flex items-center gap-3">
                              <h1 className="font-normal text-blue-gray-800 text-sm">
                                {borrower.personal_info?.name}
                              </h1>
                            </div>
                          </td>

                          <td className={classes}>
                            <div className="flex items-center gap-3">
                              <h1 className="font-normal text-blue-gray-800 text-sm">
                                {borrower.personal_info?.email}
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
                                {return_date
                                  ? new Date(return_date).toLocaleDateString()
                                  : "-"}
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
      <MoreInfoBorrowedItemComponent
        open={openDialog}
        handleOpenDialog={() => setOpenDialog(false)}
        selectedItem={selectedItem}
      />
    </Layout>
  );
};

export default BorrowedItemsPage;
