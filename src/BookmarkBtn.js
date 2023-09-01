import * as React from 'react'
import { Checkbox } from '@mui/material'
import { bookmarkSetting } from './bookmarkSetting'
import { BookmarkBorder, Bookmark } from '@mui/icons-material'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';

export default function BookmarkBtn({ sx, url, title, disabled, icon }) {
    function handleChange(e) {
        console.log(e.target.checked)
        if (checked) {//沒有寫反(應該 XD)
            bookmarkSetting("delete", { url: url, title: title, icon: icon })
        } else {
            bookmarkSetting("add", { url: url, title: title, icon: icon })
        }
        setChecked(!checked)
    }
    React.useEffect(() => {
        setChecked(bookmarkSetting("check", { url: url, title: title, icon: icon }))
    }, [title])
    const [checked, setChecked] = React.useState(bookmarkSetting("check", { url: url, title: title, icon: icon }))
    return (
        <>
            <Box sx={sx} >
                <Checkbox
                    sx={{ m: 0, p: 0, verticalAlign: "text-bottom" }}
                    checked={checked}
                    disabled={disabled}
                    inputProps={{ 'aria-label': '新增或刪除書籤' }}
                    icon={<BookmarkBorder />}
                    checkedIcon={<BookmarkAddedIcon />}
                    onChange={(e) => {
                        handleChange(e)
                    }}
                />
            </Box>
        </>
    )
}