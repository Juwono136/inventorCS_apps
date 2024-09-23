import React, { useEffect, useState } from 'react';
import { Card, CardBody, Typography } from "@material-tailwind/react";
import userIcon from '../../assets/images/usericon.png';

const ActiveUserComponent = () => {
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    const fetchActiveUsers = () => {
      const activeUsersCount = Math.floor(Math.random() * 100);
      setActiveUsers(activeUsersCount);
    };

    fetchActiveUsers();

    const intervalId = setInterval(fetchActiveUsers, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card>
      <CardBody>
        <div className="flex items-center">
          <img src={userIcon} alt="User Icon" className="h-6 w-6 mr-2" />
          <Typography variant="h6">Active Users</Typography>
        </div>
        <Typography variant="h4">{activeUsers}</Typography>
      </CardBody>
    </Card>
  );
};

export default ActiveUserComponent;