import React from "react";
import { useTranslation, Trans } from "react-i18next";

import {
  Box,
  Container,
  Typography,
  makeStyles,
  Link,
} from "@material-ui/core";

const useStyles = makeStyles({
  explanation: {
    marginTop: "30px",
  },
  explanationTitle: {
    "text-transform": "capitalize",
  },
});

export default function Explanation() {
  const classes = useStyles();
  const { t } = useTranslation();

  const preventDefault = (event: React.SyntheticEvent) =>
    event.preventDefault();

  const carbonLink = (
    <Link href="https://carbonintensity.org.uk/" onClick={preventDefault}>
      {t("explanation.howSection.carbonIntensityLinkText")}
    </Link>
  );

  const repoLink = (
    <Link
      href="https://github.com/FraserTooth/japan_grid_carbon_api"
      onClick={preventDefault}
    >
      {t("explanation.helpSection.repoText")}
    </Link>
  );

  return (
    <Box className={classes.explanation}>
      <Typography variant="h5" className={classes.explanationTitle}>
        {t("explanation.probablySection.title")}
      </Typography>
      <Typography>
        {t("explanation.probablySection.paragraph", { joinArrays: "\n" })}
      </Typography>

      <br></br>

      <Typography variant="h5" className={classes.explanationTitle}>
        {t("explanation.howSection.title")}
      </Typography>
      <Typography>
        {t("explanation.howSection.paragraph", { joinArrays: "\n" })}
      </Typography>
      <Typography>
        <Trans
          i18nKey="explanation.howSection.carbonIntensityLink"
          components={{ carbonLink }}
        />
      </Typography>

      <br></br>

      <Typography variant="h5" className={classes.explanationTitle}>
        {t("explanation.helpSection.title")}
      </Typography>
      <Typography>
        <Trans
          i18nKey="explanation.helpSection.repo"
          components={{ repoLink }}
        />
      </Typography>
    </Box>
  );
}
