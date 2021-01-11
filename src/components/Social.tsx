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
  icons: {
    marginRight: "5px",
  },
});

export default function Social(props: SocialProps) {
  const classes = useStyles();
  const { t } = useTranslation();

  // Posted in the Social Links
  const carbonIntensity = props.carbonIntensity;
  const utility = t(`utilities.${props.utility}`);
  const hashtags: string[] = t("social.hashtags", { returnObjects: true });

  const url = "denkicarbon.jp";

  return (
    <Box className={classes.socialBlock}>
      <TwitterShareButton
        disabled={carbonIntensity === 0}
        disabledStyle={{ opacity: 0.2 }}
        className={classes.icons}
        url={url}
        title={t("social.twitter", { utility, carbonIntensity })}
        hashtags={hashtags}
      >
        <TwitterIcon size={32} round={true} />
      </TwitterShareButton>
      <FacebookShareButton
        disabled={carbonIntensity === 0}
        disabledStyle={{ opacity: 0.2 }}
        className={classes.icons}
        url={url}
        quote={t("social.facebook", { utility, carbonIntensity })}
        hashtag={hashtags[0]}
      >
        <FacebookIcon size={32} round={true} />
      </FacebookShareButton>
      <LinkedinShareButton
        disabled={carbonIntensity === 0}
        disabledStyle={{ opacity: 0.2 }}
        className={classes.icons}
        url={url}
        title="Denki Carbon"
        summary={t("social.linkedin", { utility, carbonIntensity })}
      >
        <LinkedinIcon size={32} round={true} />
      </LinkedinShareButton>
    </Box>
  );
}
