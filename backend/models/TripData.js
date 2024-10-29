const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tripSchema = new mongoose.Schema({
  tripName: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  totalDistance: { type: Number, required: true },
  totalStoppageDuration: { type: Number, required: true },
  totalIdlingDuration: { type: Number, required: true },
  totalOverspeedingDuration: { type: Number, required: true },
  totalOverspeedingDistance: { type: Number, required: true },
  totalTripDuration: { type: Number, required: true },
  coordinates: [
    {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      timestamp: { type: Date, required: true },
      ignition: { type: String, required: true },
      distanceCovered: { type: Number, default: 0 },
      speedOfTheVehicle: { type: Number, default: 0 },
    },
  ],
  overspeedSegments: [
    {
      startTime: { type: Date, required: true },
      endTime: { type: Date, required: true },
      startCoordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
      endCoordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
    },
  ],
});

const Trips = mongoose.model("Trips", tripSchema);

module.exports = Trips;
