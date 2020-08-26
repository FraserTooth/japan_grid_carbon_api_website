import React, { useState, useEffect } from "react";

import Graph from "./Graph";
import Explanation from "./Explanation";
import Title from "./Title";

import { Box, Container, Typography, Divider } from "@material-ui/core";

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

const carbonIntensityColor = (carbonIntensity: number): string => {
  const maxIntensity = 900;

  const hueCalc = 100 - Math.floor((carbonIntensity / maxIntensity) * 100);

  const hue = hueCalc > 0 ? hueCalc : 0;

  console.log(`hsl(${hue},100%,100%)`);

  return `hsl(${hue},100%,50%)`;
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

export default function Main() {
  const date = new Date();
  const hourIndex = date.getHours();
  const month = date.getMonth() + 1;

  // const [dailyCarbon, setDailyCarbon] = useState(defaultDailyCarbon);

  const [dailyCarbonByMonth, setDailyCarbonByMonth] = useState(
    defaultDailyCarbonMonth
  );

  const carbonIntensity =
    Math.round(dailyCarbonByMonth[month]?.[hourIndex]?.carbon_intensity) || 0;

  const updateUtility = (utility: string) => {
    retriveDailyIntensityByMonth(setDailyCarbonByMonth, utility);
  };

  useEffect(() => {
    // retriveDailyIntensity(setDailyCarbon, "tepco");
    updateUtility("tepco");
  }, []);

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Title updateUtility={updateUtility} />
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          style={{
            display: "inline-block",
            color: carbonIntensityColor(carbonIntensity),
          }}
        >
          {carbonIntensity}
        </Typography>
        <Typography style={{ display: "inline-block" }}>gC02/kWh</Typography>
        <Graph data={dailyCarbonByMonth[month] ?? defaultDailyCarbon} />
        <Divider variant="middle" />
        <Explanation />
      </Box>
    </Container>
  );
}
