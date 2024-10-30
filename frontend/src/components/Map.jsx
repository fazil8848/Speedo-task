import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Loader from "./Loader";
import L from "leaflet";

const Map = ({ selectedTrip }) => {
  function formatTravelDuration(durationInSeconds) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    return `${hours > 0 ? hours + " Hr " : ""}${
      minutes > 0 ? minutes + " Mins " : ""
    }${seconds} Seconds`;
  }

  const handleRouteColor = (coord) => {
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

  let lastValidPosition = [
    selectedTrip.coordinates[0].latitude,
    selectedTrip.coordinates[0].longitude,
  ];
  const polylines = [];

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
            const currentPos = [coord.latitude, coord.longitude];
            const isIdling =
              coord.ignition === "on" && coord.speedOfTheVehicle === 0;
            const isStopped = coord.ignition === "off";

            if (isIdling) {
              return (
                <Marker
                  key={`idle-${index}`}
                  position={currentPos}
                  icon={L.divIcon({
                    className: "custom-marker",
                    html: `<div style="background-color: #FF00B8; border-radius: 50%; width: 12px; height: 12px;"></div>`,
                  })}
                >
                  <Popup>
                    Vehicle idled here for{" "}
                    {formatTravelDuration(coord.idlingDuration)}
                  </Popup>
                </Marker>
              );
            }

            if (isStopped) {
              return (
                <Marker
                  key={`stopped-${index}`}
                  position={currentPos}
                  icon={L.divIcon({
                    className: "custom-marker",
                    html: `<div style="background-color: red; border-radius: 50%; width: 12px; height: 12px;"></div>`,
                  })}
                >
                  <Popup className="bg-red-500">
                    Vehicle stopped here for{" "}
                    {formatTravelDuration(coord.stoppageDuration)}
                  </Popup>
                </Marker>
              );
            }

            if (lastValidPosition) {
              polylines.push(
                <Polyline
                  key={index}
                  positions={[lastValidPosition, currentPos]}
                  color={handleRouteColor(coord)}
                  weight={8}
                />
              );
            }

            if (coord.speedOfTheVehicle > 0 || isStopped) {
              lastValidPosition = currentPos;
            }

            return null;
          })}

          {polylines}

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
