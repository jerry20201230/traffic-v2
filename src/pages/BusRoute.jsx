import * as React from 'react'
import TopBar from '../TopBar'
import Grid from '@mui/material/Unstable_Grid2';
import { NativeSelect, Box, InputLabel, Paper, TextField, Button } from '@mui/material'
import getData from '../getData'
import SearchAnything from '../searchAnything'
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import '../App.css'
import { red, yellow, blue, green, brown, orange, grey } from '@mui/material/colors';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { AppBar, Toolbar } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress';
import BoltIcon from '@mui/icons-material/Bolt';


export function BusRoute() {

  const [routeData, setRouteData] = React.useState([])
  const [busDirection, setBusDirect] = React.useState(0)
  const [searchResult, setSearchResult] = React.useState([
    {
      route: "",
      from: "",
      to: "",
      city: "",
      uid: ""
    }
  ])

  const [progress, setProgress] = React.useState(0);
  const [countdown, setCountdown] = React.useState(0)

  const [pageTitle, setPageTitle] = React.useState("")

  function UrlParam(name) {
    var url = new URL(window.location.href),
      result = url.searchParams.get(name);
    return result
  }

  const handleBusDirectChange = (e, n) => {
    setBusDirect(n)
  }

  function createData(station, estimateTime, plateNumb,) {
    return { station, estimateTime, plateNumb };
  }

  var rows = [
    createData('Frozen yoghurt', 159, 6.0,),
    createData('Ice cream sandwich', 237, 9.0),
    createData('Eclair', 262, 16.0),
    createData('Cupcake', 305, 3.7),
    createData('Gingerbread', 356, 16.0),
  ];

  function cityName2Id(n) {
    var a = []
    var b = []
    getData("https://tdx.transportdata.tw/api/basic/v2/Basic/City?%24format=JSON", function (res) {
      console.log(res)
      a.push("請選擇縣市")
      b.push("null")
      for (let i = 0; i < res.length; i++) {
        a.push(res[i].CityName)
        b.push(res[i].City)
      }
      a.push("公路客運")
      b.push("interBus")
      return (b[a.indexOf(n)])
    }, { useLocalCatch: true })
  }



  function getBusData() {
    getData(`https://tdx.transportdata.tw/api/basic/v2/Bus/EstimatedTimeOfArrival/City/${cityName2Id(searchResult[0].city)}/900?%24format=JSON`, function (res) {
      console.log(res)

    }, { useLocalCatch: false })
  }

  React.useEffect(() => {
    var currentRouteList = [
      {
        route: "",
        from: "",
        to: "",
        city: "",
        uid: ""
      }
    ],
      searchKeyword = UrlParam("q")

    getData("https://tdx.transportdata.tw/api/basic/v2/Basic/City?%24format=JSON", function (res) {

      for (let i = 0; i < res.length; i++) {
        getData(`https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/${res[i].City}?%24format=JSON`, (res2) => {
          for (let j = 0; j < res2.length; j++) {
            if (res2[j].RouteUID === (searchKeyword)) {
              currentRouteList[0] =
              {
                route: res2[j].RouteName.Zh_tw,
                from: res2[j].DepartureStopNameZh,
                to: res2[j].DestinationStopNameZh,
                city: res[i].CityName,
                uid: res2[j].RouteUID
              }

              console.log(currentRouteList, res2[j])
              setSearchResult(currentRouteList)
              break
            }
          }
        }, { useLocalCatch: true })
      }

      getData(`https://tdx.transportdata.tw/api/basic/v2/Bus/Route/InterCity?%24format=JSON`, (res2) => {
        for (let j = 0; j < res2.length; j++) {
          if (res2[j].RouteUID === searchKeyword) {
            currentRouteList[0] =
            {
              route: res2[j].RouteName.Zh_tw,
              from: res2[j].DepartureStopNameZh,
              to: res2[j].DestinationStopNameZh,
              city: "公路客運",
              uid: res2[j].RouteUID

            }
            setSearchResult(currentRouteList)
            break
          }
        }
      }, { useLocalCatch: true })

    }, { useLocalCatch: true })

  }, [])

  React.useEffect(() => {
    console.log(searchResult)
    setPageTitle(searchResult[0].route + " - " + (searchResult[0].city === "公路客運" ? searchResult[0].city : searchResult[0].city) + "公車")
  }, [searchResult])


  React.useEffect(() => {
    if (countdown === 0) {
      getBusData()
      setCountdown(15)
    } else if (countdown > 0) {
      setProgress((15 - countdown) * (100 / 15))
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

  return (
    <>
      <Box sx={{ p: 3 }}>
        <TopBar title={pageTitle} />
        <Card sx={{ m: 0, pt: 0 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {searchResult[0].route}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {searchResult[0].from} - {searchResult[0].to}<br />
              {searchResult[0].city}
            </Typography>
          </CardContent>
        </Card>
        <p></p>
        <Card sx={{ m: 0, pt: 0 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              即時資料
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
            </Typography>

            <Typography variant="body2" component="div">


              <ToggleButtonGroup
                color="primary"
                value={busDirection}
                exclusive
                onChange={handleBusDirectChange}
                aria-label="Platform"
              >
                <ToggleButton value={0}>往{searchResult[0].from}</ToggleButton>
                <ToggleButton value={1}>往{searchResult[0].to}</ToggleButton>
              </ToggleButtonGroup>
              <p></p>


              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow
                        key={row.station}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {row.estimateTime}
                        </TableCell>
                        <TableCell component="th" scope="row">{row.station}</TableCell>
                        <TableCell component="th" scope="row">{row.plateNumb}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Typography>
          </CardContent>
        </Card>
      </Box>


      <AppBar position="fixed" color="secondary" sx={{ top: 'auto', bottom: 0, height: 'auto', display: (countdown < 0 ? "none" : "unset") }} >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <BoltIcon sx={{ verticalAlign: 'middle' }} /> 公車即時資料 / {countdown}秒
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