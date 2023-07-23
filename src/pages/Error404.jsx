import * as React from 'react';
import TopBar from '../TopBar';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';



function Err404() {


  return (
    <>
      <TopBar title="找不到路徑" />
      <Box sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          : (
        </Typography>
        <h1>Error 404</h1>
      </Box>
    </>
  )
}

export default Err404;
