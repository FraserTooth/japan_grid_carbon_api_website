import React from "react";
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
  return (
    <Container>
      <Box className={classes.languageSelect}>
        <Button size="small" onClick={() => i18n.changeLanguage("ja")}>
          日本語
        </Button>
        |
        <Button size="small" onClick={() => i18n.changeLanguage("en")}>
          EN
        </Button>
      </Box>
      <Main />
      <Copyright />
    </Container>
  );
}

export default App;
