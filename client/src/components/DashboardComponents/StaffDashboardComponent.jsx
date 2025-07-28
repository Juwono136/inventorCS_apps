import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// components
import StaffDashboardCardComponent from "./StaffDashboardCardComponent";
import LoanReturnTrendChartComponent from "./LoanReturnTrendChartComponent";
import InventoryByCategoryChartComponent from "./InventoryByCategoryChartComponent";
import LoanTransactionTableComponent from "./LoanTransactionTableComponent";

// features
import { getInventoriesByProgram } from "../../features/inventory/inventorySlice";
import { getAllMeetings } from "../../features/meeting/meetingSlice";
import { getAllLoanTransactions } from "../../features/loanTransaction/loanSlice";
import { getAllUsersInfor } from "../../features/user/userSlice";

const StaffDashboardComponent = ({ page, sort, categories, search, limit }) => {
  const [sortLoanStatus, setSortLoanStatus] = useState({
    sort: "borrow_date",
    order: "desc",
  });

  const { allUsersInfor } = useSelector((state) => state.user);
  const { inventories } = useSelector((state) => state.inventory);
  const { meeting } = useSelector((state) => state.meeting);
  const { loanData } = useSelector((state) => state.loan);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInventoriesByProgram({ page, sort, categories, search, limit }));
    dispatch(getAllMeetings({ page, sort, categories, search }));
    dispatch(getAllLoanTransactions({ page, sort: sortLoanStatus, categories, search }));
    dispatch(getAllUsersInfor({ all: true }));
  }, [page, sort, categories, search, limit, dispatch]);

  const recentLoanTransactions = loanData?.loanTransactions?.slice().slice(0, 5);

  return (
    <>
      <div className="flex w-full flex-col pt-4">
        {/* staff dashboard card components */}
        <StaffDashboardCardComponent
          inventories={inventories}
          meeting={meeting}
          loanData={loanData}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {/* Loan vs return item component */}
        <LoanReturnTrendChartComponent loanData={loanData} />

        {/* Inventory by category component */}
        <InventoryByCategoryChartComponent inventories={inventories} />
      </div>

      {/* recent loan transaction table component */}
      <div className="flex w-full pt-4">
        <div className="w-full bg-white rounded-xl shadow-md border border-indigo-400 p-4 md:p-6">
          <div className="flex justify-between items-center w-full mb-6">
            <h2 className="text-sm md:text-lg text-gray-800 font-semibold">
              Recent Loan Transactions
            </h2>

            <a
              href="/borrowed-item?page=1&search=&loanStatus="
              className="text-xs font-semibold border border-indigo-500 text-indigo-600 px-3 py-2 rounded-md hover:bg-indigo-100 hover:text-gray-800 transition-all"
            >
              More Info
            </a>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[700px]">
              {loanData?.loanTransactions?.length > 0 ? (
                <LoanTransactionTableComponent
                  data={{ ...loanData, loanTransactions: recentLoanTransactions }}
                  users={allUsersInfor?.users}
                />
              ) : (
                <p className="text-sm text-gray-600">No recent loan transactions found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffDashboardComponent;
