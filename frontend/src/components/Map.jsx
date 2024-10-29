import React from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Loader from "./Loader";
import { MapPinCheckInside, MapPinHouse } from "lucide-react";
import { setLocale } from "yup";

const Map = ({ selectedTrip }) => {
  const handleRouteColor = (coord) => {
    console.log(coord);

    if (coord.speedOfTheVehicle > 60) {
      return "#00FFD1";
    } else if (coord.ignition === "off") {
      return "red";
    } else if (coord.ignition === "on" && coord.speedOfTheVehicle === 0) {
      return "#FF00B8";
    } else {
      return "blue";
    }
  };

  if (
    !selectedTrip ||
    !selectedTrip.coordinates ||
    selectedTrip.coordinates.length < 2
  ) {
    return <Loader />;
  }

  return (
    <>
      <div className="flex gap-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-sm">Normal Speed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#FF00B8] mr-2"></div>
          <span className="text-sm">Idle</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#00FFD1] mr-2"></div>
          <span className="text-sm">Over Speeding</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span className="text-sm">Stopped</span>
        </div>
      </div>
      <div className="p-4">
        <MapContainer
          center={[
            selectedTrip.coordinates[0].latitude,
            selectedTrip.coordinates[0].longitude,
          ]}
          zoom={13}
          className="h-[500px]"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {selectedTrip.coordinates.map((coord, index) => {
            if (index === selectedTrip.coordinates.length - 1) return null;

            const start = [coord.latitude, coord.longitude];
            const end = [
              selectedTrip.coordinates[index + 1].latitude,
              selectedTrip.coordinates[index + 1].longitude,
            ];
            const color = handleRouteColor(coord);

            return (
              <Polyline
                key={index}
                positions={[start, end]}
                color={color}
                weight={8}
              />
            );
          })}
          {selectedTrip.coordinates.map((coord, index) => {
            if (index === 0 || index === selectedTrip.coordinates.length - 1) {
              return (
                <Marker
                  key={index}
                  position={[coord.latitude, coord.longitude]}
                />
              );
            }
            return null;
          })}
        </MapContainer>
      </div>
    </>
  );
};

export default Map;
