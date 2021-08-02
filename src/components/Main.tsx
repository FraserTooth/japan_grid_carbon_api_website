import React, { useState, useEffect } from "react";
import Graph from "./graph/Graph";
import Explanation from "./Explanation";
import Title from "./Title";
import Social from "./Social";
import intensity, { supportedUtilities } from "./api/denkicarbon";
import moment from "moment";

import {
  Box,
  Container,
  Typography,
  Divider,
  CircularProgress,
} from "@material-ui/core";

const carbonIntensityColor = (carbonIntensity: number): string => {
  const maxIntensity = 900;
  const hueCalc = 100 - Math.floor((carbonIntensity / maxIntensity) * 100);
  const hue = hueCalc > 0 ? hueCalc : 0;
  console.log(`hsl(${hue},100%,100%)`);
  return `hsl(${hue},100%,50%)`;
};
const todayString = moment().format("YYYY-MM-DD");

export default function Main() {
  const date = new Date();
  const hourIndex = date.getHours();

  // Utility Choice
  const [utility, setUtility] = useState(supportedUtilities[0]);

  // Monthly Data
  const [dailyCarbonByMonth, setDailyCarbonByMonth] = useState(
    intensity.byMonth.default
  );
  useEffect(() => {
    intensity.byMonth.retrive(setDailyCarbonByMonth, utility);
  }, [utility]);

  // Forecast
  const [intensityForecast, setIntensityForecast] = useState(
    intensity.forecast.default
  );
  useEffect(() => {
    intensity.forecast.retrive(
      setIntensityForecast,
      utility,
      todayString,
      todayString
    );
  }, [utility]);

  const todaysForecastData = intensity.forecast.findTodaysData(
    intensityForecast
  );

  // Set Big Number
  const carbonIntensity =
    Math.round(todaysForecastData[hourIndex]?.forecast_value) || 0;

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Title
          updateUtility={setUtility}
          utilityIndex={supportedUtilities.indexOf(utility)}
          supportedUtilities={supportedUtilities}
        />
        {carbonIntensity === 0 ? (
          <CircularProgress />
        ) : (
          <div>
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
            <Typography style={{ display: "inline-block" }}>
              gCO₂/kWh
            </Typography>
            <Graph
              monthData={dailyCarbonByMonth ?? null}
              forecastData={todaysForecastData ?? null}
            />
          </div>
        )}
        <Social carbonIntensity={carbonIntensity} utility={utility} />
        <Divider variant="middle" />
        <Explanation />
      </Box>
    </Container>
  );
}
