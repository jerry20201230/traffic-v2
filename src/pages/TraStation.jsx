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


function TraStation() {
  const [stationCardTitle, setStationCardTitle] = React.useState("")
  const [stationCardSubTitle, setStationCardSubTitle] = React.useState("")
  const [stationCardBody, setStationCardBody] = React.useState("")
  const [stationCardAction, setStationCardAction] = React.useState("")

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

  function stationClass(n) {
    var stationLvL = ""
    if (n === "0" || n === 0) {
      stationLvL = "特等站"
    } else if (n === "1" || n === 1) {
      stationLvL = "一等站"
    } else if (n === "2" || n === 2) {
      stationLvL = "二等站"
    } else if (n === "3" || n === 3) {
      stationLvL = "三等站"
    }
    else if (n === "4" || n === 4) {
      stationLvL = "簡易站"
    }
    else if (n === "5" || n === 5) {
      stationLvL = "招呼站"
    }
    else if (n === "6" || n === 6) {
      stationLvL = "號誌站"
    }
    else if (n === "A") {
      stationLvL = "貨運站"
    }
    else if (n === "B") {
      stationLvL = "基地"
    }
    else if (n === "X") {
      stationLvL = "非車站"
    }
    return stationLvL
  }
  React.useEffect(() => {
    var station = UrlParam("q")
    if (!station) { station = "()" }
    
    if(station.includes("(")){station = station.split("(")[1].split(")")[0]} //車站ID
    console.log(station)
    getTdxData("https://tdx.transportdata.tw/api/basic/v2/Rail/TRA/Station?%24format=JSON", function (res) {
      var TRA_Station_Data = res
      var temparr = []
      var found = false, DataIndex = 0
      for (var i = 0; i < TRA_Station_Data.length; i++) {
        temparr.push(`${TRA_Station_Data[i].StationName.Zh_tw}(${TRA_Station_Data[i].StationID})`)
        if (TRA_Station_Data[i].StationID === station) {
          DataIndex = i
          found = true
          break
        }
      }
      // var finder = temparr.filter(function (ele) { return (ele === station) })
      if (!found) {
        setStationCardTitle("找不到車站")
        setStationCardBody("請確認你的條件")
        setStationCardAction(<><Button size='small' component={Link} to="/tra?sw=station">修改條件</Button></>)
      } else {
        console.log(TRA_Station_Data[DataIndex])
        setStationName(TRA_Station_Data[DataIndex].StationName.Zh_tw)
        setStationCardTitle(TRA_Station_Data[DataIndex].StationName.Zh_tw + "車站")
        setStationCardSubTitle(<>{TRA_Station_Data[DataIndex].StationID} / {stationClass(TRA_Station_Data[DataIndex].StationClass)}</>)
        setStationCardBody(
          <>
            <LocationOnIcon sx={{ verticalAlign: "bottom" }} /> {TRA_Station_Data[DataIndex].StationAddress}<br />
            <p></p>
            <PhoneIcon sx={{ verticalAlign: "bottom" }} /> {TRA_Station_Data[DataIndex].StationPhone}
            <p></p>
            <MapContainer center={[TRA_Station_Data[DataIndex].StationPosition.PositionLat, TRA_Station_Data[DataIndex].StationPosition.PositionLon]} zoom={18} style={{ width: "100%", height: "35vh", borderRadius: "5px" }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[TRA_Station_Data[DataIndex].StationPosition.PositionLat, TRA_Station_Data[DataIndex].StationPosition.PositionLon]} icon={redIcon}>
                <Popup>
                  {station.split("(")[0]}車站
                </Popup>
              </Marker>
            </MapContainer>
          </>)
        setStationCardAction(<>
          <Button size='small' component="a" href={`tel:${TRA_Station_Data[DataIndex].StationPhone}`}>撥打電話</Button>
          <Button size='small' component="a" href={`https://maps.google.com/?q=${TRA_Station_Data[DataIndex].StationPosition.PositionLat},${TRA_Station_Data[DataIndex].StationPosition.PositionLon}`} target='_blank'>Google Maps</Button>
        </>)
      }
    }, {
      useLocalCatch: true,
    })

  }, [])

  return (
    <>
      <TopBar title={`台鐵${stationName}車站`} />
      <Box sx={{ p: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #004da7, #7fa9d9)" }} variant='div' ></Typography>
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

export default TraStation;
