import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import ActiveUserComponent from "../../components/DashboardComponents/ActiveUserComponent";
import RecentlyBorrowedItemsComponent from "../../components/DashboardComponents/RecentlyBorrowedItemsComponent";
import LineChartComponent from "../../components/DashboardComponents/LineChartComponent";

const Dashboard = () => {
  const [filteredData, setFilteredData] = useState([]);
  const borrowedData = [
    { id: 1, name: 'Book 1', category: 'Books', borrowedDate: '2023-10-01', value: 5 },
    { id: 2, name: 'Laptop', category: 'Electronics', borrowedDate: '2023-10-02', value: 20 },
    { id: 3, name: 'Chair', category: 'Furniture', borrowedDate: '2023-10-03', value: 50 },
  ];

  useEffect(() => {
    setFilteredData(borrowedData);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="bg-blue-500 p-6 rounded-lg shadow-lg mb-6">
          <Typography variant="h4" className="text-white font-bold">
            Welcome to Your Dashboard!
          </Typography>
          <Typography variant="body1" className="text-white mt-2">
            Here you can manage your borrowed items, track your activity, and gain insights into your usage. Explore and make the most of our services!
          </Typography>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="mt-8 mb-4">
            <ActiveUserComponent />
          </div>
          <Card>
            <CardBody>
              <LineChartComponent data={filteredData} />
            </CardBody>
          </Card>
        </div>
        <div className="mt-4">
          <RecentlyBorrowedItemsComponent items={filteredData} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;