import React, { useState, useEffect } from "react";

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

  const supportedUtilities = props.supportedUtilities;

  const [utilityChoice, setUtilityChoice] = useState(props.utilityIndex);

  useEffect(() => {
    setUtilityChoice(props.utilityIndex);
  }, [props.utilityIndex]);

  // const classes = useStyles();

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: string }>
  ) => {
    const choice = parseInt(event.target.value);
    setUtilityChoice(choice);
    props.updateUtility(supportedUtilities[choice]);
  };

  const utilityMenu = (
    <NativeSelect value={utilityChoice} onChange={handleChange}>
      {supportedUtilities.map((utility: string, index: number) => {
        return <option value={index}>{t(`utilities.${utility}`)}</option>;
      })}
    </NativeSelect>
  );

  return (
    <Typography variant="h5" component="h1" gutterBottom>
      <Trans i18nKey="theCarbonIs" components={{ utilityMenu }} />
    </Typography>
  );
}
