import { X } from "lucide-react";
import { useState } from "react";
import { Input } from "../components/ui/input";
import toast from "react-hot-toast";
import { uploadTrip } from "@/services/apiService";

export default function UploadModal({ isOpen, onClose, setTrips }) {
  const [tripName, setTripName] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!tripName) {
      toast.error("Please enter a trip name");
      return;
    }
    if (!file) {
      toast.error("Please upload a file");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("tripName", tripName);
      formData.append("file", file);

      const response = await uploadTrip(formData);
      console.log(response.data);

      if (response.data.success) {
        toast.success("Trip uploaded successfully");
        setTrips((prevTrips) => [...prevTrips, response.data.tripData]);
        setTripName("");
        setFile(null);
      } else {
        toast.error("Failed to upload trip");
      }
    } catch (error) {
      console.error("Error uploading trip:", error);
      toast.error("Error uploading trip");
    } finally {
      setIsUploading(false);
      onClose();
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg lg:w-4/12 md:w-3/6 sm:w-4/6 w-5/6 p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-8 right-8 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
          <h2 className="text-xl font-semibold mb-4">Upload Trip</h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="tripName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Trip Name
              </label>
              <Input
                id="tripName"
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="Enter trip name"
                className="w-full"
              />
            </div>
            <div>
              <label
                htmlFor="fileUpload"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Upload Excel Sheet
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => document.getElementById("fileUpload").click()}
              >
                <input
                  id="fileUpload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                />
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  Click here to upload the Excel sheet of your trip
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {file ? file.name : "No file selected"}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    )
  );
}
