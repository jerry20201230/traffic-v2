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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export function BusRoot() {
  const citySelect = React.useRef()
  const [searchCity, setSearchCity] = React.useState("選擇縣市")
  const [tempSearchCity, setTempSearchCity] = React.useState("選擇縣市")
  const [inputVal, setInputVal] = React.useState("")
  const [currentCity, setCurrentCityList] = React.useState([])
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const [radioValue, setRadioValue] = React.useState("route")
  const busKeywordRef = React.useRef()

  const [keyWord, setKeyWord] = React.useState("")

  const [searchResult, setSearchResult] = React.useState([])

  const [keyWordInputReadonly, setKeyWordInputReadonly] = React.useState(true)

  const keyboard = React.useRef()


  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    margin: "0px",
    textAlign: 'center',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.text.secondary,
  }));

  React.useEffect(() => {
    getData("https://tdx.transportdata.tw/api/basic/v2/Basic/City?%24format=JSON", function (res) {
      console.log(res)
      var list = ["請選擇縣市"]
      for (let i = 0; i < res.length; i++) {
        list.push(res[i].CityName)
      }
      list.push("公路客運")
      setCurrentCityList(list)

    }, { useLocalCatch: true })
  }, [])

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

  function keyboardAnimation(t) {
    console.log(t, keyboard.current)
    if (t === "hide") {
      var keyboardDownKeyframes = new KeyframeEffect(
        keyboard.current,
        [
          { transform: 'translateY(0%)' },
          { transform: 'translateY(120%)' }
        ],
        { duration: 300, fill: 'forwards' }
      );
      var keyboardDownAnimation = new Animation(keyboardDownKeyframes, document.timeline);
      keyboardDownAnimation.play();

    } else if (t === "show") {
      var keyboardUpKeyframes = new KeyframeEffect(
        keyboard.current,
        [
          { transform: 'translateY(120%)' },
          { transform: 'translateY(0%)' }
        ],
        { duration: 300, fill: 'forwards' }
      );
      var keyboardUpAnimation = new Animation(keyboardUpKeyframes, document.timeline);
      keyboardUpAnimation.play();
    }
  }

  function searchData() {
    if (radioValue === "route") {
      var currentRouteList = [], searchKeyword = keyWord
      getData("https://tdx.transportdata.tw/api/basic/v2/Basic/City?%24format=JSON", function (res) {

        for (let i = 0; i < res.length; i++) {
          getData(`https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/${res[i].City}?%24format=JSON`, (res2) => {
            for (let j = 0; j < res2.length; j++) {
              if (res2[j].RouteName.Zh_tw.includes(searchKeyword)) {
                currentRouteList.push(
                  {
                    route: res2[j].RouteName.Zh_tw,
                    from: res2[j].DepartureStopNameZh,
                    to: res2[j].DestinationStopNameZh,
                    city: res[i].CityName,
                    uid: res2[j].RouteUID
                  }
                )
                setSearchResult(currentRouteList)
              }
            }
          }, { useLocalCatch: true })
        }

        getData(`https://tdx.transportdata.tw/api/basic/v2/Bus/Route/InterCity?%24format=JSON`, (res2) => {
          for (let j = 0; j < res2.length; j++) {
            if (res2[j].RouteName.Zh_tw.includes(searchKeyword)) {
              currentRouteList.push(
                {
                  route: res2[j].RouteName.Zh_tw,
                  from: res2[j].DepartureStopNameZh,
                  to: res2[j].DestinationStopNameZh,
                  city: "公路客運",
                  uid: res2[j].RouteUID

                }
              )
              setSearchResult(currentRouteList)

            }
          }
        }, { useLocalCatch: true })

      }, { useLocalCatch: true })
    }
    else if (radioValue === "station") {

    }
  }

  return (<>
    <TopBar title="公車" />
    <Box sx={{ p: 3 }}>
      <FormControl>
        <RadioGroup
          row
          name="row-radio-buttons-group-1"
          value={radioValue}
          onChange={(e) => setRadioValue(e.target.value)}
        >
          <FormControlLabel value="route" control={<Radio />} label="搜尋路線" />
          <FormControlLabel value="station" control={<Radio />} label="搜尋站牌" />

        </RadioGroup>
      </FormControl>
      <Box sx={{ display: (radioValue === "station" ? "block" : "none") }}>
        <FormControl fullWidth>
          <NativeSelect

            ref={citySelect}
            defaultValue={currentCity.length ? currentCity[0] : ""}
            inputProps={{
              name: '縣市',
              id: 'uncontrolled-native',
            }}
            onChange={(e) => setTempSearchCity(e.target.value === "請選擇縣市" ? "選擇縣市" : e.target.value)}
          >
            {
              currentCity.map((data, index) => {
                return (<option value={data} key={"citylist-" + index}>{data}</option>)
              })
            }
          </NativeSelect>
        </FormControl>

      </Box>
      <p></p>
      <TextField inputRef={busKeywordRef} variant="standard" onBlur={() => { setKeyWordInputReadonly(true); }} onFocus={() => { if (keyWordInputReadonly) { keyboardAnimation("show") } else { keyboardAnimation("hide") } }} onInput={(e) => { setKeyWord(e.target.value); }} value={keyWord} inputProps={{ readOnly: (keyWordInputReadonly && radioValue === "route"), }} fullWidth placeholder={radioValue === "route" ? "輸入路線名稱" : "輸入站牌名稱"} />
      <p></p>
      <Button variant='contained' onClick={() => { keyboardAnimation("hide"); searchData(); }}>搜尋</Button>

    </Box>
    <Box sx={{ p: 3 }}>
      {
        searchResult.length < 1 ? <></> : <p>共 {searchResult.length}筆資料</p>
      }
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <nav aria-label="">
          <List>
            {searchResult.length > 0 ?
              searchResult.map((data, i) => {
                return (
                  <div key={"data--" + i}>
                    <ListItem disablePadding>
                      <ListItemButton components={Link} to={`/bus/route/?q=${data.uid}`}>
                        <ListItemText>
                          <Typography variant="h5">{data.route}</Typography>{data.from} - {data.to}<br />{data.city}
                        </ListItemText>
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                  </div>
                )
              }) : <></>
            }
          </List>
        </nav>
      </Box>

    </Box>
    <Box ref={keyboard} sx={{ position: "fixed", bottom: "0", textAlign: "center", width: "100%", userSelect: "none", display: "flex", pr: 0, background: grey[200], borderRadius: "5px 5px 0 0" }}></Box>
    <Box ref={keyboard} sx={{ position: "fixed", bottom: "0", textAlign: "center", width: "100%", userSelect: "none", display: "flex", pr: 0, background: grey[200], borderRadius: "5px 5px 0 0", display: (radioValue === "route" ? "flex" : "none"), transform: "translateY(120%)" }}>
      <Grid container spacing={2} sx={{ p: 2, maxWidth: "40%", flexGrow: 1, flexShrink: 1 }}>
        <Grid xs={6} component="button" className='btn-container-2' onClick={() => { setKeyWord(keyWord + "紅") }}><Item className='btn' sx={{ fontSize: "1.20em", backgroundColor: red[500], color: "#fff" }}>紅</Item></Grid>
        <Grid xs={6} component="button" className='btn-container-2' onClick={() => { setKeyWord(keyWord + "黃") }}><Item className='btn' sx={{ fontSize: "1.20em", backgroundColor: yellow[500] }}>黃</Item></Grid>
        <Grid xs={6} component="button" className='btn-container-2' onClick={() => { setKeyWord(keyWord + "藍") }}><Item className='btn' sx={{ fontSize: "1.20em", backgroundColor: blue[500], color: "#fff" }}>藍</Item></Grid>
        <Grid xs={6} component="button" className='btn-container-2' onClick={() => { setKeyWord(keyWord + "綠") }}><Item className='btn' sx={{ fontSize: "1.20em", backgroundColor: green[500], color: "#fff" }}>綠</Item></Grid>
        <Grid xs={6} component="button" className='btn-container-2' onClick={() => { setKeyWord(keyWord + "橘") }}><Item className='btn' sx={{ fontSize: "1.20em", backgroundColor: orange[500] }}>橘</Item></Grid>
        <Grid xs={6} component="button" className='btn-container-2' onClick={() => { setKeyWord(keyWord + "棕") }}><Item className='btn' sx={{ fontSize: "1.20em", backgroundColor: brown[500], color: "#fff" }}>棕</Item></Grid>
        <Grid xs={6} component="button" className='btn-container-2' onClick={() => { keyboardAnimation("hide") }}><Item className='btn' sx={{ fontSize: "1.43rem", }}><ExpandMoreIcon sx={{ fontSize: "1.43rem", }} /></Item></Grid>
        <Grid xs={6} component="button" className='btn-container-2' onClick={() => { setKeyWordInputReadonly(!keyWordInputReadonly); if (keyWordInputReadonly) { busKeywordRef.current.focus(); busKeywordRef.current.click(); keyboardAnimation("hide") } }}><Item className='btn'><KeyboardIcon sx={{ verticalAlign: "bottom", fontSize: "1.43rem" }} color={(keyWordInputReadonly ? "inherit" : "primary")} /></Item></Grid>
      </Grid>
      <Grid container spacing={2} sx={{ p: 2, pl: 0, flexGrow: 1, flexShrink: 1 }}>
        <Grid xs={4} component="button" className='btn-container-1' onClick={() => { setKeyWord(keyWord + "1") }}><Item className='btn' sx={{ fontSize: "1.20em", }}>1</Item></Grid>
        <Grid xs={4} component="button" className='btn-container-1' onClick={() => { setKeyWord(keyWord + "2") }}><Item className='btn' sx={{ fontSize: "1.20em", }}>2</Item></Grid>
        <Grid xs={4} component="button" className='btn-container-1' onClick={() => { setKeyWord(keyWord + "3") }}><Item className='btn' sx={{ fontSize: "1.20em", }}>3</Item></Grid>
        <Grid xs={4} component="button" className='btn-container-1' onClick={() => { setKeyWord(keyWord + "4") }}><Item className='btn' sx={{ fontSize: "1.20em", }}>4</Item></Grid>
        <Grid xs={4} component="button" className='btn-container-1' onClick={() => { setKeyWord(keyWord + "5") }}><Item className='btn' sx={{ fontSize: "1.20em", }}>5</Item></Grid>
        <Grid xs={4} component="button" className='btn-container-1' onClick={() => { setKeyWord(keyWord + "6") }}><Item className='btn' sx={{ fontSize: "1.20em", }}>6</Item></Grid>
        <Grid xs={4} component="button" className='btn-container-1' onClick={() => { setKeyWord(keyWord + "7") }}><Item className='btn' sx={{ fontSize: "1.20em", }}>7</Item></Grid>
        <Grid xs={4} component="button" className='btn-container-1' onClick={() => { setKeyWord(keyWord + "8") }}><Item className='btn' sx={{ fontSize: "1.20em", }}>8</Item></Grid>
        <Grid xs={4} component="button" className='btn-container-1' onClick={() => { setKeyWord(keyWord + "9") }}><Item className='btn' sx={{ fontSize: "1.20em", }}>9</Item></Grid>
        <Grid xs={4} component="button" className='btn-container-1' onClick={() => { setKeyWord(keyWord + "0") }}><Item className='btn' sx={{ fontSize: "1.20em" }}>0</Item></Grid>
        <Grid xs={4} component="button" className='btn-container-1' onClick={() => { setKeyWord(keyWord.slice(0, -1)) }}><Item className='btn'><BackspaceIcon sx={{ verticalAlign: "bottom", fontSize: "1.43rem" }} /></Item></Grid>
        <Grid xs={4} component="button" className='btn-container-1' onClick={() => { keyboardAnimation("hide"); searchData() }}><Item className='btn'><SearchIcon sx={{ verticalAlign: "bottom", fontSize: "1.43rem" }} /></Item></Grid>
      </Grid>
    </Box>
  </>
  )
}