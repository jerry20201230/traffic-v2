import * as React from 'react';
import SearchAnything from '../searchAnything';
import { Box } from '@mui/material'
import TopBar from '../TopBar';

export default function Search() {
    function UrlParam(name) {
        var url = new URL(window.location.href),
            result = url.searchParams.get(name);
        return result
    }

    return (
        <>
            <TopBar title={"搜尋"} />
            <Box sx={{ p: 3 }}>
                <SearchAnything type="all" value={UrlParam("q")} variant="full" />
            </Box>
        </>
    )
}