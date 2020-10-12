import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import {
  CircularProgress,
  Card,
  makeStyles,
} from "@material-ui/core";

import Title from "./Title";
import useWindowDimensions from "./resize";
import CustomTooltip, { timeFormatter } from "./Tooltip";

import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  graphCard: {
    padding: "10px",
  },
});

const INDUSTRY_TARGET_2030 = 370;

export default function Graph(props: any) {
  const classes = useStyles();
  const { t } = useTranslation();

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const monthInAPI = month + 1;
  const weekday = now.getDay(); // 0-6, 0 is Sunday in JS
  const weekdayInAPI = weekday === 0 ? 7 : weekday; // No Zero in API, 1-7, 1 is Monday
  const weekdayInMenu = weekdayInAPI - 1;

  const [monthChoice, setMonthChoice] = useState(month);
  const [weekdayChoice, setWeekdayChoice] = useState(weekdayInMenu);

  const { width } = useWindowDimensions();
  const graphWidth = width > 700 ? 500 : width - 100;

  const lineInfo = {
    today: {
      color: "#8884d8",
      type: "line",
      name: String(t("graph.todayLine")),
    },
    compare: {
      color: "red",
      type: "line",
      name: String(t("graph.compareLine")),
    },
    target: {
      color: "green",
      type: "line",
      strokeDasharray: "6 6",
      name: String(t("graph.targetLine")),
    },
  };

  const legendPayload: ReadonlyArray<any> = [
    {
      value: lineInfo.today.name,
      id: 1,
      type: "line",
      color: lineInfo.today.color,
    },
    {
      value: lineInfo.compare.name,
      id: 2,
      type: "none",
      color: lineInfo.compare.color,
    },
    {
      value: lineInfo.target.name,
      id: 3,
      type: "plainline",
      payload: {
        strokeDasharray: lineInfo.target.strokeDasharray,
      },
      color: lineInfo.target.color,
    },
  ];

  if (Object.keys(props.data).length < 12) {
    //Don't render if not enough data yet
    return <CircularProgress />;
  }

  let data = props.data[monthInAPI][weekdayInAPI];

  data = data.map((dp: any, i: number) => {
    // Add 2030 target
    const newDP = {
      target2030: INDUSTRY_TARGET_2030,
      ...dp,
    };
    // Add Comparison Data to chart and legend, if we have it
    if (monthChoice !== month || weekdayChoice !== weekdayInMenu || props.predictionYear !== year) {
      const comparisonData = props.predictionData?.[monthChoice + 1]?.[weekdayChoice + 1];
      newDP.comparison = comparisonData?.[i].predicted_carbon_intensity;
      legendPayload[1].type = "line";
    }

    return newDP;
  });

  // Copy first Datapoint to the Back, with hour '24' so we get a neat 'midnight to midnight' line
  const adjustedData = JSON.parse(JSON.stringify(data));
  const wrapAround = JSON.parse(JSON.stringify(adjustedData[0]));
  wrapAround.hour = 24;
  adjustedData.push(wrapAround);

  const renderLineChart = (
    <LineChart width={graphWidth} height={300} data={adjustedData}>
      <Line
        name={lineInfo.today.name}
        type="monotone"
        dataKey="carbon_intensity"
        stroke={lineInfo.today.color}
      />
      <Line
        name={lineInfo.compare.name}
        type="monotone"
        dataKey="comparison"
        stroke={lineInfo.compare.color}
      />
      <Line
        name={lineInfo.target.name}
        type="monotone"
        dataKey="target2030"
        stroke={lineInfo.target.color}
        strokeDasharray="3 3"
        dot={false}
      />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis
        dataKey="hour"
        tickFormatter={timeFormatter}
        type="number"
        interval="preserveStartEnd"
      />
      <YAxis
        label={{ value: "gC02/kWh", angle: -90, position: "insideLeft" }}
        domain={[0, 900]}
      />
      <Tooltip content={<CustomTooltip />} />
      <Legend verticalAlign="bottom" height={36} payload={legendPayload} />
    </LineChart>
  );

  return (
    <Card className={classes.graphCard}>
      <Title
        setMonthChoice={setMonthChoice}
        setWeekdayChoice={setWeekdayChoice}
        predictionYear={props.predictionYear}
        setPredictionYear={props.setPredictionYear} 
        monthChoice={monthChoice}
        weekdayChoice={weekdayChoice}
      />
      <br />
      {renderLineChart}
    </Card>
  );
}
