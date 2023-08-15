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

function convertOperator(text) {
  var operatorCode = ["KRTC", "NTMC", "THSR", "TMRT", "TRA", "TRTC", "TYMC"]
  var operatorName = ["高雄捷運", "新北捷運", "高鐵", "台中捷運", "台鐵", "台北捷運", "桃園捷運"]
}
var trainStation_isTransferStation = false
export default function BasicTabs({ lat, lon, spec, hide, data, children }) {
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
  const [nearByData, setNearByData] = React.useState([{ RailStations: { RailStationList: [{ StationUID: "" }] } }])
  const [traTab, setTraTab] = React.useState([])
  const [hsrTab, setHsrTab] = React.useState([])
  const [mrtTab, setMrtTab] = React.useState(<></>)
  const [busTab, setBusTab] = React.useState(<></>)
  const [bikeTab, setBikeTab] = React.useState(<></>)


  React.useEffect(() => {

    if (lat && lon) {
      getData(`https://tdx.transportdata.tw/api/advanced/V3/Map/GeoLocating/Transit/Nearby/LocationX/${lon}/LocationY/${lat}/Distance/500?%24format=JSON`, (res) => {
        console.log(res)
        setNearByData(res)
        return
      }, { useLocalCatch: true })
    }
  }, [lat, lon])


  React.useEffect(() => {
    if (spec === "tra") {
      getData("https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/LineTransfer?%24format=JSON", (res) => {
        for (let i = 0; i < res.LineTransfers.length; i++) {
          if (res.LineTransfers[i].FromStationID === data.stationID) {
            trainStation_isTransferStation = true
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
      }, { useLocalCatch: true })


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
  }, [nearByData, traTab, hsrTab])

  React.useEffect(() => {

    setTabsDoc(<>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', position: "sticky", top: 0, backgroundColor: "white", backdropFilter: "blur(5px)" }}>
          <Tabs value={value} onChange={handleChange}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
          >
            <Tab label="台鐵" {...a11yProps(0)} />
            <Tab label="高鐵" {...a11yProps(1)} />
            <Tab label="捷運" {...a11yProps(2)} />
            <Tab label="公車" {...a11yProps(3)} />
            <Tab label="公共自行車" {...a11yProps(4)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {traTab[0]}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {hsrTab[0]}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Item Three
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          Item Three
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          Item Three
        </CustomTabPanel>
      </Box >
    </>)
  }, [nearByData, value])


  return (
    tabsDoc
  );
}