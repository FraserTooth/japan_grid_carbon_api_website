import React from "react";
import { useTranslation, Trans } from "react-i18next";

import { Box, Typography, makeStyles, Link } from "@material-ui/core";

const useStyles = makeStyles({
  explanation: {
    marginTop: "30px",
  },
  explanationTitle: {
    "text-transform": "capitalize",
  },
  section: {
    marginTop: "20px",
    marginBottom: "20px",
  },
});

export default function Explanation() {
  const classes = useStyles();
  const { t } = useTranslation();

  const transLink = (url: string) => <Link href={url}></Link>;

  const buildParagraph = (key: string): any => {
    const sectionArray: any = t(key, {
      returnObjects: true,
    });
    return sectionArray.map((line: string) => <Typography>{line}</Typography>);
  };

  return (
    <Box className={classes.explanation}>
      <Box className={classes.section}>
        <Typography variant="h5" className={classes.explanationTitle}>
          {t("explanation.probablySection.title")}
        </Typography>
        {buildParagraph("explanation.probablySection.paragraph")}
      </Box>

      <Box className={classes.section}>
        <Typography variant="h5" className={classes.explanationTitle}>
          {t("explanation.howSection.title")}
        </Typography>
        {buildParagraph("explanation.howSection.paragraph")}
        <Typography>
          <Trans
            i18nKey="explanation.howSection.carbonIntensityLink"
            components={{
              carbonLink: transLink("https://carbonintensity.org.uk/"),
            }}
          />
        </Typography>
      </Box>

      <Box className={classes.section}>
        <Typography variant="h5" className={classes.explanationTitle}>
          {t("explanation.helpSection.title")}
        </Typography>
        <Typography>
          <Trans
            i18nKey="explanation.helpSection.repoLink"
            components={{
              repoLink: transLink(
                "https://github.com/FraserTooth/japan_grid_carbon_api"
              ),
            }}
          />
        </Typography>
        <Typography>
          <Trans
            i18nKey="explanation.helpSection.sponsor"
            components={{
              contactLink: transLink("https://frasertooth.dev/"),
            }}
          />
        </Typography>
      </Box>
    </Box>
  );
}
