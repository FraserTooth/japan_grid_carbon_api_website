import React, { useState, useEffect } from "react";
import LocationUtils from "./api/location";
import { useTranslation, Trans } from "react-i18next";

import {
  Typography,
  NativeSelect,
} from "@material-ui/core";


export default function Title(props: any) {
  const { t } = useTranslation();

  const supportedUtilities = props.supportedUtilities;

  // Add Location Based Guess to Utilties Menu
  const utilitiesMenu = [...supportedUtilities, "location"];

  const [utilityChoice, setUtilityChoice] = useState(props.utilityIndex);

  useEffect(() => {
    setUtilityChoice(props.utilityIndex);
  }, [props.utilityIndex]);


  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: string }>
  ) => {
    const choice = parseInt(event.target.value);
    // If Use Location Selected
    if (choice >= supportedUtilities.length) {
      console.log("Using Location to Guess Utility");
      LocationUtils.fetchUtilityBasedOnGeolocation(
        LocationUtils.utilityGeocoordinates,
        props.updateUtility
      );
    } else {
      setUtilityChoice(choice);
      props.updateUtility(supportedUtilities[choice]);
    }
  };

  const utilityMenu = (
    <NativeSelect value={utilityChoice} onChange={handleChange}>
      {utilitiesMenu.map((utility: string, index: number) => {
        if (utility === "location")
          return (
            <option key={`utilityMenu-${index}`} value={index}>
              {t(`location.utilityMenu`)}
            </option>
          );
        return (
          <option key={`utilityMenu${index}`} value={index}>
            {t(`utilities.${utility}`)}
          </option>
        );
      })}
    </NativeSelect>
  );

  return (
    <Typography variant="h5" component="h1" gutterBottom>
      <Trans i18nKey="theCarbonIs" components={{ utilityMenu }} />
    </Typography>
  );
}
