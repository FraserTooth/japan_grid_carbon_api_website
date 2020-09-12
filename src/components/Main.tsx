import React, { useState, useEffect } from "react";
import ReactGA from "react-ga";
import Graph from "./graph/Graph";
import Explanation from "./Explanation";
import Title from "./Title";
import intensity from "./API";

import { Box, Container, Typography, Divider } from "@material-ui/core";

const supportedUtilities = ["tepco", "kepco", "tohokuden"];

const carbonIntensityColor = (carbonIntensity: number): string => {
  const maxIntensity = 900;
  const hueCalc = 100 - Math.floor((carbonIntensity / maxIntensity) * 100);
  const hue = hueCalc > 0 ? hueCalc : 0;
  console.log(`hsl(${hue},100%,100%)`);
  return `hsl(${hue},100%,50%)`;
};

export const GApageView = (page: string) => {
  ReactGA.pageview(page);
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

  const carbonIntensity =
    Math.round(
      dailyCarbonByMonthAndWeekday[month]?.[weekdayInAPI]?.[hourIndex]
        ?.carbon_intensity
    ) || 0;

  useEffect(() => {
    // retriveDailyIntensity(setDailyCarbon, "tepco");
    // intensity.byMonth.retrive(setDailyCarbonByMonth, utility);
    intensity.byMonthWeekday.retrive(setDailyCarbonByMonthAndWeekday, utility);
  }, [utility]);

  useEffect(() => {
    GApageView("main");
  }, []);

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Title
          updateUtility={setUtility}
          utility={utility}
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
        <Graph data={dailyCarbonByMonthAndWeekday ?? null} />
        <Divider variant="middle" />
        <Explanation />
      </Box>
    </Container>
  );
}
