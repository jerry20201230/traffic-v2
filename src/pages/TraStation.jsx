import * as React from 'react';
import TopBar from '../TopBar';
import { Alert, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Card, CardActions, CardContent } from '@mui/material'
import Button from '@mui/material/Button';
import getData from '../getData';
import { Link } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { AppBar, Toolbar } from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt';
import LinearProgress from '@mui/material/LinearProgress';
import { TocTwoTone } from '@mui/icons-material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import IconButton from '@mui/material/IconButton';

function TraStation() {
  const [stationCardTitle, setStationCardTitle] = React.useState("")
  const [stationCardSubTitle, setStationCardSubTitle] = React.useState("")
  const [stationCardBody, setStationCardBody] = React.useState("")
  const [stationCardAction, setStationCardAction] = React.useState("")

  const [title, setTitle] = React.useState(<></>)
  const [stationID, setStationID] = React.useState()
  const [stationName, setStationName] = React.useState("")

  const [trainBoard, setTrainBoard] = React.useState([])
  const [trainBoardEle, setTrainBoardEle] = React.useState([])

  const [radioValue, setRadioValue] = React.useState(0)
  const [progress, setProgress] = React.useState(0);

  const [countdown, setCountdown] = React.useState(0)


  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });


  function UrlParam(name) {
    var url = new URL(window.location.href),
      result = url.searchParams.get(name);
    return result
  }
  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
    readTrainData(trainBoard)
    //
    //window.history.pushState("", "", window.location.origin + window.location.pathname + "?sw=" + event.target.value);
  };

  function stationClass(n) {
    var stationLvL = ""
    if (n === "0" || n === 0) {
      stationLvL = "特等站"
    } else if (n === "1" || n === 1) {
      stationLvL = "一等站"
    } else if (n === "2" || n === 2) {
      stationLvL = "二等站"
    } else if (n === "3" || n === 3) {
      stationLvL = "三等站"
    }
    else if (n === "4" || n === 4) {
      stationLvL = "簡易站"
    }
    else if (n === "5" || n === 5) {
      stationLvL = "招呼站"
    }
    else if (n === "6" || n === 6) {
      stationLvL = "號誌站"
    }
    else if (n === "A") {
      stationLvL = "貨運站"
    }
    else if (n === "B") {
      stationLvL = "基地"
    }
    else if (n === "X") {
      stationLvL = "非車站"
    }
    return stationLvL
  }
  function convertTrainType(txt) {
    var traintype = txt
    if (String(txt).includes("專開") || String(txt).includes("郵輪式")) {
      traintype = "專車"
    }
    else if (String(txt).includes("自強") && String(txt).includes("(3000)")) {
      traintype = "新自強"
    }
    else if (String(txt).includes("自強") && !String(txt).includes("(3000)")) {
      traintype = "自強"
    }
    else if (String(txt).includes("莒光")) {
      traintype = "莒光"
    }
    else if (String(txt).includes("復興")) {
      traintype = "復興"
    }
    else if (String(txt).includes("區間") && !String(txt).includes("快")) {
      traintype = "區間"
    }
    else if (String(txt).includes("區間") && String(txt).includes("快")) {
      traintype = "區間快"
    }
    return traintype
  }


  function readTrainData(res) {
    var data
    if (res) {
      data = res
    } else {
      data = trainBoard
    }
    var query = radioValue
    console.log(query)
    console.log(data)
    var list = []
    for (let i = 0; i < data.length; i++) {
      if (data[i].Direction == Number(query)) {
        list.push(data[i])
      }
    }
    if (list.length < 1) {
      list.push("無資料")
    }
    console.log(list)
    setTrainBoardEle(list)
  }



  React.useEffect(() => {
    var station = UrlParam("q")
    if (!station) { station = "()" }

    if (station.includes("(")) { station = station.split("(")[1].split(")")[0] } //車站ID
    console.log(station)
    getData("https://tdx.transportdata.tw/api/basic/v2/Rail/TRA/Station?%24format=JSON", function (res) {
      var TRA_Station_Data = res
      var temparr = []
      var found = false, DataIndex = 0
      for (var i = 0; i < TRA_Station_Data.length; i++) {
        temparr.push(`${TRA_Station_Data[i].StationName.Zh_tw}(${TRA_Station_Data[i].StationID})`)
        if (TRA_Station_Data[i].StationID === station) {
          DataIndex = i
          found = true
          break
        }
      }
      // var finder = temparr.filter(function (ele) { return (ele === station) })
      if (!found) {
        setStationCardTitle("找不到車站")
        setStationCardBody("請確認你的條件")
        setStationCardAction(<><Button size='small' component={Link} to="/tra?sw=station">修改條件</Button></>)
      } else {


        console.log(TRA_Station_Data[DataIndex])
        setStationID(TRA_Station_Data[DataIndex].StationID)
        setTitle(<TopBar title={`台鐵${TRA_Station_Data[DataIndex].StationName.Zh_tw}車站`} />)
        setStationName(TRA_Station_Data[DataIndex].StationName.Zh_tw)
        setStationCardTitle(TRA_Station_Data[DataIndex].StationName.Zh_tw + "車站")
        setStationCardSubTitle(<>{TRA_Station_Data[DataIndex].StationID} / {stationClass(TRA_Station_Data[DataIndex].StationClass)}</>)
        setStationCardBody(
          <>
            <LocationOnIcon sx={{ verticalAlign: "bottom" }} /> {TRA_Station_Data[DataIndex].StationAddress}<br />
            <p></p>
            <PhoneIcon sx={{ verticalAlign: "bottom" }} /> {TRA_Station_Data[DataIndex].StationPhone}
            <p></p>
            <MapContainer dragging={!L.Browser.mobile} scrollWheelZoom={false} center={[TRA_Station_Data[DataIndex].StationPosition.PositionLat, TRA_Station_Data[DataIndex].StationPosition.PositionLon]} zoom={18} style={{ width: "100%", height: "35vh", borderRadius: "5px" }}>
              <TileLayer
                attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors${L.Browser.mobile ? "<br/>使用兩指移動與縮放地圖" : ""}`}
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[TRA_Station_Data[DataIndex].StationPosition.PositionLat, TRA_Station_Data[DataIndex].StationPosition.PositionLon]} icon={redIcon}>
                <Popup>
                  {TRA_Station_Data[DataIndex].StationName.Zh_tw}車站
                </Popup>
              </Marker>
            </MapContainer>
          </>)
        setStationCardAction(<>
          <Button size='small' component="a" href={`tel:${TRA_Station_Data[DataIndex].StationPhone}`}>撥打電話</Button>
          <Button size='small' component="a" href={`https://maps.google.com/?q=${TRA_Station_Data[DataIndex].StationPosition.PositionLat},${TRA_Station_Data[DataIndex].StationPosition.PositionLon}`} target='_blank'>Google Maps</Button>
        </>)


      }
    }, {
      useLocalCatch: true,
    })

  }, [])


  React.useEffect(() => {
    if (countdown === 0 && stationID) {
      getData(`https://tdx.transportdata.tw/api/basic/v2/Rail/TRA/LiveBoard/Station/${stationID}?%24format=JSON`, function (res) {
        setTrainBoard(res)
        readTrainData(res)
      }, { useLocalCatch: false })
      setCountdown(60)
    } else if (countdown > 0) {
      setProgress((60 - countdown) * (100 / 60))
    } else {

    }
  }, [countdown]);

  React.useEffect(() => {
    if (stationID) {
      getData(`https://tdx.transportdata.tw/api/basic/v2/Rail/TRA/LiveBoard/Station/${stationID}?%24format=JSON`, function (res) {
        setTrainBoard(res)
        console.log(res)
        setCountdown(60)
        //  readTrainData(res)
      }, { useLocalCatch: false })
      const intervalId = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      // 组件卸载时清除定时器
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [stationID]);


  React.useEffect(() => {
    if (trainBoard) {
      readTrainData(trainBoard)
    }
  }, [trainBoard, radioValue])


  return (
    <>
      {title}
      <Box sx={{ p: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #004da7, #7fa9d9)" }} variant='div' ></Typography>
              {stationCardTitle}
              <IconButton aria-label="add bookmark" sx={{float:"right"}}>
                <BookmarkBorderIcon/>
              </IconButton>
            </Typography>

            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {stationCardSubTitle}
            </Typography>
            <Typography variant="body2" component="div" sx={{ lineHeight: 1.25 }}>
              {stationCardBody}
            </Typography>
          </CardContent>
          <CardActions>
            {stationCardAction}
          </CardActions>
        </Card>
        <p></p>
        <Card>
          <CardContent>
            <Typography variant='h5' component='div'>
              即時資料
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              30分鐘內的車次資料
            </Typography>
            <Typography variant="body2" component="div" sx={{ lineHeight: 1.25 }}>
              <Alert severity='warning'>這裡的列車時間是表定離站時間<br/>資料可能會延遲，請以車站看板為準</Alert>
              <p></p>
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">列車方向</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={radioValue}
                  onChange={(e) => handleRadioChange(e)}
                >
                  <FormControlLabel value={0} control={<Radio />} label="北上" />
                  <FormControlLabel value={1} control={<Radio />} label="南下" />
                </RadioGroup>
              </FormControl>

              <p></p>
              <TableContainer component={Paper} >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ p: 0.5 }}>時間</TableCell>
                      <TableCell sx={{ p: 0.5 }}>車次</TableCell>
                      <TableCell sx={{ p: 0.5 }}>車種</TableCell>
                      <TableCell sx={{ p: 0.5 }}>經</TableCell>
                      <TableCell sx={{ p: 0.5 }}>往</TableCell>
                      <TableCell sx={{ p: 0.5 }}>備註</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {trainBoardEle.map((row) => (
                      row.TrainNo !== undefined ?
                        <TableRow
                          key={row.TrainNo}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 }, }}
                        >
                          <TableCell component="th" scope="row" sx={{ p: 0.5 }}>
                            {row.ScheduledDepartureTime.split(":")[0] + ":" + row.ScheduledDepartureTime.split(":")[1]}
                          </TableCell>
                          <TableCell sx={{ p: 0.5 }}><Link to={`/tra/train/?q=${row.TrainNo}`}>{row.TrainNo}</Link></TableCell>
                          <TableCell sx={{ p: 0.5 }}>{convertTrainType(row.TrainTypeName.Zh_tw)}</TableCell>
                          <TableCell sx={{ p: 0.5 }}>{row.TripLine === 0 ? "--" : row.TripLine === 1 ? "山線" : row.TripLine === 2 ? "海線" : "成追"}</TableCell>
                          <TableCell sx={{ p: 0.5 }}>{row.EndingStationName.Zh_tw}  </TableCell>
                          <TableCell sx={{ p: 0.5 }}>{row.DelayTime === 0 ? <Typography color="green">準點</Typography> : <Typography color="red">晚{row.DelayTime}分</Typography>}</TableCell>
                        </TableRow>
                        : <TableRow
                          key={0}

                          sx={{ '&:last-child td, &:last-child th': { border: 0 }, }}
                        >
                          <TableCell sx={{ p: 0.5, textAlign: "center" }} colSpan={6}>無資料</TableCell>
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
            <BoltIcon sx={{ verticalAlign: 'middle' }} /> 台鐵即時資料 / {countdown}秒
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

export default TraStation;
