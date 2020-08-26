import React, { useState } from "react";

import { useTranslation, Trans } from "react-i18next";

import {
  Typography,
  NativeSelect,
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

export default function Title(props: any) {
  const { t } = useTranslation();

  const supportedUtilities = ["tepco", "kepco", "tohokuden"];

  const [utilityChoice, setUtilityChoice] = useState(0);

  const classes = useStyles();

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: string }>
  ) => {
    const choice = parseInt(event.target.value);
    setUtilityChoice(choice);
    props.updateUtility(supportedUtilities[choice]);
  };

  const utilityMenu = (
    <NativeSelect value={utilityChoice} onChange={handleChange}>
      <option value={0}>{t(`utilities.${supportedUtilities[0]}`)}</option>
      <option value={1}>{t(`utilities.${supportedUtilities[1]}`)}</option>
      <option value={2}>{t(`utilities.${supportedUtilities[2]}`)}</option>
    </NativeSelect>
  );

  return (
    <Typography variant="h5" component="h1" gutterBottom>
      <Trans i18nKey="theCarbonIs" components={{ utilityMenu }} />
      {"(" + t("probably") + "):"}
    </Typography>
  );
}
