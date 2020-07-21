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
  Box,
  CircularProgress,
  Card,
  Typography,
  makeStyles,
} from "@material-ui/core";

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
  const classes = useStyles();
  const renderLineChart = (
    <LineChart width={500} height={300} data={props.data}>
      <Line type="monotone" dataKey="carbon_intensity" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="index" />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
    </LineChart>
  );

  return (
    <Card className={classes.graphCard}>
      <Typography variant="h6">
        Carbon Intensity over a given day, averaged from the last 4 years of
        data
      </Typography>
      {props.data.length > 1 ? renderLineChart : <CircularProgress />}
    </Card>
  );
}
