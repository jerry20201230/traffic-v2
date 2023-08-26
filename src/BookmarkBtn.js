import * as React from 'react'
import { Checkbox } from '@mui/material'
import { bookmarkSetting } from './bookmarkSetting'
import { BookmarkBorder, Bookmark } from '@mui/icons-material'
import dayjs from 'dayjs'
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';

export default function BookmarkBtn({ sx, url, title, disabled }) {
    function handleChange(e) {
        console.log(e.target.checked)
        if (checked) {//沒有寫反(應該 XD)
            bookmarkSetting("delete", { url: url, title: title })
        } else {
            bookmarkSetting("add", { url: url, title: title })
        }
        setChecked(!checked)
    }
    React.useEffect(() => {
        setChecked(bookmarkSetting("check", { url: url, title: title }))
    }, [title])
    const [checked, setChecked] = React.useState(bookmarkSetting("check", { url: url, title: title }))
    return (
        <>
            <Checkbox
                checked={checked}
                disabled={disabled}
                sx={sx}
                inputProps={{ 'aria-label': '新增或刪除書籤' }}
                icon={<BookmarkBorder />}
                checkedIcon={<BookmarkAddedIcon />}
                onChange={(e) => {
                    handleChange(e)
                }}
            />
        </>
    )
}