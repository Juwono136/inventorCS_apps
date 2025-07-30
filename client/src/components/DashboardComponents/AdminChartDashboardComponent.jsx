import { useMemo } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const AdminChartDashboardComponent = () => {
  const { allUsersInfor } = useSelector((state) => state.user);

  // Line chart data: New users per date
  const chartData = useMemo(() => {
    const users = allUsersInfor?.users || [];

    const dateMap = {};

    users.forEach((user) => {
      const raw = user?.joinedAt?.$date || user?.joinedAt;
      if (!raw) return;
      const date = new Date(raw);
      if (isNaN(date)) return;

      const dateKey = date.toISOString().split("T")[0];

      if (!dateMap[dateKey]) {
        dateMap[dateKey] = { date: dateKey, newUsers: 0 };
      }
      dateMap[dateKey].newUsers += 1;
    });

    return Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [allUsersInfor]);

  // Bar chart data: Number of users per program
  const programData = useMemo(() => {
    const users = allUsersInfor?.users || [];

    const programMap = {};

    users.forEach((user) => {
      const program = user?.personal_info?.program?.trim() || "Unknown";
      if (!programMap[program]) {
        programMap[program] = { program, users: 0 };
      }
      programMap[program].users += 1;
    });

    return Object.values(programMap).sort((a, b) => b.users - a.users);
  }, [allUsersInfor]);

  const formatXAxisLabel = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">User Activity Overview</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: New Users */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-4">New Users Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxisLabel}
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="newUsers"
                name="New Users"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#6366f1", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Horizontal Bar Chart: Users per Program */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Users by Program</h3>
          <ResponsiveContainer width="100%" height={Math.max(300, programData.length * 30)}>
            <BarChart
              layout="vertical"
              data={programData}
              margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#9ca3af" fontSize={12} />
              <YAxis dataKey="program" type="category" stroke="#9ca3af" fontSize={12} width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="users" name="Users" fill="#10b981" barSize={18} radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminChartDashboardComponent;
