import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import dayjs from 'dayjs';

Chart.register(...registerables);

const LineChartComponent = () => {
  const [dateRange, setDateRange] = useState('1month');
  const [dateLabels, setDateLabels] = useState([]);
  const [dataQuantity, setDataQuantity] = useState([]);

  const generateDateRange = (range) => {
    let startDate;
    const today = dayjs();

    switch (range) {
      case '7days':
        startDate = today.subtract(7, 'day');
        return generateDailyLabels(startDate, today, 3);
      case '1month':
        startDate = today.subtract(1, 'month');
        return generateDailyLabels(startDate, today, 5);
      case '6months':
        startDate = today.subtract(6, 'month');
        return generateWeeklyLabels(startDate, today, 2);
      case '1year':
        startDate = today.subtract(1, 'year');
        return generateMonthlyLabels(startDate, today, 2);
      default:
        startDate = today.subtract(1, 'month');
        return generateDailyLabels(startDate, today, 5);
    }
  };

  const generateDailyLabels = (startDate, today, step = 1) => {
    const dates = [];
    for (let i = 0; i <= today.diff(startDate, 'day'); i += step) {
      dates.push(startDate.add(i, 'day').format('YYYY-MM-DD'));
    }
    return dates;
  };

  const generateWeeklyLabels = (startDate, today, step = 1) => {
    const weeks = [];
    for (let i = 0; i <= today.diff(startDate, 'week'); i += step) {
      weeks.push(startDate.add(i, 'week').format('YYYY-MM-DD'));
    }
    return weeks;
  };

  const generateMonthlyLabels = (startDate, today, step = 1) => {
    const months = [];
    for (let i = 0; i <= today.diff(startDate, 'month'); i += step) {
      months.push(startDate.add(i, 'month').format('YYYY-MM-DD'));
    }
    return months;
  };

  const generateQuantityData = (length) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 100));
  };

  useEffect(() => {
    const labels = generateDateRange(dateRange);
    setDateLabels(labels);
    setDataQuantity(generateQuantityData(labels.length));
  }, [dateRange]);

  const data = {
    labels: dateLabels,
    datasets: [
      {
        label: '',
        data: dataQuantity,
        fill: true,
        backgroundColor: 'rgba(0, 0, 139, 0.2)',
        borderColor: 'rgba(255, 255, 255, 1)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 6,
        },
      },
      y: {
        title: {
          display: false,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-darkblue-500 shadow-lg rounded-lg p-6 max-w-full">
      <div className="mb-4 flex items-center space-x-2">
        <label htmlFor="dateRange" className="font-medium text-black">Select Date Range:</label>
        <select
          id="dateRange"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-indigo-200"
        >
          <option value="7days">Last 7 Days</option>
          <option value="1month">Last 1 Month</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last 1 Year</option>
        </select>
      </div>

      <div className="w-full h-96 md:h-80 sm:h-64">
        <Line data={data} options={options} />
      </div>
      <div className="mt-4">
        <p className="text-black font-bold" style={{ fontSize: '12pt' }}>Items Borrowed</p>
      </div>
    </div>
  );
};

export default LineChartComponent;