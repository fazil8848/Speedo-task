import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Clock,
  History,
  Timer,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import { MapMarkerDistance } from "../components/icons/MapDistanceMarker";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSelectedTrips } from "@/services/apiService";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import Map from "@/components/Map";

export default function TripDetails() {
  const [currentPage, setCurrentPage] = useState(1);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [currentTrips, setCurrentTrips] = useState([]);
  const location = useLocation();
  const tripIds = location.state;

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await getSelectedTrips([...tripIds]);

      if (response.data.success) {
        setTrips(response.data.trips);
        setSelectedTrip(response.data.trips[0] || null);
      } else {
        toast.error(response.data.error || response.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  function formatCoordinates(latitude, longitude) {
    const latDirection = latitude >= 0 ? "N" : "S";
    const longDirection = longitude >= 0 ? "E" : "W";

    const formattedLatitude = `${Math.abs(latitude).toFixed(
      4
    )}° ${latDirection}`;
    const formattedLongitude = `${Math.abs(longitude).toFixed(
      4
    )}° ${longDirection}`;

    return `${formattedLatitude}, ${formattedLongitude}`;
  }

  function formatDuration(totalMinutes) {
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.floor((totalMinutes * 60) % 60); // Calculate total seconds

    return `${
      days > 0
        ? days + " Day" + (days > 1 ? "s" : "") + ", "
        : hours > 0
        ? hours + " Hr "
        : ""
    }${
      minutes > 0 ? minutes + " Min" + (minutes > 1 ? "s " : " ") : ""
    }${seconds} Seconds`;
  }

  const tripStats = [
    {
      icon: <MapMarkerDistance color="#00B2FF" />,
      value: selectedTrip
        ? selectedTrip.totalDistance.toFixed(2) + " KM"
        : "0 KM",
      label: "Total Distance Travelled",
    },
    {
      icon: (
        <Clock
          fill="#00B2FF"
          stroke="white"
          className="w-8 h-8 mb-2 text-gray-500"
        />
      ),
      value: selectedTrip
        ? formatDuration(selectedTrip.totalTripDuration.toFixed(2))
        : "0 Hr 0 Mins",
      label: "Total Travelled Duration",
    },
    {
      icon: <Timer className="w-8 h-8 mb-2 text-[#0055ff]" />,
      value: selectedTrip
        ? formatDuration(selectedTrip.totalOverspeedingDuration.toFixed(2))
        : "0 Hr 0 Mins",
      label: "Over Speeding Duration",
    },
    {
      icon: <MapMarkerDistance color="#00FFD1" />,
      value: selectedTrip
        ? selectedTrip.totalOverspeedingDistance.toFixed(2) + " KM"
        : "0 KM",
      label: "Over Speeding Distance",
    },
    {
      icon: (
        <History
          color="rgba(0, 56, 255, 1)"
          className="w-8 h-8 mb-2 text-gray-500"
        />
      ),
      value: selectedTrip
        ? formatDuration(selectedTrip.totalStoppageDuration)
        : "0 Hr 0 Mins",
      label: "Stopped Duration",
    },
  ];

  const tripsPerPage = 5;

  const totalPages =
    selectedTrip && selectedTrip.coordinates
      ? Math.ceil(selectedTrip.coordinates.length / tripsPerPage)
      : 1;
  const startIndex = (currentPage - 1) * tripsPerPage;

  const handlePreviousTrip = () => {
    const currentIndex = trips.indexOf(selectedTrip);
    if (currentIndex > 0) {
      setSelectedTrip(trips[currentIndex - 1]);
    }
  };

  const handleNextTrip = () => {
    const currentIndex = trips.indexOf(selectedTrip);
    if (currentIndex < trips.length - 1) {
      setSelectedTrip(trips[currentIndex + 1]);
    }
  };

  function formatTravelDuration(durationInSeconds) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    return `${hours > 0 ? hours + " Hr " : ""}${
      minutes > 0 ? minutes + " Mins " : ""
    }${seconds} Seconds`;
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const calculateTravelDetails = (trips) => {
    let totalDistance = 0;
    let overspeedingDuration = 0;
    let stoppageDuration = 0;

    const SPEED_LIMIT = 60;

    for (let index = 0; index < trips.length; index++) {
      const currentTrip = trips[index];
      const nextTrip = trips[index + 1];

      if (!nextTrip) continue;

      const distance = calculateDistance(
        currentTrip.latitude,
        currentTrip.longitude,
        nextTrip.latitude,
        nextTrip.longitude
      );
      totalDistance += distance;

      const timeDifference =
        (new Date(nextTrip.timestamp) - new Date(currentTrip.timestamp)) / 1000;

      if (currentTrip.speedOfTheVehicle > SPEED_LIMIT) {
        overspeedingDuration += timeDifference;
      }

      if (
        currentTrip.speedOfTheVehicle === 0 &&
        currentTrip.ignition === "off"
      ) {
        stoppageDuration += timeDifference;
      }
    }

    const travelDuration =
      trips.length > 0
        ? (new Date(trips[trips.length - 1].timestamp) -
            new Date(trips[0].timestamp)) /
          1000
        : 0;

    return {
      travelDuration: formatTravelDuration(travelDuration),
      totalDistance: totalDistance.toFixed(2),
      overspeedingDuration: formatTravelDuration(overspeedingDuration),
      stoppageDuration: formatDuration(stoppageDuration),
    };
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    if (selectedTrip && selectedTrip.coordinates) {
      setCurrentTrips(
        selectedTrip.coordinates.slice(startIndex, startIndex + tripsPerPage)
      );
    }
  }, [selectedTrip, startIndex]);

  const travelDetails = calculateTravelDetails(currentTrips);

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-screen bg-gray-100">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-2">
            <button>
              <ArrowLeftIcon width="2rem" height="2rem" />
            </button>
            <div className="flex justify-between items-center w-full bg-white rounded-md border border-black px-4 py-4 ">
              <h1 className="text-2xl font-medium flex-grow">
                {selectedTrip?.tripName}
              </h1>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow mb-6 p-5 pt-3">
            <Map selectedTrip={selectedTrip} />
            <div className="border-b border-gray-200 p-1 flex space-x-4 overflow-x-auto w-full justify-between">
              <button
                disabled={trips.indexOf(selectedTrip) === 0}
                className="border border-[rgba(255, 255, 255, 1)] rounded-sm px-2"
                onClick={handlePreviousTrip}
              >
                <ArrowLeftIcon
                  stroke="rgba(191, 191, 191, 1)"
                  width="1.5rem"
                  height="1.5rem"
                />
              </button>
              <div className="w-full flex gap-2">
                {trips.map((trip, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 border-b py-2 px-1 rounded text-sm ${
                      trip._id === selectedTrip?._id
                        ? " text-blue-500 border-b-4 border-b-blue-500"
                        : "text-gray-300 border-b-0"
                    }`}
                    onClick={() => setSelectedTrip(trip)}
                  >
                    {trip?.tripName}
                  </button>
                ))}
              </div>
              <button
                disabled={trips.indexOf(selectedTrip) === trips.length - 1}
                className="border border-[rgba(255, 255, 255, 1)] px-2 rounded-sm"
                onClick={handleNextTrip}
              >
                <ArrowRightIcon
                  stroke="rgba(191, 191, 191, 1)"
                  width="1.5rem"
                  height="1.5rem"
                />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {tripStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-full">{stat.icon}</div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-white rounded border border-gray-300 shadow overflow-hidden flex overflow-x-auto">
            <table className="text-center w-3/5">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-8 text-xs font-medium border-r border-r-gray-300 text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-8 text-xs font-medium border-r border-r-gray-300 text-gray-500 uppercase tracking-wider">
                    Point
                  </th>
                  <th className="px-6 py-8 text-xs font-medium border-r border-r-gray-300 text-gray-500 uppercase tracking-wider">
                    Ignition
                  </th>
                  <th className="px-6 py-8 text-xs font-medium border-r border-r-gray-300 text-gray-500 uppercase tracking-wider">
                    Speed
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentTrips?.map((row, index) => {
                  const nextRow = currentTrips[index + 1];

                  const duration = nextRow
                    ? `${new Date(
                        row.timestamp
                      ).toLocaleTimeString()} to ${new Date(
                        nextRow.timestamp
                      ).toLocaleTimeString()}`
                    : `${new Date(
                        row.timestamp
                      ).toLocaleTimeString()} to ${new Date(
                        row.timestamp
                      ).toLocaleTimeString()}`;

                  return (
                    <tr key={index} className="border-b border-b-gray-300">
                      <td className="px-6 py-6 whitespace-nowrap border-r border-r-gray-300 text-sm font-medium text-gray-900">
                        {duration}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap border-r border-r-gray-300 text-sm font-medium text-gray-900">
                        {formatCoordinates(row.latitude, row.longitude)}
                      </td>
                      <td
                        className={`px-6 py-6 whitespace-nowrap border-r border-r-gray-300 text-sm font-medium ${
                          row.ignition === "on"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {row.ignition.toUpperCase()}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap border-r border-r-gray-300 text-sm font-medium text-gray-900">
                        {row.speedOfTheVehicle.toFixed(3)} km/h
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="md:w-2/5 w-[40rem] flex justify-center items-center cursor-default">
              <div className="md:w-4/5 w-[32rem] text-center text-base mt-10 px-6">
                <div className="flex justify-between py-4">
                  <p className="w-full">Travel Duration</p>
                  <p className="w-full font-medium">
                    {travelDetails.travelDuration}
                  </p>
                </div>
                <div className="flex justify-between py-4">
                  <p className="w-full">Stopped Duration</p>
                  <p className="w-full font-medium">
                    {travelDetails.stoppageDuration}
                  </p>
                </div>
                <div className="flex justify-between py-4">
                  <p className="w-full">Distance</p>
                  <p className="w-full font-medium">
                    {travelDetails.totalDistance} km
                  </p>
                </div>
                <div className="flex justify-between py-4">
                  <p className="w-full">Overspeeding Duration</p>
                  <p className="w-full font-medium">
                    {travelDetails.overspeedingDuration}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={`${
                      currentPage > 1
                        ? "cursor-pointer"
                        : "text-gray-300 hover:text-gray-300"
                    }`}
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                  const pageIndex = Math.max(0, currentPage - 3) + index;

                  if (pageIndex + 1 > totalPages) return null;

                  return (
                    <PaginationItem key={pageIndex}>
                      <PaginationLink
                        className="cursor-pointer"
                        isActive={currentPage === pageIndex + 1}
                        onClick={() => setCurrentPage(pageIndex + 1)}
                      >
                        {pageIndex + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    className={`${
                      currentPage !== totalPages
                        ? "cursor-pointer"
                        : "text-gray-300 hover:text-gray-300 "
                    }`}
                    onClick={() =>
                      setCurrentPage(Math.min(currentPage + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </main>
      </div>
    </>
  );
}
