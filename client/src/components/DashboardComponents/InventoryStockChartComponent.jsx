import { useEffect, useRef, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { inventoryDataSet } from "../../data/inventoryData";

// components
import ChartHeader from "../../common/ChartHeader";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const stock = payload.find((p) => p.dataKey === "stock")?.value;
    const min = payload.find((p) => p.dataKey === "min")?.value;
    const status = stock >= min ? "good" : "low";

    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border border-purple-200 rounded-lg shadow-xl">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-purple-600 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
            Stock: {stock}
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-400"></span>
            Min Required: {min}
          </p>
          <p
            className={`font-medium flex items-center gap-2 ${
              status === "low" ? "text-red-600" : "text-green-600"
            }`}
          >
            <span
              className={`w-3 h-3 rounded-full ${status === "low" ? "bg-red-600" : "bg-green-600"}`}
            ></span>
            Status: {status.charAt(0).toUpperCase() + status.slice(1)}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const InventoryStockChartComponent = () => {
  const [range, setRange] = useState("week");
  const [data, setData] = useState(inventoryDataSet.week);

  const chartRef = useRef(null);

  useEffect(() => {
    setData(inventoryDataSet[range]);
  }, [range]);

  const handleRangeChange = (e) => {
    setRange(e.target.value);
  };

  return (
    <div
      className="w-full bg-white rounded-xl shadow-md p-6 border border-indigo-400"
      ref={chartRef}
    >
      <h2 className="text-sm md:text-lg text-gray-800 font-semibold mb-6">
        Inventory Stock Levels
      </h2>
      <ChartHeader timeRange={range} setTimeRange={handleRangeChange} chartRef={chartRef} />
      <div className="h-72 bg-gradient-to-br from-purple-50/50 to-indigo-50/30 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.8} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#64748b" }}
              angle={-30}
              textAnchor="end"
              height={60}
              axisLine={{ stroke: "#cbd5e1" }}
            />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#cbd5e1" }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="min" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Min Required" />
            <Bar
              dataKey="stock"
              fill="url(#stockGradient)"
              radius={[4, 4, 0, 0]}
              name="Current Stock"
            ></Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InventoryStockChartComponent;
