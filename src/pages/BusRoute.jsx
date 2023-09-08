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

export function BusRoute() {

  const [routeData, setRouteData] = React.useState([])
  const [searchResult, setSearchResult] = React.useState([])
  const [busDataUI, setBusDataUI] = React.useState(<></>)

  function UrlParam(name) {
    var url = new URL(window.location.href),
      result = url.searchParams.get(name);
    return result
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

              console.log(currentRouteList)
              setSearchResult(currentRouteList)

              setBusDataUI(
                <>
                  <TopBar title={currentRouteList[0].route + " - " + currentRouteList[0].city + "公車"} />
                  <Card sx={{ m: 0, pt: 0 }}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {currentRouteList[0].route}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {currentRouteList[0].from} - {currentRouteList[0].to}<br />
                        {currentRouteList[0].city}
                      </Typography>
                      <Typography variant="body2" component="div">
                      </Typography>
                    </CardContent>
                  </Card>
                </>
              )
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
            setBusDataUI(
              <>
                <TopBar title={currentRouteList[0].route + " - " + currentRouteList[0].city} />
                <Card sx={{ m: 0, pt: 0 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {currentRouteList[0].route}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {currentRouteList[0].from} - {currentRouteList[0].to}<br />
                      {currentRouteList[0].city}
                    </Typography>
                    <Typography variant="body2" component="div">
                    </Typography>
                  </CardContent>
                </Card>
              </>
            )

          }
        }
      }, { useLocalCatch: true })

    }, { useLocalCatch: true })
  }, [])


  return (
    <>
      <Box sx={{ p: 3 }}>
        {busDataUI}
      </Box>
    </>
  )
}