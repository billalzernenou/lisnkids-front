import React, { useState } from "react";
import { useNavigation } from "@react-navigation/core";
import {
  Button,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import Constants from "expo-constants";
import colors from "../assets/colors";
import { AntDesign } from "@expo/vector-icons";
import Logo from "../components/Logo";
import MainTitle from "../components/MainTitle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function GuidanceScreen1({
  userGuidance,
  setGuidance,
  dayNightMode,
}) {
  const navigation = useNavigation();
  const [error, setError] = useState(null);
  return (
    <ScrollView
      style={[
        styles.safeAreaView,
        {
          backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
          flex: 1,
          paddingTop: Constants.statusBarHeight + 40,
        },
      ]}
    >
      <StatusBar hidden={true} />
      <View contentContainerStyle={styles.Scroll}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          {/* LOGO */}
          <View>
            <Logo width={100} height={100} />
          </View>
          <View>
            <MainTitle
              text="Bonne pratique du soir N°1"
              color="white"
              fontSize={16}
              textAlign="center"
              marginBottom={5}
            />
          </View>
          <View>
            <Text style={styles.text}>
              La journée vos enfants aimeront découvrir les belles illustrations
              de leurs histoires préférées. Mais quand vient le soir 🌙✨, les
              écrans peuvent perturber leur sommeil 🛌.
            </Text>
            <Text style={styles.text}>
              Si vous avez une enceinte Bluetooth à la maison, préparez avec eux
              leur liste d'écoute avant le coucher, et faites jouer les
              histoires à distance de leur lit.
            </Text>
          </View>
          {/* BTN */}
          <TouchableOpacity
            style={styles.btn}
            title="Set guidance 1"
            onPress={async () => {
              try {
                // build dataForm
                const formData = new FormData();
                const userId = await AsyncStorage.getItem("userId");
                formData.append("_id", userId);
                formData.append("guidance1", true);
                //  send request to api
                const response = await axios.post(
                  "https://lisnkids.herokuapp.com/api/update",
                  formData,
                  {
                    headers: {
                      Authorization: "Bearer LRCes!e2021vg",
                      "Content-Type": "multipart/form-data",
                    },
                  }
                );

                if (response.data.account) {
                  //  Mise à jour du storage
                  const newGuidance = { ...userGuidance };
                  newGuidance.guidance1 = true;
                  setGuidance(newGuidance);
                } else {
                  setError("Une erreur s'est produite. Veuillez réessayer");
                }
              } catch (error) {
                setError("Une erreur s'est produite. Veuillez réessayer");
                console.log(error);
              }
            }}
          >
            <Text
              style={[
                styles.textBtn,
                { color: dayNightMode ? colors.bgNight : colors.bgDay },
              ]}
            >
              Compris, bonnes pratiques du soir N°2
            </Text>
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
            <View style={{ marginTop: 2, marginLeft: 5 }}>
              <AntDesign
                name="right"
                size={15}
                color={dayNightMode ? colors.bgNight : colors.bgDay}
              />
            </View>
          </TouchableOpacity>
        </View>
        {/* IMAGE */}
        <View style={{ marginTop: 20 }}>
          <View
            style={{
              alignItems: "flex-end",
              paddingRight: 30,
            }}
          >
            <Image
              style={styles.hifi}
              source={require("../assets/img/illustrations_perso/guidance-illustration.png")}
            />
          </View>
          <View style={{ paddingLeft: 30 }}>
            <Image
              style={styles.bed}
              source={require("../assets/img/illustrations_perso/guidance-illustration-bed.png")}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    marginTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
  },
  Scroll: {
    flex: 1,
  },
  textBtn: {
    color: colors.accentColor,
    textAlign: "center",
    fontWeight: "bold",
    paddingHorizontal: 5,
  },
  btn: {
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  text: {
    color: "white",
    textAlign: "center",
    paddingHorizontal: 40,
    paddingBottom: 10,
    lineHeight: 16,
  },
  bed: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  hifi: {
    width: 80,
    height: 50,
    resizeMode: "contain",
  },
});
