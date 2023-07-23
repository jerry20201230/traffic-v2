
import TopBar from '../TopBar';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

import LocateControl from '../location';



function Map() {
  var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  const locateOptions = {
    position: 'topright',
    strings: {
      title: 'Show me where I am, yo!'
    },
    onActivate: () => { } // callback before engine starts retrieving locations
  }

  return (
    <>
      <div style={{ display: "flex", flexFlow: "column", height: "100%" }}>
        <TopBar title="地圖" />
        <div className="map" id="map" style={{ width: "100%", height: `100%`, flexGrow: 1 }}>
          <MapContainer center={[23.75518176611264, 120.9406086935125]} zoom={7} style={{ width: "100%", height: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[23.75518176611264, 120.9406086935125]} icon={greenIcon}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
            <LocateControl options={locateOptions} startDirectly />
          </MapContainer>
        </div>
      </div>
    </>
  )
}

export default Map;

