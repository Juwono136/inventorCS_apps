import React from "react";

// icons and material-tailwind
import { motion } from "framer-motion";
import { FiShoppingCart, FiCheckCircle } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { FaCartPlus } from "react-icons/fa";

const UserDashboardComponent = () => {
  const inventoryCards = [
    {
      title: "Total Loan Transactions",
      value: 12,
      icon: FaCartPlus,
      gradient: "bg-blue-500",
      textColor: "text-white",
      delay: 0.1,
    },
    {
      title: "Loan Item Borrowed",
      value: 10,
      icon: FiShoppingCart,
      gradient: "bg-orange-500",
      textColor: "text-white",
      delay: 0.2,
    },
    {
      title: "Loan Item Returned",
      value: 7,
      icon: FiCheckCircle,
      gradient: "bg-green-500",
      textColor: "text-white",
      delay: 0.3,
    },
    {
      title: "Loan Item Cancelled",
      value: 5,
      icon: MdOutlineCancel,
      gradient: "bg-red-500",
      textColor: "text-white",
      delay: 0.4,
    },
  ];

  return (
    <>
      <div className="flex w-full flex-col pt-4">
        {/* Inventory Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {inventoryCards.map((card, index) => {
            const IconComponent = card.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: card.delay }}
                className="bg-gradient-card shadow-sm rounded-lg p-6 shadow-card hover:shadow-hover hover:bg-gray-50 transition-all duration-300 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {card.value.toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={`w-14 h-14 rounded-xl ${card.gradient} flex items-center justify-center`}
                  >
                    <IconComponent className={`w-7 h-7 ${card.textColor}`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default UserDashboardComponent;
