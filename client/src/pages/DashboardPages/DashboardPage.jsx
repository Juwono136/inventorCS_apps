import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// components
import Layout from "./Layout";
import UseDocumentTitle from "../../common/UseDocumentTitle";
import StaffDashboardCardComponent from "../../components/DashboardComponents/StaffDashboardCardComponent";
import InventoryStockChartComponent from "../../components/DashboardComponents/InventoryStockChartComponent";
import LoanReturnTrendChartComponent from "../../components/DashboardComponents/LoanReturnTrendChartComponent";
import InventoryByCategoryChartComponent from "../../components/DashboardComponents/InventoryByCategoryChartComponent";

// features
import { getInventoriesByProgram } from "../../features/inventory/inventorySlice";
import { getAllMeetings } from "../../features/meeting/meetingSlice";
import { getAllLoanTransactions } from "../../features/loanTransaction/loanSlice";

const DashboardPage = ({ page, sort, categories, search }) => {
  UseDocumentTitle("Dashboard");

  const { userInfor } = useSelector((state) => state.user);
  const { inventories } = useSelector((state) => state.inventory);
  const { meeting } = useSelector((state) => state.meeting);
  const { loanData } = useSelector((state) => state.loan);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInventoriesByProgram({ page, sort, categories, search }));
    dispatch(getAllMeetings({ page, sort, categories, search }));
    dispatch(getAllLoanTransactions({ page, sort, categories, search }));
  }, [page, sort, categories, search, dispatch]);

  return (
    <Layout>
      <div className="flex gap-2">
        <h3 className="text-xl font-bold text-indigo-500/60 pointer-events-none pb-2">Dashboard</h3>
      </div>
      <h3 className="text-sm font-semibold text-gray-800/60 pointer-events-none mb-2 md:mb-0">
        Welcome, <span className="text-indigo-600/80">{userInfor?.personal_info?.name}</span>
      </h3>

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
        <LoanReturnTrendChartComponent />

        {/* Inventory by category component */}
        <InventoryByCategoryChartComponent />
      </div>

      <div className="flex w-full pt-4">
        {/* Inventory stock chart component */}
        <InventoryStockChartComponent />
      </div>
    </Layout>
  );
};

export default DashboardPage;
