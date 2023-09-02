import * as React from 'react'
import TopBar from '../TopBar'
import Grid from '@mui/material/Unstable_Grid2';
import { NativeSelect, Box, InputLabel, FormControl, Paper } from '@mui/material'
import getData from '../getData'
import SearchAnything from '../searchAnything'
import { styled } from '@mui/material/styles';
import BackspaceIcon from '@mui/icons-material/Backspace';
import SearchIcon from '@mui/icons-material/Search';

export function BusRoot() {
    const citySelect = React.useRef()
    const [searchCity, setSearchCity] = React.useState("選擇縣市")
    const [tempSearchCity, setTempSearchCity] = React.useState("選擇縣市")
    const [inputVal, setInputVal] = React.useState("")
    const [currentCity, setCurrentCityList] = React.useState([])
    const [dialogOpen, setDialogOpen] = React.useState(false)
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
        <Box sx={{ position: "fixed", bottom: "0", p: 2, textAlign: "center" }}>

            <Grid container spacing={2}>
                <Grid xs={4}><Item sx={{ fontSize: "1em" }}>1</Item></Grid>
                <Grid xs={4}><Item sx={{ fontSize: "1em" }}>2</Item></Grid>
                <Grid xs={4}><Item sx={{ fontSize: "1em" }}>3</Item></Grid>
                <Grid xs={4}><Item sx={{ fontSize: "1em" }}>4</Item></Grid>
                <Grid xs={4}><Item sx={{ fontSize: "1em" }}>5</Item></Grid>
                <Grid xs={4}><Item sx={{ fontSize: "1em" }}>6</Item></Grid>
                <Grid xs={4}><Item sx={{ fontSize: "1em" }}>7</Item></Grid>
                <Grid xs={4}><Item sx={{ fontSize: "1em" }}>8</Item></Grid>
                <Grid xs={4}><Item sx={{ fontSize: "1em" }}>9</Item></Grid>
                <Grid xs={4}><Item sx={{ fontSize: "1em" }}>0</Item></Grid>
                <Grid xs={4}><Item><BackspaceIcon sx={{ verticalAlign: "bottom", fontSize: "1.4rem" }} /></Item></Grid>
                <Grid xs={4}><Item><SearchIcon sx={{ verticalAlign: "bottom", fontSize: "1.4rem" }} /></Item></Grid>
            </Grid>

        </Box>
    </>
    )
}