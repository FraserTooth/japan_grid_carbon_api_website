import getDistance from "geolib/es/getDistance";

// Data source: https://www.naturalearthdata.com/downloads/110m-cultural-vectors/110m-admin-0-countries/
const JAPAN_COORDS = {
  min_long: 129.408463169,
  min_lat: 31.0295791692,
  max_long: 145.543137242,
  max_lat: 45.5514834662,
};

interface LatLong {
  latitude: number;
  longitude: number;
}

const utilityGeocoordinates = {
  tepco: {
    latitude: 35.694003,
    longitude: 139.753594,
  },
  kepco: {
    latitude: 35.033333,
    longitude: 126.716667,
  },
  tohokuden: {
    latitude: 38.269167,
    longitude: 140.870556,
  },
  chuden: {
    latitude: 35.183333,
    longitude: 136.9,
  },
  hepco: {
    latitude: 43.066667,
    longitude: 141.35,
  },
  rikuden: {
    latitude: 36.695917,
    longitude: 137.213694,
  },
  cepco: {
    latitude: 34.383333,
    longitude: 132.45,
  },
  yonden: {
    latitude: 34.35,
    longitude: 134.05,
  },
  kyuden: {
    latitude: 33.583333,
    longitude: 130.4,
  },
  okiden: {
    latitude: 26.245833,
    longitude: 127.721944,
  },
};

const isUserInsideJPBounds = (userCoords: LatLong): boolean => {
  return (
    userCoords.latitude >= JAPAN_COORDS.min_lat &&
    userCoords.latitude <= JAPAN_COORDS.max_lat &&
    userCoords.longitude >= JAPAN_COORDS.min_long &&
    userCoords.longitude <= JAPAN_COORDS.max_long
  );
};

const fetchNearestUtility = (
  utilityGeocoordinatesMap: any,
  userLatLong: LatLong
): string => {
  // If the current user is not inside Japan, return a falsy JS value
  if (!isUserInsideJPBounds(userLatLong)) {
    return "";
  }

  let nearestUtility = "";
  let minDistance = null;

  for (const utility in utilityGeocoordinatesMap) {
    if (
      Object.prototype.hasOwnProperty.call(utilityGeocoordinatesMap, utility)
    ) {
      const utilityLatLong = utilityGeocoordinatesMap[utility];
      let userProximityToUtility = getDistance(userLatLong, utilityLatLong);

      if (minDistance == null || userProximityToUtility < minDistance) {
        minDistance = userProximityToUtility;
        nearestUtility = utility;
      }
    }
  }

  return nearestUtility;
};

const fetchUtilityBasedOnUsersGeolocation = (
  utilityGeocoordinatesMap: any,
  setUtility: any
) => {
  // Get the current User's geolocation and fetch the nearest Utility option
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let userLatLong = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        const nearestUtility = fetchNearestUtility(
          utilityGeocoordinatesMap,
          userLatLong
        );
        console.log(`Nearest Utility Determined to be: ${nearestUtility}`);
        if (nearestUtility) {
          setUtility(nearestUtility);
        }
      },
      (error) => {
        console.error(
          `An error has occurred while fetching the user's geolocation: ${error.message}`
        );
      }
    );
  } else {
    console.log(`Geolocation is not available.`);
  }
};

export default {
  fetchUtilityBasedOnGeolocation: fetchUtilityBasedOnUsersGeolocation,
  utilityGeocoordinates,
};
