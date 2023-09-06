import * as React from 'react';
import TopBar from '../TopBar';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { Card, CardActions, CardContent } from '@mui/material'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function SettingAbout({ CURRENT_VER }) {


  return (
    <>
      <TopBar title="關於" />
      <Box sx={{ p: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              關於 大眾運輸查詢系統
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">

            </Typography>
            <Typography variant="body2" component="div" sx={{ lineHeight: 1.25 }}>
              <h2>資料來源</h2>
              <h3>所有交通相關資料 / 交通部TDX平台<br />
                <a rel="noreferrer noopener" href="https://tdx.transportdata.tw/" target="_blank"><img alt="TDX平台Logo" height="30" src="https://tdx.transportdata.tw/images/tdxlogo.png" style={{ marginTop: "1rem" }} /></a></h3>
              <h3>天氣資料來源 / 中央氣象局</h3>
              <h3>天氣圖標來源 / Freepik </h3>
              <p>程式版本 : v{CURRENT_VER}</p>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}

export default SettingAbout;
