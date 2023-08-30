import * as React from 'react';
import SearchAnything from '../searchAnything';
import { Box } from '@mui/material'
import TopBar from '../TopBar';
import getData from '../getData';

export default function Search() {
    function UrlParam(name) {
        var url = new URL(window.location.href),
            result = url.searchParams.get(name);
        return result
    }

    function reloadSearch() {
        var keyword = UrlParam("q")
        console.log("[:)", keyword, isNaN(Number(keyword)))
    }

    React.useEffect(() => {
        reloadSearch()
    }, [UrlParam("q")])
    return (
        <>
            <TopBar title={"搜尋"} />
            <Box sx={{ p: 3 }}>
                <SearchAnything type="all" value={UrlParam("q")} variant="search.js" city={UrlParam("city")} onSearchBtnClick={{ func: reloadSearch }} />
            </Box>
        </>
    )
}