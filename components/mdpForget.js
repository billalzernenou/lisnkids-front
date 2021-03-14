import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../assets/colors";

export default function MdpForget({ dayNightMode }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          console.log("click sur mot de passe oublié");
        }}
      >
        <Text
          style={{
            color: dayNightMode ? colors.textDay : colors.textNight,
            fontSize: 12,
          }}
        >
          Mot de passe oublié ?
        </Text>
      </TouchableOpacity>
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
