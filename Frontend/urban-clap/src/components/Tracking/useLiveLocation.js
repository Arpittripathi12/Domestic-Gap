// hooks/useLiveLocation.js
import { useEffect } from "react";


export default function useLiveLocation(onLocation) {
  useEffect(() => {

    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const location = {  
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        onLocation(location);
      },
      (err) => console.log(err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [onLocation]);
}
