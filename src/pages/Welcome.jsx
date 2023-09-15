import * as React from 'react'
import TopBar from '../TopBar'
import { Box, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import getData from '../getData'
import LinearProgressWithLabel from '@mui/material/LinearProgress';

export function Welcome({ next, title, CURRENT_VER }) {
    var allItem = [
        //city//
        "https://tdx.transportdata.tw/api/basic/v2/Basic/City?%24format=JSON",
        //TRA//
        "https://tdx.transportdata.tw/api/basic/v2/Rail/TRA/Station?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/LineTransfer?%24format=JSON",
        //HSR//
        "https://tdx.transportdata.tw/api/basic/v2/Rail/THSR/Station?%24format=JSON",
        //bus//
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/Taipei?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/Taichung?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/Keelung?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/Tainan?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/Kaohsiung?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/NewTaipei?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/YilanCounty?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/Taoyuan?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/Chiayi?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/HsinchuCounty?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/MiaoliCounty?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/NantouCounty?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/ChanghuaCounty?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/Hsinchu?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/YunlinCounty?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/ChiayiCounty?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/PingtungCounty?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/HualienCounty?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/TaitungCounty?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/KinmenCounty?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/PenghuCounty?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/LienchiangCounty?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Bus/Route/InterCity?%24format=JSON",



    ]
    var item = 0
    var [summery, setSummery] = React.useState("正在準備更新...")
    React.useEffect(() => {

        for (let i = 0; i < allItem.length; i++) {
            console.log(i)
            setSummery(`正在更新第 ${item + 1} 項資料，共 ${allItem.length} 項`)
            getData(allItem[i], function (res) {
                item += 1
                console.log("ITEM", item, (item / allItem.length) * 100)
                if (item + 1 < allItem.length) {
                    setSummery(`第 ${item} 項資料更新成功，共 ${allItem.length} 項`)
                }
                else {
                    setSummery("資料更新完畢")
                    localStorage.setItem("ver", CURRENT_VER)
                    //  linkBtn.current.click()
                    window.location.reload()
                }

            }, {
                useLocalCatch: true,
            })
        }

    }, [])

    return (
        <>
            <TopBar title={"更新資料集"} />
            <Box sx={{ p: 3 }}>
                {summery}
                <p>
                    <LinearProgressWithLabel value={(item / allItem.length) * 100} />
                </p>

            </Box>
        </>
    )
} 