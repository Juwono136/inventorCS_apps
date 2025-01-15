import React from "react";

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
import Loader from "../../common/Loader";
import { getFullDay } from "../../common/Date";

const BorrowedtemTableComponent = ({
  isLoading,
  handleOpenDialog,
  getBorrowerInfo,
  data,
}) => {
  const TABLE_HEAD = [
    "No.",
    "Transaction ID",
    "Borrower ID",
    "Borrower Name",
    "Borrow Date",
    "Return Date",
    "Loan Status",
  ];

  return (
    <>
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
                These are details about the last loan of equipment transactions
              </Typography>
            </div>
            <div className="flex w-full shrink-0 gap-4 flex-col-reverse md:flex-row md:w-max md:gap-2">
              <div className="w-full md:w-72">
                <Input label="Search" icon={<CiSearch className="h-5 w-5" />} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="max-h-[450px] md:max-h-[500px] overflow-y-auto p-0">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : data?.loanTransactions?.length > 0 ? (
            <table className="w-full table-auto text-left">
              <thead className="sticky top-0 z-30">
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-y border-blue-gray-100 bg-indigo-100 p-4"
                    >
                      <Typography
                        color="blue-gray"
                        className="font-bold text-xs md:text-sm text-indigo-600 leading-none opacity-80"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.loanTransactions.map(
                  (
                    {
                      _id,
                      borrower_id,
                      transaction_id,
                      borrow_date,
                      return_date,
                      loan_status,
                      is_new,
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
                          <h1 className="font-normal text-blue-gray-800 text-xs md:text-sm">
                            {index + 1}
                          </h1>
                        </td>

                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <h1 className="font-normal text-blue-gray-800 text-xs md:text-sm">
                              {transaction_id}
                            </h1>
                            {is_new && (
                              <Chip
                                size="sm"
                                color="red"
                                variant="filled"
                                value="New"
                              />
                            )}
                          </div>
                        </td>

                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <h1 className="font-normal text-blue-gray-800 text-xs md:text-sm">
                              {borrower.personal_info?.binusian_id}
                            </h1>
                          </div>
                        </td>

                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <h1 className="font-normal text-blue-gray-800 text-xs md:text-sm">
                              {borrower.personal_info?.name}
                            </h1>
                          </div>
                        </td>

                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <h1 className="font-normal text-blue-gray-800 text-xs md:text-sm">
                              {getFullDay(borrow_date)}
                            </h1>
                          </div>
                        </td>

                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <h1 className="font-normal text-blue-gray-800 text-xs md:text-sm">
                              {return_date ? getFullDay(return_date) : "-"}
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
          ) : (
            <div className="flex justify-center item-center text-sm text-gray-700 my-6 mx-8 bg-gray-300 rounded-full p-2">
              There is no borrowed item.
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default BorrowedtemTableComponent;
