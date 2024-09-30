import React from 'react';
import { Typography } from "@material-tailwind/react";
import { FaCheckCircle, FaHourglassHalf, FaUserCheck, FaTimesCircle } from 'react-icons/fa';

const TimeLineModal = ({ item, onClose }) => {
  const currentStatus = item.status;
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

  const timeline = [
    { date: '2023-01-01', event: 'Item borrowed', icon: FaCheckCircle, color: 'text-blue-500' },
  ];

  if (currentStatus === 'Pending') {
    timeline.push(
      { date: '2023-01-02', event: 'Pending', icon: FaHourglassHalf, color: 'text-yellow-400' },
      { date: '2023-01-03', event: 'Waiting for approval from admin', icon: FaUserCheck, color: 'text-purple-500' }
    );
  } else if (currentStatus === 'Borrowed') {
    timeline.push(
      { date: '2023-01-02', event: 'Pending', icon: FaHourglassHalf, color: 'text-yellow-400' },
      { date: '2023-01-03', event: 'Waiting for approval from admin', icon: FaUserCheck, color: 'text-purple-500' },
      { date: '2023-01-04', event: 'Approved by admin', icon: FaCheckCircle, color: 'text-green-500' }
    );
  } else if (currentStatus === 'Cancelled') {
    timeline.push(
      { date: '2023-01-02', event: 'Pending', icon: FaHourglassHalf, color: 'text-yellow-400' },
      { date: '2023-01-03', event: 'Waiting for approval from admin', icon: FaUserCheck, color: 'text-purple-500' },
      { date: '2023-01-04', event: 'Approved by admin', icon: FaCheckCircle, color: 'text-green-500' },
      { date: currentDate, event: 'Item cancelled', icon: FaTimesCircle, color: 'text-gray-500' }
    );
  } else if (currentStatus === 'Rejected') {
    timeline.push(
      { date: '2023-01-02', event: 'Pending', icon: FaHourglassHalf, color: 'text-yellow-400' },
      { date: '2023-01-03', event: 'Waiting for approval from admin', icon: FaUserCheck, color: 'text-purple-500' },
      { date: currentDate, event: 'Rejected by admin', icon: FaTimesCircle, color: 'text-red-500' }
    );
  }

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
              <li key={index} className="flex items-center space-x-4">
                <div className={`flex-shrink-0 ${entry.color}`}>
                  <entry.icon className="h-6 w-6" />
                </div>
                <div>
                  <Typography variant="body2" className="font-bold">{entry.date}</Typography>
                  <Typography variant="body2">{entry.event}</Typography>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TimeLineModal;