import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import colors from "../assets/colors";

// Faire une note explicative pour l'utiliser

export default function SwitchMode({
  setDayNightMode,
  dayNightMode,
  width,
  height,
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        setDayNightMode(!dayNightMode);
      }}
    >
      {dayNightMode ? (
        <View
          style={{
            width: 35,
            height: 35,
            backgroundColor: colors.overlayDayII,
            borderRadius: 50 / 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={[
              styles.switchButton,
              {
                width: 27,
                height: 27,
                resizeMode: "cover",

                borderRadius: 50 / 2,
                backgroundColor: colors.overlayDayII,
              },
            ]}
            source={require("../assets/img/logo-icons/night.png")}
          ></Image>
        </View>
      ) : (
        <View
          style={{
            width: 35,
            height: 35,
            backgroundColor: colors.bgNight,
            borderRadius: 50 / 2,
            borderWidth: 0.5,
            borderColor: colors.accentColor,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{
              width: 27,
              height: 27,
              resizeMode: "cover",
              borderRadius: 50 / 2,
            }}
            source={require("../assets/img/logo-icons/day.png")}
          ></Image>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
