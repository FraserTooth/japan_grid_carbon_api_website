import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Container, Typography, makeStyles } from "@material-ui/core";

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
  return (
    <Box className={classes.explanation}>
      <Typography variant="h5" className={classes.explanationTitle}>
        {t("explanation.probablySection.probably") + "?"}
      </Typography>
      <Typography>
        {t("explanation.probablySection.paragraph", { joinArrays: "\n" })}
      </Typography>
    </Box>
  );
}
