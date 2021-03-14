import React, { useState } from "react";
import { Switch } from "react-native";
import colors from "../assets/colors";
import { useNavigation } from "@react-navigation/native";

const SwitchHeader = ({
  isEnabled,
  setIsEnabled,
  dayNightMode,
  parentMode,
  setParentMode,
  setSettingScreen,
}) => {
  const navigation = useNavigation();

  // const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  // console.log(isEnabled);

  if (isEnabled) {
    // navigation.navigate("SettingParentScreen");
    // console.log("yes");
  } else {
    // console.log("no");
  }
  return dayNightMode ? (
    <Switch
      trackColor={{ false: "grey", true: "white" }}
      thumbColor={isEnabled ? colors.bgNight : "lightgrey"}
      ios_backgroundColor="#3e3e3e"
      onValueChange={() => {
        setIsEnabled(!isEnabled);
        if (parentMode) {
          setParentMode(false);
          setSettingScreen(null);
        }
      }}
      value={isEnabled}
    />
  ) : (
    <Switch
      trackColor={{ false: "grey", true: "white" }}
      thumbColor={isEnabled ? colors.overlayDay : "darkgrey"}
      ios_backgroundColor="#3e3e3e"
      // onValueChange={toggleSwitch}
      onValueChange={() => {
        setIsEnabled(!isEnabled);
        // setParentMode(!parentMode);

        setParentMode(false);
        setSettingScreen(null);
      }}
      value={isEnabled}
    />
  );
};

export default SwitchHeader;
