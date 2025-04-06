import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";

// components
import Layout from "./Layout";
import BorrowedItemTableComponent from "../../components/DashboardComponents/BorrowedItemTableComponent";
import MoreInfoBorrowedItemComponent from "../../components/DashboardComponents/MoreInfoBorrowedItemComponent";
import DynamicBreadcrumbs from "../../common/DynamicBreadcrumbs";
import UseDocumentTitle from "../../common/UseDocumentTitle";

// features
import {
  getAllLoanTransactions,
  markTransactionIsNew,
} from "../../features/loanTransaction/loanSlice";
import { getAllUsersInfor } from "../../features/user/userSlice";
import Pagination from "../../common/Pagination";
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";

const BorrowedItemsPage = ({
  sort,
  setSort,
  loanStatus,
  setLoanStatus,
  page,
  setPage,
  search,
  setSearch,
}) => {
  UseDocumentTitle("Borrowed Item");

  const { loanData, isLoading, isError, message } = useSelector(
    (state) => state.loan
  );
  const { allUsersInfor } = useSelector((state) => state.user);
  const { users } = allUsersInfor;
  const data = loanData;

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("borrowed");
  const [borrowDateRange, setBorrowDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";

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
          sort,
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
    sort,
    loanStatus,
    debouncedSearch,
    formattedStartDate,
    formattedEndDate,
  ]);

  // Make sure the URL is always updated with the state
  useEffect(() => {
    setSearchParams({
      page,
      search,
      loanStatus,
    });

    if (isError) {
      toast.error(message);
    }

    // if (isSuccess) {
    //   toast.success(message);
    // }
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
          sort,
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
        sort.sort === selectedSortField && sort.order === "asc"
          ? "desc"
          : "asc";
      setSort({ sort: selectedSortField, order: newOrder });
    }
  };

  return (
    <Layout>
      <DynamicBreadcrumbs />
      <h3 className="text-base font-bold text-indigo-500/60 sm:text-xl mb-2">
        Borrowed Items Info
      </h3>
      <hr className="my-2 border-blue-gray-50" />

      <div className="mt-4">
        <Tabs value={activeTab}>
          <TabsHeader
            className="rounded-none flex gap-4 border-b border-blue-gray-50 bg-transparent p-0"
            indicatorProps={{
              className:
                "bg-indigo-50 border-b-2 border-indigo-800 shadow-none rounded-md",
            }}
          >
            <Tab
              value="borrowed"
              onClick={() => setActiveTab("borrowed")}
              className="w-auto text-sm"
            >
              Borrowed Items
            </Tab>
            <Tab
              value="meetings"
              onClick={() => setActiveTab("meetings")}
              className="w-auto text-sm"
            >
              Meeting Requests
            </Tab>
          </TabsHeader>

          <TabsBody>
            <TabPanel value="borrowed" className="py-4">
              <BorrowedItemTableComponent
                isLoading={isLoading}
                handleOpenDialog={handleOpenDialog}
                getBorrowerInfo={getBorrowerInfo}
                data={data}
                setSearch={setSearch}
                setLoanStatus={setLoanStatus}
                setPage={setPage}
                borrowDateRange={borrowDateRange}
                setBorrowDateRange={setBorrowDateRange}
                handleSort={handleSort}
              />
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
            </TabPanel>

            <TabPanel value="meetings" className="py-4">
              <div className="text-gray-700 text-center py-8">
                <p className="text-lg font-semibold">Meeting Requests</p>
                <p className="text-sm mt-2">
                  This section is under development.
                </p>
              </div>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>

      <MoreInfoBorrowedItemComponent
        open={openDialog}
        handleOpenDialog={() => setOpenDialog(false)}
        selectedItem={selectedItem}
      />
    </Layout>
  );
};

export default BorrowedItemsPage;
