import React, { useMemo } from "react";

// icons and material-tailwind
import { MdOutlineInventory2 } from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { BsCartCheck } from "react-icons/bs";

const StaffDashboardCardComponent = ({ inventories, meeting, loanData }) => {
  const calculateStats = (dataArray, filterFn = null, dateField = "createdAt") => {
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(now.getDate() - 14);

    const filtered = filterFn ? dataArray.filter(filterFn) : dataArray;

    const thisWeek = filtered.filter((item) => new Date(item[dateField]) >= oneWeekAgo);

    const lastWeek = filtered.filter(
      (item) => new Date(item[dateField]) >= twoWeeksAgo && new Date(item[dateField]) < oneWeekAgo
    );

    const change = thisWeek.length - lastWeek.length;

    return {
      change,
      isPositive: change >= 0,
    };
  };

  const summaryData = useMemo(() => {
    if (!inventories || !loanData || !meeting) return [];

    const { items = [], totalItems = 0 } = inventories;
    const { loanTransactions = [], totalLoans = 0 } = loanData;
    // const { items: meetingItems = [], totalItems: totalMeetings = 0 } = meeting;

    const borrowedItems = loanTransactions?.filter((item) => item?.loan_status === "Borrowed");
    const returnedItems = loanTransactions?.filter((item) => item?.loan_status === "Returned");

    return [
      {
        title: "Total Inventories",
        value: totalItems,
        ...calculateStats(items, null, "publishedAt"),
        icon: MdOutlineInventory2,
        href: "/inventories",
        gradient: "from-blue-400 to-blue-600",
      },
      {
        title: "Total Loan Transactions",
        value: totalLoans,
        ...calculateStats(loanTransactions),
        icon: HiOutlineShoppingCart,
        href: "/borrowed-item?page=1&search=&tab=borrowedItems&loanStatus=",
        gradient: "from-purple-400 to-purple-600",
      },
      {
        title: "Total Borrowed Items",
        value: borrowedItems.length,
        ...calculateStats(borrowedItems),
        icon: BsCartCheck,
        href: "/borrowed-item?page=1&search=&tab=borrowedItems&loanStatus=",
        gradient: "from-green-400 to-green-600",
      },
      {
        title: "Total Returned Items",
        value: returnedItems.length,
        ...calculateStats(returnedItems),
        icon: FaArrowRotateLeft,
        href: "/borrowed-item?page=1&search=&tab=borrowedItems&loanStatus=",
        gradient: "from-orange-400 to-orange-600",
      },
    ];
  }, [inventories, loanData, meeting]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
      {/* total inventories card */}
      {summaryData.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <a
            href={item.href}
            key={index}
            className="flex flex-col gap-2.5 rounded-lg p-6 border border-indigo-400 bg-white shadow-sm cursor-pointer hover:shadow-lg transition-all duration-300 hover:bg-indigo-100/10"
          >
            <div className="flex w-full gap-2 items-center">
              <div className={`p-3 bg-gradient-to-r ${item.gradient} rounded-md`}>
                {" "}
                <IconComponent className="h-5 w-5 text-white" />
              </div>
              <div className="text-sm text-gray-800 font-semibold">{item.title}</div>
            </div>
            <h1 className="text-2xl md:text-3xl text-gray-800">{item.value}</h1>
            <div className="flex items-center gap-1">
              {item.change !== 0 && (
                <>
                  {item.isPositive ? (
                    <FaArrowUp className="text-green-500 text-sm" />
                  ) : (
                    <FaArrowDown className="text-red-500 text-sm" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      item.isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.change > 0 ? `+${item.change}` : `-${item.change}`}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">this week</span>
                </>
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default StaffDashboardCardComponent;
