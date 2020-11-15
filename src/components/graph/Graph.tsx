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

import {CarbonIntensityForecast, DailyCarbonDataByMonth} from '../api/denkicarbon'

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

interface GraphProps {
  monthData: DailyCarbonDataByMonth[],
  forecastData: CarbonIntensityForecast[]
}

export default function Graph(props: GraphProps) {
  const classes = useStyles();
  const { t } = useTranslation();

  const now = new Date();
  const month = now.getMonth();

  const [monthChoice, setMonthChoice] = useState(month);

  const { width } = useWindowDimensions();
  const graphWidth = width > 700 ? 500 : width - 100;

  const lineInfo = {
    average: {
      color: "orange",
      type: "line",
      name: String(t("graph.averageLine")),
    },
    forecast: {
      color: "#8884d8",
      type: "line",
      name: String(t("graph.forecast")),
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
      value: lineInfo.forecast.name,
      id: 1,
      type: "line",
      color: lineInfo.forecast.color,
    },
    {
      value: lineInfo.average.name,
      id: 2,
      type: "line",
      color: lineInfo.average.color,
    },
    {
      value: lineInfo.compare.name,
      id: 3,
      type: "none",
      color: lineInfo.compare.color,
    },
    {
      value: lineInfo.target.name,
      id: 4,
      type: "plainline",
      payload: {
        strokeDasharray: lineInfo.target.strokeDasharray,
      },
      color: lineInfo.target.color,
    },
  ];

  if (Object.keys(props.monthData).length < 12) {
    //Don't render if not enough data yet
    return <CircularProgress />;
  }

  
  let data = props.monthData[month].data
  
  data = data.map((dp: any, i: number) => {
    // Add 2030 target
    const newDP: any = {
      target2030: INDUSTRY_TARGET_2030,
      forecast: props.forecastData[i]?.forecast_value,
      average: dp.carbon_intensity,
      hour: dp.hour,
    };
    // Add Comparison Data to chart and legend, if we have it
    if (monthChoice !== month) {
      const comparisonData = props.monthData?.[monthChoice].data
      newDP.comparison = comparisonData?.[i].carbon_intensity;
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
        name={lineInfo.average.name}
        type="monotone"
        dataKey="average"
        stroke={lineInfo.average.color}
      />
      <Line
        name={lineInfo.forecast.name}
        type="monotone"
        dataKey="forecast"
        stroke={lineInfo.forecast.color}
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
        monthChoice={monthChoice}
      />
      <br />
      {renderLineChart}
    </Card>
  );
}
