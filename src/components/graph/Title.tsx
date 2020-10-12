import React, { useState } from "react";

import {
  Typography,
  NativeSelect,
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core";

import { useTranslation, Trans } from "react-i18next";

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

function range(size: number, startAt:number) {
  const array:any = Array(size).keys()
  return [...array].map(i => i + startAt);
}
const now = new Date()
const predictionYears:number[] = range(30,now.getFullYear())

export default function Title(props: any) {
  const { t } = useTranslation();

  // MONTH
  const handleChangeMonth = (
    event: React.ChangeEvent<{ name?: string; value: string }>
  ) => {
    const choice = parseInt(event.target.value);
    props.setMonthChoice(choice);
  };

  const monthMenu = (
    <NativeSelect value={props.monthChoice} onChange={handleChangeMonth}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(
        (month: number, index: number) => {
          return <option value={index}>{t(`months.${month}`)}</option>;
        }
      )}
    </NativeSelect>
  );

  // WEEKDAY
  const handleChangeWeekday = (
    event: React.ChangeEvent<{ name?: string; value: string }>
  ) => {
    const choice = parseInt(event.target.value);
    props.setWeekdayChoice(choice);
  };

  const weekdayMenu = (
    <NativeSelect value={props.weekdayChoice} onChange={handleChangeWeekday}>
      {[0, 1, 2, 3, 4, 5, 6].map((weekday: number, index: number) => {
        return <option value={index}>{t(`weekdays.${weekday}`)}</option>;
      })}
    </NativeSelect>
  );

  // YEAR
  const handleChangePredictionYear = (
    event: React.ChangeEvent<{ name?: string; value: string }>
  ) => {
    const choice = parseInt(event.target.value);
    props.setPredictionYear(choice);
  };

  const predictionYearMenu = (
    <NativeSelect value={props.predictionYear} onChange={handleChangePredictionYear}>
      {predictionYears.map((year: number) => {
        return <option value={year}>{String(year)}</option>;
      })}
    </NativeSelect>
  );

  return (
    <Typography variant="h6" align="center">
      <Trans
        i18nKey="carbonGraphTitle"
        components={{ monthMenu, weekdayMenu, predictionYearMenu }}
      />
    </Typography>
  );
}
