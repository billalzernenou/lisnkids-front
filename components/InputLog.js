import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import colors from "../assets/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Input({
  placeHolder,
  setFunction,
  secure,
  dayNightMode,
  lastChild,
}) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          { color: colors.textDay },
          {
            backgroundColor: dayNightMode
              ? colors.overlayDay
              : colors.overlayNight,
          },
          // Si c'est le dernier input, je ne mets pas de marginBottom
          { marginBottom: !lastChild ? 15 : 0 },
        ]}
        placeholderTextColor={dayNightMode ? colors.textDay : colors.textNight}
        autoCapitalize="none"
        placeholder={placeHolder}
        onChangeText={(text) => {
          setFunction(text);
        }}
        secureTextEntry={secure}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},

  input: {
    width: "100%",
    height: 45,
    paddingHorizontal: 15,
    fontWeight: "bold",
    textAlign: "left",
    borderRadius: 25,
  },
});
