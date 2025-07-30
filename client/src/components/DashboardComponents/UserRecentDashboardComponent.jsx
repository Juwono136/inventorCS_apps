import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const UserRecentDashboardComponent = () => {
  const { loanData, isLoading } = useSelector((state) => state.loan);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gray-400 text-white";
      case "Ready to Pickup":
        return "bg-blue-400 text-white";
      case "Borrowed":
        return "bg-blue-500 text-white";
      case "Partially Consumed":
        return "bg-purple-400 text-white";
      case "Consumed":
        return "bg-orange-500 text-white";
      case "Returned":
        return "bg-green-500 text-white";
      case "Cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-300 text-white";
    }
  };

  const activities =
    loanData?.loanTransactions?.slice(0, 5).map((trx) => ({
      id: trx._id,
      transactionId: trx.transaction_id,
      borrowDate: trx.borrow_date,
      returnDate: trx.return_date,
      status: trx.loan_status,
    })) || [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow">
        <h3 className="text-base font-semibold text-gray-700">Recent Borrow Activity</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse flex items-center space-x-4 p-4 rounded-lg bg-gray-100"
            >
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white rounded-xl border border-gray-300 p-6 shadow-sm"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-gray-700">Recent Borrow Activity</h3>
        <a
          href="/user-loan"
          className="text-xs border border-gray-800 text-gray-800 p-2 rounded-md hover:bg-blue-gray-500 hover:text-white transition-all"
        >
          View More
        </a>
      </div>

      {activities.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-gray-500 text-sm italic">
          No recent borrow activity found
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Transaction ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Borrow Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Return Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, index) => (
                  <motion.tr
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * index }}
                    className="hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium">{activity.transactionId}</td>
                    <td className="py-3 px-4">{formatDate(activity.borrowDate)}</td>
                    <td className="py-3 px-4">
                      {activity.returnDate ? formatDate(activity.returnDate) : "Not returned"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                          activity.status
                        )}`}
                      >
                        {activity.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile List View */}
          <div className="md:hidden space-y-3">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="border rounded-lg p-4 bg-white"
              >
                <div className="flex justify-between flex-col gap-2 items-start mb-2">
                  <h4 className=" text-[10px] lg:text-xs font-semibold text-gray-800">
                    {activity.transactionId}
                  </h4>
                  <span
                    className={`px-2 py-1 text-[10px] lg:text-xs font-semibold rounded-full ${getStatusClass(
                      activity.status
                    )}`}
                  >
                    {activity.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Borrowed: {formatDate(activity.borrowDate)}</p>
                  <p>
                    Return: {activity.returnDate ? formatDate(activity.returnDate) : "Not returned"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default UserRecentDashboardComponent;
