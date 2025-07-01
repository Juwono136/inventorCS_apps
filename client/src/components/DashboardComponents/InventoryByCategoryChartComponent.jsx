import React, { useEffect, useRef, useState } from "react";
import { categoryData } from "../../data/categoryData";
import ChartHeader from "../../common/ChartHeader";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border border-purple-200 rounded-lg shadow-xl">
        <p className="font-semibold text-gray-800 mb-2">{data.name}</p>
        <div className="space-y-1">
          <p className="flex items-center gap-2" style={{ color: data.payload.color }}>
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.payload.color }}
            ></span>
            Items: {data.value}
          </p>
          <p className="text-gray-600 text-sm">
            Percentage: {((data.value / payload[0].payload.total) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
          <span className="text-xs text-gray-600">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const InventoryByCategoryChartComponent = () => {
  const [range, setRange] = useState("week");
  const [data, setData] = useState(categoryData.week);
  const chartRef = useRef(null);

  const currentData = categoryData[range];
  const total = currentData.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = currentData.map((item) => ({ ...item, total }));

  useEffect(() => {
    setData(categoryData[range]);
  }, [range]);

  const handleRangeChange = (e) => {
    setRange(e.target.value);
  };

  return (
    <div
      className="w-full bg-white rounded-xl shadow-md p-6 border border-indigo-400"
      ref={chartRef}
    >
      <h2 className="text-sm md:text-lg text-gray-800 font-semibold mb-6">Inventory By Category</h2>
      <ChartHeader timeRange={range} setTimeRange={handleRangeChange} chartRef={chartRef} />

      <div className="h-96 md:h-96 lg:h-80 bg-gradient-to-br from-purple-50/50 to-blue-50/50 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithTotal}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {dataWithTotal.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InventoryByCategoryChartComponent;
