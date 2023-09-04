import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CircularProgress, TextField, Divider } from '@mui/material'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import getData from './getData';

export default function LinearStepper() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const [radio1Value, setRadio1Value] = React.useState('navLoc');
    const [radio2Value, setRadio2Value] = React.useState('fromMap');

    const [latlng1, setlatlng1] = React.useState([25.047632717526668, 121.51753494171209])
    const [latlng2, setlatlng2] = React.useState([25.047632717526668, 121.51753494171209])

    const [place1, setPlace1] = React.useState("")
    const [place2, setPlace2] = React.useState("")

    const map1 = React.useRef()
    const map2 = React.useRef()

    const [userLocStatus, setUserLocStatus] = React.useState(<Button variant='contained'>開啟定位</Button>)
    const [userLoc, setUserLoc] = React.useState([])
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
        } else {
            setUserLocStatus(<>
                <Typography color="red">定位資訊無法使用 (裝置不支援)</Typography>
            </>)
        }

        function successFunction(loc) {
            setUserLocStatus(<Typography>資料驗證中...</Typography>)
            console.log(loc)
            getData(
                `https://tdx.transportdata.tw/api/advanced/V3/Map/GeoLocating/Address/LocationX/${loc.coords.longitude}/LocationY/${loc.coords.latitude}?%24format=JSON`,
                (res) => {

                    setPlace1(res[0].Address)

                    setUserLocStatus(<>{res[0].Address}<br /><Button variant='contained' onClick={() => { setPlace1(res[0].Address); setlatlng1([loc.coords.latitude, loc.coords.longitude]) }}>使用這個地址</Button></>)
                    setlatlng1([loc.coords.latitude, loc.coords.longitude])
                }, { useLocalCatch: false })
        }

        function errorFunction() {
            setUserLocStatus(<>
                <Typography color="red">無法使用你的定位</Typography>
            </>)
        }
    }

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const redIcon = new L.Icon({
        iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    const steps = ['設定起點', '設定終點'];


    React.useEffect(() => {
        getLocation()
    }, [])

    const MapEvents = ({ map, id }) => {
        useMapEvents({
            click(e) {
                // setState your coords here
                // coords exist in "e.latlng.lat" and "e.latlng.lng"
                var loc = [e.latlng.lat, e.latlng.lng]

                let marker = L.marker(loc, { icon: redIcon }).addTo(map.current);

                marker.bindPopup("資料讀取中...")
                map.current.flyTo(loc, 18)

                marker.addEventListener("click", (e) => { console.log(e) })
                getData(
                    `https://tdx.transportdata.tw/api/advanced/V3/Map/GeoLocating/Address/LocationX/${loc[1]}/LocationY/${loc[0]}?%24format=JSON`,
                    (res) => {

                        marker.bindPopup(res[0].Address)
                        if (id === "1") {
                            setPlace1(res[0].Address)
                            setlatlng1(loc)
                        } else if (id === "2") {
                            setPlace2(res[0].Address)
                            setlatlng2(loc)
                        }
                    }, { useLocalCatch: false })

            }
        })
        return false;
    };



    var stepBody = [
        <>
            {place1 ? place1 : "地址會顯示在這裡"}
            <Divider />
            <FormControl>
                <RadioGroup
                    row
                    name="row-radio-buttons-group-1"
                    value={radio1Value}
                    onChange={(e) => setRadio1Value(e.target.value)}
                >
                    <FormControlLabel value="navLoc" control={<Radio />} label="使用定位" />
                    <FormControlLabel value="fromMap" control={<Radio />} label="從地圖選擇" />
                    <FormControlLabel value="typeIn" control={<Radio />} label="輸入地址" />
                </RadioGroup>
            </FormControl>
            <div hidden={radio1Value !== "navLoc"}>你的定位:<br />
                {userLocStatus}
            </div>
            <div hidden={radio1Value !== "fromMap"}>
                請點擊地圖
                {radio1Value !== "fromMap" ? <></> : <MapContainer
                    ref={map1}
                    dragging={!L.Browser.mobile}
                    scrollWheelZoom={false}
                    center={latlng1}
                    zoom={16}
                    style={{ width: "100%", height: "50vh" }}
                >
                    <TileLayer
                        attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors${L.Browser.mobile ? "<br/>使用兩指移動與縮放地圖" : ""}`}
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapEvents map={map1} id="1" />

                </MapContainer>}
            </div>
            <div hidden={radio1Value !== "typeIn"}><TextField value={place1} onInput={(e) => { setPlace1(e.target.value) }} placeholder='輸入地址或經緯度' /></div>
        </>,
        <>
            {place2 ? place2 : "地址會顯示在這裡"}
            <Divider />
            <FormControl>
                <RadioGroup
                    row
                    name="row-radio-buttons-group-2"
                    value={radio2Value}
                    onChange={(e) => setRadio2Value(e.target.value)}
                >
                    <FormControlLabel value="fromMap" control={<Radio />} label="從地圖選擇" />
                    <FormControlLabel value="typeIn" control={<Radio />} label="輸入地址" />
                </RadioGroup>
            </FormControl>
            <div hidden={radio2Value !== "fromMap"}>
                請點擊地圖
                {radio2Value !== "fromMap" ? <></> : <MapContainer
                    ref={map2}
                    dragging={!L.Browser.mobile}
                    scrollWheelZoom={false}
                    center={latlng2}
                    zoom={16}
                    style={{ width: "100%", height: "50vh" }}
                >
                    <TileLayer
                        attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors${L.Browser.mobile ? "<br/>使用兩指移動與縮放地圖" : ""}`}
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapEvents map={map2} id="2" />

                </MapContainer>}
            </div>
            <div hidden={radio2Value !== "typeIn"}><TextField value={place2} onInput={(e) => { setPlace2(e.target.value) }} placeholder='輸入地址或經緯度' /></div>

        </>]






    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <Typography sx={{ mt: 2, mb: 1, p: 1, textAlign: "center" }} component="div"><CircularProgress /><br />
                    正在規劃路線
                    <br />
                    起點: {place1}<br />
                    終點: {place2}
                    <p><Button variant='contained' color="secondary" onClick={() => window.location.reload()}>重試</Button></p></Typography>
            ) : (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1, p: 1, height: "100%" }} component="div" >
                        {stepBody[activeStep]}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            上一步
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleNext}
                            disabled={
                                activeStep === 0 && place1 === "" || activeStep === 1 && place2 === ""
                            }>
                            {activeStep === steps.length - 1 ? '開始規劃路線' : (activeStep === 0 && place1 === "" || activeStep === 1 && place2 === "" ? "請選擇地點" : "下一步")}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    );
}