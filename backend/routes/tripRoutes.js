const express = require("express");
const {
  addTrip,
  getTrips,
  deleteTrips,
  getSelectedTrips,
} = require("../controller/tripController");
const { auth } = require("../middleware/authMiddleware");
const upload = require("../config/multerConfig");

const router = express.Router();

router.get("/getTrips", auth, getTrips);
router.post("/addTrip", auth, upload.single("file"), addTrip);
router.delete("/deleteTrips", auth, deleteTrips);
router.post("/getSelectedTrips", auth, getSelectedTrips);

module.exports = router;
