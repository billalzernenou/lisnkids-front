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
  setError,
}) {
  console.log(placeHolder);
  return (
    <View style={styles.container}>
      {placeHolder == "Votre code secret" ? (
        <>
          <TextInput
            style={[
              styles.input,

              // { color: colors.textDay },
              // {
              //   backgroundColor: dayNightMode
              //     ? colors.overlayDay
              //     : colors.overlayNight,
              // },
              // // Si c'est le dernier input, je ne mets pas de marginBottom
              // { marginBottom: !lastChild ? 15 : 0 },
            ]}
            placeholderTextColor={colors.overlayDay}
            autoCapitalize="none"
            maxLength={4}
            fontSize={16}
            keyboardType="numeric"
            placeholder={placeHolder}
            onChangeText={(text) => {
              setFunction(text);
              setError(false);
            }}
            secureTextEntry={secure}
          />
        </>
      ) : (
        <TextInput
          style={[
            styles.input,

            // { color: colors.textDay },
            // {
            //   backgroundColor: dayNightMode
            //     ? colors.overlayDay
            //     : colors.overlayNight,
            // },
            // // Si c'est le dernier input, je ne mets pas de marginBottom
            // { marginBottom: !lastChild ? 15 : 0 },
          ]}
          placeholderTextColor={colors.overlayDay}
          autoCapitalize="none"
          // maxLength={4}
          fontSize={16}
          // keyboardType="numeric"
          placeholder={placeHolder}
          onChangeText={(text) => {
            setFunction(text);
            setError(false);
          }}
          secureTextEntry={secure}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},

  input: {
    fontSize: 25,
    textAlign: "center",
    color: "white",
    marginBottom: 15,
  },
});
