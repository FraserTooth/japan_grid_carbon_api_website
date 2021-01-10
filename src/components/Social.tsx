import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { TwitterIcon, TwitterShareButton } from "react-share";

const useStyles = makeStyles({
  socialBlock: {
    marginTop: "10px",
    marginBottom: "10px",
  },
});

export default function Social() {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Box className={classes.socialBlock}>
      <TwitterShareButton
        url="https://www.denkicarbon.jp"
        title={t("social.twitter")}
        hashtags={["denkicarbon"]}
      >
        <TwitterIcon size={32} round={true} />
      </TwitterShareButton>
    </Box>
  );
}
