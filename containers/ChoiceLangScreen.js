import React, { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/core";
import Constants from "expo-constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect, { defaultStyles } from "react-native-picker-select";
import {
  Button,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";

// COMPONENTS
import colors from "../assets/colors";
import Logo from "../components/Logo";
import MainTitle from "../components/MainTitle";
import Input from "../components/Input";
import SwitchMode from "../components/SwitchMode";

export default function ChoiceLangScreen({
  setLang,
  dayNightMode,
  setDayNightMode,
}) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

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
      <ScrollView>
        <View style={styles.wrapper}>
          <KeyboardAwareScrollView style={styles.keyboard}>
            <ScrollView contentContainerStyle={styles.scrollView}>
              {/* LOGO + MAINTITLE */}
              <View style={styles.logoContainer}>
                <Logo width={150} height={50} dayNightMode={dayNightMode} />
              </View>
              <MainTitle
                text={`Bienvenue cher parent !`}
                color="white"
                fontSize={18}
                textAlign="center"
                marginBottom={0}
              />
              {/* ASK */}
              <View style={styles.askWrapper}>
                <Text style={styles.ask}>
                  Dans quelle langue vos enfants écoutent-ils des histoires ?
                </Text>
              </View>

              <View style={styles.form}>
                {/* CHOICE LANGAGE */}
                <RNPickerSelect
                  onValueChange={(value) => {
                    setSelectedLanguage(value);
                    setError(null);
                  }}
                  placeholder={{
                    label: "Selectionner une langue",
                    value: null,
                    color: colors.textNight,
                  }}
                  items={[
                    { label: "Français", value: "FR", color: colors.textNight },
                    {
                      label: "English",
                      value: "EN",
                      color: colors.textNight,
                    },
                  ]}
                  style={{
                    ...styles,
                    iconContainer: {
                      top: 10,
                      right: 12,
                    },
                    placeholder: {
                      color: "white",
                      fontSize: 12,
                      fontWeight: "bold",
                    },
                  }}
                  value={selectedLanguage}
                  useNativeAndroidPickerStyle={false}
                  textInputProps={{ underlineColor: "yellow" }}
                  Icon={() => {
                    return (
                      <Ionicons name="md-arrow-down" size={24} color="white" />
                    );
                  }}
                />

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
                {isLoading ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  // /* BUTTON VALIDATION CHOICE LANGUAGE */
                  <View style={styles.btnValidationWrapper}>
                    <TouchableOpacity
                      style={[
                        styles.btnValidation,
                        {
                          backgroundColor: dayNightMode
                            ? colors.bgNight
                            : colors.overlayNight,
                        },
                      ]}
                      title="Set Language"
                      onPress={async () => {
                        setIsLoading(true);
                        try {
                          // Quand je clique, je lance la fonction qui enregistre la langue dans le userToken (dans app.js)
                          if (!selectedLanguage) {
                            setError("Merci de selectionner une langue");
                            setIsLoading(false);
                          } else {
                            // build dataForm
                            const formData = new FormData();
                            const userId = await AsyncStorage.getItem("userId");
                            formData.append("_id", userId);
                            formData.append(
                              "languageDefault",
                              selectedLanguage
                            );
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

                            if (response.data.account.languageDefault) {
                              setLang(response.data.account.languageDefault);
                              setIsLoading(false);
                            } else {
                              setError(
                                "Une erreur s'est produite. Veuillez réessayer"
                              );
                            }
                          }
                        } catch (error) {
                          setError(
                            "Une erreur s'est produite. Veuillez réessayer"
                          );
                          console.log(error);
                        }
                      }}
                    >
                      <AntDesign
                        name="check"
                        size={52}
                        color="white"
                        style={{ alignSelf: "center" }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          </KeyboardAwareScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  scrollView: {
    marginTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
  },

  wrapper: {
    flex: 1,
    paddingHorizontal: 40,
    position: "relative",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  errorContainer: {
    height: 20,
    width: "100%",
    marginVertical: 8,
  },
  error: {
    color: "red",
    textAlign: "center",
  },

  askWrapper: { marginBottom: 20 },
  ask: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  btnValidationWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  btnValidation: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 80 / 2,
  },
  select: {
    backgroundColor: "red",
  },
  inputAndroid: {
    width: "100%",
    height: 45,
    paddingHorizontal: 15,
    fontWeight: "bold",
    textAlign: "left",
    borderRadius: 25,
    backgroundColor: colors.overlayNight,

    color: "white",
    paddingRight: 0, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    width: "100%",
    height: 45,
    paddingHorizontal: 15,
    fontWeight: "bold",
    textAlign: "left",
    borderRadius: 25,
    backgroundColor: colors.overlayNight,

    color: "white",
    paddingRight: 0, // to ensure the text is never behind the icon
  },
  inputIOS: {
    width: "100%",
    height: 45,
    paddingHorizontal: 15,
    fontWeight: "bold",
    textAlign: "left",
    borderRadius: 25,
    backgroundColor: colors.overlayNight,
    color: "white",
    paddingRight: 0,
  },
});
