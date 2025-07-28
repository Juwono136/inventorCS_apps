import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";

// components
import Layout from "./Layout";
import LoanTransactionCardComponent from "../../components/DashboardComponents/LoanTransactionCardComponent";
import Loader from "../../common/Loader";
import DynamicBreadcrumbs from "../../common/DynamicBreadcrumbs";
import UseDocumentTitle from "../../common/UseDocumentTitle";

// features
import {
  cancelLoanTransaction,
  getLoanTransactionsByUser,
  loanReset,
} from "../../features/loanTransaction/loanSlice";
import SearchElement from "../../common/SearchElement";
import FilterCheckBox from "../../common/FilterCheckBox";
import FilterByDate from "../../common/FilterByDate";
import Pagination from "../../common/Pagination";

const MyLoanTransactionPage = () => {
  UseDocumentTitle("My Loan Transactions");

  const statusLoanColors = {
    Pending: "blue-gray",
    "Ready to Pickup": "lime",
    Borrowed: "blue",
    "Partially Consumed": "purple",
    Consumed: "orange",
    Returned: "green",
    Cancelled: "red",
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const [loanStatus, setLoanStatus] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortLoanStatus, setSortLoanStatus] = useState({
    sort: "borrow_date",
    order: "desc",
  });
  const [borrowDateRange, setBorrowDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const { loanData, isLoading, isError, message } = useSelector((state) => state.loan);
  const [openCancelLoan, setOpenCancelLoan] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [cancelationReason, setCancelationReason] = useState("");

  const data = loanData;

  const dispatch = useDispatch();
  const [debouncedSearch] = useDebounce(search, 500);

  const [copiedId, setCopiedId] = useState(null);

  const formattedStartDate = borrowDateRange.startDate
    ? new Date(borrowDateRange.startDate).toISOString()
    : "";

  const formattedEndDate = borrowDateRange.endDate
    ? new Date(new Date(borrowDateRange.endDate).setHours(23, 59, 59, 999)).toISOString()
    : "";

  const handleOpenCancelLoan = (id) => {
    setOpenCancelLoan(!openCancelLoan);
    setSelectedId(id);
  };

  const handleCancelLoan = (id, reason) => {
    const data = {
      _id: id,
      cancelation_reason: reason,
    };

    dispatch(cancelLoanTransaction(data))
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        dispatch(getLoanTransactionsByUser());
      });

    setOpenCancelLoan(!openCancelLoan);
    setCancelationReason("");
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

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
        getLoanTransactionsByUser({
          page,
          sort: sortLoanStatus,
          loanStatus,
          search: debouncedSearch || "",
          borrow_date_start: formattedStartDate,
          borrow_date_end: formattedEndDate,
        })
      );
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
  ]);

  useEffect(() => {
    setSearchParams({
      page,
      search,
      loanStatus,
    });

    if (isError) {
      toast.error(message);
      dispatch(loanReset());
    }
  }, [dispatch, page, search, loanStatus, isError, message]);

  return (
    <Layout>
      <DynamicBreadcrumbs />
      <h3 className="text-base text-center md:text-left font-bold text-indigo-500/60 pointer-events-none sm:text-xl">
        My Loan Transactions
      </h3>
      <hr className="w-full border-indigo-100 my-4" />

      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center">
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

      {isLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : loanData?.loanTransactions?.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="text-sm text-gray-700 bg-gray-300 rounded-full p-2">
            There is no loan transactions.
          </p>

          <p className="mt-8 text-sm text-indigo-900">
            Want to borrow an item?{" "}
            <a href="/inventory-list" className="text-blue-gray-900 underline hover:font-semibold">
              Click here.
            </a>
          </p>
        </div>
      ) : (
        <LoanTransactionCardComponent
          statusLoanColors={statusLoanColors}
          copiedId={copiedId}
          handleCopy={handleCopy}
          loanData={loanData}
          selectedId={selectedId}
          openCancelLoan={openCancelLoan}
          handleOpenCancelLoan={handleOpenCancelLoan}
          handleCancelLoan={handleCancelLoan}
          cancelationReason={cancelationReason}
          setCancelationReason={setCancelationReason}
        />
      )}

      {data?.totalLoans > 0 && (
        <Pagination
          totalPage={search ? Math.ceil(data?.totalLoans / data?.limit) : data?.totalPages}
          page={page}
          setPage={setPage}
          bgColor="indigo"
        />
      )}
    </Layout>
  );
};

export default MyLoanTransactionPage;
