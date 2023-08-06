import * as React from 'react'
import TopBar from '../TopBar';
import getData from '../getData';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Autocomplete, TextField, Button } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { AppBar, Toolbar } from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt';
import LinearProgress from '@mui/material/LinearProgress';

export default function BikeStation() {
  const [pageTitle, setPageTitle] = React.useState("loading")
  const [bikeStationCardTitle, setBikeStationCardTitle] = React.useState()
  const [bikeStationCardSubTitle, setBikeStationCardSubTitle] = React.useState()
  const [bikeStationCardBody, setBikeStationCardBody] = React.useState()
  const [bikeData, setBikeData] = React.useState()
  const [bikeStationData, setBikeStationData] = React.useState()
  const [topbar, setTopbar] = React.useState(<></>)
  const [progress, setProgress] = React.useState(0);
  const [stationID, setStationID] = React.useState()
  const [countdown, setCountdown] = React.useState(60)

  function UrlParam(name) {
    var url = new URL(window.location.href),
      result = url.searchParams.get(name);
    return result
  }

  const greenIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  function getBikeData() {
    getData(
      `https://tdx.transportdata.tw/api/advanced/v2/Bike/Availability/NearBy?%24spatialFilter=nearby%28${UrlParam("lon")}%2C%20${UrlParam("lat")}%2C%201%29&%24format=JSON&top=1`,
      (res2) => { setBikeData(res2) }, { useLocalCatch: false })
  }

  React.useEffect(() => {
    if (!UrlParam("lat") || !UrlParam("lon") || !UrlParam("uid")) {
      setTopbar(<TopBar title={"找不到站點"} />)
      setBikeStationCardTitle("找不到站點")
      setBikeStationCardSubTitle("網址無效")
      setCountdown(-1)
    }
    else {
      getData(
        `https://tdx.transportdata.tw/api/advanced/v2/Bike/Station/NearBy?%24spatialFilter=nearby%28${UrlParam("lon")}%2C%20${UrlParam("lat")}%2C%201%29&%24format=JSON&top=1`,
        (res) => {
          setTopbar(<TopBar title={res[0].StationName.Zh_tw.replace("_", " ")} />)
          setBikeStationData(res)
        }, { useLocalCatch: false })
      getBikeData()
    }
  }, [])

  React.useEffect(() => {
    if (countdown === 0) {
      getBikeData()
      setCountdown(60)
    } else if (countdown > 0) {
      setProgress((60 - countdown) * (100 / 60))
    } else {

    }
  }, [countdown]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // 组件卸载时清除定时器
    return () => {
      clearInterval(intervalId);
    };

  }, []);

  React.useEffect(() => {
    if (bikeData && bikeStationData) {
      var res = bikeStationData
      console.log(res)
      if (res.length === 0) {
        setCountdown(-1)
        setTopbar(<TopBar title={"找不到站點"} />)
        setBikeStationCardTitle("找不到站點")
        setBikeStationCardSubTitle("請檢查輸入")
      } else {
        console.log(res)

        setBikeStationCardTitle(res[0].StationName.Zh_tw.replace("_", " "))
        setBikeStationCardSubTitle()
        setBikeStationCardBody(
          <>
            <MapContainer
              dragging={!L.Browser.mobile}
              scrollWheelZoom={false}
              center={[res[0].StationPosition.PositionLat, res[0].StationPosition.PositionLon]}
              zoom={18}
              style={{ width: "100%", height: "35vh" }}
            >
              <TileLayer
                attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors${L.Browser.mobile ? "<br/>使用兩指移動與縮放地圖" : ""}`}
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[res[0].StationPosition.PositionLat, res[0].StationPosition.PositionLon]}
                icon={greenIcon}
              >
                <Popup>{res[0].StationName.Zh_tw.replace("_", " ")}</Popup>
              </Marker>
            </MapContainer>
            <p></p>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ p: 0.5, textAlign: "center" }}><img src='/ubike/YouBike2.0.svg' style={{ maxHeight: "3em" }} alt='可借車輛' /> <br />車輛</TableCell>
                    <TableCell sx={{ p: 0.5, textAlign: "center" }}><img src='/ubike/2.0-dock.svg' style={{ maxHeight: "3em" }} alt='可還空位' /><br />空位</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ textAlign: "center" }}>{bikeData.StationUID === "" ? <CircularProgress size={"1rem"} /> : <>一般:{bikeData[0].AvailableRentBikesDetail.GeneralBikes}<br />電輔:{bikeData[0].AvailableRentBikesDetail.ElectricBikes}</>}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{bikeData.StationUID === "" ? <CircularProgress size={"1rem"} /> : bikeData[0].AvailableReturnBikes}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </>)
      }
    }
  }, [bikeData, bikeStationData])

  return (
    <>
      {topbar}
      <Box sx={{ m: 0, p: 3 }}>
        <Card sx={{ mt: 0, pt: 0 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #ffef00,#fff647)" }} variant='div' ></Typography> {bikeStationCardTitle}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {bikeStationCardSubTitle}
            </Typography>
            <Typography variant="body2" component="div">
              {bikeStationCardBody}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <AppBar position="fixed" color="secondary" sx={{ top: 'auto', bottom: 0, height: 'auto', display: (countdown < 0 ? "none" : "unset") }} >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <BoltIcon sx={{ verticalAlign: 'middle' }} /> 即時車位資料 / {countdown}秒
            <Box sx={{ width: '100%' }}>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  )
}