const apiURL = process.env.REACT_APP_API_URL
console.log("API URL: ", apiURL)

export interface DailyCarbonData {
  hour: number;
  carbon_intensity: number;
}
const defaultDailyCarbon: DailyCarbonData[] = [
  { carbon_intensity: 0, hour: 0 },
];

export interface DailyCarbonDataByMonth {
  month: number;
  data: DailyCarbonData[]
}
const defaultDailyCarbonMonth: DailyCarbonDataByMonth[] = [{
  month: 1,
  data: defaultDailyCarbon,
}];

export interface CarbonIntensityForecast {
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
  setData: (data: CarbonIntensityForecast[]) => void,
  utility: string
): Promise<void> => {
  setData(defaultCarbonIntensityForecast);
  const response = await fetch(
    `${apiURL}/carbon_intensity/forecast/${utility}`
  );

  const result = await response.json();

  const data: CarbonIntensityForecast[] =
    result["data"]["forecast"];

  setData(data);
};

const datesAreOnSameDay = (first: Date, second: Date) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

const findTodaysData = (forecastData: CarbonIntensityForecast[]) => {
  const now = new Date();
  return forecastData.filter((hourData: CarbonIntensityForecast) => {
    const day = new Date(Date.parse(hourData.forecast_timestamp))
    day.setHours(day.getHours() - 9); // Re-adjust for UTC Output from API
    return datesAreOnSameDay(now, day)
  })
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
    findTodaysData 
  }
};
