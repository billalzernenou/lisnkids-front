import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function PlayStoryScreen() {
  return (
    <View style={styles.container}>
      <Text>this is your story !</Text>
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
