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
import { red, yellow, blue, green, brown, orange } from '@mui/material/colors';

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
    const [keyWordInputReadonly, setKeyWordInputReadonly] = React.useState(true)


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


    return (<>
        <TopBar title="公車" />
        <Box sx={{ p: 3 }}>
            <h1>歡迎使用公車資料</h1>
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
            <p></p>
            <TextField inputRef={busKeywordRef} variant="standard" onInput={(e) => setKeyWord(e.target.value)} value={keyWord} inputProps={{ readOnly: keyWordInputReadonly, }} fullWidth placeholder={radioValue === "route" ? "輸入路線名稱" : "輸入站牌名稱"} />
        </Box>
        <Box sx={{ position: "fixed", bottom: "0", textAlign: "center", width: "100%", userSelect: "none", display: "flex", pr: 0 }}>
            <Grid container spacing={2} sx={{ display: (radioValue === "route" ? "flex" : "none"), p: 2, maxWidth: "40%" }}>
                <Grid xs={6}><Item component={Button} color={"inherit"} className='btn' sx={{ fontSize: "1em", width: "100%", backgroundColor: red[500] }} onClick={() => { setKeyWord(keyWord + "紅") }}>紅</Item></Grid>
                <Grid xs={6}><Item component={Button} className='btn' sx={{ fontSize: "1em", width: "100%" }} onClick={() => { setKeyWord(keyWord + "黃") }}>黃</Item></Grid>
                <Grid xs={6}><Item component={Button} className='btn' sx={{ fontSize: "1em", width: "100%", }} onClick={() => { setKeyWord(keyWord + "藍") }}>藍</Item></Grid>
                <Grid xs={6}><Item component={Button} className='btn' sx={{ fontSize: "1em", width: "100%", }} onClick={() => { setKeyWord(keyWord + "綠") }}>綠</Item></Grid>
                <Grid xs={6}><Item component={Button} className='btn' sx={{ fontSize: "1em", width: "100%", }} onClick={() => { setKeyWord(keyWord + "橘") }}>橘</Item></Grid>
                <Grid xs={6}><Item component={Button} className='btn' sx={{ fontSize: "1em", width: "100%", }} onClick={() => { setKeyWord(keyWord + "棕") }}>棕</Item></Grid>
                <Grid xs={6}><Item component={Button} className='btn' sx={{ width: "100%" }} onClick={() => { setKeyWordInputReadonly(!keyWordInputReadonly); if (keyWordInputReadonly) { busKeywordRef.current.focus(); busKeywordRef.current.click() } }}><KeyboardIcon sx={{ verticalAlign: "bottom", fontSize: "1.4rem" }} color={(keyWordInputReadonly ? "inherit" : "primary")} /></Item></Grid>
                <Grid xs={6}><Item component={Button} className='btn' sx={{ fontSize: "1em", width: "100%" }} onClick={() => { setKeyWord(keyWord + "小") }}>小</Item></Grid>
            </Grid>
            <Grid container spacing={2} sx={{ display: (radioValue === "route" ? "flex" : "none"), p: 2, pl: 0 }}>
                <Grid xs={4}><Item component={Button} className='btn' sx={{ fontSize: "1em", width: "100%" }} onClick={() => { setKeyWord(keyWord + "1") }}>1</Item></Grid>
                <Grid xs={4}><Item component={Button} className='btn' sx={{ fontSize: "1em", width: "100%" }} onClick={() => { setKeyWord(keyWord + "2") }}>2</Item></Grid>
                <Grid xs={4}><Item component={Button} className='btn' sx={{ fontSize: "1em", width: "100%" }} onClick={() => { setKeyWord(keyWord + "3") }}>3</Item></Grid>
                <Grid xs={4}><Item component={Button} className='btn' sx={{ fontSize: "1em", width: "100%" }} onClick={() => { setKeyWord(keyWord + "4") }}>4</Item></Grid>
                <Grid xs={4}><Item component={Button} className='btn' sx={{ fontSize: "1em", width: "100%" }} onClick={() => { setKeyWord(keyWord + "5") }}>5</Item></Grid>
                <Grid xs={4}><Item component={Button} className='btn' sx={{ fontSize: "1em", width: "100%" }} onClick={() => { setKeyWord(keyWord + "6") }}>6</Item></Grid>
                <Grid xs={4}><Item component={Button} className='btn' sx={{ fontSize: "1em", width: "100%" }} onClick={() => { setKeyWord(keyWord + "7") }}>7</Item></Grid>
                <Grid xs={4}><Item component={Button} className='btn' sx={{ fontSize: "1em", width: "100%" }} onClick={() => { setKeyWord(keyWord + "8") }}>8</Item></Grid>
                <Grid xs={4}><Item component={Button} className='btn' sx={{ fontSize: "1em", width: "100%" }} onClick={() => { setKeyWord(keyWord + "9") }}>9</Item></Grid>
                <Grid xs={4}><Item component={Button} className='btn' sx={{ fontSize: "1em", width: "100%" }} onClick={() => { setKeyWord(keyWord + "0") }}>0</Item></Grid>
                <Grid xs={4}><Item component={Button} className='btn' sx={{ width: "100%" }} onClick={() => { setKeyWord(keyWord.slice(0, -1)) }}><BackspaceIcon sx={{ verticalAlign: "bottom", fontSize: "1.4rem" }} /></Item></Grid>
                <Grid xs={4}><Item component={Button} className='btn' sx={{ width: "100%" }}><SearchIcon sx={{ verticalAlign: "bottom", fontSize: "1.4rem" }} /></Item></Grid>
            </Grid>

        </Box>
    </>
    )
}