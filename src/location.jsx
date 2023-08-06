import React, { Component } from "react";
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import Locate from "leaflet.locatecontrol";
/*
class LocateControl extends Component {
  componentDidMount() {
    const { options, startDirectly } = this.props;
    const { map } = this.props.leaflet;

    const lc = new Locate(options);
    lc.addTo(map);

    if (startDirectly) {
      // request location update and set location
      lc.start();
    }
  }

  render() {
    return null;
  }
}

export default LocateControl;*/


function LocateControl(props) {
  console.log(props, "1321321321313")
  const { options, startDirectly, map } = props;
  // const { map } = props.leaflet;

  console.log(map)
  const lc = new Locate(options);
  lc.addTo(map);

  if (startDirectly) {
    // request location update and set location
    lc.start();
  }
  return null
}
export default LocateControl