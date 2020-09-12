import React, { useEffect } from "react";
import ReactGA from "react-ga";
import "./App.css";
import Main from "./components/Main";

import {
  Box,
  Container,
  Typography,
  Link,
  Button,
  makeStyles,
} from "@material-ui/core";

import { useTranslation } from "react-i18next";

ReactGA.initialize("UA-48407359-4", { standardImplementation: true });

const useStyles = makeStyles({
  copyright: {
    margin: "10px",
  },
  languageSelect: {
    position: "fixed",
    top: 0,
    right: 0,
    backgroundColor: "white",
  },
});

function Copyright() {
  const classes = useStyles();
  return (
    <Container className={classes.copyright}>
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="https://frasertooth.dev/">
          Fraser Tooth
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </Container>
  );
}

function App() {
  const classes = useStyles();
  const { i18n } = useTranslation();

  useEffect(() => {
    ReactGA.initialize("UA-48407359-4", { standardImplementation: true });
    ReactGA.pageview(window.location.pathname);
  });

  return (
    <Container>
      <Box className={classes.languageSelect}>
        <Button size="small" onClick={() => i18n.changeLanguage("ja")}>
          ja
        </Button>
        |
        <Button size="small" onClick={() => i18n.changeLanguage("en")}>
          en
        </Button>
      </Box>
      <Main />
      <Copyright />
    </Container>
  );
}

export default App;
