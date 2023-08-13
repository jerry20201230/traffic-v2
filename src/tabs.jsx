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

export default function BasicTabs({ lat, lon, spec, hide, data, children }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [nearByData, setNearByData] = React.useState([{ RailStations: { RailStationList: [{ StationUID: "" }] } }])

  const [traTabSpecVal, setTraTabSpecVal] = React.useState([{ FromLineName: { Zh_tw: "" }, ToLineName: { Zh_tw: "" } }])
  const [hsrTab, setHsrTab] = React.useState(<></>)
  const [mrtTab, setMrtTab] = React.useState(<></>)
  const [busTab, setBusTab] = React.useState(<></>)
  const [bikeTab, setBikeTab] = React.useState(<></>)

  React.useEffect(() => {
    if (lat && lon) {
      getData(`https://tdx.transportdata.tw/api/advanced/V3/Map/GeoLocating/Transit/Nearby/LocationX/${lon}/LocationY/${lat}/Distance/500?%24format=JSON`, (res) => {
        console.log(res)
        setNearByData(res)
      }, { useLocalCatch: false })
    }

    if (spec === "tra") {
      getData("https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/LineTransfer?%24format=JSON", (res) => {
        setTraTabSpecVal(res.LineTransfers)

      }, { useLocalCatch: true })
    }
  }, [lat, lon])



  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"
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
          spec !== "tra" ?
            nearByData[0].RailStations.RailStationList.map((data, index) => {
              return (
                data.StationUID.includes("TRA") ?
                  <div key={"tra-" + index}>
                    <span>{data.StationName}車站</span><br />
                  </div>
                  :
                  <></>
              )
            })
            :
            traTabSpecVal.map((tradata, index) => {

              return (
                traTabSpecVal.length > 0 ?
                  tradata.FromStationID == data.stationID ?
                    <div key={index + "-tra"}>
                      <h3>轉乘 {tradata.FromLineName.Zh_tw}、{tradata.ToLineName.Zh_tw}，請在本站換車</h3>
                    </div>
                    :
                    <></>
                  : <></>
              )

            })
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
  );
}