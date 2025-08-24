import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

// icons and material-tailwind
import { Card, CardHeader, Typography, CardBody } from "@material-tailwind/react";

// components
import Loader from "../../common/Loader";
import SearchElement from "../../common/SearchElement";
import FilterCheckBox from "../../common/FilterCheckBox";
import FilterByDate from "../../common/FilterByDate";
import Pagination from "../../common/Pagination";
import MoreInfoBorrowedItemComponent from "./MoreInfoBorrowedItemComponent";
import LoanTransactionTableComponent from "./LoanTransactionTableComponent";

// features
import {
  getAllLoanTransactions,
  markTransactionIsNew,
} from "../../features/loanTransaction/loanSlice";
import { getAllUsersInfor } from "../../features/user/userSlice";

const BorrowedItemTableComponent = ({ refreshTrigger }) => {
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

  const { loanData, isLoading, isError, message } = useSelector((state) => state.loan);
  const { allUsersInfor } = useSelector((state) => state.user);

  const { users } = allUsersInfor;
  const data = loanData;

  const formattedStartDate = borrowDateRange.startDate
    ? new Date(newDate(borrowDateRange.startDate).setHours(0, 0, 0, 0)).toISOString()
    : "";

  const formattedEndDate = borrowDateRange.endDate
    ? new Date(new Date(borrowDateRange.endDate).setHours(23, 59, 59, 999)).toISOString()
    : "";

  const dispatch = useDispatch();
  const [debouncedSearch] = useDebounce(search, 500);

  // Sets the page when the component is first mounted to match the URL.
  useEffect(() => {
    if (page !== currentPage) {
      setPage(currentPage);
      setSearch(searchQuery);
    }
  }, [currentPage, searchQuery]);

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
    const selectedData = data?.loanTransactions?.find((item) => item._id === id);

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
        sortLoanStatus.sort === selectedSortField && sortLoanStatus.order === "asc"
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
            <Typography color="gray" className="mt-1 font-normal text-xs md:text-sm">
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
            setDateRange={(newRange) => {
              setBorrowDateRange(newRange);
              setPage(1);
            }}
            placeholder="Filter by Borrow Date"
          />
        </div>
        <CardBody className="h-[400px] overflow-y-auto p-0">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : data?.loanTransactions?.length > 0 ? (
            <LoanTransactionTableComponent
              data={data}
              users={users}
              handleOpenDialog={handleOpenDialog}
              handleSort={handleSort}
            />
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
            totalPage={search ? Math.ceil(data?.totalLoans / data?.limit) : data?.totalPages}
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
