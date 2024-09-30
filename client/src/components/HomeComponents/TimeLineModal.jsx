
import React from 'react';
import { Typography } from "@material-tailwind/react";
import { FaCheckCircle, FaShippingFast, FaBoxOpen, FaHourglassHalf, FaUserCheck } from 'react-icons/fa';

const TimeLineModal = ({ onClose }) => {
  const timeline = [
    { date: '2023-01-01', event: 'Item borrowed', icon: FaCheckCircle, color: 'text-blue-500' },
    { date: '2023-01-02', event: 'Pending', icon: FaHourglassHalf, color: 'text-yellow-400' },
    { date: '2023-01-03', event: 'Approval by Admin', icon: FaUserCheck, color: 'text-purple-500' },
    { date: '2023-01-05', event: 'Item processed', icon: FaBoxOpen, color: 'text-yellow-500' },
    { date: '2023-01-10', event: 'Item shipped', icon: FaShippingFast, color: 'text-green-500' },
    { date: '2023-01-15', event: 'Item delivered', icon: FaCheckCircle, color: 'text-green-600' },
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-11/12 sm:w-3/4 lg:w-1/2 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        <Typography variant="h5" className="font-bold mb-4">Item Timeline</Typography>
        
        <div className="relative mb-4">
          <div className="border-l-2 border-gray-300 absolute h-full left-4"></div>
          <ul className="space-y-4">
            {timeline.map((entry, index) => (
              <li key={index} className="relative pl-10">
                <span className={`absolute left-0 top-1/2 transform -translate-y-1/2 ${entry.color}`}>
                  <entry.icon size={20} />
                </span>
                <Typography variant="body2" className="text-sm">
                  <strong>{entry.date}:</strong> {entry.event}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TimeLineModal;
