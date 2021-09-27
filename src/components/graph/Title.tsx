import React from "react";

import {
  Typography,
  NativeSelect,
} from "@material-ui/core";

import { useTranslation, Trans } from "react-i18next";


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
          return (
            <option key={`monthChoice-${index}`} value={index}>
              {t(`months.${month}`)}
            </option>
          );
        }
      )}
    </NativeSelect>
  );

  return (
    <Typography variant="h6" align="center">
      <Trans i18nKey="carbonGraphTitle" components={{ monthMenu }} />
    </Typography>
  );
}
