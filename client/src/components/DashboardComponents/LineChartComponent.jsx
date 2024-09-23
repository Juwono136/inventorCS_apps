import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import dayjs from 'dayjs';

Chart.register(...registerables);

const ChartComponent = () => {
  const [dateRange, setDateRange] = useState('1month');
  const [dateLabels, setDateLabels] = useState([]);
  const [dataQuantity, setDataQuantity] = useState([]);

  const generateDateRange = (range) => {
    let startDate;
    const today = dayjs();

    switch (range) {
      case '7days':
        startDate = today.subtract(7, 'day');
        return generateDailyLabels(startDate, today);
      case '1month':
        startDate = today.subtract(1, 'month');
        return generateDailyLabels(startDate, today);
      case '6months':
        startDate = today.subtract(6, 'month');
        return generateWeeklyLabels(startDate, today);
      case '1year':
        startDate = today.subtract(1, 'year');
        return generateWeeklyLabels(startDate, today);
      default:
        startDate = today.subtract(1, 'month');
        return generateDailyLabels(startDate, today);
    }
  };

  const generateDailyLabels = (startDate, today) => {
    const dates = [];
    for (let i = 0; i <= today.diff(startDate, 'day'); i++) {
      dates.push(startDate.add(i, 'day').format('YYYY-MM-DD'));
    }
    return dates;
  };

  const generateWeeklyLabels = (startDate, today) => {
    const weeks = [];
    for (let i = 0; i <= today.diff(startDate, 'week'); i++) {
      weeks.push(startDate.add(i, 'week').format('YYYY-MM-DD'));
    }
    return weeks;
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
        label: 'Quantity',
        data: dataQuantity,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Borrowed Item',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Quantity',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Quantity Chart</h2>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="dateRange">Select Date Range: </label>
        <select
          id="dateRange"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="7days">Last 7 Days</option>
          <option value="1month">Last 1 Month</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last 1 Year</option>
        </select>
      </div>

      <Line data={data} options={options} />
    </div>
  );
};

export default ChartComponent;
