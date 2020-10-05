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

const fetchCurrentUsersCountry = async (userLatLong: LatLong): Promise<string> => {
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLatLong.latitude},${userLatLong.longitude}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
    );

    return response.json().then((geocodingResult) => {
        let userCountry = "";
        
        for (let i = 0; i < geocodingResult.results.length; i++) {
            const result = geocodingResult.results[i];
            if(result["types"]?.indexOf("country") >= 0) {
                userCountry = result["address_components"]?.[0]?.["short_name"];
                break;
            }
        }
        return userCountry;
    });
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

    return nearestUtility;
}

export const LocationUtils = {
    fetchCountry : fetchCurrentUsersCountry,
    fetchUtility : fetchNearestUtility
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
