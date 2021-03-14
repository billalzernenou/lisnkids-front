import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import SwitchHeader from "./SwitchHeader";
import colors from "../assets/colors";
import Logo from "./Logo";
import SwitchMode from "./SwitchMode";
import WindowOnly from "./WindowOnly";
import Constants from "expo-constants";
import { useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const HeaderModeParentOnly = ({
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
  const [infos, setInfos] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const stored = await AsyncStorage.getItem("childrenInfos");
      if (stored) {
        const infos = JSON.parse(stored);
        setInfos(infos);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return isLoading ? (
    <Text>En cours de chargement...</Text>
  ) : (
    <>
      <View style={styles.header}>
        {/* LEFT */}
        <View style={styles.left}>
          <Logo dayNightMode={dayNightMode} width={75} height={75} />
        </View>
        {/* RIGHT */}
        <View style={styles.right}>
          <View>
            <SwitchHeader
              dayNightMode={dayNightMode}
              isEnabled={isEnabled}
              setIsEnabled={setIsEnabled}
              userInfo={userInfo}
              setParentMode={setParentMode}
              setSettingScreen={setSettingScreen}
              // userInfo={userInfo}
            />
          </View>
          <View style={styles.swicthMode}>
            <SwitchMode
              dayNightMode={dayNightMode}
              setDayNightMode={setDayNightMode}
              width={30}
              height={30}
            />
          </View>
        </View>
      </View>
    </>
  );
};
export default HeaderModeParentOnly;
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
