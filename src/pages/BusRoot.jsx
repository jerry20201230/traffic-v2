import * as React from 'react'
import TopBar from '../TopBar'
import { NativeSelect, Box, InputLabel, FormControl } from '@mui/material'
import getData from '../getData'
import SearchAnything from '../searchAnything'


export function BusRoot() {
    const citySelect = React.useRef()
    const [searchCity, setSearchCity] = React.useState("選擇縣市")
    const [tempSearchCity, setTempSearchCity] = React.useState("選擇縣市")
    const [inputVal, setInputVal] = React.useState("")
    const [currentCity, setCurrentCityList] = React.useState([])
    const [dialogOpen, setDialogOpen] = React.useState(false)


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
    </>
    )
}