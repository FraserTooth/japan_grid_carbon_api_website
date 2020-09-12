import React from "react";

import { Typography } from "@material-ui/core";

import { useTranslation } from "react-i18next";

export default function Title(props: any) {
  const date = new Date();
  const month = date.getMonth() + 1;
  const weekday = date.getDay(); // 0-6, 0 is Sunday in JS
  const weekdayInAPI = weekday === 0 ? 7 : weekday; // No Zero in API, 1-7, 1 is Monday

  const { t } = useTranslation();

  return (
    <Typography variant="h6" align="center">
      {t("carbonGraphTitle", {
        month: t(`months.${month - 1}`),
        weekday: t(`weekdays.${weekdayInAPI - 1}`),
      })}
    </Typography>
  );
}
