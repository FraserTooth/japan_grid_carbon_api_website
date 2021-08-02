import React from "react";

import { Card, Typography, Box, makeStyles } from "@material-ui/core";

import { useTranslation } from "react-i18next";

export const timeFormatter = (tick: number) => {
  if (tick === 24) return "00:00";
  if (tick < 10) return `0${tick}:00`;
  return `${tick}:00`;
};

const useStyles = makeStyles({
  tooltip: {
    padding: "2px",
    fontSize: "10px",
  },
  intensity: {
    display: "inline-block",
    fontSize: "12px",
  },
  time: {
    fontSize: "15px",
  },
});

export default function CustomTooltip({ payload, label, active }: any) {
  const classes = useStyles();
  const { t } = useTranslation();

  if (active) {
    const dp = payload[0].payload;

    const dataBit = (
      data: any,
      label: string,
      color: string,
      index: number
    ) => {
      return data ? (
        <div key={`tooltip-${index}`}>
          <div style={{ color, display: "inline-block" }}>{label}</div>
          {": "}
          <Typography
            className={classes.intensity}
            variant="h6"
            component="h1"
            gutterBottom
          >
            {Math.round(data)}
          </Typography>
          gCO₂/kWh
        </div>
      ) : (
        <div></div>
      );
    };

    const lines = payload
      .filter((line: any) => ["average", "forecast"].includes(line.dataKey))
      .map((line: any, index: number) => {
        return dataBit(
          dp[line.dataKey],
          t(`graph.${line.dataKey}`),
          line.stroke,
          index
        );
      });

    return (
      <Card className={classes.tooltip}>
        <Box style={{ paddingLeft: "5px", paddingRight: "5px" }}>
          <Typography className={classes.time}>
            {timeFormatter(dp.hour)}
          </Typography>
          {lines}
        </Box>
      </Card>
    );
  }

  return null;
}
