import * as React from 'react'
import TopBar from '../TopBar'
import { Box, TextField, InputBase, IconButton, Paper, Divider } from '@mui/material'
import SearchAnything from '../searchAnything'
import MapIcon from '@mui/icons-material/Map';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LinearStepper from '../stepper'

export function PlanRoot() {
    return (
        <>
            <TopBar title="路線規劃" />
            <Box sx={{ p: 3 }}>
                <LinearStepper />
            </Box>
        </>
    )
}