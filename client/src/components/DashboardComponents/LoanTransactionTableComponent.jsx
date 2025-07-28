// icons and material-tailwind
import { Typography, Chip } from "@material-tailwind/react";
import { RxCaretSort } from "react-icons/rx";

// components
import { getFullDay } from "../../common/Date";

const LoanTransactionTableComponent = ({
  data,
  users,
  handleOpenDialog = () => {},
  handleSort = () => {},
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

  const getBorrowerInfo = (borrowerId) => {
    return users?.find((user) => user._id === borrowerId) || {};
  };

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
    <table className="w-full table-auto text-left">
      <thead className="sticky top-0 z-10">
        <tr>
          {TABLE_HEAD.map((head, index) => (
            <th
              key={head}
              className={`cursor-pointer border-y border-blue-gray-100 bg-indigo-100 p-4 transition-colors ease-in-out ${
                head !== "No." ? "hover:bg-indigo-200" : ""
              }`}
              onClick={() => head !== "No." && handleSort(head)}
            >
              <Typography
                color="blue-gray"
                className="flex items-center justify-between gap-1 font-bold text-xs md:text-sm text-indigo-600 leading-none opacity-80"
              >
                {head}
                {head !== "No." && index !== TABLE_HEAD.length && (
                  <RxCaretSort className="text-xl hover:text-indigo-200" />
                )}
              </Typography>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.loanTransactions?.map(
          (
            { _id, borrower_id, transaction_id, borrow_date, return_date, loan_status, is_new },
            index
          ) => {
            const isLast = index === data.loanTransactions.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            const borrower = getBorrowerInfo(borrower_id);
            const binusianId = borrower.personal_info?.binusian_id;
            const borrowerName = borrower.personal_info?.name;

            return (
              <tr
                key={_id}
                onClick={() => handleOpenDialog(_id)}
                className="hover:bg-blue-gray-50 hover:cursor-pointer"
              >
                <td className={classes}>
                  <h1 className="font-normal text-blue-gray-800 text-xs md:text-sm">{index + 1}</h1>
                </td>

                <td className={classes}>
                  <div className="flex items-center gap-3">
                    <h1 className="font-normal text-blue-gray-800 text-xs md:text-sm">
                      {transaction_id}
                    </h1>
                    {is_new && <Chip size="sm" color="red" variant="filled" value="New" />}
                  </div>
                </td>

                <td className={classes}>
                  <h1 className="font-normal text-blue-gray-800 text-xs md:text-sm">
                    {binusianId}
                  </h1>
                </td>

                <td className={classes}>
                  <h1 className="font-normal text-blue-gray-800 text-xs md:text-sm">
                    {borrowerName}
                  </h1>
                </td>

                <td className={classes}>
                  <h1 className="font-normal text-blue-gray-800 text-xs md:text-sm">
                    {getFullDay(borrow_date)}
                  </h1>
                </td>

                <td className={classes}>
                  <h1 className="font-normal text-blue-gray-800 text-xs md:text-sm">
                    {return_date ? getFullDay(return_date) : "-"}
                  </h1>
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
  );
};

export default LoanTransactionTableComponent;
