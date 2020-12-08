const apiURL = process.env.REACT_APP_API_URL;
console.log("API URL: ", apiURL);

export const supportedUtilities = [
  "tepco",
  "kepco",
  "tohokuden",
  "chuden",
  "hepco",
  "rikuden",
  "cepco",
  "yonden",
  "kyuden",
  "okiden",
] as const;

export type Utilities = typeof supportedUtilities[number];

export interface DailyCarbonData {
  hour: number;
  carbon_intensity: number;
}
const defaultDailyCarbon: DailyCarbonData[] = [
  { carbon_intensity: 0, hour: 0 },
];

export interface DailyCarbonDataByMonth {
  month: number;
  data: DailyCarbonData[];
}
const defaultDailyCarbonMonth: DailyCarbonDataByMonth[] = [
  {
    month: 1,
    data: defaultDailyCarbon,
  },
];

export interface CarbonIntensityForecast {
  forecast_timestamp: string;
  forecast_value: number;
  standard_error: number;
  confidence_level: number;
  prediction_interval_lower_bound: number;
  prediction_interval_upper_bound: number;
  confidence_interval_lower_bound: number;
  confidence_interval_upper_bound: number;
  date_created: string;
}
const defaultCarbonIntensityForecast: CarbonIntensityForecast[] = [
  {
    forecast_timestamp: "2020-01-01 00:00:00+00:00",
    forecast_value: 1,
    standard_error: 1,
    confidence_level: 1,
    prediction_interval_lower_bound: 1,
    prediction_interval_upper_bound: 1,
    confidence_interval_lower_bound: 1,
    confidence_interval_upper_bound: 1,
    date_created: "2020-01-01 00:00:00+00:00",
  },
];

/**
 * Generate Cache for Local Browser to prevent API overuse
 *
 * @returns Object containing getter and setter functions
 */
const createCache = <StoredDataType>() => {
  type Cache = {
    [K in Utilities]?: StoredDataType;
  };

  const cache: Cache = {};

  // const cache = {};

  /**
   * Get Cache Data for Utility
   *
   * @param utility Utility Name
   * @returns Cached Data
   */
  const getCache = (utility: Utilities): StoredDataType | undefined =>
    cache[utility];

  /**
   * Sets Cache Data for Utility
   *
   * @param utility Utility Name
   * @param data Cached Data
   */
  const setCache = (utility: Utilities, data: StoredDataType): void => {
    cache[utility] = data;
  };
  return { getCache, setCache };
};

/**
 * Create API Interface
 *
 * @param endpointPath endpoint path, don't put '/' on the ends
 * @param defaultData the default data for useState
 * @param unpacker basic function to unpack the data down to the main array
 *
 * @returns API calling interface
 */
function createAPIInterface<DataType, PathFormat>(
  defaultData: DataType,
  unpacker: (raw: any) => DataType = (raw) => raw,
  endpointPath: string
) {
  // Cache in closure
  const cache = createCache<DataType>();

  // Return Function
  const callAPI = async (
    setData: (data: DataType) => void,
    utility: Utilities,
    ...restOfPathVariables: PathFormat[]
  ): Promise<void> => {
    setData(defaultData);

    const cacheData = cache.getCache(utility);
    if (cacheData) {
      console.log(`Got ${endpointPath} for ${utility} from Local Cache`);
      return setData(cacheData);
    }

    const requestURL = restOfPathVariables.reduce(
      (fullPath, currentVar) => `${fullPath}/${currentVar}`,
      `${apiURL}/${endpointPath}/${utility}`
    );
    const response = await fetch(requestURL);

    if (response.ok === false) {
      console.error("API Call Failed Retrying...");
      console.error(response);
      setTimeout(() => callAPI(setData, utility, ...restOfPathVariables), 2000);
      return;
    }

    const result: DataType = await response.json();

    const data: DataType = unpacker(result);

    cache.setCache(utility, data);
    setData(data);
  };
  return callAPI;
}

/**
 * Get Daily intensity average from the API for endpoint .../v1/carbon_intensity/average/<utility>
 *
 * @param setData Function to setData given by useState
 * @param utility Utility Name
 *
 * @returns API data, from the API itself or the local cache - if the function has been run before
 */
const retriveDailyIntensity = createAPIInterface<DailyCarbonData[], never>(
  defaultDailyCarbon,
  (raw) => raw["data"]["carbon_intensity_average"]["data"],
  "carbon_intensity/average"
);

/**
 * Get Daily intensity averages by Month from the API for endpoint .../v1/carbon_intensity/average/month/<utility>
 *
 * @param setData Function to setData given by useState
 * @param utility Utility Name
 *
 * @returns API data, from the API itself or the local cache - if the function has been run before
 */
const retriveDailyIntensityByMonth = createAPIInterface<
  DailyCarbonDataByMonth[],
  never
>(
  defaultDailyCarbonMonth,
  (raw) => raw["data"]["carbon_intensity_average"]["data"],
  "carbon_intensity/average/month"
);

/**
 * Get Carbon Intensity Forecast from API for endpoint .../v1/carbon_intensity/forecast/<utility>
 *
 * @param setData Function to setData given by useState
 * @param utility Utility Name
 * @param fromDate From Date in format YYYY-MM-DD
 * @param toDate To Date in format YYYY-MM-DD
 *
 * @returns API data, from the API itself or the local cache - if the function has been run before
 */
const retriveForecast = createAPIInterface<CarbonIntensityForecast[], string>(
  defaultCarbonIntensityForecast,
  (raw) => raw["data"]["forecast"],
  `carbon_intensity/forecast`
);

/**
 * Uses JS's date object to check whether both dates are on the same day
 *
 * @param first JS Date object
 * @param second JS Date object
 *
 * @returns Boolean - Are these two dates on the same day?
 */
const datesAreOnSameDay = (first: Date, second: Date): Boolean =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

/**
 * Find data for 'today' from the Forecast Data
 *
 * @param forecastData - Forecast Data Array
 *
 * @returns - Filtered Array, with Data just from today
 */
const findTodaysData = (forecastData: CarbonIntensityForecast[]) => {
  const now = new Date();
  return forecastData.filter((hourData: CarbonIntensityForecast) => {
    const day = new Date(Date.parse(hourData.forecast_timestamp));
    day.setHours(day.getHours() - 9); // Re-adjust for UTC Output from API
    return datesAreOnSameDay(now, day);
  });
};

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
    findTodaysData,
  },
};
