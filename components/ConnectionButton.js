import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../assets/colors";
import { useNavigation } from "@react-navigation/native";

const ConnectionButton = ({
  text,
  submitFunction,
  dayNightMode,
  isActive,
  screenRedirection,
}) => {
  const navigation = useNavigation();
  let bg = "";
  if (isActive) {
    // si je suis sur la page en cours
    bg = colors.accentColor;
  } else {
    if (dayNightMode) {
      // Si je suis en mode jour
      bg = colors.overlayDayII;
    } else {
      // Si je suis en mode nuit
      bg = colors.overlayNight;
    }
  }
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          backgroundColor: bg,
        },
      ]}
      onPress={async () => {
        // Quand je clique, Si je suis sur la page actuelle, j'envoie ma requete d'incription ou de connexion), sinon ça veut dire que je veux être redirigé vers l'autre page
        isActive ? submitFunction() : navigation.push(screenRedirection);
      }}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export default ConnectionButton;

const styles = StyleSheet.create({
  btn: {
    height: 45,
    width: "48%",
    paddingHorizontal: 15,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
