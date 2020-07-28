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
  const date = new Date();
  const month = date.getMonth() + 1;
  const renderLineChart = (
    <LineChart width={500} height={300} data={props.data}>
      <Line type="monotone" dataKey="carbon_intensity" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="hour" />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
    </LineChart>
  );

  return (
    <Card className={classes.graphCard}>
      <Typography variant="h6">
        {t("carbonGraphTitle1") + t(`month${month}`) + t("carbonGraphTitle2")}
      </Typography>
      {props.data.length > 1 ? renderLineChart : <CircularProgress />}
    </Card>
  );
}
