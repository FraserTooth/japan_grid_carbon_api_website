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
const defaultDailyCarbonMonth: DailyCarbonDataByMonth = [
  [{ carbon_intensity: 0, hour: 0 }],
];

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

export default {
  daily: {
    default: defaultDailyCarbon,
    retrive: retriveDailyIntensity,
  },
  byMonth: {
    default: defaultDailyCarbonMonth,
    retrive: retriveDailyIntensityByMonth,
  },
};
