import * as React from 'react'
import TopBar from '../TopBar'
import Grid from '@mui/material/Unstable_Grid2';
import { NativeSelect, Box, InputLabel, Paper, TextField, Button } from '@mui/material'
import getData from '../getData'
import SearchAnything from '../searchAnything'
import { styled } from '@mui/material/styles';
import BackspaceIcon from '@mui/icons-material/Backspace';
import KeyboardIcon from '@mui/icons-material/Keyboard';
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

export function BusRoute() {

  const [routeData, setRouteData] = React.useState([])
  const [searchResult, setSearchResult] = React.useState([
    {
      route: "",
      from: "",
      to: "",
      city: "",
      uid: ""
    }
  ])
  const [countdown, setCountdown] = React.useState(60)

  function UrlParam(name) {
    var url = new URL(window.location.href),
      result = url.searchParams.get(name);
    return result
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
          }
        }
      }, { useLocalCatch: true })

    }, { useLocalCatch: true })
  }, [])


  return (
    <>
      <Box sx={{ p: 3 }}>
        <TopBar title={searchResult[0].route + " - " + searchResult[0].city === "公路客運" ? searchResult[0].city : searchResult[0].city + "公車"} />
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
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">

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
    </>
  )
}