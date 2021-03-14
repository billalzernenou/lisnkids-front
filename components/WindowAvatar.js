import React, { useEffect, useState } from "react";
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
  ActivityIndicator,
} from "react-native";

import { useNavigation } from "@react-navigation/core";
import Constants from "expo-constants";
import colors from "../assets/colors";
import MainTitle from "../components/MainTitle";
import IsLoading from "../components/isLoading";
export default function WindowAvatar({
  dayNightMode,
  nameChildren,
  nameAvatar,
  urlAvatar,
}) {
  //   console.log(nameChildren);
  //   console.log(nameAvatar);

  const route = useRoute();
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);
  const [avatar, setAvatar] = useState("");
  //   console.log(avatar);

  // Requete pour récupérer les image d'avatar en fonction du mode nuit/jour

  //   useEffect(() => {
  //     const getAvatar = async () => {
  //       try {
  //         //  send request to api
  //         const formData = new FormData();
  //         // formData.append("title", "ANATOLE");
  //         formData.append("selected", "SELECTED");
  //         formData.append("dayNightOnly", dayNightMode ? "DAY" : "NIGHT");
  //         formData.append("title", nameAvatar);
  //         const response = await axios.post(
  //           "https://lisnkids.herokuapp.com/api/avatars",
  //           formData,
  //           {
  //             headers: {
  //               Authorization: "Bearer LRCes!e2021vg",
  //               "Content-Type": "multipart/form-data",
  //             },
  //           }
  //         );

  //         console.log(response.data[0].url);
  //         if (response.data) {
  //           //   setAllAvatar(response.data);
  //           //   setClickedOnAvatar(true);
  //           setAvatar(response.data[0].url);
  //           setIsLoadingAvatar(false);
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };
  //     getAvatar();
  //   }, []);

  return (
    <View style={styles.windowContainer}>
      <View style={[styles.windowWrapper]}>
        <ImageBackground
          style={styles.avatarImgWindow}
          source={{
            uri: urlAvatar,
          }}
        >
          <Image
            source={require("../assets/img/profil/window-only.png")}
            style={styles.windowOnly}
          />
        </ImageBackground>
      </View>
      {/* Name children */}
      <View style={styles.windowName}>
        <ImageBackground
          style={styles.imgName}
          source={require("../assets/img/profil/name_only.png")}
        >
          <Text style={{ color: "white" }}>{nameChildren}</Text>
        </ImageBackground>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  windowContainer: {
    width: 140,
    // height: 280,
    // marginBottom: 15,
    // width: 140,
    // height: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  windowWrapper: {
    // height: 250,
    // width: 230,
    height: 150,
    width: "100%",
  },
  windowOnly: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImgWindow: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
    alignItems: "center",
    justifyContent: "center",
  },

  inputName: {
    color: "white",
    textAlign: "center",
    width: "100%",
    paddingHorizontal: 10,
  },

  windowName: {
    marginTop: -20,

    height: 35,
    width: "100%",
    alignItems: "center",
  },
  imgName: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
  },
});
