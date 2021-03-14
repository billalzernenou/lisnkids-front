import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function DayNightMode({ dayNightMode, setDayNightMode }) {
  return (
    <View style={styles.container}>
      <Text>This is the DayNightMode component</Text>
      {/* Button + onPress{setDayNighMode(!dayNightMode)} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
