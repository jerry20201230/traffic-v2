import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import dayjs from 'dayjs';
import SearchAnything from '../searchAnything';
import TopBar from '../TopBar';
import Grid from '@mui/material/Unstable_Grid2';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { Button } from '@mui/material';
import { bookmarkSetting } from '../bookmarkSetting';
import { Link } from 'react-router-dom';
import { BookmarkAdded } from '@mui/icons-material';

export default function HomePage() {

  const mymap = React.useRef()
  const [weatherCardTitle, setWeatherCardTitle] = React.useState(<></>)
  const [weatherCardBody, setWeatherCardBody] = React.useState(<><Button variant='contained'>啟用定位</Button></>)

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    height: "100%",
    color: theme.palette.text.secondary,
  }));

  const gridContainer = {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)"
  };




  return (
    <>
      <TopBar title="首頁" />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
          <Grid xs={6} sx={{ height: "100%" }}>
            <Item><h2 style={{ margin: 0 }}>天氣</h2>
              {weatherCardBody}
            </Item>
          </Grid>
          <Grid xs={6} sx={{ height: "100%" }}>
            <Item ><h2 style={{ margin: 0 }}>書籤</h2>
              {
                bookmarkSetting("get") !== null ?
                  bookmarkSetting("get").length < 1 ?
                    "你沒有任何書籤"
                    : bookmarkSetting("get").map((data, index) => {

                      return (
                        index < 5 ?
                          <>
                            <Link to={data.url} key={String(index) + String(data.url)}>{data.title}</Link><br />
                          </> :
                          index === 5 ?
                            <>前往書籤頁面查看另外{bookmarkSetting("get").length - 5}個書籤</>
                            :
                            <></>
                      )
                    })
                  : "你沒有任何書籤"
              }</Item>
          </Grid>
          <Grid xs={12} sx={{ height: "25rem" }}>
            <Item sx={{ height: "100%" }}>
              <div style={{ display: "flex", flexFlow: "column", height: "100%" }}>
                <h2 style={{ margin: 0 }}>附近大眾運輸</h2>
                <div className="map" id="map" style={{ width: "100%", height: `100%`, flexGrow: 1 }}>
                  <MapContainer
                    ref={mymap}
                    dragging={!L.Browser.mobile}
                    scrollWheelZoom={false}
                    center={[23.75518176611264, 120.9406086935125]}
                    zoom={7}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <TileLayer
                      attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors${L.Browser.mobile ? "<br/>使用兩指移動與縮放地圖" : ""
                        }`}
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                  </MapContainer>
                </div>
              </div>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}