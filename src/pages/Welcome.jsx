import * as React from 'react'
import TopBar from '../TopBar'
import { Box, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import getData from '../getData'
import LinearProgressWithLabel from '@mui/material/LinearProgress';

export function Welcome({ next, title }) {
    const allItem = [
        "https://tdx.transportdata.tw/api/basic/v2/Rail/TRA/Station?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Rail/THSR/Station?%24format=JSON",
        "https://tdx.transportdata.tw/api/basic/v2/Basic/City?%24format=JSON"
    ]
    var item = 0
    var [summery, setSummery] = React.useState("")
    const linkBtn = React.useRef()

    const CURRENT_VER = "1.0.0"

    React.useEffect(() => {
        if (linkBtn.current) {


            if (!localStorage.getItem("ver")) {
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
                            linkBtn.current.click()

                        }
                    }, {
                        useLocalCatch: true,
                    })
                }
            } else {
                setSummery("資料更新完畢")

                item = allItem.length
                localStorage.setItem("ver", CURRENT_VER)
                linkBtn.current.click()
            }
        }
    }, [linkBtn])

    return (
        <>
            <TopBar title={"更新資料集"} />
            <Box sx={{ p: 3 }}>
                {summery}
                <p>
                    <LinearProgressWithLabel value={(item / allItem.length) * 100} sx={{ display: (item + 1 >= allItem.length ? "block" : "none") }} />
                </p>
                <p></p>
                <Button ref={linkBtn} disabled={summery !== "資料更新完畢"} variant='contained' onClick={() => window.location.reload()}>繼續使用系統</Button>
            </Box>
        </>
    )
} 