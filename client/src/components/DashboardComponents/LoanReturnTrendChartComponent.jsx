import { useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// components
import ChartHeader from "../../common/ChartHeader";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border border-purple-200 rounded-lg shadow-xl">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <p key={index} className="flex items-center gap-2" style={{ color: entry.color }}>
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></span>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const LoanReturnTrendChartComponent = ({ loanData }) => {
  const [range, setRange] = useState("week");
  const chartRef = useRef(null);

  const filteredChartData = useMemo(() => {
    if (!loanData?.loanTransactions?.length) return [];

    const now = new Date();

    const formatLabel = (date, type) => {
      if (type === "week") return date.toLocaleDateString("en-US", { weekday: "short" });
      if (type === "month")
        return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
      if (type === "year") return date.toLocaleDateString("en-US", { month: "short" });
    };

    let startDate, groupBy;
    if (range === "week") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);
      groupBy = "day";
    } else if (range === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      groupBy = "day";
    } else if (range === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
      groupBy = "month";
    }

    const dataMap = new Map();
    for (let d = new Date(startDate); d <= now; ) {
      const label = formatLabel(d, range);
      dataMap.set(label, { period: label, loans: 0, returns: 0, consumed: 0 });

      if (range === "year") d.setMonth(d.getMonth() + 1);
      else d.setDate(d.getDate() + 1);
    }

    loanData?.loanTransactions?.forEach((tx) => {
      // Borrowed
      if (tx.borrow_confirmed_date_by_user && tx.loan_status === "Borrowed") {
        const borrowDate = new Date(tx.borrow_confirmed_date_by_user);
        if (borrowDate >= startDate && borrowDate <= now) {
          const label = formatLabel(borrowDate, range);
          if (dataMap.has(label)) dataMap.get(label).loans += 1;
        }
      }

      // Returns
      if (tx.loan_status === "Returned" && tx.return_date) {
        const returnDate = new Date(tx.return_date);
        if (returnDate >= startDate && returnDate <= now) {
          const label = formatLabel(returnDate, range);
          if (dataMap.has(label)) dataMap.get(label).returns += 1;
        }
      }

      // Consumed
      if (tx.loan_status === "Consumed" && tx.borrow_confirmed_date_by_user) {
        const consumedDate = new Date(tx.borrow_confirmed_date_by_user);
        if (consumedDate >= startDate && consumedDate <= now) {
          const label = formatLabel(consumedDate, range);
          if (dataMap.has(label)) dataMap.get(label).consumed += 1;
        }
      }
    });

    return Array.from(dataMap.values());
  }, [loanData, range]);

  return (
    <div
      className="w-full bg-white rounded-xl shadow-md p-6 border border-indigo-400"
      ref={chartRef}
    >
      <h2 className="text-sm md:text-lg text-gray-800 font-semibold mb-6">
        Loan, Return, and Consumed Item Trend
      </h2>
      <ChartHeader
        timeRange={range}
        setTimeRange={(e) => setRange(e.target.value)}
        chartRef={chartRef}
      />

      <div className="h-80 bg-gradient-to-br from-green-50/50 to-blue-50/50 rounded-lg p-4 flex items-center justify-center">
        {filteredChartData.length === 0 ? (
          <p className="text-gray-500 text-sm font-medium">No data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="loanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="returnGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="consumedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={1} />
                  <stop offset="100%" stopColor="#fdba74" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#cbd5e1" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#cbd5e1" }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "20px", fontSize: 12 }} iconType="circle" />
              <Line
                type="monotone"
                dataKey="loans"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 2 }}
                name="Borrowed"
              />
              <Line
                type="monotone"
                dataKey="returns"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2 }}
                name="Returns"
              />
              <Line
                type="monotone"
                dataKey="consumed"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ fill: "#f97316", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: "#f97316", strokeWidth: 2 }}
                name="Consumed"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default LoanReturnTrendChartComponent;
