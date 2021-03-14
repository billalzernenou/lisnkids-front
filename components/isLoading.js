import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";

import Constants from "expo-constants";
import colors from "../assets/colors";
import Logo from "../components/Logo";

export default function IsLoading({ dayNightMode }) {
  return (
    <SafeAreaView
      style={[
        styles.safeAreaView,
        {
          backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
          flex: 1,
        },
      ]}
    >
      <StatusBar hidden={true} />
      <ScrollView contentContainerStyle={styles.Scroll}>
        <View style={[styles.container, styles.horizontal]}>
          {/* LOGO */}
          <Logo width={250} height={150} dayNightMode={dayNightMode} />
          <View style={{ marginTop: 50 }}>
            <ActivityIndicator size={80} color="white" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  Scroll: {
    flex: 1,
    alignItems: "center",
  },
});
