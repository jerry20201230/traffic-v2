import * as React from 'react'
import TopBar from '../src/TopBar';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Err404 from './pages/Error404';

export default function GoToLocation(prop) {
    function UrlParam(name) {
        var url = new URL(window.location.href),
            result = url.searchParams.get(name);
        return result
    }
    var theLoc = (window.location.pathname.replace("/route/to", "") + window.location.search)
    const linkRef = React.useRef(null)
    const [message, setMessage] = React.useState(<></>)
    React.useEffect(() => {
        //     if (linkRef.current) {
        //        linkRef.current.click()
        //    }
        console.log(window.location.origin + theLoc)
        setMessage(<Box sx={{ p: 3 }}>正在將你重新導向到 {theLoc}<br />如果沒有自動導向，請<Link to={theLoc} ref={linkRef}>按這裡</Link></Box>)
        if (theLoc.includes("route")) {
            setMessage(<Err404 noHeader={true} />)
        } else {
            window.location.href = window.location.origin + theLoc
        }
    }, [])
    return (
        <>
            <TopBar title="正在重新導向" />

            {message}

        </>
    )
}