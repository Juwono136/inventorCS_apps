import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// icons and material-tailwind
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";

const UserLoanChartComponent = () => {
  const { loanData } = useSelector((state) => state.loan);

  // Count status summary from loanData
  const statusCounts = loanData?.loanTransactions?.reduce(
    (acc, trx) => {
      const status = trx.loan_status;
      if (status === "Borrowed") acc.borrowed += 1;
      else if (status === "Returned") acc.returned += 1;
      else if (status === "Cancelled") acc.cancelled += 1;
      return acc;
    },
    { borrowed: 0, returned: 0, cancelled: 0 }
  );

  const data = [
    { name: "Borrowed", value: statusCounts?.borrowed || 0, color: "#F59E0B" },
    { name: "Returned", value: statusCounts?.returned || 0, color: "#10b951" },
    { name: "Cancelled", value: statusCounts?.cancelled || 0, color: "#EF4444" },
  ];

  const hasData = data.some((item) => item.value > 0);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-lg p-6 shadow-sm hover:shadow-hover transition-all duration-300 border border-gray-300"
    >
      <h3 className="text-base font-semibold text-gray-700">Your Loan Transaction Status</h3>
      {hasData ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[250px] text-gray-500 text-sm italic">
          No transaction data available
        </div>
      )}
    </motion.div>
  );
};

export default UserLoanChartComponent;
