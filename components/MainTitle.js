import React from "react";
import { StyleSheet, Text } from "react-native";
import colors from "../assets/colors";

const MainTitle = ({ text, color, fontSize, textAlign, marginBottom }) => {
  return (
    <Text
      style={[
        styles.text,
        { color: color },
        { fontSize: fontSize },
        { textAlign: textAlign },
        { marginBottom: marginBottom },
      ]}
    >
      {text}
    </Text>
  );
};

export default MainTitle;

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
  },
});
