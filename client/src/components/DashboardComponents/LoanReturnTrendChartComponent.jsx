import React, { useEffect, useRef, useState } from "react";
import { trendData } from "../../data/trendData";
import ChartHeader from "../../common/ChartHeader";
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

const LoanReturnTrendChartComponent = () => {
  const [range, setRange] = useState("week");
  const [data, setData] = useState(trendData.week);
  const chartRef = useRef(null);

  useEffect(() => {
    setData(trendData[range]);
  }, [range]);

  const handleRangeChange = (e) => {
    setRange(e.target.value);
  };

  return (
    <div
      className="w-full bg-white rounded-xl shadow-md p-6 border border-indigo-400"
      ref={chartRef}
    >
      <h2 className="text-sm md:text-lg text-gray-800 font-semibold mb-6">Loan VS Return Trend</h2>
      <ChartHeader timeRange={range} setTimeRange={handleRangeChange} chartRef={chartRef} />

      <div className="h-80 bg-gradient-to-br from-green-50/50 to-blue-50/50 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="loanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="returnGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={{ stroke: "#cbd5e1" }}
            />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#cbd5e1" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "20px", fontSize: 12 }} iconType="circle" />
            <Line
              type="monotone"
              dataKey="loans"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 2 }}
              name="Loans"
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
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LoanReturnTrendChartComponent;
