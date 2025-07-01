import { useMemo, useRef, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// components
import ChartHeader from "../../common/ChartHeader";

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#6366f1",
  "#14b8a6",
  "#ec4899",
  "#eab308",
  "#22c55e",
];

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
            Percentage: {((data.value / data.payload.total) * 100).toFixed(1)}%
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

const InventoryByCategoryChartComponent = ({ inventories }) => {
  const [range, setRange] = useState("year");
  const chartRef = useRef(null);

  const filteredData = useMemo(() => {
    if (!inventories?.items?.length) return [];

    const now = new Date();
    let startDate;

    if (range === "week") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);
    } else if (range === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (range === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const recentItems = inventories.items.filter((item) => {
      const created = new Date(item.publishedAt);
      return created >= startDate && created <= now;
    });

    const grouped = recentItems.reduce((acc, curr) => {
      const category = curr.categories?.[0] || "Uncategorized"; // ambil elemen pertama dari array
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const total = recentItems.length;

    return Object.entries(grouped).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length],
      total,
    }));
  }, [inventories, range]);

  return (
    <div
      className="w-full bg-white rounded-xl shadow-md p-6 border border-indigo-400"
      ref={chartRef}
    >
      <h2 className="text-sm md:text-lg text-gray-800 font-semibold mb-6">Inventory By Category</h2>
      <ChartHeader
        timeRange={range}
        setTimeRange={(e) => setRange(e.target.value)}
        chartRef={chartRef}
      />

      <div className="h-96 md:h-96 lg:h-80 bg-gradient-to-br from-purple-50/50 to-blue-50/50 rounded-lg p-4 flex items-center justify-center">
        {filteredData.length === 0 ? (
          <p className="text-gray-500 text-sm font-medium">Data is not available for this time.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default InventoryByCategoryChartComponent;
