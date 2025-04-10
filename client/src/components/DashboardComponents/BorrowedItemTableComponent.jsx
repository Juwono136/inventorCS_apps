import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

// icons and material-tailwind
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Chip,
} from "@material-tailwind/react";
import { RxCaretSort } from "react-icons/rx";

// components
import Loader from "../../common/Loader";
import { getFullDay } from "../../common/Date";
import SearchElement from "../../common/SearchElement";
import FilterCheckBox from "../../common/FilterCheckBox";
import FilterByDate from "../../common/FilterByDate";
import Pagination from "../../common/Pagination";
import MoreInfoBorrowedItemComponent from "./MoreInfoBorrowedItemComponent";

// features
import {
  getAllLoanTransactions,
  markTransactionIsNew,
} from "../../features/loanTransaction/loanSlice";
import { getAllUsersInfor } from "../../features/user/userSlice";

const BorrowedItemTableComponent = ({ refreshTrigger }) => {
  const TABLE_HEAD = [
    "No.",
    "Transaction ID",
    "Borrower ID",
    "Borrower Name",
    "Borrow Date",
    "Return Date",
    "Loan Status",
  ];

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const [sortLoanStatus, setSortLoanStatus] = useState({
    sort: "borrow_date",
    order: "desc",
  });

  const [loanStatus, setLoanStatus] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [borrowDateRange, setBorrowDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const { loanData, isLoading, isError, message } = useSelector(
    (state) => state.loan
  );
  const { allUsersInfor } = useSelector((state) => state.user);

  const { users } = allUsersInfor;
  const data = loanData;

  const formattedStartDate = borrowDateRange.startDate
    ? new Date(borrowDateRange.startDate).toISOString()
    : "";

  const formattedEndDate = borrowDateRange.endDate
    ? new Date(
        new Date(borrowDateRange.endDate).setHours(23, 59, 59, 999)
      ).toISOString()
    : "";

  const dispatch = useDispatch();
  const [debouncedSearch] = useDebounce(search, 500);

  // Sets the page when the component is first mounted to match the URL.
  useEffect(() => {
    setPage(currentPage);
  }, []);

  // Sync search with URL
  useEffect(() => {
    if (searchQuery !== search) {
      setSearch(searchQuery);
    }
  }, [searchQuery]);

  // Reset page to 1 when search changes
  useEffect(() => {
    if (debouncedSearch) {
      setPage(1);
      setSearchParams({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (page === currentPage) {
      dispatch(
        getAllLoanTransactions({
          page,
          sort: sortLoanStatus,
          loanStatus,
          search: debouncedSearch || "",
          borrow_date_start: formattedStartDate,
          borrow_date_end: formattedEndDate,
        })
      );
      dispatch(getAllUsersInfor({ all: true }));
    }
  }, [
    dispatch,
    page,
    currentPage,
    sortLoanStatus,
    loanStatus,
    debouncedSearch,
    formattedStartDate,
    formattedEndDate,
    refreshTrigger,
  ]);

  useEffect(() => {
    setSearchParams({
      page,
      search,
      loanStatus,
    });

    if (isError) {
      toast.error(message);
    }
  }, [page, search, loanStatus, borrowDateRange, isError, message]);

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

    if (selectedData?.is_new === true) {
      dispatch(markTransactionIsNew(id));
      dispatch(
        getAllLoanTransactions({
          page,
          sort: sortLoanStatus,
          loanStatus,
          search: debouncedSearch || "",
          borrow_date_start: formattedStartDate,
          borrow_date_end: formattedEndDate,
        })
      );
    }

    setSelectedItem(itemDetails);
    setOpenDialog(!openDialog);
  };

  const getBorrowerInfo = (borrowerId) => {
    const borrower = users?.find((user) => user._id === borrowerId);
    return borrower || {};
  };

  const handleSort = (column) => {
    const sortFileMap = {
      "Transaction ID": "transaction_id",
      "Borrower ID": "borrower_id",
      "Borrower Name": "borrower_id",
      "Borrow Date": "borrow_date",
      "Return Date": "return_date",
      "Loan Status": "Loan Status",
    };
    const selectedSortField = sortFileMap[column];
    if (selectedSortField) {
      const newOrder =
        sortLoanStatus.sort === selectedSortField &&
        sortLoanStatus.order === "asc"
          ? "desc"
          : "asc";
      setSortLoanStatus({ sort: selectedSortField, order: newOrder });
    }
  };

  return (
    <>
      <Card className="w-full overflow-y-hidden">
        <CardHeader floated={false} shadow={false} className="rounded-none">
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
        </CardHeader>

        <div className="mb-4 flex flex-col gap-4 py-2 px-4 md:flex-row md:items-center">
          <SearchElement setSearch={setSearch} />

          <FilterCheckBox
            filterValues={data?.loan_statuses || []}
            setFilter={(val) => {
              setLoanStatus(val);
            }}
            setPage={setPage}
            filterTitle="Filter by Loan Status"
          />

          <FilterByDate
            dateRange={borrowDateRange}
            setDateRange={setBorrowDateRange}
            placeholder="Filter by Borrow Date"
          />
        </div>
        <CardBody className="h-[400px] overflow-y-auto p-0">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : data?.loanTransactions?.length > 0 ? (
            <table className="w-full table-auto text-left">
              <thead className="sticky top-0">
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
                        {head}{" "}
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
                    const binusianId = borrower.personal_info?.binusian_id;
                    const borrowerName = borrower.personal_info?.name;

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
                              {binusianId}
                            </h1>
                          </div>
                        </td>

                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <h1 className="font-normal text-blue-gray-800 text-xs md:text-sm">
                              {borrowerName}
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
            data?.loanTransactions?.length === 0 && (
              <div className="flex justify-center item-center text-xs md:text-sm text-center text-red-800 my-4 mx-8 bg-red-100 rounded-md md:rounded-full px-4 py-2">
                Borrowed item not found.
              </div>
            )
          )}
        </CardBody>

        {data?.totalLoans > 0 && (
          <Pagination
            totalPage={
              search
                ? Math.ceil(data?.totalLoans / data?.limit)
                : data?.totalPages
            }
            page={page}
            setPage={setPage}
            bgColor="deep-purple"
          />
        )}
      </Card>

      <MoreInfoBorrowedItemComponent
        open={openDialog}
        handleOpenDialog={() => setOpenDialog(false)}
        selectedItem={selectedItem}
      />
    </>
  );
};

export default BorrowedItemTableComponent;
