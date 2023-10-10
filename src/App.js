import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "./styles.css";
import LeafletControlGeocoder from "./LeafletControlGeocoder";

export default function App() {
  const position = [7.8731, 80.7718];

  return (
    <MapContainer center={position} zoom={8} style={{ height: "100vh" }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LeafletControlGeocoder />
    </MapContainer>
  );
}