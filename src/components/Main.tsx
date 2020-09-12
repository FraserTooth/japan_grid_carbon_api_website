import React, { useState, useEffect } from "react";
import ReactGA from "react-ga";
import Graph from "./Graph";
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

  const [dailyCarbonByMonth, setDailyCarbonByMonth] = useState(
    intensity.byMonth.default
  );

  const [
    dailyCarbonByMonthAndWeekday,
    setDailyCarbonByMonthAndWeekday,
  ] = useState(intensity.byMonth.default);

  const [utility, setUtility] = useState(supportedUtilities[0]);

  const carbonIntensity =
    Math.round(dailyCarbonByMonth[month]?.[hourIndex]?.carbon_intensity) || 0;

  useEffect(() => {
    // retriveDailyIntensity(setDailyCarbon, "tepco");
    intensity.byMonth.retrive(setDailyCarbonByMonth, utility);
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
        <Graph data={dailyCarbonByMonth[month] ?? null} />
        <Divider variant="middle" />
        <Explanation />
      </Box>
    </Container>
  );
}
