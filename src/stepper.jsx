import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CircularProgress, TextField } from '@mui/material'
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



    const MapEvents = () => {
        useMapEvents({
            click(e) {
                // setState your coords here
                // coords exist in "e.latlng.lat" and "e.latlng.lng"
                var loc = [e.latlng.lat, e.latlng.lng]


                let marker = L.marker(loc, { icon: redIcon }).addTo(map1.current);

                marker.bindPopup("資料讀取中...")
                map1.current.flyTo(loc, 16)

                marker.addEventListener("click", (e) => { console.log(e) })
                getData(
                    `https://tdx.transportdata.tw/api/advanced/V3/Map/GeoLocating/Address/LocationX/${loc[1]}/LocationY/${loc[0]}?%24format=JSON`,
                    (res) => {

                        marker.bindPopup(res[0].Address)
                        setPlace1(res[0].Address)
                    }, { useLocalCatch: false })

            }
        })
        return false;
    };



    var stepBody = [
        <>
            {place1}<p></p>
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
            <div hidden={radio1Value !== "navLoc"}>你的定位:</div>
            <div hidden={radio1Value !== "fromMap"}>
                請點擊地圖
                {radio1Value !== "fromMap" ? <></> : <MapContainer
                    ref={map1}
                    dragging={!L.Browser.mobile}
                    scrollWheelZoom={false}
                    center={latlng1}
                    zoom={7}
                    style={{ width: "100%", height: "50vh" }}
                >
                    <TileLayer
                        attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors${L.Browser.mobile ? "<br/>使用兩指移動與縮放地圖" : ""}`}
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapEvents />

                </MapContainer>}
            </div>
            <div hidden={radio1Value !== "typeIn"}><TextField onInput={(e) => { setPlace1(e.target.value) }} placeholder='輸入地址或經緯度' /></div>
        </>,
        <>
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
                <Typography sx={{ mt: 2, mb: 1, p: 1, textAlign: "center" }} component="div"><CircularProgress /><br />正在規劃路線<p><Button variant='contained' color="secondary" onClick={() => window.location.reload()}>重試</Button></p></Typography>
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
                        <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? '開始規劃路線' : '下一步'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    );
}