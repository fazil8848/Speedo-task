import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const CustomPopup = ({ position, message, backgroundColor }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.panTo(position);
    }
  }, [position, map]);

  return (
    <div
      className={`absolute transform -translate-y-full left-1/2 -translate-x-1/2 p-2 rounded-lg ${backgroundColor} text-white text-sm`}
      style={{
        top: map.latLngToContainerPoint(position).y,
        left: map.latLngToContainerPoint(position).x,
      }}
    >
      {message}
    </div>
  );
};
