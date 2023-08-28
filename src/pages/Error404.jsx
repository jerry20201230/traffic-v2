import * as React from 'react';
import TopBar from '../TopBar';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import SearchAnything from '../searchAnything';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
function Err404({ noHeader }) {


  return (
    <>
      {noHeader ? <></> : <TopBar title="找不到路徑" />}
      <Box sx={{ p: 3 }}>
        <Typography >
          發生錯誤，我們找不到你想去的地方:<br />
          {window.location.pathname}<br />
          你可以嘗試搜尋，或者<Link to="/">回首頁</Link>
        </Typography>
        <SearchAnything type="" />
      </Box>



    </>
  )
}

export default Err404;
