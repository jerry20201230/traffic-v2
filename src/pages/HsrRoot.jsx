import * as React from 'react';
import TopBar from '../TopBar';
import getData from '../getData';
import { Box, Autocomplete, TextField, Button } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Alert } from '@mui/material';
import { Link } from 'react-router-dom';

function HsrRoot() {
  const [stationDataInput, setstationDataInput] = React.useState([])
  const stationInput = React.useRef()
  const trainInput = React.useRef()
  const submitButton = React.useRef()
  const [radioValue, setRadioValue] = React.useState('');
  const [selected, setSelected] = React.useState()
  const [trainNum, setTrainNum] = React.useState()
  const handleChange = (event) => {
    setRadioValue(event.target.value);
    window.history.pushState("", "", window.location.origin+window.location.pathname+"?sw="+event.target.value);
  };
  function UrlParam(name) {
    var url = new URL(window.location.href),
      result = url.searchParams.get(name);
    return result
  }
  React.useLayoutEffect(() => {
    getData("https://tdx.transportdata.tw/api/basic/v2/Rail/THSR/Station?%24format=JSON", function (res) {
      var HSR_Station_Data = res
      console.log(HSR_Station_Data)

      var temparr = []
      for (var i = 0; i < HSR_Station_Data.length; i++) {
        temparr.push(`${HSR_Station_Data[i].StationName.Zh_tw}(${HSR_Station_Data[i].StationID})`)
      }
      setstationDataInput(temparr)
    }, {
      useLocalCatch: true,
    })
  }, []);

  React.useEffect(() => {
    if(UrlParam("sw")){setRadioValue(UrlParam("sw"))}else{setRadioValue("station")}
    const handleKeyDown = (event) => {
      if (event.keyCode === 13) {
        console.log(submitButton)
        submitButton.current.click()
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <TopBar title="高鐵"></TopBar>
      <Box sx={{ p: 3 }}>
        <h1>歡迎使用高鐵資料</h1>
        <h3>請選擇 資料輸入方式</h3>
        <Alert severity="info">輸入<b>車站</b>: 車站資訊、轉乘指引、列車時刻表<br />輸入<b>車次</b>: 沿途停靠站</Alert>
        <p></p>
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={radioValue}
            onChange={(e) => handleChange(e)}
          >
            <FormControlLabel value="station" control={<Radio />} label="車站" />
            <FormControlLabel value="train" control={<Radio />} label="車次" />
          </RadioGroup>
        </FormControl>

        <p></p>
        <div hidden={radioValue === "train"}>
          <Autocomplete
            disablePortal
            options={stationDataInput}
            onChange={(e, v) => setSelected(v)}
            renderInput={(params) => <TextField {...params} label="車站名稱" ref={stationInput} />}
            noOptionsText="無資料"
          />
          <p></p>
          <Alert severity="warning">注意: 區分 "台" 和 "臺"! 高鐵資料使用的是"台"</Alert>
        </div>

        <div hidden={radioValue === "station"} style={{ width: "100%" }}>
          <TextField ref={trainInput} label="車次" sx={{ width: "100%" }} onChange={(e, v) => setTrainNum(e.target.value)}></TextField>
        </div>
        <p></p>
        <Button variant="contained" ref={submitButton} component={Link} to={"/hsr/" + radioValue + "/?q=" + (radioValue === "station" ? selected : trainNum) + "&t=fulldata"}>繼續</Button>
      </Box>
    </>
  )
}

export default HsrRoot;
