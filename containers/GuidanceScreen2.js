import React, { useState } from "react";
import { useNavigation } from "@react-navigation/core";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  ImageBackground,
  Image,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import colors from "../assets/colors";
import { AntDesign } from "@expo/vector-icons";
import Logo from "../components/Logo";
import MainTitle from "../components/MainTitle";

export default function GuidanceScreen2({
  userGuidance,
  setGuidance,
  dayNightMode,
}) {
  const navigation = useNavigation();
  const [error, setError] = useState(null);
  return (
    <ScrollView
      contentContainerStyle={[
        styles.safeAreaView,
        {
          backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,

          flex: 1,
          paddingTop: Constants.statusBarHeight,
        },
      ]}
    >
      <StatusBar hidden={true} />

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* LOGO */}
        <View>
          <Logo width={100} height={100} />
        </View>
        <View>
          <MainTitle
            text="Bonne pratique du soir N°2"
            color="white"
            fontSize={16}
            textAlign="center"
            marginBottom={5}
          />
        </View>
        <View>
          <Text style={styles.text}>
            Si vous préférez laisser l'appareil à votre enfant le soir 🌙 en
            autonomie, nous avons prévu un{" "}
            <Text style={{ fontWeight: "bold", color: "white", marginLeft: 2 }}>
              mode nocturne protégé.
            </Text>
          </Text>
          <Text style={styles.text}>
            Téléchargez chacun des épisodes de votre liste d'écoute puis passez
            en mode avion ✈️ pour couper l'émission des ondes.
          </Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: "bold", color: "white", marginLeft: 2 }}>
              Vous pouvez désormais accèder au mode nocturne protégé :
            </Text>{" "}
            un écran noir non stimulant pour le soir, aucune onde émise et un
            code secret pour bloquer l'accès au reste de l'application.
          </Text>
        </View>
        {/* BTN */}
        <TouchableOpacity
          style={styles.btn}
          title="Set guidance 2"
          onPress={async () => {
            try {
              // build dataForm
              const formData = new FormData();
              const userId = await AsyncStorage.getItem("userId");
              formData.append("_id", userId);
              formData.append("guidance2", true);
              //  send request to api
              const response = await axios.post(
                "https://lisnkids-api.herokuapp.com/api/update",
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
                newGuidance.guidance2 = true;
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
              { color: dayNightMode ? "black" : colors.bgDay },
            ]}
          >
            Créer un profil enfant
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
              color={dayNightMode ? "black" : colors.bgDay}
            />
          </View>
        </TouchableOpacity>
        {/* IMAGE */}
        <View
          style={{
            width: "100%",
            height: 200,
            marginTop: 20,
            marginLeft: 130,
            marginBottom: 10,
          }}
        >
          <Image
            style={styles.img}
            source={require("../assets/img/player/playerHorizontal.png")}
          />
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    marginTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
  },
  // Scroll: {
  //   flex: 1,
  // },
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
  img: {
    width: "100%",

    height: "100%",
    resizeMode: "contain",
  },
});
