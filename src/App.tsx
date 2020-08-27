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

export const initGA = () => {
  ReactGA.initialize("UA-48407359-4"); // put your tracking id here
};

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
    initGA();
  }, []);
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
