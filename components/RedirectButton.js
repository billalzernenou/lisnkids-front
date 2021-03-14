import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../assets/colors";
import { useNavigation } from "@react-navigation/native";

const RedirectButton = ({ text, screenRedirection, dayNightMode }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          backgroundColor: dayNightMode
            ? colors.overlayDayII
            : colors.overlayNight,
        },
      ]}
      onPress={async () => {
        // Ici je mets un push, sinon le retour en arrière ne remets pas à jour le state d'erreur
        navigation.push(screenRedirection);
      }}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export default RedirectButton;

const styles = StyleSheet.create({
  btn: {
    height: 45,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "48%",
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
