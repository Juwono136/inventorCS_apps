import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// icons and material-tailwind
import { motion } from "framer-motion";
import { FiShoppingCart, FiCheckCircle } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { FaCartPlus } from "react-icons/fa";

// features
import { getLoanTransactionsByUser } from "../../features/loanTransaction/loanSlice";

// components
import UserLoanChartComponent from "./UserLoanChartComponent";
import UserRecentDashboardComponent from "./UserRecentDashboardComponent";

const UserDashboardComponent = ({ limit }) => {
  const dispatch = useDispatch();
  const { loanData } = useSelector((state) => state.loan);

  useEffect(() => {
    dispatch(
      getLoanTransactionsByUser({
        page: 1,
        sort: {
          sort: "borrow_date",
          order: "desc",
        },
        loanStatus: "",
        search: "",
        borrow_date_start: "",
        borrow_date_end: "",
        limit,
      })
    );
  }, [dispatch, limit]);

  const total = loanData?.loanTransactions?.length || 0;
  const borrowed =
    loanData?.loanTransactions?.filter((trx) => trx.loan_status === "Borrowed").length || 0;
  const returned =
    loanData?.loanTransactions?.filter((trx) => trx.loan_status === "Returned").length || 0;
  const cancelled =
    loanData?.loanTransactions?.filter((trx) => trx.loan_status === "Cancelled").length || 0;

  const inventoryCards = [
    {
      title: "Total Loan Transactions",
      value: total,
      icon: FaCartPlus,
      gradient: "bg-blue-500",
      textColor: "text-white",
      delay: 0.1,
    },
    {
      title: "Loan Item Borrowed",
      value: borrowed,
      icon: FiShoppingCart,
      gradient: "bg-orange-500",
      textColor: "text-white",
      delay: 0.2,
    },
    {
      title: "Loan Item Returned",
      value: returned,
      icon: FiCheckCircle,
      gradient: "bg-green-500",
      textColor: "text-white",
      delay: 0.3,
    },
    {
      title: "Loan Item Cancelled",
      value: cancelled,
      icon: MdOutlineCancel,
      gradient: "bg-red-500",
      textColor: "text-white",
      delay: 0.4,
    },
  ];

  return (
    <>
      <div className="flex w-full flex-col pt-4">
        {/* Inventory Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {inventoryCards.map((card, index) => {
            const IconComponent = card.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: card.delay }}
                className="bg-gradient-card shadow-sm rounded-lg p-6 shadow-card hover:shadow-hover hover:bg-gray-50 transition-all duration-300 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {card.value.toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={`w-14 h-14 rounded-xl ${card.gradient} flex items-center justify-center`}
                  >
                    <IconComponent className={`w-7 h-7 ${card.textColor}`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Chart and Recent Activity Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8"
        >
          {/* Inventory Status Chart */}
          <div className="lg:col-span-2">
            <UserLoanChartComponent />
          </div>

          {/* Recent Borrow Activity */}
          <div className="lg:col-span-3">
            <UserRecentDashboardComponent />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default UserDashboardComponent;
