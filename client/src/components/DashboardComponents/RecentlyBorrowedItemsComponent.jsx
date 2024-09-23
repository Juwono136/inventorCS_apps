import React, { useEffect, useState } from 'react';
import { Card, CardBody, Typography, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import clockIcon from '../../assets/images/clockicon.png';

const RecentlyBorrowedItemsComponent = () => {
  const [recentlyBorrowedItems, setRecentlyBorrowedItems] = useState([]);

  useEffect(() => {
    const fetchRecentlyBorrowedItems = () => {
      const items = [
        { id: 1, name: 'Item 1', borrowedDate: '2023-10-01' },
        { id: 2, name: 'Item 2', borrowedDate: '2023-10-02' },
        { id: 3, name: 'Item 3', borrowedDate: '2023-10-03' },
      ];
      setRecentlyBorrowedItems(items);
    };

    fetchRecentlyBorrowedItems();
  }, []);

  return (
    <Card className="shadow-lg rounded-lg">
      <CardBody>
        <Typography variant="h6" className="mb-4">Recently Borrowed Items</Typography>
        <List>
          {recentlyBorrowedItems.map(item => (
            <ListItem key={item.id} className="flex items-center space-x-4">
              <ListItemPrefix>
                <img src={clockIcon} alt="Clock Icon" className="h-6 w-6" />
              </ListItemPrefix>
              <div>
                <Typography variant="body1" className="font-medium">{item.name}</Typography>
                <Typography variant="body2" color="gray">{item.borrowedDate}</Typography>
              </div>
            </ListItem>
          ))}
        </List>
      </CardBody>
    </Card>
  );
};

export default RecentlyBorrowedItemsComponent;