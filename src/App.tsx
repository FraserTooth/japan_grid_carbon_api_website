import React from "react";
import "./App.css";
import Graph from "./components/Graph";

import { Box, Container, Typography, Link } from "@material-ui/core";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://frasertooth.dev/">
        Fraser Tooth
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function App() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          The Carbon Intensity in Tokyo today is:
        </Typography>
        <Graph />
        <Copyright />
      </Box>
    </Container>
  );
}

export default App;
