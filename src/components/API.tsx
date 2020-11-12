import getDistance from 'geolib/es/getDistance';
const apiURL = process.env.REACT_APP_API_URL
console.log("API URL: ", apiURL)

interface DailyCarbonData {
  hour: number;
  carbon_intensity: number;
}
const defaultDailyCarbon: DailyCarbonData[] = [
  { carbon_intensity: 0, hour: 0 },
];

interface DailyCarbonDataByMonth {
  month: number;
  data: DailyCarbonData[]
}
const defaultDailyCarbonMonth: DailyCarbonDataByMonth[] = [{
  month: 1,
  data: defaultDailyCarbon,
}];

interface CarbonIntensityForecast {
  forecast_timestamp: string,
  forecast_value: number,
  standard_error: number,
  confidence_level: number,
  prediction_interval_lower_bound: number,
  prediction_interval_upper_bound: number,
  confidence_interval_lower_bound: number,
  confidence_interval_upper_bound: number
}
const defaultCarbonIntensityForecast: CarbonIntensityForecast[] = [{
  forecast_timestamp: "2020-01-01 00:00:00+00:00",
  forecast_value: 1,
  standard_error: 1,
  confidence_level: 1,
  prediction_interval_lower_bound: 1,
  prediction_interval_upper_bound: 1,
  confidence_interval_lower_bound: 1,
  confidence_interval_upper_bound: 1
}];


const retriveDailyIntensity = async (
  setData: (data: DailyCarbonData[]) => void,
  utility: string
): Promise<void> => {
  const response = await fetch(
    `${apiURL}/carbon_intensity/average/${utility}`
  );

  const result = await response.json();

  console.log(result)

  const data: DailyCarbonData[] = result["data"]["carbon_intensity_average"]["data"];

  setData(data);
};

const retriveDailyIntensityByMonth = async (
  setData: (data: DailyCarbonDataByMonth[]) => void,
  utility: string
): Promise<void> => {
  setData(defaultDailyCarbonMonth);
  const response = await fetch(
    `${apiURL}/carbon_intensity/average/month/${utility}`
  );

  const result = await response.json();

  const data: DailyCarbonDataByMonth[] =
    result["data"]["carbon_intensity_average"]["data"];

  setData(data);
};

const retriveForecast = async (
  setData: (data: DailyCarbonDataByMonth[]) => void,
  utility: string
): Promise<void> => {
  setData(defaultDailyCarbonMonth);
  const response = await fetch(
    `${apiURL}/carbon_intensity/forecast/${utility}`
  );

  const result = await response.json();

  const data: DailyCarbonDataByMonth[] =
    result["data"]["forecast"];

  setData(data);
};

// Data source: https://www.naturalearthdata.com/downloads/110m-cultural-vectors/110m-admin-0-countries/
const JAPAN_COORDS = {
    min_long: 129.408463169,
    min_lat: 31.0295791692,
    max_long: 145.543137242,
    max_lat: 45.5514834662
};

interface LatLong {
    latitude: number;
    longitude: number;
}

const isUserInsideJPBounds = (userCoords: LatLong): boolean => {
    return (
        (userCoords.latitude >= JAPAN_COORDS.min_lat && userCoords.latitude <= JAPAN_COORDS.max_lat) &&
        (userCoords.longitude >= JAPAN_COORDS.min_long && userCoords.longitude <= JAPAN_COORDS.max_long)
    )
}

const fetchNearestUtility = (utilityGeocoordinatesMap: any, userLatLong: LatLong): string => {
    // If the current user is not inside Japan, return a falsy JS value
    if(!isUserInsideJPBounds(userLatLong)) {
        return '';
    }

    let nearestUtility = '';
    let minDistance = null;

    for (const utility in utilityGeocoordinatesMap) {
        if (Object.prototype.hasOwnProperty.call(utilityGeocoordinatesMap, utility)) {
            const utilityLatLong = utilityGeocoordinatesMap[utility];
            let userProximityToUtility = getDistance(userLatLong, utilityLatLong);

            if((minDistance == null) || userProximityToUtility < minDistance) {
                minDistance = userProximityToUtility;
                nearestUtility = utility;
            }    
        }
    }

    return nearestUtility;
}

const fetchUtilityBasedOnUsersGeolocation = (utilityGeocoordinatesMap: any, setUtility: any) => {
    // Get the current User's geolocation and fetch the nearest Utility option
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let userLatLong = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };

                const nearestUtility = fetchNearestUtility(utilityGeocoordinatesMap, userLatLong);
                if(nearestUtility) {
                    setUtility(nearestUtility);
                }
            },
            (error) => {
                console.error(`An error has occurred while fetching the user's geolocation: ${error.message}`);
            } 
        )
    } else {
        console.log(`Geolocation is not available.`);
    }
}

export const LocationUtils = {
    fetchUtilityBasedOnGeolocation: fetchUtilityBasedOnUsersGeolocation
}

export default {
  average: {
    default: defaultDailyCarbon,
    retrive: retriveDailyIntensity,
  },
  byMonth: {
    default: defaultDailyCarbonMonth,
    retrive: retriveDailyIntensityByMonth,
  },
  forecast: {
    default: defaultCarbonIntensityForecast,
    retrive: retriveForecast,
  }
};
