import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import TopBar from '../TopBar';
import getData from '../getData';
import getWeather from '../getWeather';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import dayjs from 'dayjs';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Autocomplete, TextField, Button, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import SearchAnything from '../searchAnything';
export default function HomePage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [weatherSettingDialogOpen, setWeatherSettingDialogOpen] = React.useState(false)
  const [currentCity, setCurrentCity] = React.useState("")
  const [currentCityList, setCurrentCityList] = React.useState([])
  const [weatherCardTitle, setWeatherCardTitle] = React.useState(<>天氣預報</>)
  const [weatherCardBody, setWeatherCardBody] = React.useState(
    <center>
      <CircularProgress /><br />資料讀取中...
    </center>
  )
  const [weatherCardAction, setWeatherCardAction] = React.useState(<><Button size="small" onClick={() => getLocation()}>開啟定位</Button></>)

  const [weatherData, setWeatherData] = React.useState([])
  const [weatherDialogInput, setWeatherDialogInput] = React.useState("")
  const locationErrorAlertCheckRef = React.useRef()

  React.useEffect(() => {
    getData("https://tdx.transportdata.tw/api/basic/v2/Basic/City?%24format=JSON", function (res) {
      console.log(res)
      var list = []
      for (let i = 0; i < res.length; i++) {
        list.push(res[i].CityName)
      }
      setCurrentCityList(list)
      getLocation()
    }, { useLocalCatch: true })
  }, [])

  React.useEffect(() => {
    setWeatherCardBody(<>
      使用裝置定位，或選擇縣市
      <p></p>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel shrink htmlFor="select-multiple-native">
          選擇縣市
        </InputLabel>
        <Select
          native
          value={currentCity}
          // @ts-ignore Typings are not considering `native`
          onChange={e => { setWeatherDialogInput(e.target.value); setCurrentCity(e.target.value) }}
          onBlur={e => { setWeatherDialogInput(e.target.value); setCurrentCity(e.target.value) }}
          label="選擇縣市"
          inputProps={{
            id: 'select-multiple-native',
          }}
        >
          {currentCityList.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>

      </FormControl><br></br>

    </>)
  }, [currentCityList,])


  const steps = [
    {
      label: '天氣',
      description:
        <Box sx={{ width: "100%", m: 0, p: 0 }}>
          <Card sx={{ mt: 0, pt: 0 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {weatherCardTitle}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary"></Typography>
              <Typography variant="body2" component="div">
                {weatherCardBody}
              </Typography>
            </CardContent>
            <CardActions>
              {weatherCardAction}
            </CardActions></Card></Box>,
    },
    {
      label: '書籤',
      description:
        '你沒有任何書籤',
    },
    {
      label: '附近大眾運輸',
      description: <>
        <Box sx={{ width: "100%", m: 0, p: 0 }}>
          <Card sx={{ mt: 0, pt: 0 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                需要使用定位
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </>,
    },
  ];
  const theme = useTheme();

  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = steps.length;
  function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // 判断时间点是否在时间线上的函数
  function isTimeInRange(time, startTime, endTime) {
    const timeInMinutes = timeToMinutes(time);
    const startInMinutes = timeToMinutes(startTime);
    const endInMinutes = timeToMinutes(endTime);

    // 检查时间是否在时间线的范围内，需要考虑时间线跨夜的情况
    if (startInMinutes <= endInMinutes) {
      // 时间线不跨夜的情况
      return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
    } else {
      // 时间线跨夜的情况
      return timeInMinutes >= startInMinutes || timeInMinutes <= endInMinutes;
    }
  }
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    } else {
      setDialogOpen(true)
    }

    function successFunction(loc) {
      setWeatherCardBody(<center><CircularProgress /><br />正在取得天氣資料</center>)
      console.log(loc);
      getData(`https://tdx.transportdata.tw/api/advanced/V3/Map/GeoLocating/District/LocationX/${loc.coords.longitude}/LocationY/${loc.coords.latitude}?%24format=JSON`, function (res) {
        setCurrentCity(<>{res[0].CityName}</>)

        setWeatherCardTitle(<><FmdGoodIcon /> {res[0].CityName} 的天氣預報 <IconButton onClick={() => setWeatherSettingDialogOpen(true)} title='設定地區' sx={{ float: "right" }}><SettingsIcon /></IconButton></>)

        getWeather(res[0].CityName, function (res) {

          getData(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=CWB-F29A34D9-5547-4A00-BA43-CDA0C1416940&format=JSON&CountyName=${window.encodeURI(res.locationName)}&timeFrom=${dayjs(new Date()).format("YYYY-MM-DD")}&timeTo=${dayjs().date(dayjs().date() + 1).format("YYYY-MM-DD")}`, function (res2) {
            console.log(res2)
            console.log(dayjs().date(dayjs().date() + 1).format("YYYY-MM-DD"))

            console.log(isTimeInRange(dayjs(new Date()).format("HH:mm"), res2.records.locations.location[0].time[0].SunRiseTime, res2.records.locations.location[0].time[0].SunSetTime))
            console.log(res2.records.locations.location[0].time[0].SunRiseTime)
            console.log(res2.records.locations.location[0].time[0].SunSetTime)
            setWeatherCardBody(
              <>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <p style={{ fontSize: "1.1rem" }}><b>{res.weatherElement[0].time[0].parameter.parameterName} <br /> {res.weatherElement[3].time[0].parameter.parameterName}</b></p>
                    <p style={{ paddingBottom: 0, marginBottom: 0 }}>
                      <span style={{ fontSize: "3rem" }}>{res.weatherElement[2].time[0].parameter.parameterName}~{res.weatherElement[4].time[0].parameter.parameterName}<sup style={{ fontSize: "1.5rem" }}>℃</sup></span>
                    </p>

                    <img src='/weather/umbrella_6143012.png' style={{ maxHeight: "2.5em", verticalAlign: "middle" }} /> 降雨機率 / {res.weatherElement[1].time[0].parameter.parameterName}%<br />
                  </Box>
                  <Box><WeatherIcon res={res} isNight={!isTimeInRange(dayjs(new Date()).format("HH:mm"), res2.records.locations.location[0].time[0].SunRiseTime, res2.records.locations.location[0].time[0].SunSetTime)} /></Box>
                </Box>
                <p>天氣預報有效時間:  {res.weatherElement[0].time[0].endTime}</p>
              </>)
          }, { useLocalCatch: false })

        })
        setWeatherCardAction(<></>)

      }, { useLocalCatch: false })
    }

    function errorFunction() {
      console.log("Unable to retrieve your location.");
      if (localStorage.getItem("dialog.getLocationError.show") === "true" || !localStorage.getItem("dialog.getLocationError.show")) {
        setDialogOpen(true)
      }

    }
  }




  useEffect(() => {
    if (currentCity.length) {
      setWeatherCardBody(<center><CircularProgress /><br />正在讀取 {currentCity} 的天氣資料</center>)

      setWeatherCardTitle(<>{currentCity} 的天氣預報<IconButton onClick={() => setWeatherSettingDialogOpen(true)} title='設定地區' sx={{ float: "right" }}><SettingsIcon /></IconButton></>)
      getWeather(currentCity, function (res) {

        getData(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=CWB-F29A34D9-5547-4A00-BA43-CDA0C1416940&format=JSON&CountyName=${window.encodeURI(res.locationName)}&timeFrom=${dayjs(new Date()).format("YYYY-MM-DD")}&timeTo=${dayjs().date(dayjs().date() + 1).format("YYYY-MM-DD")}`, function (res2) {
          console.log(res2)
          console.log(dayjs().date(dayjs().date() + 1).format("YYYY-MM-DD"))

          console.log(isTimeInRange(dayjs(new Date()).format("HH:mm"), res2.records.locations.location[0].time[0].SunRiseTime, res2.records.locations.location[0].time[0].SunSetTime))
          console.log(res2.records.locations.location[0].time[0].SunRiseTime)
          console.log(res2.records.locations.location[0].time[0].SunSetTime)
          setWeatherCardBody(
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <p style={{ fontSize: "1.1rem" }}><b>{res.weatherElement[0].time[0].parameter.parameterName} <br /> {res.weatherElement[3].time[0].parameter.parameterName}</b></p>
                  <p style={{ paddingBottom: 0, marginBottom: 0 }}>

                    {res.weatherElement[2].time[0].parameter.parameterName !== res.weatherElement[4].time[0].parameter.parameterName ? <span style={{ fontSize: "3rem" }}>{res.weatherElement[2].time[0].parameter.parameterName}~{res.weatherElement[4].time[0].parameter.parameterName}<sup style={{ fontSize: "1.5rem" }}>℃</sup></span> : <span style={{ fontSize: "3rem" }}>{res.weatherElement[2].time[0].parameter.parameterName}<sup style={{ fontSize: "1.5rem" }}>℃</sup></span>}
                  </p>

                  <img src='/weather/umbrella_6143012.png' style={{ maxHeight: "2.5em", verticalAlign: "middle" }} /> 降雨機率 / {res.weatherElement[1].time[0].parameter.parameterName}%<br />
                </Box>
                <Box><WeatherIcon res={res} isNight={!isTimeInRange(dayjs(new Date()).format("HH:mm"), res2.records.locations.location[0].time[0].SunRiseTime, res2.records.locations.location[0].time[0].SunSetTime)} /></Box>
              </Box>
              <p>天氣預報有效時間: {res.weatherElement[0].time[0].endTime}</p>
            </>)
        }, { useLocalCatch: false })

      })
      setWeatherCardAction(<></>)
    }
  }, [currentCity])



  function WeatherIcon({ res, isNight }) {
    //referrence:https://pjchender.dev/react-bootcamp/docs/book/ch6/6-1/#%E6%8F%9B%E4%BD%A0%E4%BA%86%EF%BC%81%E6%8A%8A%E5%A4%A9%E6%B0%A3%E4%BB%A3%E7%A2%BC%E8%BD%89%E6%8F%9B%E6%88%90%E5%A4%A9%E6%B0%A3%E5%9E%8B%E6%85%8B
    const weatherTypes = {
      isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
      isClear: [1],
      isCloudyFog: [25, 26, 27, 28],
      isCloudy: [2, 3, 4, 5, 6, 7],
      isFog: [24],
      isPartiallyClearWithRain: [
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        19,
        20,
        29,
        30,
        31,
        32,
        38,
        39,
      ],
      isSnowing: [23, 37, 42],
    };

    const weatherIcons = {
      day: {
        isThunderstorm: <img src="/weather/8594648946.png" style={{ maxHeight: "8em" }} />,
        isClear: <img src="/weather/sun_6142888.png" style={{ maxHeight: "8em" }} />,
        isCloudyFog: <img src="/weather/sun_6142591.png" style={{ maxHeight: "8em" }} />,
        isCloudy: <img src="/weather/sun_6142591.png" style={{ maxHeight: "8em" }} />,
        isFog: <img src="/weather/1655464.png" style={{ maxHeight: "8em" }} />,
        isPartiallyClearWithRain: <img src="/weather/6142570.png" style={{ maxHeight: "8em" }} />,
        isSnowing: <img src="/weather/snow_6142805.png" style={{ maxHeight: "8em" }} />,
      },
      night: {
        isThunderstorm: <img src="/weather/8594648946.png" style={{ maxHeight: "8em" }} />,
        isClear: <img src="/weather/489894894894.png" style={{ maxHeight: "8em" }} />,
        isCloudyFog: <img src="/weather/moon_6142510.png" style={{ maxHeight: "8em" }} />,
        isCloudy: <img src="/weather/moon_6142510.png" style={{ maxHeight: "8em" }} />,
        isFog: <img src="/weather/1655464.png" style={{ maxHeight: "8em" }} />,
        isPartiallyClearWithRain: <img src="/weather/rainy-night_6142492.png" style={{ maxHeight: "8em" }} />,
        isSnowing: <img src="/weather/snow_6142805.png" style={{ maxHeight: "8em" }} />,
      },
    };
    const weatherCode2Type = (weatherCode) => {
      const [weatherType] =
        Object.entries(weatherTypes).find(([weatherType, weatherCodes]) =>
          weatherCodes.includes(Number(weatherCode))
        ) || [];

      return weatherType;
    };
    if (isNight) {
      return <>{weatherIcons.night[weatherCode2Type(res.weatherElement[0].time[0].parameter.parameterValue)]}</>
    } else {
      return <>{weatherIcons.day[weatherCode2Type(res.weatherElement[0].time[0].parameter.parameterValue)]}</>
    }
  }



  const handleNext = () => {
    if (activeStep === maxSteps - 1) {
      setActiveStep(0);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {

    if (activeStep === 0) {
      setActiveStep(maxSteps - 1);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };


  return (
    <>
      <TopBar title="首頁" />
      <Box sx={{ p: 3 }}><SearchAnything type="easy" variant="framed" /></Box>


      <Box sx={{ display: "flex", p: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Paper
            square
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: 20,

              bgcolor: 'background.default',
              m: 2,
              ml: 0
            }}
          >
            <h2>{steps[activeStep].label}</h2>
          </Paper>
          <Box sx={{ height: "22em", width: '100%' }}>
            {steps[activeStep].description}
          </Box>
          <MobileStepper
            variant="text"
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
              //disabled={activeStep === maxSteps - 1}
              >
                下一頁
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} >
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                上一頁
              </Button>
            }
          />
        </Box>
      </Box>




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
            {navigator.geolocation ? <>你之前拒絕了我們的定位請求<br />如果要啟用定位，請到<Paper sx={{ p: 0.5 }}>瀏覽器設定&gt;網站設定&gt;{window.location.origin}</Paper>開啟定位服務，接著刷新此頁面</> : <>你的裝置不支援我們的技術<br />請嘗試更新瀏覽器，或在其他裝置上再試一次</>}
          </DialogContentText>
          <FormGroup>
            <FormControlLabel control={<Checkbox inputRef={locationErrorAlertCheckRef} />} label="以後不再顯示" />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDialogOpen(false); window.localStorage.setItem("dialog.getLocationError.show", String(!locationErrorAlertCheckRef.current.checked)) }}>
            確定
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={weatherSettingDialogOpen}
        onClose={() => setWeatherSettingDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"設定地區"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" component="div">
            選擇天氣顯示的地區<br />這些設定只會應用於這一次，我們不會保留此設定<p></p>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel shrink htmlFor="select-multiple-native">
                選擇縣市
              </InputLabel>
              <Select
                native
                value={weatherDialogInput || "臺北市"}
                // @ts-ignore Typings are not considering `native`
                onChange={e => { console.log(e.target.value); setWeatherDialogInput(e.target.value); }}
                label="選擇縣市"
                inputProps={{
                  id: 'select-multiple-native',
                }}
              >
                {currentCityList.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWeatherSettingDialogOpen(false)}>
            取消
          </Button>
          <Button onClick={() => { setWeatherSettingDialogOpen(false); setCurrentCity(weatherDialogInput || "臺北市") }}>
            確定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

