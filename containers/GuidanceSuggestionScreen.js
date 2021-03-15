import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import colors from "../assets/colors";
import { AntDesign } from "@expo/vector-icons";
import Logo from "../components/Logo";
import axios from "axios";

export default function GuidanceSuggestionScreen({
  setGuidanceSuggestionStorage,
  userGuidance,
  setGuidance,
  dayNightMode,
}) {
  const [error, setError] = useState(null);
  return (
    <SafeAreaView
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
      <ScrollView contentContainerStyle={styles.Scroll}>
        {/* LOGO */}
        <Logo width={150} height={50} dayNightMode={dayNightMode} />
        <View style={styles.content}>
          <Text
            style={{
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
              fontSize: 16,
            }}
          >
            Très bien.
          </Text>
          <Text style={styles.text}>
            Avant de mettre cette application entre les mains de vos enfants,
            voici 2 bonnes pratiques pour l'histoire du soir.
          </Text>
          <TouchableOpacity
            style={[
              styles.btnYes,
              {
                backgroundColor: colors.overlayNight,
              },
            ]}
            title="Bonnes pratiques du soir"
            onPress={async () => {
              try {
                setError(null);
                // build dataForm
                const formData = new FormData();
                const userId = await AsyncStorage.getItem("userId");
                formData.append("_id", userId);
                formData.append("guidance", true);
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
                if (response.data.account.guidance) {
                  //  Mise à jour du storage
                  setGuidanceSuggestionStorage(true);
                } else {
                  setError("Une erreur s'est produite. Veuillez réessayer");
                }
              } catch (error) {
                setError("Une erreur s'est produite. Veuillez réessayer");
                console.log(error);
              }
            }}
          >
            <Text style={[styles.textBtn, { color: colors.accentColor }]}>
              Bonnes pratiques du soir
            </Text>
            <View style={{ marginTop: 2, marginLeft: 5 }}>
              <AntDesign name="right" size={15} color={colors.textNight} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnNo}
            title="Non, Merci"
            onPress={async () => {
              try {
                // Si je dis non, je dois envoyer true pour guidance + guidance1+guidance2 dans la bdd
                // Puis mettre à jour aussi le storage
                // build dataForm
                const formData = new FormData();
                const userId = await AsyncStorage.getItem("userId");
                formData.append("_id", userId);
                formData.append("guidance", true);
                formData.append("guidance1", true);
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
                if (
                  response.data.account.guidance &&
                  response.data.account.guidance1 &&
                  response.data.account.guidance2
                ) {
                  //  Mise à jour du storage guidance suggestion + guidance1+guidance2
                  setGuidanceSuggestionStorage(true);
                  const newGuidance = { ...userGuidance };
                  newGuidance.guidance1 = true;
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
                styles.textNo,
                {
                  color: dayNightMode ? colors.bgNight : colors.bgDay,
                  fontWeight: "bold",
                },
              ]}
            >
              Non merci.
            </Text>
            <View style={{ marginTop: 2, marginLeft: 5 }}>
              <AntDesign
                name="right"
                size={15}
                color={dayNightMode ? colors.bgNight : colors.bgDay}
              />
            </View>
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
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    textAlign: "center",
    paddingHorizontal: 55,
  },
  Scroll: {
    flex: 1,
    alignItems: "center",
  },
  content: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    alignItems: "center",
  },
  btnYes: {
    height: 45,
    paddingHorizontal: 15,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  textBtn: {
    color: colors.accentColor,
    textAlign: "center",
    fontWeight: "bold",
    paddingHorizontal: 5,
  },
  btnNo: {
    height: 45,
    paddingHorizontal: 15,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
