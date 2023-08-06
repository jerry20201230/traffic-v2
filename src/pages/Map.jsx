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
    </>
  )
}

export default Map;

