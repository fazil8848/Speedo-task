import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import { getTrips, deleteTripsAPI } from "@/services/apiService";
import UploadModal from "@/components/UploadTripsModal";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const tripsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [trips, setTrips] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrips, setSelectedTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(trips.length / tripsPerPage);
  const startIndex = (currentPage - 1) * tripsPerPage;
  const currentTrips = trips.slice(startIndex, startIndex + tripsPerPage);

  const fectchTrips = async () => {
    try {
      setLoading(true);
      const response = await getTrips();
      setTrips(response.data.trips);
    } catch (error) {
      console.error("Error fetching trips", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (tripId) => {
    setSelectedTrips((prevSelectedTrips) => {
      if (prevSelectedTrips.includes(tripId)) {
        return prevSelectedTrips.filter((id) => id !== tripId);
      } else {
        return [...prevSelectedTrips, tripId];
      }
    });
  };

  const handleTripDelete = async () => {
    try {
      if (selectedTrips.length === 0) {
        return toast.error("Please select atleast 1 trip");
      }
      const response = await deleteTripsAPI(selectedTrips);
      setTrips((pre) =>
        pre.filter((trips) => !selectedTrips.includes(trips._id))
      );
      toast.success("Trips deleted successfully");
    } catch (error) {
      console.error("Error deleting trips: ", error);
      toast.error("Trip deletion failed");
    }
  };

  const handleTripOpen = () => {
    if (selectedTrips.length === 0) {
      return toast.error("Please select atleast 1 trip");
    }

    navigate("/trip-details", { state: selectedTrips });
    setSelectedTrips([]);
  };

  useEffect(() => {
    fectchTrips();
  }, []);

  return (
    <>
      {loading && <Loader />}
      <div className="bg-gray-100 min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="mb-6">
            <CardContent className="p-4 flex items-center">
              <span className="text-2xl mr-2">👋</span>
              <h1 className="text-2xl font-semibold">Welcome, User</h1>
            </CardContent>
          </Card>

          {trips.length === 0 ? (
            <Card className="p-8 flex flex-col items-center">
              <img
                src="/cuate.png"
                alt="People interacting with a map"
                className="mb-6"
                width={300}
                height={200}
              />
              <Button
                onClick={() => setModalOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 mb-4"
              >
                Upload Trip
              </Button>
              <p className="text-sm text-gray-500">
                Upload the <span className="font-medium">Excel</span> sheet of
                your trip
              </p>
            </Card>
          ) : (
            <>
              <Card className="mb-6">
                <CardContent className="p-4 flex items-center justify-between">
                  <Button
                    onClick={() => setModalOpen(true)}
                    className="bg-slate-800 hover:bg-slate-700"
                  >
                    Upload Trip
                  </Button>
                  <p className="text-sm text-gray-500">
                    Upload the <span className="font-medium">Excel</span> sheet
                    of your trip
                  </p>
                </CardContent>
              </Card>
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Your Trips</h2>
                  <div className="space-x-2">
                    <Button onClick={handleTripDelete} variant="outline">
                      Delete
                    </Button>
                    <Button onClick={handleTripOpen}>Open</Button>
                  </div>
                </div>
                <div className="p-10">
                  <ul>
                    {currentTrips.map((trip, index) => (
                      <li key={index} className="border-b border-gray-200 ">
                        <div className="flex items-center p-4">
                          <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange(trip._id)}
                            checked={selectedTrips.includes(trip._id)}
                            id={`trip-${index}`}
                            className="mr-4"
                          />
                          <label
                            htmlFor={`trip-${index}`}
                            className="text-sm font-medium"
                          >
                            {trip.tripName}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 ">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage(Math.max(currentPage - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className={`${
                            currentPage > 1
                              ? "cursor-pointer"
                              : "text-gray-300 hover:text-gray-300"
                          }`}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            isActive={currentPage === index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          className={`${
                            currentPage !== totalPages
                              ? "cursor-pointer"
                              : "text-gray-300 hover:text-gray-300"
                          }`}
                          onClick={() =>
                            setCurrentPage(
                              Math.min(currentPage + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </>
          )}
        </main>
        <UploadModal
          setTrips={setTrips}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </>
  );
}
