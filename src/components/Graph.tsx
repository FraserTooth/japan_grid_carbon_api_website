import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  CircularProgress,
  Card,
  Typography,
  makeStyles,
  Box,
} from "@material-ui/core";

import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  tooltip: {
    padding: "2px",
  },
  graphCard: {
    padding: "10px",
  },
});

const timeFormatter = (tick: number) => {
  if (tick === 24) return "00:00";
  if (tick < 10) return `0${tick}:00`;
  return `${tick}:00`;
};

function CustomTooltip({ payload, label, active }: any) {
  const classes = useStyles();
  if (active) {
    const dp = payload[0].payload;
    return (
      <Card className={classes.tooltip}>
        <Box style={{ paddingLeft: "5px", paddingRight: "5px" }}>
          <Typography>{timeFormatter(dp.hour)}</Typography>
          <Typography
            variant="h6"
            component="h1"
            gutterBottom
            style={{ display: "inline-block" }}
          >
            {Math.round(dp.carbon_intensity)}
          </Typography>
          gC02/kWh
        </Box>
      </Card>
    );
  }

  return null;
}

export default function Graph(props: any) {
  const { t } = useTranslation();
  const classes = useStyles();
  const now = new Date();
  const month = now.getMonth() + 1;

  if (Object.keys(props.data).length < 12) {
    //Don't render if not enough data yet
    return <CircularProgress />;
  }
  // Add wrap around for the graph

  const monthsData = props.data[month];

  const adjustedData = JSON.parse(JSON.stringify(monthsData));
  const wrapAround = JSON.parse(JSON.stringify(adjustedData[0]));
  wrapAround.hour = 24;
  adjustedData.push(wrapAround);

  const renderLineChart = (
    <LineChart width={500} height={300} data={adjustedData}>
      <Line type="monotone" dataKey="carbon_intensity" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis
        dataKey="hour"
        tickFormatter={timeFormatter}
        type="number"
        interval="preserveStartEnd"
      />
      <YAxis
        label={{ value: "gC02/kWh", angle: -90, position: "insideLeft" }}
      />
      <Tooltip content={<CustomTooltip />} />
    </LineChart>
  );

  return (
    <Card className={classes.graphCard}>
      <Typography variant="h6" align="center">
        {t("carbonGraphTitle", { month: t(`months.${month - 1}`) })}
      </Typography>
      <br />
      {renderLineChart}
    </Card>
  );
}
