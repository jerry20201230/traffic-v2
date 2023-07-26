import * as React from 'react';
import TopBar from '../TopBar';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Card, CardActions, CardContent } from '@mui/material'
import Button from '@mui/material/Button';
import getTdxData from '../getTdxData';
import { Link } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'


function HsrStation() {
  const [stationCardTitle, setStationCardTitle] = React.useState("")
  const [stationCardSubTitle, setStationCardSubTitle] = React.useState("")
  const [stationCardBody, setStationCardBody] = React.useState("")
  const [stationCardAction, setStationCardAction] = React.useState("")

  const [title,setTitle] = React.useState(<></>)

  const [stationName, setStationName] = React.useState("")
  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });


  function UrlParam(name) {
    var url = new URL(window.location.href),
      result = url.searchParams.get(name);
    return result
  }


  React.useEffect(() => {
    var station = UrlParam("q")
    if (!station) { station = "()" }

    if (station.includes("(")) { station = station.split("(")[1].split(")")[0] } //車站ID
    console.log(station)
    getTdxData("https://tdx.transportdata.tw/api/basic/v2/Rail/THSR/Station?%24format=JSON", function (res) {
      var HSR_Station_Data = res
      var temparr = []
      var found = false, DataIndex = 0
      for (var i = 0; i < HSR_Station_Data.length; i++) {
        temparr.push(`${HSR_Station_Data[i].StationName.Zh_tw}(${HSR_Station_Data[i].StationID})`)
        if (HSR_Station_Data[i].StationID === station) {
          DataIndex = i
          found = true
          break
        }
      }
      // var finder = temparr.filter(function (ele) { return (ele === station) })
      if (!found) {
        setStationCardTitle("找不到車站")
        setStationCardBody("請確認你的條件")
        setStationCardAction(<><Button size='small' component={Link} to="/hsr?sw=station">修改條件</Button></>)
      } else {
        console.log(HSR_Station_Data[DataIndex])
        setTitle(<TopBar title={`高鐵${HSR_Station_Data[DataIndex].StationName.Zh_tw}站`} />)
        setStationName(HSR_Station_Data[DataIndex].StationName.Zh_tw)
        setStationCardTitle("高鐵" + HSR_Station_Data[DataIndex].StationName.Zh_tw + "站")
        setStationCardSubTitle(<>代碼 / {HSR_Station_Data[DataIndex].StationID}</>)
        setStationCardBody(
          <>
            <LocationOnIcon sx={{ verticalAlign: "bottom" }} /> {HSR_Station_Data[DataIndex].StationAddress}<br />
            <p></p>
            <MapContainer dragging={!L.Browser.mobile} center={[HSR_Station_Data[DataIndex].StationPosition.PositionLat, HSR_Station_Data[DataIndex].StationPosition.PositionLon]} zoom={18} style={{ width: "100%", height: "35vh", borderRadius: "5px" }}>
            <TileLayer
                attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors${L.Browser.mobile?"<br/>使用兩指移動與縮放地圖":""}`}
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[HSR_Station_Data[DataIndex].StationPosition.PositionLat, HSR_Station_Data[DataIndex].StationPosition.PositionLon]} icon={redIcon}>
                <Popup>
                  高鐵{HSR_Station_Data[DataIndex].StationName.Zh_tw}站
                </Popup>
              </Marker>
            </MapContainer>
          </>)
        setStationCardAction(
          <>
            <Button size='small' component="a" href={`https://maps.google.com/?q=${HSR_Station_Data[DataIndex].StationPosition.PositionLat},${HSR_Station_Data[DataIndex].StationPosition.PositionLon}`} target='_blank'>Google Maps</Button>
          </>)
      }
    }, {
      useLocalCatch: true,
    })

  }, [])

  return (
    <>
      {title}
      <Box sx={{ p: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #ca4f0f, #f89867)" }} variant='div' ></Typography>
              {stationCardTitle}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {stationCardSubTitle}
            </Typography>
            <Typography variant="body2" component="div" sx={{ lineHeight: 1.25 }}>
              {stationCardBody}
            </Typography>
          </CardContent>
          <CardActions>
            {stationCardAction}
          </CardActions>
        </Card>
        <p></p>
        <Card>
          <CardContent>
            <Typography variant='h5' component='div'>
              即時資料
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}

export default HsrStation;
