const geolib = require("geolib");

function calculateDistance(prev, curr) {
  return geolib.getDistance(
    { latitude: curr.latitude, longitude: curr.longitude },
    { latitude: prev.latitude, longitude: prev.longitude }
  );
}

module.exports = { calculateDistance };
