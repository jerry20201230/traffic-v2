import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import TopBar from '../TopBar';
import getData from '../getData';
import getWeather from '../getWeather';


export default function HomePage() {
  const [city, setCity] = React.useState("")
  const [weatherCardTitle, setWeatherCardTitle] = React.useState(<><FmdGoodIcon />請允許定位</>)
  const [weatherCardBody, setWeatherCardBody] = React.useState(<>請允許我們使用定位，才能獲取你所在地點的天氣資料<br />如果你拒絕過我們的定位要求，你可能需要前往 設定&gt;網站設定 重新開啟</>)
  const [weatherIcon, setWeatherIcon] = React.useState(<></>)
  const [weatherCardAction, setWeatherCardAction] = React.useState(<><Button size="small" onClick={() => getLocation()}>開啟定位</Button></>)

  const [weatherData, setWeatherData] = React.useState([])
  const [cityList, setCityList] = React.useState([])

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
      label: 'Create an ad group',
      description:
        'An ad group contains one or more ads which target a shared set of keywords.',
    },
    {
      label: 'Create an ad',
      description: `Try out different ad text to see what brings in the most customers,
                and learn how to enhance your ads using features like ad extensions.
                If you run into any problems with your ads, find out how to tell if
                they're running and how to resolve approval issues.`,
    },
  ];
  const theme = useTheme();

  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = steps.length;
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    function successFunction(loc) {
      console.log(loc);
      getData(`https://tdx.transportdata.tw/api/advanced/V3/Map/GeoLocating/District/LocationX/${loc.coords.longitude}/LocationY/${loc.coords.latitude}?%24format=JSON`, function (res) {
        setCity(<><FmdGoodIcon />{res[0].CityName}</>)
        setWeatherCardTitle(`${res[0].CityName} 的天氣`)

        getWeather(res[0].CityName, function (res) {
          setWeatherCardBody(
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <p>到 {res.weatherElement[0].time[0].endTime} 為止的天氣預報</p>
                <p><b>{res.weatherElement[0].time[0].parameter.parameterName} / {res.weatherElement[3].time[0].parameter.parameterName}</b></p>
                <p><img src='/weather/temperature_6142979.png' style={{maxHeight:"1em",verticalAlign: "middle"}}/>最高溫 / {res.weatherElement[4].time[0].parameter.parameterName}℃</p>

              </Box>
              <Box><WeatherIcon res={res} /></Box>

            </Box>)
        })
        setWeatherCardAction(<></>)

      }, { useLocalCatch: true })
    }

    function errorFunction() {
      console.log("Unable to retrieve your location.");
    }
  }

  function WeatherIcon({ res }) {
    //referrence:https://pjchender.dev/react-bootcamp/docs/book/ch6/6-1/#%E6%8F%9B%E4%BD%A0%E4%BA%86%EF%BC%81%E6%8A%8A%E5%A4%A9%E6%B0%A3%E4%BB%A3%E7%A2%BC%E8%BD%89%E6%8F%9B%E6%88%90%E5%A4%A9%E6%B0%A3%E5%9E%8B%E6%85%8B

    console.log("reS", res)
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
        isThunderstorm: <img src="/weather/8594648946.png" style={{ maxHeight: "10em" }} />,
        isClear: <img src="/weather/sun_6142888.png" style={{ maxHeight: "10em" }} />,
        isCloudyFog: <img src="/weather/sun_6142591.png" style={{ maxHeight: "10em" }} />,
        isCloudy: <img src="/weather/sun_6142591.png" style={{ maxHeight: "10em" }} />,
        isFog: <img src="/weather/1655464.png" style={{ maxHeight: "10em" }} />,
        isPartiallyClearWithRain: <img src="/weather/6142570.png" style={{ maxHeight: "10em" }} />,
        isSnowing: <img src="/weather/snow_6142805.png" style={{ maxHeight: "10em" }} />,
      },
      night: {
        isThunderstorm: <img src="/weather/8594648946.png" style={{ maxHeight: "10em" }} />,
        isClear: <img src="/weather/489894894894.png" style={{ maxHeight: "10em" }} />,
        isCloudyFog: <img src="/weather/moon_6142510.png" style={{ maxHeight: "10em" }} />,
        isCloudy: <img src="/weather/moon_6142510.png" style={{ maxHeight: "10em" }} />,
        isFog: <img src="/weather/1655464.png" style={{ maxHeight: "10em" }} />,
        isPartiallyClearWithRain: <img src="/weather/rainy-night_6142492.png" style={{ maxHeight: "10em" }} />,
        isSnowing: <img src="/weather/snow_6142805.png" style={{ maxHeight: "10em" }} />,
      },
    };
    const weatherCode2Type = (weatherCode) => {
      const [weatherType] =
        Object.entries(weatherTypes).find(([weatherType, weatherCodes]) =>
          weatherCodes.includes(Number(weatherCode))
        ) || [];

      return weatherType;
    };
    return <>{weatherIcons.day[weatherCode2Type(res.weatherElement[0].time[0].parameter.parameterValue)]}</>
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


  React.useEffect(() => {
    getData("https://tdx.transportdata.tw/api/basic/v2/Basic/City?%24format=JSON", function (res) {
      console.log(res)
      setCityList(res)
      getLocation()
    }, { useLocalCatch: true })
  }, [])



  return (
    <>
      <TopBar title="首頁" />
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
          <Box sx={{ height: "18em", width: '100%' }}>
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

    </>
  );
}

