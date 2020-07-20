import React, { useState, useEffect } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";

import { Box } from "@material-ui/core";
import axios from "axios";

export default function Graph() {
  // Declare a new state variable, which we'll call "count"  #
  const [dailyCarbon, setDailyCarbon] = useState([{}]);

  useEffect(() => {
    async function fetchData() {
      const result = await axios.post(
        "https://us-central1-japan-grid-carbon-api.cloudfunctions.net/daily_carbon_intensity",
        {
          utility: "tepco",
        }
      );

      const data: any[] = Object.keys(result.data).map((key) => {
        return result.data[key];
      });

      console.log(data);

      setDailyCarbon(data);
    }
    fetchData();
  }, []);

  const renderLineChart = (
    <LineChart width={600} height={300} data={dailyCarbon}>
      <Line type="monotone" dataKey="carbon_intensity" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="index" />
      <YAxis />
    </LineChart>
  );

  return <Box>{renderLineChart}</Box>;
}
