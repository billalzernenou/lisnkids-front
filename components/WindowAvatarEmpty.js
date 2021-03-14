import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRoute } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar,
  Platform,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";

import { useNavigation } from "@react-navigation/core";
import Constants from "expo-constants";
import colors from "../assets/colors";
import MainTitle from "./MainTitle";
export default function WindowAvatarEmpty({ dayNightMode }) {
  const route = useRoute();
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);
  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      style={{
        backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
        flex: 1,
        paddingTop: Constants.statusBarHeight + 40,
      }}
    >
      <StatusBar hidden={true} />

      <View>
        <MainTitle
          text="text"
          color="white"
          fontSize={16}
          textAlign="center"
          marginBottom={8}
        />
      </View>
      <View>
        <Text style={styles.text}>This is the AvatarEmpty component</Text>
      </View>
      <View>
        {/* ERROR */}
        <View style={styles.errorContainer}>
          {error && (
            <Text
              style={[
                styles.error,
                {
                  color: dayNightMode
                    ? colors.errorForDay
                    : colors.errorForNight,
                },
              ]}
            >
              {error}
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {},
  errorContainer: { height: 20, width: "100%", marginVertical: 8 },
  error: {
    color: "red",
    textAlign: "center",
  },
  text: {
    color: "white",
  },
});
