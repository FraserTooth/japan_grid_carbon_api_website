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
  },
});

export default function CustomTooltip({ payload, label, active }: any) {
  const classes = useStyles();
  const { t } = useTranslation();

  if (active) {
    const dp = payload[0].payload;

    const dataBit = (data: any, label: string) => {
      return data ? (
        <div>
          {label + ": "}
          <Typography
            variant="h6"
            component="h1"
            gutterBottom
            style={{ display: "inline-block" }}
          >
            {Math.round(data)}
          </Typography>
          gC02/kWh
        </div>
      ) : (
        <div></div>
      );
    };

    return (
      <Card className={classes.tooltip}>
        <Box style={{ paddingLeft: "5px", paddingRight: "5px" }}>
          <Typography>{timeFormatter(dp.hour)}</Typography>
          {dataBit(dp.forecast, t("graph.forecast"))}
          {dataBit(dp.average, t("graph.average"))}
          {dataBit(dp.comparison, t("graph.compare"))}
        </Box>
      </Card>
    );
  }

  return null;
}
