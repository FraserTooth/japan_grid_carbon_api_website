import React, { useState, useEffect } from "react";
import axios from "axios";

import Graph from "./Graph";
import { useTranslation } from "react-i18next";

import { Box, Container, Typography } from "@material-ui/core";

interface DailyCarbonData {
  [key: string]: number;
  hour: number;
  carbon_intensity: number;
}

const carbonIntensityColor = (carbonIntensity: number): string => {
  const maxIntensity = 900;

  const hueCalc = 100 - Math.floor((carbonIntensity / maxIntensity) * 100);

  const hue = hueCalc > 0 ? hueCalc : 0;

  console.log(`hsl(${hue},100%,100%)`);

  return `hsl(${hue},100%,50%)`;
};

const retriveDailyIntensity = async (
  setData: (data: DailyCarbonData[]) => void
): Promise<void> => {
  const result = await axios.post(
    "https://us-central1-japan-grid-carbon-api.cloudfunctions.net/daily_carbon_intensity",
    {
      utility: "tepco",
    }
  );

  const data: DailyCarbonData[] =
    result.data["data"]["carbon_intensity_by_hour"];

  setData(data);
};

const retriveDailyIntensityByMonth = async (
  setData: (data: DailyCarbonData[]) => void
): Promise<void> => {
  const result = await axios.post(
    "https://us-central1-japan-grid-carbon-api.cloudfunctions.net/daily_carbon_intensity_by_month",
    {
      utility: "tepco",
    }
  );

  const data: DailyCarbonData[] =
    result.data["data"]["carbon_intensity_by_month"];

  setData(data);
};

export default function Main() {
  const { t } = useTranslation();
  const date = new Date();
  const hour = date.getHours();
  const month = date.getMonth();

  const defaultDailyCarbon: DailyCarbonData[] = [
    { carbon_intensity: 0, hour: 0 },
  ];
  const [dailyCarbon, setDailyCarbon] = useState(defaultDailyCarbon);

  const defaultDailyCarbonMonth: DailyCarbonData[] = [
    { carbon_intensity: 0, hour: 0 },
  ];
  const [dailyCarbonByMonth, setDailyCarbonByMonth] = useState(
    defaultDailyCarbonMonth
  );

  const carbonIntensity = Math.round(dailyCarbon[hour]?.carbon_intensity) || 0;

  useEffect(() => {
    retriveDailyIntensity(setDailyCarbon);
    retriveDailyIntensityByMonth(setDailyCarbonByMonth);
  }, []);

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h5" component="h1" gutterBottom>
          {t("theCarbonIs") + t("probably") + ":"}
        </Typography>
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
      </Box>
    </Container>
  );
}
