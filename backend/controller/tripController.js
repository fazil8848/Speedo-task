const csv = require("csv-parser");
const fs = require("fs");
const Trips = require("../models/TripData.js");
const {
  calculateDistance,
  calculateTotalDistance,
} = require("../utils/tripCalculations.js");

const getTrips = async (req, res) => {
  const user = req.userId;
  try {
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "user not found",
        message: '"User ID is required"',
      });
    }

    const trips = await Trips.find({ user }).lean();

    res
      .status(200)
      .json({ success: true, message: "Trips fetched successfully", trips });
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const addTrip = async (req, res) => {
  try {
    const { tripName } = req.body;
    const file = req.file;
    if (!tripName || !file) {
      return res
        .status(400)
        .json({ success: false, error: "Trip name and file are required" });
    }

    const coordinates = [];
    const readStream = fs.createReadStream(file.path);

    readStream
      .pipe(csv())
      .on("data", (row) => {
        const { latitude, longitude, timestamp, ignition } = row;
        coordinates.push({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          timestamp: new Date(timestamp),
          ignition,
          distanceCovered: 0,
          speedOfTheVehicle: 0,
          idlingDuration: 0,
          stoppageDuration: 0,
        });
      })
      .on("end", async () => {
        let totalDistance = 0;
        let totalStoppageDuration = 0;
        let totalIdlingDuration = 0;
        let totalOverspeedingDuration = 0;
        let totalOverspeedingDistance = 0;
        const overspeedSegments = [];

        const SPEED_LIMIT = 60;
        let startIdleTime = null;
        let startStopTime = null;

        for (let i = 1; i < coordinates.length; i++) {
          const prev = coordinates[i - 1];
          const curr = coordinates[i];

          const distance = calculateDistance(prev, curr);
          const timeDiff = (curr.timestamp - prev.timestamp) / 1000;
          const speed =
            timeDiff > 0 && coordinates[i].ignition === "on"
              ? (distance / timeDiff) * 3.6
              : 0;

          totalDistance += distance;
          coordinates[i].distanceCovered = distance;
          coordinates[i].speedOfTheVehicle = speed;

          if (speed > SPEED_LIMIT) {
            overspeedSegments.push({
              startTime: prev.timestamp,
              endTime: curr.timestamp,
              startCoordinates: {
                latitude: prev.latitude,
                longitude: prev.longitude,
              },
              endCoordinates: {
                latitude: curr.latitude,
                longitude: curr.longitude,
              },
            });
            totalOverspeedingDuration += timeDiff / 60;
            totalOverspeedingDistance += distance;
          }

          if (curr.ignition === "on" && speed === 0) {
            if (!startIdleTime) {
              startIdleTime = prev.timestamp;
            }
            totalIdlingDuration += timeDiff / 60;
            curr.idlingDuration = timeDiff / 60;
          } else if (startIdleTime) {
            const idleTime = (curr.timestamp - startIdleTime) / 1000;
            for (let j = i - 1; j >= 0; j--) {
              if (
                coordinates[j].ignition === "on" &&
                coordinates[j].speedOfTheVehicle === 0
              ) {
                coordinates[j].idlingDuration = idleTime;
              } else {
                break;
              }
            }
            startIdleTime = null;
          }

          if (curr.ignition === "off") {
            if (!startStopTime) {
              startStopTime = prev.timestamp;
            }
            totalStoppageDuration += timeDiff / 60;
            curr.stoppageDuration = timeDiff / 60;
          } else if (startStopTime) {
            const stopTime = (curr.timestamp - startStopTime) / 1000;
            for (let j = i - 1; j >= 0; j--) {
              if (coordinates[j].ignition === "off") {
                coordinates[j].stoppageDuration = stopTime;
              } else {
                break;
              }
            }
            startStopTime = null;
          }
        }

        if (coordinates.length > 0) {
          coordinates[0].distanceCovered = 0;
          coordinates[0].speedOfTheVehicle = 0;
          coordinates[0].idlingDuration = 0;
          coordinates[0].stoppageDuration = 0;
        }

        const totalTripDuration =
          (coordinates[coordinates.length - 1].timestamp -
            coordinates[0].timestamp) /
          60000;

        const tripData = await Trips.create({
          coordinates,
          tripName,
          user: req.userId,
          startTime: coordinates[0].timestamp,
          endTime: coordinates[coordinates.length - 1].timestamp,
          totalDistance: parseFloat(totalDistance / 1000).toFixed(3),
          totalStoppageDuration: parseFloat(totalStoppageDuration).toFixed(2),
          totalIdlingDuration: parseFloat(totalIdlingDuration).toFixed(2),
          overspeedSegments,
          totalOverspeedingDuration: parseFloat(
            totalOverspeedingDuration
          ).toFixed(2),
          totalOverspeedingDistance: parseFloat(
            totalOverspeedingDistance / 1000
          ).toFixed(3),
          totalTripDuration: parseFloat(totalTripDuration).toFixed(2),
        });

        res.status(200).json({
          success: true,
          message: "Trip added successfully",
          tripData,
        });
      });
  } catch (error) {
    console.error("Error uploading trip:", error);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

const deleteTrips = async (req, res) => {
  try {
    const tripIds = req.body;
    user = req.userId;

    const result = await Trips.deleteMany({
      _id: { $in: tripIds },
      user: user,
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No trips found with given IDs" });
    }

    res
      .status(200)
      .json({ success: true, message: "Trips deleted successfully" });
  } catch (error) {
    console.error("Error Deleting trips:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getSelectedTrips = async (req, res) => {
  try {
    const tripIds = req.body;

    const trips = await Trips.find({ _id: { $in: tripIds } });

    if (trips.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No trips found" });
    }

    res.status(200).json({ success: true, trips });
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { addTrip, getTrips, deleteTrips, getSelectedTrips };
