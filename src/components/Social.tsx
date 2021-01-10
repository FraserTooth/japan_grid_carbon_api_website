import React from "react";
import { Utilities } from "./api/denkicarbon";
import { Box, makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import {
  TwitterIcon,
  TwitterShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
} from "react-share";

interface SocialProps {
  carbonIntensity: number;
  utility: Utilities;
}

const useStyles = makeStyles({
  socialBlock: {
    marginTop: "10px",
    marginBottom: "10px",
  },
});

export default function Social(props: SocialProps) {
  const classes = useStyles();
  const { t } = useTranslation();

  // Posted in the Social Links
  const carbonIntensity = props.carbonIntensity;
  const utility = t(`utilities.${props.utility}`);
  const hashtags: string[] = t("social.hashtags", { returnObjects: true });

  return (
    <Box className={classes.socialBlock}>
      <TwitterShareButton
        url="https://www.denkicarbon.jp"
        title={t("social.twitter", { utility, carbonIntensity })}
        hashtags={hashtags}
      >
        <TwitterIcon size={32} round={true} />
      </TwitterShareButton>
    </Box>
  );
}
