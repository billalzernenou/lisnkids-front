import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Switch,
} from "react-native";
import SwitchHeader from "./SwitchHeader";
import colors from "../assets/colors";
import Logo from "./Logo";
import SwitchMode from "./SwitchMode";
import WindowOnly from "../components/WindowOnly";
import Constants from "expo-constants";
import { useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HeaderOnlyModeNight = ({
  dayNightMode,
  setDayNightMode,
  isEnabled,
  setIsEnabled,
  parentMode,
  setParentMode,
  setSettingScreen,
}) => {
  const route = useRoute();
  const [userInfo, setUserInfo] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <View style={styles.header}>
        {/* LEFT */}
        <View style={styles.left}>
          <Logo dayNightMode={dayNightMode} width={75} height={75} />
        </View>
        {/* RIGHT */}
        <View style={styles.right}>
          <View style={styles.swicthMode}>
            <SwitchMode
              dayNightMode={dayNightMode}
              setDayNightMode={setDayNightMode}
              width={30}
              height={30}
            />
          </View>
          {/* On cache l'icone profile dans la page des profils */}
        </View>
      </View>
    </>
  );
};

export default HeaderOnlyModeNight;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    height: Platform.OS === "android" ? Constants.statusBarHeight : 0,

    alignItems: "center",
    justifyContent: "space-between",
  },
  headerSimple: {
    flexDirection: "row",
    height: Platform.OS === "android" ? Constants.statusBarHeight : 0,

    alignItems: "center",
    justifyContent: "flex-end",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  right: {
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  swicthMode: {
    // paddingLeft: 15,
    marginRight: 10,
  },
});
