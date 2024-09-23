import React from 'react';
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";

const ConfirmRemovalButtonComponent = ({ item, onConfirm, onCancel }) => {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
      style={{ display: item ? 'flex' : 'none' }}
    >
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
        <Card className="shadow-lg rounded-lg">
          <CardBody>
            <Typography variant="h6" className="mb-4">Confirm Removal</Typography>
            <Typography variant="body2" className="mb-4">
              Are you sure you want to remove {item.name} from your cart?
            </Typography>
            <div className="flex justify-between">
              <Button color="red" onClick={onConfirm}>Yes, Remove</Button>
              <Button color="gray" onClick={onCancel}>Cancel</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ConfirmRemovalButtonComponent;