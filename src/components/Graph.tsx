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

function CustomTooltip({ payload, label, active }: any) {
  const classes = useStyles();
  if (active) {
    return (
      <Card className={classes.tooltip}>
        <Typography
          variant="h6"
          component="h1"
          gutterBottom
          style={{ display: "inline-block" }}
        >
          {Math.round(payload[0].value)}
        </Typography>
        gC02/kWh
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

  const timeFormatter = (tick: number) => {
    return `${tick}:00`;
  };

  // Add wrap around for the graph
  const adjustedData = JSON.parse(JSON.stringify(props.data));
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
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
    </LineChart>
  );

  return (
    <Card className={classes.graphCard}>
      <Typography variant="h6">
        {t("carbonGraphTitle", { month: t(`months.${month - 1}`) })}
      </Typography>
      {props.data.length > 1 ? renderLineChart : <CircularProgress />}
    </Card>
  );
}
