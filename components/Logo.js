import React from "react";
import { StyleSheet, Image } from "react-native";

const Logo = (props) => {
  return (
    <Image
      style={[styles.logo, { width: props.width, height: props.height }]}
      source={
        props.dayNightMode
          ? require("../assets/img/logo-icons/LOGO_DARK.png")
          : require("../assets/img/logo-icons/LOGO_LIGHT.png")
      }
      resizeMode="contain"
    ></Image>
  );
};

export default Logo;

const styles = StyleSheet.create({
  logo: {
    width: 25,
    height: 25,
  },
});
