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
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Autoplay, Pagination, Navigation } from 'swiper/modules';



export default function HomePage() {

  const mymap = React.useRef()
  const [weatherCardTitle, setWeatherCardTitle] = React.useState(<></>)
  const [weatherCardBody, setWeatherCardBody] = React.useState(<><Button variant='contained' onClick={() => getLocation()}>啟用定位</Button></>)

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    margin: "5px",
    textAlign: 'left',
    height: "100%",
    color: theme.palette.text.secondary,
  }));

  const gridContainer = {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)"
  };
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    } else {
      setWeatherCardBody(<>
        <Typography color="red">定位資訊無法使用</Typography>
      </>)
    }

    function successFunction(loc) {
      setWeatherCardBody(<></>)
    }

    function errorFunction() {
      setWeatherCardBody(<>
        <Typography color="red">無法使用你的定位</Typography>
      </>)
    }
  }

  React.useEffect(() => {

    getLocation()
  }, [])



  return (
    <>
      <TopBar title="首頁" />
      <SearchAnything sx={{ m: 0 }} />


      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
          <Grid xs={12}>
            <Swiper
              pagination={{
                dynamicBullets: true,
                clickable: true
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              loop={true}
              modules={[Autoplay, Pagination, Navigation]}
              className="mySwiper"
              style={{ padding: "5px" }}
            >
              <SwiperSlide>
                <Card style={{ padding: "10px" }} sx={{ m: 2 }}>
                  <Typography variant="h5" component="div">天氣</Typography>
                  <CardContent>{weatherCardBody}</CardContent>
                </Card>
              </SwiperSlide>
              <SwiperSlide>
                <Card style={{ padding: "10px" }} sx={{ m: 2 }}>
                  <Typography variant="h5" component="div">書籤</Typography>
                  <CardContent>{weatherCardBody}</CardContent>
                </Card>
              </SwiperSlide>
              <SwiperSlide>
                <Card style={{ padding: "10px" }} sx={{ m: 2 }}>
                  <Typography variant="h5" component="div">附近大眾運輸</Typography>
                  <CardContent>{weatherCardBody}</CardContent>
                </Card>
              </SwiperSlide>

            </Swiper>
          </Grid>

          <Grid component={Link} to={"/tra"} xs={6} sx={{ textDecoration: "none" }}><Paper sx={{ height: "5em", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(315deg, #004da7, #7fa9d9, 45px,transparent 0)" }}><Typography variant='h6'>台鐵</Typography></Paper></Grid>
          <Grid component={Link} to={"/hsr"} xs={6} sx={{ textDecoration: "none" }}><Paper sx={{ height: "5em", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(315deg, #ca4f0f, #f89867, 45px,transparent 0)" }}><Typography variant='h6'>高鐵</Typography></Paper></Grid>
          <Grid component={Link} to={"/bus"} xs={6} sx={{ textDecoration: "none" }}><Paper sx={{ height: "5em", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(315deg, #8d8d8d,#ccc, 45px,transparent 0)" }}><Typography variant='h6'>公車</Typography></Paper></Grid>
          <Grid component={Link} to={"/mrt"} xs={6} sx={{ textDecoration: "none" }}><Paper sx={{ height: "5em", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(315deg, #8dc21f,#ccf871, 45px,transparent 0)" }}><Typography variant='h6'>捷運</Typography></Paper></Grid>
          <Grid component={Link} to={"/bike"} xs={6} sx={{ textDecoration: "none" }}><Paper sx={{ height: "5em", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(315deg, #ffef00,#fff647, 45px,transparent 0)" }}><Typography variant='h6'>公共自行車</Typography></Paper></Grid>
          <Grid component={Link} to={"/plan"} xs={6} sx={{ textDecoration: "none" }}><Paper sx={{ height: "5em", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(315deg,  #c800f4,#ff7cf3, 45px,transparent 0)" }}><Typography variant='h6'>路線規劃</Typography></Paper></Grid>

          <Grid xs={12} sx={{ height: "100%", display: "none" }}>
            <Item ><h2 style={{ margin: 0 }}>書籤</h2>
              {
                bookmarkSetting("get") !== null ?
                  bookmarkSetting("get").length < 1 ?
                    "你沒有任何書籤"
                    : bookmarkSetting("get").map((data, index) => {

                      return (
                        index < 5 ?
                          <span key={String(index) + String(data.url)} >
                            <Link to={data.url} >{data.title}</Link><br />
                          </span> :
                          index === 5 ?
                            <>還有{bookmarkSetting("get").length - 5}個書籤</>
                            :
                            <></>
                      )
                    })
                  : "你沒有任何書籤"
              }</Item>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}