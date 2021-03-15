import React from "react";
import IsLoading from "../components/isLoading";
import axios from "axios";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Constants from "expo-constants";
import { useRoute } from "@react-navigation/native";

// Components
import Logo from "../components/Logo";
import MainTitle from "../components/MainTitle";
import Input from "../components/InputLog";
import ConnectionButton from "../components/ConnectionButton";
import RedirectButton from "../components/RedirectButton";
import colors from "../assets/colors";
import SwitchMode from "../components/SwitchMode";
import MdpForget from "../components/mdpForget";
import { set } from "react-native-reanimated";

export default function SignInScreen({
  setToken,
  setId,
  setLang,
  setParentSecret,
  dayNightMode,
  setDayNightMode,
  setGuidanceSuggestionStorage,
  setGuidance,
  setParentAccess,
  // ajout du props venant du main
  setChildrenExistAsync,
}) {
  // get name screen
  const route = useRoute();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    // setIsLoading(true);
    try {
      setError(null);
      if (email && password) {
        // build dataForm
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        //  send request to api
        const response = await axios.post(
          "https://lisnkids-api.herokuapp.com/api/signin",
          formData,
          {
            headers: {
              Authorization: "Bearer LRCes!e2021vg",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data) {
          setToken(response.data.token);
          setId(response.data._id);
          if (response.data.account) {
            if (response.data.account.languageDefault) {
              setLang(response.data.account.languageDefault);
            } else {
              setError("veuillez choisir une langue");
            }
            if (response.data.account.secretCode) {
              setParentSecret(true);
              setParentAccess(false);
            } else {
              setError("veuillez choisir un code secret");
              setParentAccess(true);
            }
            if (response.data.account.guidance) {
              setGuidanceSuggestionStorage(true);
            } else {
              setGuidanceSuggestionStorage(null);
            }
            if (response.data.account.guidance2) {
              setGuidance({
                guidance1: response.data.account.guidance1,
                guidance2: response.data.account.guidance2,
              });
            } else {
              setGuidance({ guidance1: true, guidance2: false });
            }
            if (response.data.account.guidance1) {
              setGuidance({
                guidance1: response.data.account.guidance1,
                guidance2: response.data.account.guidance2,
              });
            } else {
              setGuidance({ guidance1: false, guidance2: false });
            }
            if (response.data.childrens.length > 0) {
              setChildrenExistAsync(true);
            } else {
              setChildrenExistAsync(false);
            }
          }
          setIsLoading(false);
        } else {
          setError("Une erreur s'est produite. Veuillez réessayer");
        }
      } else {
        setError("Merci de remplir tous les champs");
      }
    } catch (error) {
      if (error.response.data.message === "User not found") {
        setError("Cet email n'existe pas");
      } else {
        setError("Une erreur s'est produite. Veuillez réessayer");
      }
    }
  };

  return isLoading ? (
    <IsLoading dayNightMode={dayNightMode} />
  ) : (
    <SafeAreaView
      style={[
        styles.safeAreaView,
        {
          backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
          flex: 1,
          paddingTop: Constants.statusBarHeight,
        },
      ]}
    >
      <StatusBar hidden={true} />
      <KeyboardAwareScrollView style={styles.keyboard}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.wrapper}>
            {/* BUTTON SWITCH MODE DAY OR NIGHT
            <View style={styles.absolute}>
              <SwitchMode
                setDayNightMode={setDayNightMode}
                dayNightMode={dayNightMode}
              />
            </View> */}

            <View style={styles.logoContainer}>
              <Logo width={150} height={150} dayNightMode={dayNightMode} />
              <MainTitle
                text={`Série audio pour enfants. ${"\n"} En illimité`}
                color="white"
                fontSize={16}
                textAlign="center"
              />
            </View>
            <View style={styles.form}>
              {/* EMAIL */}
              <Input
                placeHolder="Email"
                setFunction={setEmail}
                dayNightMode={dayNightMode}
              />

              {/* PASS */}
              <Input
                placeHolder="Mot de passe"
                setFunction={setPassword}
                secure={true}
                dayNightMode={dayNightMode}
                lastChild={true}
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
            </View>

            {/* BOUTON SUBMIT */}
            <View style={styles.buttons}>
              {/* btn redirection */}
              <RedirectButton
                text="S'inscrire"
                screenRedirection="SignUp"
                dayNightMode={dayNightMode}
                isActive={route.name === "SignUp" ? true : false}
              />
              <ConnectionButton
                text="Se connecter"
                screenRedirection="SignUp"
                submitFunction={submit}
                dayNightMode={dayNightMode}
                isActive={route.name === "SignIn" ? true : false}
              />
            </View>

            {/* MDP FORGET */}
            <View style={styles.mdpForget}>
              <MdpForget dayNightMode={dayNightMode} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  keyboard: {},
  scrollView: {
    marginTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
  },
  wrapper: {
    paddingHorizontal: 40,
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

  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  absolute: {
    // position: "absolute",
    // bottom: 5,
    // left: 20,
    width: 25,
    height: 25,
    borderColor: "blue",
    borderWidth: 2,
  },
  mdpForget: {
    width: "100%",
    height: 50,
  },
});
