import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import getData from './getData';
import { useLocation } from 'react-router';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Button } from '@mui/material';
import L from 'leaflet'
import { Link } from 'react-router-dom';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



export default function BasicTabs({ lat, lon, spec, specQuery, hide, data, children }) {
  function convertOperator(text) {
    var operatorCode = ["KRTC", "NTMC", "THSR", "TMRT", "TRA", "TRTC", "TYMC"]
    var operatorName = ["高雄捷運", "新北捷運", "高鐵", "台中捷運", "台鐵", "台北捷運", "桃園捷運"]
    return operatorName[operatorCode.indexOf(text)]
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

  const [value, setValue] = React.useState(0);

  const [tabsDoc, setTabsDoc] = React.useState((<></>))

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [nearByData, setNearByData] = React.useState
    ([{
      RailStations: {
        RailStationList: [
          { StationUID: "" }
        ]
      },
      BusStations: {
        BusStationList: [{ StopName: "" }],
      },
      BikeStations: {
        BikeStationList: [{ StationName: "" }],
      }
    }])
  const [traTab, setTraTab] = React.useState([])
  const [hsrTab, setHsrTab] = React.useState([])
  const [mrtTab, setMrtTab] = React.useState([])
  const [busTab, setBusTab] = React.useState([])
  const [bikeTab, setBikeTab] = React.useState([])


  React.useEffect(() => {

    if (lat && lon) {
      getData(`https://tdx.transportdata.tw/api/advanced/V3/Map/GeoLocating/Transit/Nearby/LocationX/${lon}/LocationY/${lat}/Distance/500?%24format=JSON`, (res) => {
        console.log(res)
        setNearByData(res)
        return
      }, { useLocalCatch: false })
    }
  }, [lat, lon])


  React.useEffect(() => {
    if (spec === "tra") {
      getData("https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/LineTransfer?%24format=JSON", (res) => {
        for (let i = 0; i < res.LineTransfers.length; i++) {
          if (res.LineTransfers[i].FromStationID === data.stationID) {

            traTab[0] =
              <>
                <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "bottom", background: "linear-gradient(315deg, #004da7, #7fa9d9)" }} variant='div' ></Typography>{res.LineTransfers[i].FromLineName.Zh_tw.replace("西部幹線 (海線)", "海線").replace("西部幹線", "山線")} <p></p>
                <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "bottom", background: "linear-gradient(315deg, #004da7, #7fa9d9)" }} variant='div' ></Typography>{res.LineTransfers[i].ToLineName.Zh_tw.replace("西部幹線 (海線)", "海線").replace("西部幹線", "山線")}
              </>
            break
          }
        }
        if (traTab[0] === <></> || traTab === undefined || traTab.length < 1) {
          traTab[0] = "無資料"
        }
      }, { useLocalCatch: false })


    }
    else {
      for (let i = 0; i < nearByData[0].RailStations.RailStationList.length; i++) {
        if (nearByData[0].RailStations.RailStationList[i].StationUID.includes("TRA")) {
          if (traTab[0] === "無資料") {
            traTab[0] =
              <>
                <Card sx={{ m: 0, pt: 0 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #004da7, #7fa9d9)" }} variant='div' ></Typography> {nearByData[0].RailStations.RailStationList[i].StationName}車站
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">

                    </Typography>
                    <Typography variant="body2" component="div">
                      {data.map ?
                        <Button variant="contained" onClick={() => {
                          let marker = L.marker([nearByData[0].RailStations.RailStationList[i].LocationY, nearByData[0].RailStations.RailStationList[i].LocationX], { icon: greenIcon }).addTo(data.map.current);
                          data.markedCallback(false);
                          marker.bindPopup(nearByData[0].RailStations.RailStationList[i].StationName + "車站")
                          data.map.current.setView([nearByData[0].RailStations.RailStationList[i].LocationY, nearByData[0].RailStations.RailStationList[i].LocationX], 16)
                        }}>在地圖上顯示</Button>
                        :
                        <Button variant="contained" component={Link} to={`/map/?lat=${nearByData[0].RailStations.RailStationList[i].LocationY}&lon=${nearByData[0].RailStations.RailStationList[i].LocationX}&popup=${nearByData[0].RailStations.RailStationList[i].StationName}車站`}>在地圖上顯示</Button>
                      }
                    </Typography>
                  </CardContent>
                </Card>
              </>
          } else {
            traTab[0] =
              <>
                {traTab[0]}
                <p></p>
                <Card sx={{ m: 0, pt: 0 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #004da7, #7fa9d9)" }} variant='div' ></Typography> {nearByData[0].RailStations.RailStationList[i].StationName}車站
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">

                    </Typography>
                    <Typography variant="body2" component="div">
                      {data.map ?
                        <Button variant="contained" onClick={() => {
                          let marker = L.marker([nearByData[0].RailStations.RailStationList[i].LocationY, nearByData[0].RailStations.RailStationList[i].LocationX], { icon: greenIcon }).addTo(data.map.current);
                          data.markedCallback(false);
                          marker.bindPopup(nearByData[0].RailStations.RailStationList[i].StationName + "車站")
                          data.map.current.setView([nearByData[0].RailStations.RailStationList[i].LocationY, nearByData[0].RailStations.RailStationList[i].LocationX], 16)
                        }}>在地圖上顯示</Button>
                        :
                        <Button variant="contained" component={Link} to={`/map/?lat=${nearByData[0].RailStations.RailStationList[i].LocationY}&lon=${nearByData[0].RailStations.RailStationList[i].LocationX}&popup=${nearByData[0].RailStations.RailStationList[i].StationName}車站`}>在地圖上顯示</Button>
                      }
                    </Typography>
                  </CardContent>
                </Card>
              </>
          }
        }
      }
      if (traTab[0] === <></> || traTab === undefined || traTab.length < 1) {
        traTab[0] = "無資料"
      }

    }

    if (spec === "hsr") {
      hsrTab[0] = "..."
    } else {
      console.log(nearByData[0].RailStations.RailStationList[0])
      console.log("HSRTAB", hsrTab)
      for (let i = 0; i < nearByData[0].RailStations.RailStationList.length; i++) {
        if (nearByData[0].RailStations.RailStationList[i].StationUID.includes("THSR")) {
          if (hsrTab[0] === "無資料") {
            hsrTab[0] =
              <>
                <Card sx={{ m: 0, pt: 0 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #ca4f0f, #f89867)" }} variant='div' ></Typography> 高鐵{nearByData[0].RailStations.RailStationList[i].StationName}站
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">

                    </Typography>
                    <Typography variant="body2" component="div">
                      {data.map ?
                        <Button variant="contained" onClick={() => {
                          let marker = L.marker([nearByData[0].RailStations.RailStationList[i].LocationY, nearByData[0].RailStations.RailStationList[i].LocationX], { icon: greenIcon }).addTo(data.map.current);
                          data.markedCallback(false);
                          marker.bindPopup("高鐵" + nearByData[0].RailStations.RailStationList[i].StationName + "站")
                          data.map.current.setView([nearByData[0].RailStations.RailStationList[i].LocationY, nearByData[0].RailStations.RailStationList[i].LocationX], 16)
                        }}>在地圖上顯示</Button>
                        :
                        <Button variant="contained" component={Link} to={`/map/?lat=${nearByData[0].RailStations.RailStationList[i].LocationY}&lon=${nearByData[0].RailStations.RailStationList[i].LocationX}&popup=高鐵${nearByData[0].RailStations.RailStationList[i].StationName}站`}>在地圖上顯示</Button>
                      }
                    </Typography>
                  </CardContent>
                </Card>
              </>
          } else {
            hsrTab[0] =
              <>
                {hsrTab[0]}
                <p></p>
                <Card sx={{ m: 0, pt: 0 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #ca4f0f, #f89867)" }} variant='div' ></Typography> 高鐵{nearByData[0].RailStations.RailStationList[i].StationName}站
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">

                    </Typography>
                    <Typography variant="body2" component="div">
                      {data.map ?
                        <Button variant="contained" onClick={() => {
                          let marker = L.marker([nearByData[0].RailStations.RailStationList[i].LocationY, nearByData[0].RailStations.RailStationList[i].LocationX], { icon: greenIcon }).addTo(data.map.current);
                          data.markedCallback(false);
                          marker.bindPopup("高鐵" + nearByData[0].RailStations.RailStationList[i].StationName + "站")
                          data.map.current.setView([nearByData[0].RailStations.RailStationList[i].LocationY, nearByData[0].RailStations.RailStationList[i].LocationX], 16)
                        }}>在地圖上顯示</Button>
                        :
                        <Button variant="contained" component={Link} to={`/map/?lat=${nearByData[0].RailStations.RailStationList[i].LocationY}&lon=${nearByData[0].RailStations.RailStationList[i].LocationX}&popup=高鐵${nearByData[0].RailStations.RailStationList[i].StationName}站`}>在地圖上顯示</Button>
                      }
                    </Typography>
                  </CardContent>
                </Card>
              </>
          }
        }
      }
      console.log(hsrTab)
      if (hsrTab[0] === <></> || hsrTab === undefined || hsrTab.length < 1) {
        hsrTab[0] = "無資料"
      }
    }



    if (spec === "mrt") {
      mrtTab[0] = "..."
    } else {
      console.log(nearByData[0].RailStations.RailStationList[0])
      console.log("MRTTAB", mrtTab)
      for (let i = 0; i < nearByData[0].RailStations.RailStationList.length; i++) {
        if (!nearByData[0].RailStations.RailStationList[i].StationUID.includes("TRA") && !nearByData[0].RailStations.RailStationList[i].StationUID.includes("THSR") && nearByData[0].RailStations.RailStationList[i].StationUID) {
          if (mrtTab[0] === "無資料") {
            mrtTab[0] =
              <>
                <Card sx={{ m: 0, pt: 0 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #8dc21f,#ccf871)" }} variant='div' ></Typography> {nearByData[0].RailStations.RailStationList[i].StationUID.split("-")[1]} {nearByData[0].RailStations.RailStationList[i].StationName}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {convertOperator(nearByData[0].RailStations.RailStationList[i].StationUID.split("-")[0])}
                    </Typography>
                    <Typography variant="body2" component="div">
                      {data.map ?
                        <Button variant="contained" onClick={() => {
                          let marker = L.marker([nearByData[0].RailStations.RailStationList[i].LocationY, nearByData[0].RailStations.RailStationList[i].LocationX], { icon: greenIcon }).addTo(data.map.current);
                          data.markedCallback(false);
                          marker.bindPopup(convertOperator(nearByData[0].RailStations.RailStationList[i].StationUID.split("-")[0]) + nearByData[0].RailStations.RailStationList[i].StationName)
                          data.map.current.setView([nearByData[0].RailStations.RailStationList[i].LocationY, nearByData[0].RailStations.RailStationList[i].LocationX], 16)
                        }}>在地圖上顯示</Button>
                        :
                        <Button variant="contained" component={Link} to={`/map/?lat=${nearByData[0].RailStations.RailStationList[i].LocationY}&lon=${nearByData[0].RailStations.RailStationList[i].LocationX}&popup=捷運${nearByData[0].RailStations.RailStationList[i].StationName}`}>在地圖上顯示</Button>
                      }
                    </Typography>
                  </CardContent>
                </Card>
              </>
          } else {
            mrtTab[0] =
              <>
                {mrtTab[0]}
                <p></p>
                <Card sx={{ m: 0, pt: 0 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #8dc21f,#ccf871)" }} variant='div' ></Typography> {nearByData[0].RailStations.RailStationList[i].StationUID.split("-")[1]} {nearByData[0].RailStations.RailStationList[i].StationName}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {convertOperator(nearByData[0].RailStations.RailStationList[i].StationUID.split("-")[0])}
                    </Typography>
                    <Typography variant="body2" component="div">
                      {data.map ?
                        <Button variant="contained" onClick={() => {
                          let marker = L.marker([nearByData[0].RailStations.RailStationList[i].LocationY, nearByData[0].RailStations.RailStationList[i].LocationX], { icon: greenIcon }).addTo(data.map.current);
                          data.markedCallback(false);
                          marker.bindPopup(convertOperator(nearByData[0].RailStations.RailStationList[i].StationUID.split("-")[0]) + nearByData[0].RailStations.RailStationList[i].StationName)
                          data.map.current.setView([nearByData[0].RailStations.RailStationList[i].LocationY, nearByData[0].RailStations.RailStationList[i].LocationX], 16)
                        }}>在地圖上顯示</Button>
                        :
                        <Button variant="contained" component={Link} to={`/map/?lat=${nearByData[0].RailStations.RailStationList[i].LocationY}&lon=${nearByData[0].RailStations.RailStationList[i].LocationX}&popup=捷運${nearByData[0].RailStations.RailStationList[i].StationName}`}>在地圖上顯示</Button>
                      }
                    </Typography>
                  </CardContent>
                </Card>
              </>
          }
        }
      }
      if (mrtTab[0] === <></> || mrtTab === undefined || mrtTab.length < 1) {
        mrtTab[0] = "無資料"
      }
    }




    if (spec === "bus") {
      busTab[0] = "..."
    } else {
      var busStops = []
      var busRoutes = []
      var busStopPos = []
      console.log(nearByData[0].BusStations.BusStationList[0])
      console.log("busTAB", busTab)

      for (let i = 0; i < nearByData[0].BusStations.BusStationList.length; i++) {
        var theStopName = nearByData[0].BusStations.BusStationList[i].StopName
        var theRouteName = nearByData[0].BusStations.BusStationList[i].RouteName
        if (!busStops.includes(theStopName)) {
          busStops.push(theStopName)
          busRoutes.push([])
          busStopPos.push([nearByData[0].BusStations.BusStationList[i].LocationY, nearByData[0].BusStations.BusStationList[i].LocationX])
        }
        if (!busRoutes[busStops.indexOf(theStopName)].includes(theRouteName)) {
          busRoutes[busStops.indexOf(theStopName)].push(theRouteName)
        }
      }
      console.log(busStops, busRoutes, busStopPos)

      for (let i = 0; i < busStops.length; i++) {
        if (!busStops[i].includes(specQuery) && busStops[i]) {
          var theStopName = busStops[i]
          var theRouteName = busRoutes[i].join(" , ")
          if (busTab[0] === "無資料") {
            busTab[0] =
              <>
                <Card sx={{ m: 0, pt: 0 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #8d8d8d,#ccc)" }} variant='div' ></Typography> {theStopName}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {theRouteName}
                    </Typography>
                    <Typography variant="body2" component="div">
                      {data.map ?
                        <Button variant="contained" onClick={() => {
                          let marker = L.marker(busStopPos[i], { icon: greenIcon }).addTo(data.map.current);
                          data.markedCallback(false);
                          marker.bindPopup(busStops[i])
                          data.map.current.setView(busStopPos[i], 16)
                        }}>在地圖上顯示</Button>
                        :
                        <Button variant="contained" component={Link} to={`/map/?lat=${busStopPos[i][0]}&lon=${busStopPos[i][1]}&popup=${theStopName}`}>在地圖上顯示</Button>
                      }
                    </Typography>
                  </CardContent>
                </Card>
              </>
          } else {
            busTab[0] =
              <>
                {busTab[0]}
                <p></p>
                <Card sx={{ m: 0, pt: 0 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #8d8d8d,#ccc)" }} variant='div' ></Typography> {theStopName}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {theRouteName}
                    </Typography>
                    <Typography variant="body2" component="div">
                      {data.map ?
                        <Button variant="contained" onClick={() => {
                          let marker = L.marker(busStopPos[i], { icon: greenIcon }).addTo(data.map.current);
                          data.markedCallback(false);
                          marker.bindPopup(busStops[i])
                          data.map.current.setView(busStopPos[i], 16)
                        }}>在地圖上顯示</Button>
                        :
                        <Button variant="contained" component={Link} to={`/map/?lat=${busStopPos[i][0]}&lon=${busStopPos[i][1]}&popup=${theStopName}`}>在地圖上顯示</Button>
                      }
                    </Typography>
                  </CardContent>
                </Card>
              </>
          }
        }
      }
      console.log(busTab)
      if (busTab[0] === <></> || busTab === undefined || busTab.length < 1) {
        busTab[0] = "無資料"
      }
    }

    console.log(nearByData[0].BikeStations.BikeStationList[0])
    for (let i = 0; i < nearByData[0].BikeStations.BikeStationList.length; i++) {
      var bikeStation = nearByData[0].BikeStations.BikeStationList
      if (!(spec === "bike" && bikeStation[i].StationUID === specQuery) && bikeStation[i].StationName) {

        bikeTab[0] =
          <>
            {bikeTab[0] !== "無資料" ?
              <>{bikeTab[0]}<p></p></> : <></>}
            <Card sx={{ m: 0, pt: 0 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #ffef00,#fff647)" }} variant='div' ></Typography> {bikeStation[i].StationName.split("_")[1]}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {bikeStation[i].StationName.split("_")[0]}
                </Typography>
                <Typography variant="body2" component="div">
                  {data.map ?
                    <Button variant="contained" onClick={() => {
                      let marker = L.marker([bikeStation[i].LocationY, bikeStation[i].LocationX], { icon: greenIcon }).addTo(data.map.current);
                      data.markedCallback(false);
                      marker.bindPopup(bikeStation[i].StationName)
                      data.map.current.setView([bikeStation[i].LocationY, bikeStation[i].LocationX], 16)
                    }}>在地圖上顯示</Button>
                    :
                    <Button variant="contained" component={Link} to={`/map/?lat=${bikeStation[i].LocationY}&lon=${bikeStation[i].LocationX}&popup=${bikeStation[i].StationName}`}>在地圖上顯示</Button>
                  }
                </Typography>
              </CardContent>
            </Card>
          </>
      }
    }
    if (bikeTab[0] === <></> || bikeTab === undefined || bikeTab.length < 1) {
      bikeTab[0] = "無資料"
    }

  }, [nearByData, traTab, hsrTab, busTab, bikeTab])

  React.useEffect(() => {

    setTabsDoc(<>
      <Box sx={{ width: '100%' }}>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', position: "sticky", top: 0, backgroundColor: "white", backdropFilter: "blur(5px)", zIndex: 999 }}>
          <Tabs value={value} onChange={handleChange}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
          >
            <Tab label="公車" {...a11yProps(0)} />
            <Tab label="公共自行車" {...a11yProps(1)} />
            <Tab label="捷運" {...a11yProps(2)} />
            <Tab label="台鐵" {...a11yProps(3)} />
            <Tab label="高鐵" {...a11yProps(4)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {busTab[0]}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {bikeTab[0]}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2} >
          {mrtTab[0]}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3} >
          {traTab[0]}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4} >
          {hsrTab[0]}
        </CustomTabPanel>
      </Box>
    </>)
  }, [nearByData, value, traTab, hsrTab, mrtTab, busTab])


  return (
    tabsDoc
  );
}