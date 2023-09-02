import * as React from 'react'
import TopBar from '../TopBar'
import { Box } from '@mui/material'
import SearchAnything from '../searchAnything'

export function PlanRoot() {
    return (
        <>
            <TopBar title="路線規劃" />
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: "flex" }}><SearchAnything /></Box>
            </Box>
        </>
    )
}