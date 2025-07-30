import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Chip } from "@material-tailwind/react";

const UserTableDashboardComponent = () => {
  const { allUsersInfor } = useSelector((state) => state.user);

  const latestUsers = Array.isArray(allUsersInfor)
    ? allUsersInfor?.slice(0, 5)
    : Array.isArray(allUsersInfor?.users)
    ? allUsersInfor?.users.slice(0, 5)
    : [];

  const getRoleColor = (role) => {
    if (role === 0) return "blue"; // User
    if (role === 1) return "green"; // Admin
    if (role === 2) return "orange"; // Staff
    return null;
  };

  const getRoleLabel = (role) => {
    if (role === 0) return "User";
    if (role === 1) return "Admin";
    if (role === 2) return "Staff";
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-400 mb-8"
    >
      <h2 className="text-base text-gray-700 mb-4">Recent Registered Users</h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs uppercase bg-gray-200 text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Program</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {latestUsers.map((user, index) => (
              <tr key={user._id || index} className="border-b hover:bg-gray-100 transition">
                <td className="flex items-center gap-2 px-4 py-3 font-medium text-gray-800">
                  <img
                    src={user?.personal_info.avatar ? user.personal_info.avatar : "U"}
                    alt="user-image"
                    className="w-8 h-8 rounded-full border border-indigo-500"
                  />
                  {user?.personal_info?.name || "-"}
                </td>
                <td className="px-4 py-3">{user?.personal_info?.email || "-"}</td>
                <td className="px-4 py-3">{user?.personal_info?.program || "-"}</td>
                <td className="flex gap-1.5 px-4 py-3">
                  {user?.personal_info.role?.map((r) => {
                    const roleLabel = getRoleLabel(r);
                    const roleColor = getRoleColor(r);
                    return (
                      roleLabel && (
                        <Chip
                          key={r}
                          variant="ghost"
                          size="sm"
                          value={roleLabel}
                          color={roleColor}
                          className="rounded-full capitalize"
                        />
                      )
                    );
                  }) || "-"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user?.personal_info?.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {user?.personal_info?.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {latestUsers.map((user, index) => (
          <div key={user._id || index} className="bg-gray-50 rounded-md p-4 border border-gray-200">
            <div className="mb-2">
              <p className="text-sm font-semibold text-gray-800">
                {user?.personal_info?.name || "-"}
              </p>
              <p className="text-xs text-gray-500">{user?.personal_info?.email || "-"}</p>
            </div>
            <div className="text-xs text-gray-600 space-y-3 ">
              <p>
                <strong>Program:</strong> {user?.personal_info?.program || "-"}
              </p>
              <div className="flex items-center gap-1.5">
                <strong>Role:</strong>{" "}
                {user?.personal_info.role?.map((r) => {
                  const roleLabel = getRoleLabel(r);
                  const roleColor = getRoleColor(r);
                  return (
                    roleLabel && (
                      <Chip
                        key={r}
                        variant="ghost"
                        size="sm"
                        value={roleLabel}
                        color={roleColor}
                        className="rounded-full capitalize"
                      />
                    )
                  );
                }) || "-"}
              </div>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`inline-block px-2 py-0.5 rounded-full font-medium ${
                    user?.personal_info?.status === "active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  {user?.personal_info?.status === "active" ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default UserTableDashboardComponent;
