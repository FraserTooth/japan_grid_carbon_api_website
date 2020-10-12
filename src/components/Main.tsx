import React, { useState, useEffect } from "react";
import Graph from "./graph/Graph";
import Explanation from "./Explanation";
import Title from "./Title";
import intensity, { LocationUtils } from "./API";

import { Box, Container, Typography, Divider } from "@material-ui/core";

const supportedUtilities = [
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
];

const utilityGeocoordinates = {
    "tepco"     : {
        latitude : 35.694003,
        longitude: 139.753594
    },
    "kepco"     : {
        latitude : 35.033333,
        longitude: 126.716667
    },
    "tohokuden" : {
        latitude : 38.269167,
        longitude: 140.870556
    },
    "chuden"    : {
        latitude : 35.183333,
        longitude: 136.9
    },
    "hepco"     : {
        latitude : 43.066667,
        longitude: 141.35
    },
    "rikuden"   : {
        latitude : 36.695917,
        longitude: 137.213694
    },
    "cepco"     : {
        latitude : 34.383333,
        longitude: 132.45
    },
    "yonden"    : {
        latitude : 34.35,
        longitude: 134.05
    },
    "kyuden"    : {
        latitude : 33.583333,
        longitude: 130.4
    },
    "okiden"    : {
        latitude : 26.245833,
        longitude: 127.721944
    }
}

const carbonIntensityColor = (carbonIntensity: number): string => {
  const maxIntensity = 900;
  const hueCalc = 100 - Math.floor((carbonIntensity / maxIntensity) * 100);
  const hue = hueCalc > 0 ? hueCalc : 0;
  console.log(`hsl(${hue},100%,100%)`);
  return `hsl(${hue},100%,50%)`;
};

export default function Main() {
  const date = new Date();
  const hourIndex = date.getHours();
  const month = date.getMonth() + 1;
  const weekday = date.getDay(); // 0-6, 0 is Sunday in JS
  const weekdayInAPI = weekday === 0 ? 7 : weekday; // No Zero in API, 1-7, 1 is Monday

  const [
    dailyCarbonByMonthAndWeekday,
    setDailyCarbonByMonthAndWeekday,
  ] = useState(intensity.byMonthWeekday.default);

  const [utility, setUtility] = useState(supportedUtilities[0]);

  useEffect(() => {
    LocationUtils.fetchUtilityBasedOnGeolocation(utilityGeocoordinates, setUtility);
  }, []);

  const carbonIntensity =
    Math.round(
      dailyCarbonByMonthAndWeekday[month]?.[weekdayInAPI]?.[hourIndex]
        ?.carbon_intensity
    ) || 0;

  useEffect(() => {
    // intensity.byMonth.retrive(setDailyCarbonByMonth, utility);
    intensity.byMonthWeekday.retrive(setDailyCarbonByMonthAndWeekday, utility);
  }, [utility]);

  const now = new Date();
  const [predictionData, setpredictionData] = useState(intensity.prediction.default);
  const [predictionYear, setPredictionYear] = useState(now.getFullYear());

  useEffect(() => {
    intensity.prediction.retrive(setpredictionData, utility, predictionYear);
  }, [predictionYear, utility]);


  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Title
          updateUtility={setUtility}
          utilityIndex={supportedUtilities.indexOf(utility)}
          supportedUtilities={supportedUtilities}
        />
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
        <Graph 
          data={dailyCarbonByMonthAndWeekday ?? null} 
          predictionData={predictionData ?? null} 
          setPredictionYear={setPredictionYear} 
          predictionYear={predictionYear}
        />
        <Divider variant="middle" />
        <Explanation />
      </Box>
    </Container>
  );
}
