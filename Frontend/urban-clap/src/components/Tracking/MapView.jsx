import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "./MapView.css"

export const blinkitDotIcon = L.divIcon({
  className: "",
  html: `
    <div class="blinkit-dot">
      <span class="pulse"></span>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});


function Recenter({position}){
  const map=useMap();
  useEffect(()=>{
    if(position){
      map.setView (position);
    }
        
  } , [position]);
  return null;
}
export default function MapView({ center, route, providerPos, userPos }) {
  return (
    <MapContainer center={center} zoom={15} style={{ height: "40vh" }}>
      <Recenter position={providerPos}/>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {providerPos && <Marker position={providerPos}  icon={blinkitDotIcon}/>}
      {userPos && <Marker position={userPos}  />}

      {route && <Polyline positions={route} color="blue" />}
    </MapContainer>
  );
}
