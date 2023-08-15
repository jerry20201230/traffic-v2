import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import getData from './getData';
import { useLocation } from 'react-router';

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
  const [value, setValue] = React.useState(0);

  const [tabsDoc, setTabsDoc] = React.useState((<></>))

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [nearByData, setNearByData] = React.useState([{ RailStations: { RailStationList: [{ StationUID: "" }] } }])
  const [traTab, setTraTab] = React.useState(["無資料"])
  const [hsrTab, setHsrTab] = React.useState(<></>)
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
            traTab[0] = <>{res.LineTransfers[i].FromLineName.Zh_tw.replace("西部幹線", "山線").replace("西部幹線 (海線)", "海線")} <br /> {res.LineTransfers[i].ToLineName.Zh_tw.replace("西部幹線", "山線").replace("西部幹線 (海線)", "海線")}</>
            break
          }
        }
        return
      }, { useLocalCatch: true })


    }
    else {
      console.log(nearByData[0])

      for (let i = 0; i < nearByData[0].RailStations.RailStationList.length; i++) {
        if (nearByData[0].RailStations.RailStationList[i].StationUID.includes("TRA")) {
          traTab[0] = <> <span>{traTab[0]} {nearByData[0].RailStations.RailStationList[i].StationName.Zh_tw}車站</span><br /></>
        }

      }

      return
    }
  }, [nearByData, traTab])

  React.useEffect(() => {

    setTabsDoc(<>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile>
            <Tab label="台鐵" {...a11yProps(0)} />
            <Tab label="高鐵" {...a11yProps(1)} />
            <Tab label="捷運" {...a11yProps(2)} />
            <Tab label="公車" {...a11yProps(3)} />
            <Tab label="公共自行車" {...a11yProps(4)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {
            traTab[0]
          }
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          Item Two
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
      </Box>
    </>)
  }, [nearByData, value])


  return (
    tabsDoc
  );
}