import * as  React from 'react'
import TopBar from '../TopBar';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LocateControl from '../location';
import Paper from '@mui/material/Paper';
import { Box, Autocomplete, TextField, Button, IconButton, Alert } from '@mui/material';
import PropTypes from 'prop-types';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { FunctionsOutlined, RoomPreferencesTwoTone } from '@mui/icons-material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { CircularProgress } from '@mui/material';
import BasicTabs from '../tabs';
import getData from '../getData';
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NearMeIcon from '@mui/icons-material/NearMe';

function Map() {
  const [locType, setLocType] = React.useState("你的位置資訊")
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [locationMark, setLocationMark] = React.useState()
  const [locationNear, setLocationNear] = React.useState(<><NearMeIcon sx={{ verticalAlign: "bottom" }} /> 資料讀取中 <CircularProgress size="1rem" sx={{ verticalAlign: "baseline" }} /></>)
  const [locationSummery, setLocationSummery] = React.useState(<><NotListedLocationIcon sx={{ verticalAlign: "bottom" }} /> 資料讀取中 <CircularProgress size="1rem" sx={{ verticalAlign: "baseline" }} /></>)
  const [locationXY, setLocationXY] = React.useState([])
  const mymap = React.useRef()
  var mapLoaded = false
  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  function UrlParam(name) {
    var url = new URL(window.location.href),
      result = url.searchParams.get(name);
    return result;
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    } else {
      setDialogOpen(true);
    }

    function successFunction(loc) {
      //loc.coords.longitude
      console.log(loc);

      setLocationMark(
        <>
          <Marker
            eventHandlers={{
              click: (e) => {
                console.log('marker clicked', e)
              },
            }}
            position={[loc.coords.latitude, loc.coords.longitude]}
            icon={redIcon}
          >
            <Popup>你的位置</Popup>
          </Marker>
        </>
      );
      mymap.current.setView(
        [loc.coords.latitude, loc.coords.longitude],
        16
      )
      setLocationXY([loc.coords.latitude, loc.coords.longitude])
      getData(`https://tdx.transportdata.tw/api/advanced/V3/Map/GeoLocating/Address/LocationX/${loc.coords.longitude}/LocationY/${loc.coords.latitude}?%24format=JSON`, (res) => setLocationSummery(<><LocationOnIcon sx={{ verticalAlign: "bottom" }} /> {res[0].Address}</>), { useLocalCatch: true })
      getData(`https://tdx.transportdata.tw/api/advanced/V3/Map/GeoLocating/Markname/LocationX/${loc.coords.longitude}/LocationY/${loc.coords.latitude}?%24format=JSON`, (res) => setLocationNear(<><NearMeIcon sx={{ verticalAlign: "bottom" }} /> {res[0].Distance > 0 ? `${res[0].Markname} 附近 (${Math.round(res[0].Distance)}公尺)` : `${res[0].Markname}`} </>), { useLocalCatch: true })
    }
    function errorFunction() {
      //if(localStorage.getItem("dialog.getLocationError.show") === "true" || !localStorage.getItem("dialog.getLocationError.show")){
      setDialogOpen(true); //無論如何
      setLocationSummery(<><LocationOffIcon sx={{ verticalAlign: "bottom" }} /> 無法取得定位資訊</>)
      //}
    }
  }

  React.useEffect(() => {


    if (!UrlParam("lat") || !UrlParam("lon") || !UrlParam("popup")) {
      getLocation(mymap)

    }
    else {
      var lat = Number(UrlParam("lat")), lon = Number(UrlParam("lon"))
      setLocationXY([lat, lon])
      setLocType(<>此地點的位置資訊<Alert severity="warning">定位僅供參考</Alert></>)
      console.log(mymap)

      if (mymap.current !== null || mapLoaded) {

        mymap.current.setView(
          [lat, lon], 16
        )
        let mark = L.marker([lat, lon], {
          icon: redIcon
        }).addTo(mymap.current)
        mark.bindPopup(UrlParam("popup"))
        getData(`https://tdx.transportdata.tw/api/advanced/V3/Map/GeoLocating/Address/LocationX/${lon}/LocationY/${lat}?%24format=JSON`, (res) => setLocationSummery(<><LocationOnIcon sx={{ verticalAlign: "bottom" }} /> {res[0].Address}</>), { useLocalCatch: true })
        getData(`https://tdx.transportdata.tw/api/advanced/V3/Map/GeoLocating/Markname/LocationX/${lon}/LocationY/${lat}?%24format=JSON`, (res) => setLocationNear(<><NearMeIcon sx={{ verticalAlign: "bottom" }} /> {res[0].Distance > 0 ? `${res[0].Markname} 附近 (${Math.round(res[0].Distance)}公尺)` : `${res[0].Markname}`} </>), { useLocalCatch: true })
      } else {

      }

    }


  }, [mymap.current])




  const drawerBleeding = 56;

  const Root = styled('div')(({ theme }) => ({

    backgroundColor:
      theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
  }));

  const StyledBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
  }));

  const Puller = styled(Box)(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
  }));

  function SwipeableEdgeDrawer(props) {
    const { window } = props;
    const [open, setOpen] = React.useState(localStorage.getItem("map.drawer.show") === "1" ? true : false);

    const toggleDrawer = (newOpen) => () => {
      setOpen(newOpen);
      localStorage.setItem("map.drawer.show", newOpen === true ? "1" : "0")
    };

    function closeDrawer() {
      setOpen(false)
      localStorage.setItem("map.drawer.show", "0")
    }

    return (

      <Root>
        <CssBaseline />
        <Global
          styles={{
            '.drawera > .MuiPaper-root': {
              height: `calc(60% - ${drawerBleeding}px)`,
              overflow: 'visible',
            },
          }}
        />
        <SwipeableDrawer
          className='drawera'
          sx={{ display: (L.Browser.mobile ? "unset " : "none"), touchAction: "none" }}

          anchor="bottom"
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <StyledBox
            sx={{
              position: 'absolute',
              top: -drawerBleeding,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              visibility: 'visible',
              right: 0,
              left: 0,
            }}
          >
            <Puller />
            <Typography sx={{ p: 2, color: 'text.secondary' }}>位置資訊</Typography>
          </StyledBox>
          <StyledBox
            sx={{
              px: 2,
              pb: 2,
              overflow: 'auto',
            }}
          >
            <h4>{locType}</h4>
            {locationSummery}<br />
            {locationNear}
            <h4>附近大眾運輸(500公尺以內)</h4>
            <BasicTabs lat={locationXY[0]} lon={locationXY[1]} data={{ "map": mymap, markedCallback: closeDrawer }} />
          </StyledBox>
        </SwipeableDrawer>
      </Root>
    );
  }















  return (
    <>
      <div style={{ display: "flex", flexFlow: "column", height: "100%" }}>
        <TopBar title="地圖" />
        <div className="map" id="map" style={{ width: "100%", height: `100%`, flexGrow: 1 }}>
          <MapContainer ref={mymap}
            center={[23.75518176611264, 120.9406086935125]} zoom={7} style={{ width: "100%", height: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locationMark}
          </MapContainer>
        </div>
      </div>


      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"無法使用你的定位資訊"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" component="div">
            我們無法使用你的定位資訊，這可能是因為
            {navigator.geolocation ? (
              <>
                你之前拒絕了我們的定位請求
                <br />
                如果要啟用定位，請到
                <Paper sx={{ p: 0.5 }}>
                  瀏覽器設定&gt;網站設定&gt;{window.location.origin}
                </Paper>
                開啟定位服務，接著刷新此頁面
              </>
            ) : (
              <>
                你的裝置不支援我們的技術
                <br />
                請嘗試更新瀏覽器，或在其他裝置上再試一次
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            確定
          </Button>
        </DialogActions>
      </Dialog>

      <SwipeableEdgeDrawer />
    </>
  )
}

export default Map;

