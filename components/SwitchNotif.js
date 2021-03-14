import React, { useState } from "react";
import { Switch } from "react-native";
import colors from "../assets/colors";

const SwitchNotif = ({ isEnabled, setIsEnabled, dayNightMode }) => {
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return dayNightMode ? (
    <Switch
      trackColor={{ false: "grey", true: "white" }}
      thumbColor={isEnabled ? colors.bgNight : "lightgrey"}
      ios_backgroundColor="#3e3e3e"
      onValueChange={toggleSwitch}
      value={isEnabled}
    />
  ) : (
    <Switch
      trackColor={{ false: "grey", true: "white" }}
      thumbColor={isEnabled ? colors.overlayDay : "darkgrey"}
      ios_backgroundColor="#3e3e3e"
      onValueChange={toggleSwitch}
      value={isEnabled}
    />
  );
};

export default SwitchNotif;
