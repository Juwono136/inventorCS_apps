import React from 'react';
import { Card, CardContent, Typography, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const ActiveUserComponent = () => {
  const userCount = Math.floor(Math.random() * 101);

  return (
    <Card sx={{ width: '100%', position: 'relative', overflow: 'visible', marginBottom: '20px' }}>
      <Box 
        sx={{
          position: 'absolute',
          top: -20,
          left: 20,
          backgroundColor: 'black',
          color: 'white',
          borderRadius: '8px',
          width: 50,
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          zIndex: 1
        }}
      >
        <PersonIcon />
      </Box>
      <CardContent sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: '80px' }}>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h6" color="text.secondary" sx={{ fontSize: '12pt' }}>
            Active Users
          </Typography>
          <Typography variant="h4" color="text.primary" sx={{ fontSize: '18pt', fontWeight: 'bold' }}>
            {userCount}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActiveUserComponent;