import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import clsx from "clsx";

// icons and material-tailwind
import { FiUsers, FiUserCheck, FiUserX, FiUserPlus } from "react-icons/fi";

// features
import { getAllUsersInfor } from "../../features/user/userSlice";
import UserTableDashboardComponent from "./UserTableDashboardComponent";
import AdminChartDashboardComponent from "./AdminChartDashboardComponent";

const AdminDashboardComponent = () => {
  const { allUsersInfor } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUsersInfor({ all: true }));
  }, [dispatch]);

  useEffect(() => {
    if (allUsersInfor?.users) {
      setIsLoading(false);
    }
  }, [allUsersInfor]);

  const users = allUsersInfor?.users ?? [];

  const summary = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const totalUsers = users.length;
    const activeUsers = users.filter((user) => user?.personal_info?.status === "active").length;
    const inactiveUsers = totalUsers - activeUsers;

    const newUsersThisMonth = users.filter((user) => {
      const rawDate = user?.joinedAt?.$date || user?.joinedAt;
      if (!rawDate) return false;
      const joinedDate = new Date(rawDate);
      return joinedDate.getMonth() === thisMonth && joinedDate.getFullYear() === thisYear;
    }).length;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      newUsersThisMonth,
    };
  }, [users]);

  const cards = [
    {
      title: "Total Users",
      value: summary.totalUsers,
      icon: FiUsers,
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      description: "All registered users",
    },
    {
      title: "Active Users",
      value: summary.activeUsers,
      icon: FiUserCheck,
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      description: "Currently active users",
    },
    {
      title: "Inactive Users",
      value: summary.inactiveUsers,
      icon: FiUserX,
      color: "yellow",
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      description: "Suspended or inactive users",
    },
    {
      title: "New This Month",
      value: summary.newUsersThisMonth,
      icon: FiUserPlus,
      color: "purple",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      description: "Recently joined users",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  );

  return (
    <div className="flex w-full flex-col pt-4">
      <div className="w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)
            : cards.map((card, index) => (
                <motion.div
                  key={card.title}
                  variants={cardVariants}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0px 6px 15px rgba(0,0,0,0.08)",
                  }}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-400 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 group-hover:text-gray-800 transition-colors">
                        {card.title}
                      </p>
                      <motion.p
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-3xl font-bold text-gray-800"
                      >
                        {card.value.toLocaleString()}
                      </motion.p>
                      <p className="text-xs text-gray-400">{card.description}</p>
                    </div>

                    <motion.div
                      whileHover={{ rotate: 5 }}
                      className={clsx(
                        "p-3 rounded-xl group-hover:scale-110 transition-all duration-300",
                        card.bgColor
                      )}
                    >
                      <card.icon className={clsx("w-6 h-6", card.textColor)} />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* User Management Table */}
          <div className="xl:col-span-2">
            <UserTableDashboardComponent />
          </div>

          {/* Log Activity Feed*/}
          <div className="xl:col-span-1">Log Activity Feed</div>
        </div>

        {/* Activity Chart */}
        <div className="w-full">
          <AdminChartDashboardComponent />
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardComponent;
