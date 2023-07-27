//checkpoint : 3218,

import * as React from 'react';
import TopBar from '../TopBar';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import getData from '../getData';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { Card, CardContent, Stack } from '@mui/material'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import getTime from '../getTime'
import AccessibleIcon from '@mui/icons-material/Accessible';
import WorkIcon from '@mui/icons-material/Work';
import DiningIcon from '@mui/icons-material/Dining';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import TodayIcon from '@mui/icons-material/Today';
import Chip from '@mui/material/Chip';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { AppBar, Toolbar } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress';
import BoltIcon from '@mui/icons-material/Bolt';

function TraTrain() {
  const [trainStations, setTrainStations] = React.useState([])
  const [displayTrainNum, setDisplayTrainNum] = React.useState(UrlParam("q"))
  const [trainCardTitle, setTrainCardTitle] = React.useState("")
  const [trainCardSubTitle, setTrainCardSubTitle] = React.useState("")
  const [trainCardBody, setTrainCardBody] = React.useState("")
  const [trainPortStations, setTrainPortStations] = React.useState(0)
  const [displayArrivalTime, setDisplayArrivalTime] = React.useState("目前顯示抵達時間和發車時間")
  const [resData, setResData] = React.useState()
  const [loaded, setLoaded] = React.useState(false)
  const [delayAlert, setDelayAlert] = React.useState(<></>)
  const [progress, setProgress] = React.useState(0);
  const [progressText, setProgressText] = React.useState(0)
  const [progEle, setProgEle] = React.useState(<></>)

  function delay(n) {
    return new Promise(function (resolve) {
      setTimeout(resolve, n * 1000);
    });
  }
  function UrlParam(name) {
    var url = new URL(window.location.href),
      result = url.searchParams.get(name);
    return result
  }
  function calculateTimeDifference(time1, time2) {
    // 將時間轉換為日期物件
    const [hours1, minutes1] = time1.split(':');
    const [hours2, minutes2] = time2.split(':');
    const date1 = new Date(0, 0, 0, hours1, minutes1);
    const date2 = new Date(0, 0, 0, hours2, minutes2);

    // 計算毫秒差
    const differenceInMilliseconds = date2 - date1;

    // 計算分鐘差
    const differenceInMinutes = differenceInMilliseconds / (1000 * 60);

    return differenceInMinutes;
  }
  function reRenderTimeLine(t) {
    var res = resData, stationTimeline = []
    for (let i = 0; i < res[0].StopTimes.length; i++) {
      if (t) {
        setDisplayArrivalTime("目前顯示抵達時間和發車時間")
        var newStation =
          i === res[0].StopTimes.length - 1 ?
            <>
              <TimelineOppositeContent color="textSecondary">
                抵達:{res[0].StopTimes[i].ArrivalTime}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
              </TimelineSeparator>
              <TimelineContent>
                {res[0].StopTimes[i].StationName.Zh_tw} (終點)
              </TimelineContent>
            </>
            :
            <>
              <TimelineOppositeContent color="textSecondary" >
                <Typography>抵達:{res[0].StopTimes[i].ArrivalTime}</Typography>
                <Typography>發車:{res[0].StopTimes[i].DepartureTime}</Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>{res[0].StopTimes[i].StationName.Zh_tw}</TimelineContent>
            </>
        stationTimeline.push(newStation)
      } else {
        setDisplayArrivalTime("目前僅顯示發車時間")
        var newStation =
          i === res[0].StopTimes.length - 1 ?
            <>
              <TimelineOppositeContent color="textSecondary">
                {res[0].StopTimes[i].DepartureTime}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
              </TimelineSeparator>
              <TimelineContent>
                {res[0].StopTimes[i].StationName.Zh_tw} (終點)
              </TimelineContent>
            </>
            :
            <>
              <TimelineOppositeContent color="textSecondary" >
                <Typography>{res[0].StopTimes[i].DepartureTime}</Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>{res[0].StopTimes[i].StationName.Zh_tw}</TimelineContent>
            </>
        stationTimeline.push(newStation)
      }

    }

    setTrainStations(stationTimeline)

  }


  React.useEffect(() => {
    async function refreshApi () {
      setProgEle(
        <>
          <AppBar position="fixed" color="secondary" sx={{ top: 'auto', bottom: 0, height: 'auto', }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <BoltIcon sx={{ verticalAlign: 'middle' }} /> 台鐵車次資料 / {progressText}
                <Box sx={{ width: '100%' }}>
                  <LinearProgress variant="determinate" value={progress} />
                </Box>
              </Typography>
            </Toolbar>
          </AppBar>
          <Toolbar />
        </>
      )
      while (true) {
        if (Boolean(displayTrainNum) && Boolean(resData)) {
          if (calculateTimeDifference(getTime("time-s"), resData[0].StopTimes[resData[0].StopTimes.length - 1].ArrivalTime) > 0 && calculateTimeDifference(getTime("time-s"), resData[0].StopTimes[0].DepartureTime) < 0) {
            try {
              getData(`https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/TrainLiveBoard/TrainNo/${displayTrainNum}?%24format=JSON`, function (res) {
                var liveInfo = "", alertBox = <></>

                console.log(resData[0])
                console.log(res)
                if (res.TrainLiveBoards[0].TrainStationStatus < 2) { //進站/站上 => 直接顯示
                  liveInfo = "目前位於 " + res.TrainLiveBoards[0].StationName.Zh_tw + "車站"
                } else {
                  var nextStation = ""

                  for (let i = 0; i < resData[0].StopTimes.length; i++) { //抓下一個車站 (ex.台中到五權之間)
                    if (resData[0].StopTimes[i].StationName.Zh_tw === res.TrainLiveBoards[0].StationName.Zh_tw) {
                      nextStation = resData[0].StopTimes[i + 1].StationName.Zh_tw
                      break
                    }
                  }
                  if (nextStation) {
                    liveInfo = "目前位於" + res.TrainLiveBoards[0].StationName.Zh_tw + "到" + nextStation + "之間"
                  } else {
                    liveInfo = "剛通過" + res.TrainLiveBoards[0].StationName.Zh_tw + "車站"
                  }
                }

                if (res.TrainLiveBoards[0].DelayTime > 0) { //誤點
                  alertBox = <Alert severity="error"><h3 style={{ margin: 0, padding: 0 }}>列車目前誤點 {res.TrainLiveBoards[0].DelayTime}分</h3><Typography>{displayTrainNum} 次 {liveInfo}<br />最後更新:{getTime("time", res.UpdateTime)}</Typography></Alert>
                  setDelayAlert(<Alert severity="warning"><h3 style={{ margin: 0, padding: 0 }}>資訊為準點時刻</h3>列車目前誤點 {res.TrainLiveBoards[0].DelayTime}分</Alert>)
                } else {
                  alertBox = <Alert severity="success"><h3 style={{ margin: 0, padding: 0 }}>列車目前準點</h3><Typography>{displayTrainNum} 次 {liveInfo}<br />最後更新:{getTime("time", res.UpdateTime)}</Typography></Alert>
                }
                setTrainCardBody(alertBox)
              }, { useLocalCatch: false })
            } catch (e) {
              alert("err")
            }
          }
        }
        for (let r = 0; r < 30; r++) {
          if (window.location.pathname !== "/tra/train/") {
            return;
          } else {
            let refresh_sec = 30 - r
            setProgress(refresh_sec * (100 / 30))
            setProgressText(`${refresh_sec} 秒`)
            await delay(1)
            if (r < 2) {
              setProgress(100)
              setProgressText(`正在更新`)

            }
          }
        }
      }
    }
    refreshApi()
  }, [])

  React.useEffect(() => {
    var trainNum = UrlParam("q")
    if (!trainNum) { trainNum = "" }
    else {
      setDisplayTrainNum(trainNum)
      getData(`https://tdx.transportdata.tw/api/basic/v2/Rail/TRA/DailyTimetable/Today/TrainNo/${trainNum}?%24format=JSON`, function (res) {
        if (res.length) {
          setResData(res)
          var stationTimeline = []
          setTrainPortStations(res[0].StopTimes.length)
          for (let i = 0; i < res[0].StopTimes.length; i++) {
            var newStation =
              i === res[0].StopTimes.length - 1 ?
                <>
                  <TimelineOppositeContent color="textSecondary">
                    抵達:{res[0].StopTimes[i].ArrivalTime}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                  </TimelineSeparator>
                  <TimelineContent>
                    {res[0].StopTimes[i].StationName.Zh_tw} (終點)
                  </TimelineContent>
                </>
                :
                <>
                  <TimelineOppositeContent color="textSecondary" >
                    <Typography>抵達:{res[0].StopTimes[i].ArrivalTime}</Typography>
                    <Typography>發車:{res[0].StopTimes[i].DepartureTime}</Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>{res[0].StopTimes[i].StationName.Zh_tw}</TimelineContent>
                </>
            stationTimeline.push(newStation)
          }

          setTrainStations(stationTimeline)
          var tripline, traintype;
          if (res[0].DailyTrainInfo.TripLine === 1) {
            tripline = "經山線"
          }
          else if (res[0].DailyTrainInfo.TripLine === 2) {
            tripline = "經海線"
          }
          else if (res[0].DailyTrainInfo.TripLine === 3) {
            tripline = "經成追線"
          }

          if (res[0].DailyTrainInfo.TrainTypeName.Zh_tw.includes("專開") || res[0].DailyTrainInfo.TrainTypeName.Zh_tw.includes("郵輪式")) {
            traintype = "專車"
          }
          else if (res[0].DailyTrainInfo.TrainTypeName.Zh_tw.includes("自強") && !res[0].DailyTrainInfo.TrainTypeName.Zh_tw.includes("3000")) {
            traintype = "自強號"
          }
          else if (res[0].DailyTrainInfo.TrainTypeName.Zh_tw.includes("自強") && res[0].DailyTrainInfo.TrainTypeName.Zh_tw.includes("3000")) {
            traintype = "新自強"
          }
          else if (res[0].DailyTrainInfo.TrainTypeName.Zh_tw.includes("莒光")) {
            traintype = "莒光號"
          }
          else if (res[0].DailyTrainInfo.TrainTypeName.Zh_tw.includes("復興")) {
            traintype = "復興號"
          }
          else if (res[0].DailyTrainInfo.TrainTypeName.Zh_tw.includes("區間") && !res[0].DailyTrainInfo.TrainTypeName.Zh_tw.includes("快")) {
            traintype = "區間車"
          }
          else if (res[0].DailyTrainInfo.TrainTypeName.Zh_tw.includes("區間") && res[0].DailyTrainInfo.TrainTypeName.Zh_tw.includes("快")) {
            traintype = "區間快"
          }
          else {
            traintype = res[0].DailyTrainInfo.TrainTypeName.Zh_tw
          }
          setTrainCardTitle(`${trainNum} 次 ${traintype}`)
          setTrainCardSubTitle(
            <><b>{tripline} {res[0].DailyTrainInfo.StartingStationName.Zh_tw}<TrendingFlatIcon sx={{ verticalAlign: "bottom" }} />{res[0].DailyTrainInfo.EndingStationName.Zh_tw}</b>
              {traintype === res[0].DailyTrainInfo.TrainTypeName.Zh_tw ? "" : <><br /><b>車種: </b>{res[0].DailyTrainInfo.TrainTypeName.Zh_tw}</>}
              <br /><b>說明: </b>{res[0].DailyTrainInfo.Note.Zh_tw}<br />

              {res[0].DailyTrainInfo.DailyFlag > 0 ? <Chip sx={{ m: 0.5 }} icon={<CalendarMonthIcon />} label="每日行駛" variant="outlined" /> : <></>}
              {res[0].DailyTrainInfo.ServiceAddedFlag > 0 ? <Chip sx={{ m: 0.5 }} icon={<TodayIcon />} label="加班車" variant="outlined" /> : <></>}
              {res[0].DailyTrainInfo.SuspendedFlag < 1 ? <></> : res[0].DailyTrainInfo.SuspendedFlag < 2 ? <Chip sx={{ m: 0.5 }} label="停駛" variant="outlined" /> : <Chip sx={{ m: 0.5 }} label="部分停駛" variant="outlined" />}
              {res[0].DailyTrainInfo.WheelchairFlag > 0 ? <Chip sx={{ m: 0.5 }} icon={<AccessibleIcon />} label="有身障座位" variant="outlined" /> : <></>}
              {res[0].DailyTrainInfo.PackageServiceFlag > 0 ? <Chip sx={{ m: 0.5 }} icon={<WorkIcon />} label="有行李服務" variant="outlined" /> : <></>}
              {res[0].DailyTrainInfo.DiningFlag > 0 ? <Chip sx={{ m: 0.5 }} icon={<DiningIcon />} label="有訂便當服務" variant="outlined" /> : <></>}
              {res[0].DailyTrainInfo.BikeFlag > 0 ? <Chip sx={{ m: 0.5 }} icon={<PedalBikeIcon />} label="可載運自行車" variant="outlined" /> : <></>}
              {res[0].DailyTrainInfo.BreastFeedingFlag > 0 ? <Chip label="有哺(集)乳室車廂" variant="outlined" /> : <></>}

            </>)
          setTrainCardBody(
            calculateTimeDifference(getTime("time-s"), res[0].StopTimes[0].DepartureTime) >= 0
              ? <Alert severity="info"><h3 style={{ margin: 0, padding: 0 }}>列車尚未發車</h3><Typography>{trainNum} 次預計於<b>{res[0].StopTimes[0].DepartureTime}</b>從<b>{res[0].StopTimes[0].StationName.Zh_tw}</b>發車</Typography></Alert>
              :
              calculateTimeDifference(getTime("time-s"), res[0].StopTimes[res[0].StopTimes.length - 1].ArrivalTime) <= 0
                ? <Alert severity="info"><h3 style={{ margin: 0, padding: 0 }}>列車已經收班</h3><Typography>{trainNum} 次已經於<b>{res[0].StopTimes[res[0].StopTimes.length - 1].ArrivalTime}</b>抵達終點<b>{res[0].StopTimes[res[0].StopTimes.length - 1].StationName.Zh_tw}</b></Typography></Alert>
                : ""
          )
          setDisplayTrainNum(trainNum)
          setLoaded(true)
        } else {
          setTrainCardTitle("找不到列車")
          setTrainCardSubTitle("無資料")
          setTrainCardBody("請檢查搜尋條件")
        }
      }, {
        useLocalCatch: false,
      })
    }
  }, [])


  return (
    <>
      <TopBar title={`台鐵 ${displayTrainNum}次`} />
      <Box sx={{ p: 3, m: 0, zIndex: 0 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              {trainCardTitle}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary" component="div">
              {trainCardSubTitle}
            </Typography>
            <Typography variant="body2" component="div">
              {trainCardBody}
            </Typography>
          </CardContent>
        </Card>
        <p></p>
        <div>
          <Card sx={{ mt: 1 }} hidden={trainCardTitle === "無資料"}>
            <CardContent>
              <Typography variant="h5" component="div">
                沿途停靠站
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                沿途停靠 共 {trainPortStations} 站
              </Typography>
              <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked disabled={!loaded} />} label="顯示抵達時間" onChange={(e) => { reRenderTimeLine(e.target.checked); }} />
              </FormGroup>
              <Typography hidden={!loaded}>{displayArrivalTime}</Typography>
              <Typography component="div">
                {delayAlert}
              </Typography>
              <Typography variant="div" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Timeline
                  sx={{
                    [`& .${timelineItemClasses.root}:before`]: {
                      flex: 0,
                      padding: 0,
                    },
                  }}
                >
                  {trainStations.map((element, index) => (
                    <TimelineItem key={index}>{element}</TimelineItem>
                  ))}
                </Timeline>
              </Typography>
            </CardContent>
          </Card>
        </div>
      </Box>

      {progEle}
    </>
  )
}

export default TraTrain;
