import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";

import { Box, CircularProgress } from "@material-ui/core";

export default function Graph(props: any) {
  const renderLineChart = (
    <LineChart width={600} height={300} data={props.data}>
      <Line type="monotone" dataKey="carbon_intensity" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="index" />
      <YAxis />
    </LineChart>
  );

  return (
    <Box>{props.data.length > 1 ? renderLineChart : <CircularProgress />}</Box>
  );
}
