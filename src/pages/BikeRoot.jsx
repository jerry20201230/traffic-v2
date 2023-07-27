import * as React from 'react';
import TopBar from '../TopBar';
import getData from '../getData';
import { Box, Autocomplete, TextField, Button } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

function BikeRoot() {


  return (
    <>
      <TopBar title="公共自行車"></TopBar>
      <Box sx={{ p: 3 }}>
        <h2>歡迎使用<br />公共自行車資料</h2>


        <MapContainer  center={[23.75518176611264, 120.9406086935125]} zoom={7} style={{ width: "100%", height: "35vh" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>

      </Box>
    </>
  )
}

export default BikeRoot;
