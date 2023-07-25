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
import getTdxData from '../getTdxData';
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
  const [delayCheckBox, setDelayCheckBox] = React.useState(<></>)
  const [progress, setProgress] = React.useState(0);

  const [countdown, setCountdown] = React.useState(0)


  const [trainDataRes, setTrainDataRes] = React.useState()
  const [delayDataRes, setDelayDataRes] = React.useState()
  const [dataType, setDatatype] = React.useState()
  const [trainOnlineBool, setTrainOnlineBool] = React.useState(true)
  const [timerStopped, setTimsrStop] = React.useState(false)

  const arrivalCheckRef = React.useRef()
  const delayTimeCheckRef = React.useRef()

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
  // 将时间转换为分钟数的函数
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



  // 对时间进行加法计算
  function addMinutesToTime(time, minutesToAdd) {

    // 将时间转换为分钟数
    function timeToMinutes(time) {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    }

    // 将分钟数转换为时间格式
    function minutesToTime(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    const totalMinutes = timeToMinutes(time) + minutesToAdd;
    const normalizedMinutes = (totalMinutes + 24 * 60) % (24 * 60); // 处理跨夜情况
    return minutesToTime(normalizedMinutes);
  }




  // 将时间转换为分钟数
  function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // 将分钟数转换为时间格式
  function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  // 对时间进行加法计算
  function addMinutesToTime(time, minutesToAdd) {
    const totalMinutes = timeToMinutes(time) + minutesToAdd;
    const normalizedMinutes = (totalMinutes + 24 * 60) % (24 * 60); // 处理跨夜情况
    return minutesToTime(normalizedMinutes);
  }



  //畫時間線的part.
  function reRenderTimeLine(t, data) {
    console.log()
    var res = trainDataRes || data, stationTimeline = [], dataStruct;
    try {
      dataStruct = res[0].GeneralTimetable.StopTimes
    }
    catch (e) {
      dataStruct = res[0].StopTimes
    }



    for (let i = 0; i < dataStruct.length; i++) {
      var timecolor = "grey"
      if (calculateTimeDifference(dataStruct[i].ArrivalTime, dataStruct[i].DepartureTime) >= 3) {
        timecolor = "primary"
      }
      var time = [dataStruct[i].ArrivalTime, dataStruct[i].DepartureTime]
      try {
        if (delayTimeCheckRef.current.checked) {
          time[0] = <Typography sx={{display:'inline'}} color="red">{addMinutesToTime(time[0],delayDataRes.TrainLiveBoards[0].DelayTime)}</Typography>
          time[1] = <Typography sx={{display:'inline'}} color="red">{addMinutesToTime(time[1],delayDataRes.TrainLiveBoards[0].DelayTime)}</Typography>
        }
      } catch {

      }
      if (arrivalCheckRef.current.checked) {
        setDisplayArrivalTime("目前顯示抵達時間和發車時間")
        var newStation =
          i === dataStruct.length - 1 ?
            <>
              <TimelineOppositeContent color="textSecondary">
                抵達:{time[0]}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
              </TimelineSeparator>
              <TimelineContent>
                {dataStruct[i].StationName.Zh_tw} (終點)
              </TimelineContent>
            </>
            :
            <>
              <TimelineOppositeContent color="textSecondary" >
                <Typography>抵達:{time[0]}</Typography>
                <Typography>發車:{time[1]}</Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color={timecolor} />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>{dataStruct[i].StationName.Zh_tw}</TimelineContent>
            </>
        stationTimeline.push(newStation)
      } else {
        setDisplayArrivalTime("目前僅顯示發車時間")
        var newStation =
          i === dataStruct.length - 1 ?
            <>
              <TimelineOppositeContent color="textSecondary">
                {time[0]}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
              </TimelineSeparator>
              <TimelineContent>
                {dataStruct[i].StationName.Zh_tw} (終點)
              </TimelineContent>
            </>
            :
            <>
              <TimelineOppositeContent color="textSecondary" >
                <Typography>{time[1]}</Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color={timecolor} />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>{dataStruct[i].StationName.Zh_tw}</TimelineContent>
            </>
        stationTimeline.push(newStation)
      }

    }

    setTrainStations(stationTimeline)

  }



  //主要讀資料的part.
  function readTrainData() {
    if (!(trainDataRes && delayDataRes)) return;

    console.log(delayDataRes)
    var trainNum = UrlParam("q")

    var dataStruct = (dataType === "GeneralTimetable" ? trainDataRes[0].StopTimes : trainDataRes[0].StopTimes)
    setTrainPortStations(dataStruct.length)

    if (delayDataRes.TrainLiveBoards.length) {
      setTrainOnlineBool(isTimeInRange(getTime("time-s"), dataStruct[0].DepartureTime, addMinutesToTime(dataStruct[dataStruct.length - 1].ArrivalTime, delayDataRes.TrainLiveBoards[0].DelayTime)))
    }
    else {
      setTrainOnlineBool(isTimeInRange(getTime("time-s"), dataStruct[0].DepartureTime, (dataStruct[dataStruct.length - 1].ArrivalTime)))
    }
 

    var dataStruct2 = (dataType === "GeneralTimetable" ? trainDataRes[0].DailyTrainInfo : trainDataRes[0].DailyTrainInfo)

    console.log("das3", dataStruct2)

    var tripline, traintype;
    if (dataStruct2.TripLine === 1) {
      tripline = "經山線"
    }
    else if (dataStruct2[dataStruct2.TripLine] === 2) {
      tripline = "經海線"
    }
    else if (dataStruct2.TripLine === 3) {
      tripline = "經成追線"
    }
    if (String(dataStruct2.TrainTypeName.Zh_tw).includes("專開") || String(dataStruct2.TrainTypeName.Zh_tw).includes("郵輪式")) {
      traintype = "專車"
    }
    else if (String(dataStruct2.TrainTypeName.Zh_tw).includes("自強") && String(dataStruct2.TrainTypeName.Zh_tw).includes("(3000)")) {
      traintype = "新自強"
    }
    else if (String(dataStruct2.TrainTypeName.Zh_tw).includes("自強") && !String(dataStruct2.Zh_tw).includes("(3000)")) {
      traintype = "自強號"
    }

    else if (String(dataStruct2.TrainTypeName.Zh_tw).includes("莒光")) {
      traintype = "莒光號"
    }
    else if (String(dataStruct2.TrainTypeName.Zh_tw).includes("復興")) {
      traintype = "復興號"
    }
    else if (String(dataStruct2.TrainTypeName.Zh_tw).includes("區間") && !String(dataStruct2.TrainTypeName.Zh_tw).includes("快")) {
      traintype = "區間車"
    }
    else if (String(dataStruct2.TrainTypeName.Zh_tw).includes("區間") && String(dataStruct2.TrainTypeName.Zh_tw).includes("快")) {
      traintype = "區間快"
    }
    else {
      traintype = dataStruct2.TrainTypeName.Zh_tw
    }
    setTrainCardTitle(`${trainNum} 次 ${traintype}`)
    setTrainCardSubTitle(
      <><b>{tripline} {dataStruct2.StartingStationName.Zh_tw}<TrendingFlatIcon sx={{ verticalAlign: "bottom" }} />{dataStruct2.EndingStationName.Zh_tw}</b>
        {traintype === dataStruct2.TrainTypeName.Zh_tw ? "" : <><br /><b>車種: </b>{dataStruct2.TrainTypeName.Zh_tw}</>}
        <br /><b>說明: </b>{dataStruct2.Note.Zh_tw}<br />

        {dataStruct2.DailyFlag > 0 ? <Chip sx={{ m: 0.5 }} icon={<CalendarMonthIcon />} label="每日行駛" variant="outlined" /> : <></>}
        {dataStruct2.ServiceAddedFlag > 0 ? <Chip sx={{ m: 0.5 }} icon={<TodayIcon />} label="加班車" variant="outlined" /> : <></>}

        {dataStruct2.WheelchairFlag > 0 ? <Chip sx={{ m: 0.5 }} icon={<AccessibleIcon />} label="有身障座位" variant="outlined" /> : <></>}
        {dataStruct2.PackageServiceFlag > 0 ? <Chip sx={{ m: 0.5 }} icon={<WorkIcon />} label="有行李服務" variant="outlined" /> : <></>}
        {dataStruct2.DiningFlag > 0 ? <Chip sx={{ m: 0.5 }} icon={<DiningIcon />} label="有訂便當服務" variant="outlined" /> : <></>}
        {dataStruct2.BikeFlag > 0 ? <Chip sx={{ m: 0.5 }} icon={<PedalBikeIcon />} label="可載運自行車" variant="outlined" /> : <></>}
        {dataStruct2.BreastFeedingFlag > 0 ? <Chip sx={{ m: 0.5 }} label="有哺(集)乳室車廂" variant="outlined" /> : <></>}

      </>)
    setDisplayTrainNum(trainNum)
    setLoaded(true)

    //讀完卡片資料
    //接著換狀態


    if (delayDataRes.TrainLiveBoards.length) {
      if (isTimeInRange(getTime("time-s"), dataStruct[0].DepartureTime, addMinutesToTime(dataStruct[dataStruct.length - 1].ArrivalTime, delayDataRes.TrainLiveBoards[0].DelayTime))) {
        var liveInfo = "", alertBox = <></>

        if (delayDataRes.TrainLiveBoards[0].TrainStationStatus < 2) { //進站/站上 => 直接顯示
          liveInfo = "目前位於 " + delayDataRes.TrainLiveBoards[0].StationName.Zh_tw + "車站"
        } else {
          var nextStation = ""

          for (let i = 0; i < dataStruct.length; i++) { //抓下一個車站 (ex.台中到五權之間)
            if (dataStruct[i].StationName.Zh_tw === delayDataRes.TrainLiveBoards[0].StationName.Zh_tw) {
              nextStation = dataStruct[i + 1].StationName.Zh_tw
              break
            }
          }
          if (nextStation) {
            liveInfo = "目前位於" + delayDataRes.TrainLiveBoards[0].StationName.Zh_tw + "到" + nextStation + "之間"
          } else {
            liveInfo = "剛通過" + delayDataRes.TrainLiveBoards[0].StationName.Zh_tw + "車站"
          }
        }

        if (delayDataRes.TrainLiveBoards[0].DelayTime > 0) { //誤點
          alertBox = <Alert severity="error"><h3 style={{ margin: 0, padding: 0 }}>列車目前誤點 {delayDataRes.TrainLiveBoards[0].DelayTime}分</h3><Typography>{displayTrainNum} 次 {liveInfo}<br />最後更新:{getTime("time", delayDataRes.UpdateTime)}</Typography></Alert>
         // setDelayAlert(<Alert severity="warning"><h3 style={{ margin: 0, padding: 0 }}>資訊為準點時刻</h3>列車目前誤點 {delayDataRes.TrainLiveBoards[0].DelayTime}分</Alert>)
          setDelayCheckBox(<FormControlLabel control={<Checkbox inputRef={delayTimeCheckRef} />} label={`顯示誤點時間 (${delayDataRes.TrainLiveBoards[0].DelayTime}分)`} onChange={(e) => { reRenderTimeLine({ delaytime: e.target.checked }); }} />)

        } else if (delayDataRes.TrainLiveBoards[0].DelayTime <= 0) {//&& calculateTimeDifference(getTime("time-s"), dataStruct[0].DepartureTime) >= 0 && !isTimeInRange(getTime("time-s"), dataStruct[0].DepartureTime, dataStruct[dataStruct.length - 1].ArrivalTime)) {
          alertBox = <Alert severity="success"><h3 style={{ margin: 0, padding: 0 }}>列車目前準點</h3><Typography>{displayTrainNum} 次 {liveInfo}<br />最後更新:{getTime("time", delayDataRes.UpdateTime)}</Typography></Alert>
          setDelayAlert(<></>)
          setDelayCheckBox(<></>)
        }
        setTrainCardBody(alertBox)
      } else {
        var timeDiff = [
          calculateTimeDifference(getTime("time-s"), dataStruct[dataStruct.length - 1].ArrivalTime),
          calculateTimeDifference(getTime("time-s"), dataStruct[0].DepartureTime)
        ]
        if (delayDataRes.TrainLiveBoards.length) {
          timeDiff[1] = isTimeInRange(getTime("time-s"), dataStruct[0].DepartureTime, addMinutesToTime(dataStruct[dataStruct.length - 1].ArrivalTime, delayDataRes.TrainLiveBoards[0].DelayTime))
        }
        if (dataType === "DailyTimetable" && dataStruct2.OverNightStationID !== "" && dataStruct2.OverNightStationID !== undefined) { //跨夜前的跨夜車
          console.log(dataStruct2.OverNightStationID)
          timeDiff[0] = calculateTimeDifference(getTime("time-s"), "24:00")
          console.log("A")
        } else {
          if (delayDataRes.TrainLiveBoards.length) {
            timeDiff[1] = isTimeInRange(getTime("time-s"), "24:00", addMinutesToTime(dataStruct[dataStruct.length - 1].ArrivalTime, delayDataRes.TrainLiveBoards[0].DelayTime))
          } else {
            timeDiff[1] = isTimeInRange(getTime("time-s"), "00:00", addMinutesToTime(dataStruct[dataStruct.length - 1].ArrivalTime, delayDataRes.TrainLiveBoards[0].DelayTime))
          }
        }

        console.log(timeDiff)
        setTrainCardBody(
          timeDiff[0] <= 0 && !isTimeInRange(getTime("time-s"), dataStruct[0].DepartureTime, dataStruct[dataStruct.length - 1].ArrivalTime)
            ? <Alert severity="info"><h3 style={{ margin: 0, padding: 0 }}>列車已經收班</h3><Typography>{displayTrainNum} 次已經於<b>{dataStruct[dataStruct.length - 1].ArrivalTime}</b>抵達終點<b>{dataStruct[dataStruct.length - 1].StationName.Zh_tw}</b></Typography></Alert>
            :
            timeDiff[1] >= 0 && !isTimeInRange(getTime("time-s"), dataStruct[0].DepartureTime, dataStruct[dataStruct.length - 1].ArrivalTime)
              ? <Alert severity="info"><h3 style={{ margin: 0, padding: 0 }}>列車尚未發車</h3><Typography>{displayTrainNum} 次預計於<b>{dataStruct[0].DepartureTime}</b>從<b>{dataStruct[0].StationName.Zh_tw}</b>發車</Typography></Alert>
              :
              ""
        )
      }


    } else {
      setTrainCardBody(
        calculateTimeDifference(getTime("time-s"), dataStruct[dataStruct.length - 1].ArrivalTime) <= 0
          ? <Alert severity="info"><h3 style={{ margin: 0, padding: 0 }}>列車已經收班</h3><Typography>{displayTrainNum} 次已經於<b>{dataStruct[dataStruct.length - 1].ArrivalTime}</b>抵達終點<b>{dataStruct[dataStruct.length - 1].StationName.Zh_tw}</b></Typography></Alert>
          :
          calculateTimeDifference(getTime("time-s"), dataStruct[0].DepartureTime) >= 0
            ? <Alert severity="info"><h3 style={{ margin: 0, padding: 0 }}>列車尚未發車</h3><Typography>{displayTrainNum} 次預計於<b>{dataStruct[0].DepartureTime}</b>從<b>{dataStruct[0].StationName.Zh_tw}</b>發車</Typography></Alert>
            :
            ""
      )
      setTrainOnlineBool(false)
    }

    reRenderTimeLine(true, trainDataRes)
  }





  //抓資料的part . first.time
  React.useEffect(() => {
    var trainNum = UrlParam("q")
    if (!trainNum) {
      setTrainCardTitle("找不到列車")
      setTrainCardSubTitle("無資料")
      setTrainCardBody("請檢查搜尋條件")
      setTrainOnlineBool(false)
    }
    else {
      setDisplayTrainNum(trainNum)

      getTdxData(`https://tdx.transportdata.tw/api/basic/v2/Rail/TRA/DailyTimetable/Today/TrainNo/${trainNum}?%24format=JSON`, function (res) {
        if (res.length) {
          setDatatype("DailyTimetable")
          setTrainDataRes(res)
          setCountdown(60)
        } else {
          var today = new Date();
          var yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);

          // 获取昨天的年、月、日
          var year = yesterday.getFullYear();
          var month = yesterday.getMonth() + 1; // 月份从0开始，所以要加1
          var day = yesterday.getDate();

          // 格式化输出昨天的日期（可根据需要自行调整格式）
          var formattedYesterday = year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);


          getTdxData(`https://tdx.transportdata.tw/api/basic/v2/Rail/TRA/DailyTimetable/TrainNo/${trainNum}/TrainDate/${formattedYesterday}?%24format=JSON`, function (res) {
            if (res.length) {
              setDatatype("GeneralTimetable")
              setTrainDataRes(res)
              setCountdown(60)
            } else {
              setTrainCardTitle("找不到列車")
              setTrainCardSubTitle("無資料")
              setTrainCardBody("請檢查搜尋條件")
              setTrainOnlineBool(false)
            }
          }, { useLocalCatch: false })
        }
      }, {
        useLocalCatch: false,
      })
    }
  }, [])





  React.useEffect(() => {
    readTrainData()
    // 设置每隔1秒更新一次倒计时

    const intervalId = setInterval(() => {

      console.log(trainOnlineBool)
      if (!trainOnlineBool) {
        setCountdown(-1)
        clearInterval(intervalId);
      }
      else if (trainOnlineBool && !timerStopped) {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }
    }, 1000);

    // 组件卸载时清除定时器
    return () => {
      clearInterval(intervalId);
    };
  }, [trainOnlineBool, timerStopped]);
  React.useEffect(() => {
    if (countdown === 0) {
      getTdxData(`https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/TrainLiveBoard/TrainNo/${displayTrainNum}?%24format=JSON`, function (res) {
        setDelayDataRes(res)
      }, { useLocalCatch: false })
      setCountdown(60)
    } else if (countdown > 0) {
      setProgress((60 - countdown) * (100 / 60))
    } else {

    }
  }, [countdown]);


  React.useEffect(() => {
    readTrainData()

  }, [trainDataRes, delayDataRes])









  return (
    <>
      <TopBar title={`台鐵 ${displayTrainNum}次`} />
      <Box sx={{ p: 3, m: 0, zIndex: 0 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #004da7, #7fa9d9)" }} variant='div' ></Typography>
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
                <FormControlLabel control={<Checkbox defaultChecked disabled={!loaded} inputRef={arrivalCheckRef} />} label="顯示抵達時間" onChange={(e) => { reRenderTimeLine({ arrivalTime: e.target.checked }); }} />
                {delayCheckBox}
              </FormGroup>

              <Typography component="div">
                <Alert severity="info"><h3 style={{ margin: 0, padding: 0 }}>說明</h3>
                  <Typography hidden={!loaded}>{displayArrivalTime}</Typography>
                  <Typography><TimelineDot color="primary" sx={{ m: 0 }} style={{ display: "inline-block", verticalAlign: "buttom" }} />&nbsp;表示停車時間超過三分鐘</Typography>
                </Alert>
                <p></p>
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

      <AppBar position="fixed" color="secondary" sx={{ top: 'auto', bottom: 0, height: 'auto', display: (countdown < 0 ? "none" : "unset") }} >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <BoltIcon sx={{ verticalAlign: 'middle' }} /> 台鐵車次資料 / {countdown}秒
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

export default TraTrain;
