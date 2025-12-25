import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

function LocationMarker({ setLocation,isConfirmed }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
        if(isConfirmed)return;
      setPosition(e.latlng);
      setLocation(e.latlng);
    },
    moveend(e) {
        if(isConfirmed) return;
      const center = e.target.getCenter();
      setPosition(center);
      setLocation(center);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export default function SelectLocationMap({ setLocation , isConfirmed }) {
  const [currentPos, setCurrentPos] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCurrentPos(coords);
        setLocation(coords);
      },
      () => {
        // fallback (Delhi)
        setCurrentPos({ lat: 28.6139, lng: 77.209 });
      }
    );
  }, []);

  if (!currentPos) return <div className="h-80">Loading map...</div>;

  return (
    <div className="w-full h-80 rounded-2xl overflow-hidden border-4 border-green-300">
      <MapContainer
        center={currentPos}
        zoom={15}
        scrollWheelZoom={!isConfirmed}
        dragging={!isConfirmed}
              doubleClickZoom={!isConfirmed}

        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker setLocation={setLocation} isConfirmed={isConfirmed} />
      </MapContainer>
    </div>
  );
}
