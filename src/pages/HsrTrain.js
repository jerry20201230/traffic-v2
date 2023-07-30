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

function HsrTrain() {
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
                    time[0] = <Typography variant='span' sx={{ display: 'inline' }} color="red">{addMinutesToTime(time[0], delayDataRes.TrainLiveBoards[0].DelayTime)}</Typography>
                    time[1] = <Typography variant='span' sx={{ display: 'inline' }} color="red">{addMinutesToTime(time[1], delayDataRes.TrainLiveBoards[0].DelayTime)}</Typography>
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
                            <TimelineContent color="textSecondary">
                                <Link to={`/hsr/station/?q=${dataStruct[i].StationID}`} style={{ color: "currentcolor" }}>{dataStruct[i].StationName.Zh_tw} (終點)</Link>
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
                            <TimelineContent color="textSecondary">
                                <Link to={`/hsr/station/?q=${dataStruct[i].StationID}`} style={{ color: "currentcolor" }}>{dataStruct[i].StationName.Zh_tw}</Link>
                            </TimelineContent>
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
                            <TimelineContent color="textSecondary">
                                <Link to={`/hsr/station/?q=${dataStruct[i].StationID}`} style={{ color: "currentcolor" }}>{dataStruct[i].StationName.Zh_tw} (終點)</Link>
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
                            <TimelineContent color="textSecondary">
                                <Link to={`/hsr/station/?q=${dataStruct[i].StationID}`} style={{ color: "currentcolor" }}>{dataStruct[i].StationName.Zh_tw}</Link>
                            </TimelineContent>
                        </>
                stationTimeline.push(newStation)
            }

        }

        setTrainStations(stationTimeline)

    }



    //主要讀資料的part.
    function readTrainData() {

        if (!(trainDataRes)) return;
        console.log("parse")
        console.log(delayDataRes)
        var trainNum = UrlParam("q")

        var dataStruct = (dataType === "GeneralTimetable" ? trainDataRes[0].StopTimes : trainDataRes[0].StopTimes)
        setTrainPortStations(dataStruct.length)

        var dataStruct2 = (dataType === "GeneralTimetable" ? trainDataRes[0].DailyTrainInfo : trainDataRes[0].DailyTrainInfo)

        console.log("das3", dataStruct2)

        setTrainCardTitle(`${trainNum} 次 高鐵列車`)
        setTrainCardSubTitle(<>{dataStruct2.Direction === 1 ? "北上列車" : "南下列車"} / 往<Link to={`/hsr/station?q=${dataStruct2.EndingStationID}`} style={{ color: "currentcolor" }}>{dataStruct2.EndingStationName.Zh_tw}</Link></>)
        /*  setTrainCardSubTitle(
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
      
            </>)*/
        setDisplayTrainNum(trainNum)
        setLoaded(true)

        //讀完卡片資料
        //接著換狀態



        reRenderTimeLine(true, trainDataRes)
    }





    //抓資料的part . first.time
    React.useEffect(() => {
        var trainNum = UrlParam("q").length<4?"0"+UrlParam("q"):UrlParam("q")
        if (!trainNum) {
            setTrainCardTitle("找不到列車")
            setTrainCardSubTitle("無資料")
            setTrainCardBody("請檢查搜尋條件")
            setTrainOnlineBool(false)
        }
        else {
            setDisplayTrainNum(trainNum)

            getData(`https://tdx.transportdata.tw/api/basic/v2/Rail/THSR/DailyTimetable/Today/TrainNo/${trainNum}?%24format=JSON`, function (res) {
                if (res.length) {
                    setDatatype("DailyTimetable")
                    setTrainDataRes(res)
                    setCountdown(-1)
                } else {
                    setTrainCardTitle("找不到列車")
                    setTrainCardSubTitle("無資料")
                    setTrainCardBody("請檢查搜尋條件")
                    setTrainOnlineBool(false)
                }
            }, {
                useLocalCatch: false,
            })
        }
    }, [])




    React.useEffect(() => {
        readTrainData()

    }, [trainDataRes, delayDataRes])









    return (
        <>
            <TopBar title={`高鐵 ${displayTrainNum}次`} />
            <Box sx={{ p: 3, m: 0, zIndex: 0 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            <Typography sx={{ mr: 1, display: "inline-block", width: "1.5rem", height: "1.5rem", borderRadius: "5px", verticalAlign: "text-top", background: "linear-gradient(315deg, #ca4f0f, #f89867)" }} variant='div' ></Typography>
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
                <p></p>
                <Card>

                </Card>
            </Box>
        </>
    )
}

export default HsrTrain;
