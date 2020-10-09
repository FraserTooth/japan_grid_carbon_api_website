import getDistance from 'geolib/es/getDistance';

interface DailyCarbonData {
  [key: string]: number;
  hour: number;
  carbon_intensity: number;
}
const defaultDailyCarbon: DailyCarbonData[] = [
  { carbon_intensity: 0, hour: 0 },
];

interface DailyCarbonDataByMonth {
  [key: number]: DailyCarbonData[];
}
const defaultDailyCarbonMonth: DailyCarbonDataByMonth = {
  1: [{ carbon_intensity: 0, hour: 0 }],
};

interface DailyCarbonDataByMonthAndWeekday {
  [key: number]: DailyCarbonDataByMonth;
}
const defaultDailyCarbonMonthAndWeekday: DailyCarbonDataByMonthAndWeekday = {
  1: {
    1: [{ carbon_intensity: 0, hour: 0 }],
  },
};

const retriveDailyIntensity = async (
  setData: (data: DailyCarbonData[]) => void,
  utility: string
): Promise<void> => {
  const response = await fetch(
    `https://us-central1-japan-grid-carbon-api.cloudfunctions.net/api/daily_carbon_intensity/${utility}`
  );

  const result = await response.json();

  const data: DailyCarbonData[] = result["data"]["carbon_intensity_by_hour"];

  setData(data);
};

const retriveDailyIntensityByMonth = async (
  setData: (data: DailyCarbonDataByMonth) => void,
  utility: string
): Promise<void> => {
  setData(defaultDailyCarbonMonth);
  const response = await fetch(
    `https://us-central1-japan-grid-carbon-api.cloudfunctions.net/api/daily_carbon_intensity/${utility}/month`
  );

  const result = await response.json();

  const data: DailyCarbonDataByMonth =
    result["data"]["carbon_intensity_by_month"];

  setData(data);
};

const retriveDailyIntensityByMonthAndWeekday = async (
  setData: (data: DailyCarbonDataByMonthAndWeekday) => void,
  utility: string
): Promise<void> => {
  setData(defaultDailyCarbonMonthAndWeekday);
  const response = await fetch(
    `https://us-central1-japan-grid-carbon-api.cloudfunctions.net/api/daily_carbon_intensity/${utility}/month_and_weekday`
  );

  const result = await response.json();

  const data: DailyCarbonDataByMonthAndWeekday =
    result["data"]["carbon_intensity_by_month_and_weekday"];

  setData(data);
};

interface LatLong {
    latitude: number;
    longitude: number;
}

const fetchNearestUtility = (utilityGeocoordinatesMap: any, userLatLong: LatLong): string => {
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

    /*
     * Return the nearest Utility found, if the least distance between the User's location and the Utility is less than 500 km
     * Return a value that is falsy in JS, if the least distance is greater than 500 km
     * 
     * NOTE: the value of 500 km is chosen based on the largest Prefecture in Japan and also it is almost half the length of Japan
     */
    if(minDistance && minDistance < 500000) {
        return nearestUtility;
    }

    return '';
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
  byMonthWeekday: {
    default: defaultDailyCarbonMonthAndWeekday,
    retrive: retriveDailyIntensityByMonthAndWeekday,
  },
};
