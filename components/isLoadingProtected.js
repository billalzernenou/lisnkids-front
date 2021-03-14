import React from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";

export default function IsLoading() {
  return (
    <SafeAreaView
      style={[
        styles.safeAreaView,
        {
          backgroundColor: "black",
          flex: 1,
        },
      ]}
    >
      <StatusBar hidden={true} />
      <ScrollView contentContainerStyle={styles.Scroll}>
        <View style={[styles.container, styles.horizontal]}>
          <View style={{ marginTop: 50 }}>
            <ActivityIndicator size={80} color="#222" />
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
