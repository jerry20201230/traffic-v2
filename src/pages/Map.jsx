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
import { Box, Autocomplete, TextField, Button, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { RoomPreferencesTwoTone } from '@mui/icons-material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function Map() {

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [locationMark, setLocationMark] = React.useState()
  const mymap = React.useRef()
  var redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });



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
    }
    function errorFunction() {
      //if(localStorage.getItem("dialog.getLocationError.show") === "true" || !localStorage.getItem("dialog.getLocationError.show")){
      setDialogOpen(true); //無論如何
      //}
    }
  }

  React.useEffect(() => {
    getLocation()
  }, [])























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
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen) => () => {
      setOpen(newOpen);
    };

    return (

      <Root>
        <CssBaseline />
        <Global
          styles={{
            '.drawera > .MuiPaper-root': {
              height: `calc(50% - ${drawerBleeding}px)`,
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
            <h4>你的位置資訊</h4>
            <Tabs

              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              aria-label="scrollable force tabs example"
            >
              <Tab label="台鐵" />
              <Tab label="高鐵" />
              <Tab label="捷運" />
              <Tab label="公車" />
              <Tab label="公共自行車" />
            </Tabs>
          </StyledBox>
        </SwipeableDrawer>
      </Root>
    );
  }
  SwipeableEdgeDrawer.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
  };















  return (
    <>
      <div style={{ display: "flex", flexFlow: "column", height: "100%" }}>
        <TopBar title="地圖" />
        <div className="map" id="map" style={{ width: "100%", height: `100%`, flexGrow: 1 }}>
          <MapContainer ref={mymap} center={[23.75518176611264, 120.9406086935125]} zoom={7} style={{ width: "100%", height: "100%" }}>
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

