import React from "react";
import {
  Button,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";

export default function SettingsScreen({
  setToken,
  setUserLang,
  setUserGuidance,
  setUserGuidanceSuggestion,
  dayNightMode,
}) {
  return (
    <SafeAreaView
      style={[
        styles.safeAreaView,
        {
          backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
          flex: 1,
          paddingTop: Constants.statusBarHeight + 40,
        },
      ]}
    >
      <StatusBar hidden={true} />
      <ScrollView>
        <Text>Hello Settings</Text>

        <Button
          title="Log Out"
          onPress={() => {
            setToken(null);
            setUserLang(null);
            setUserGuidance(null);
            setUserGuidanceSuggestion(false);
            // tomporary code
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
