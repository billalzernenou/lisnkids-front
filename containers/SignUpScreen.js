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
} from "react-native";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Constants from "expo-constants";
// import { Entypo } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

// Components
import Logo from "../components/Logo";
import MainTitle from "../components/MainTitle";
import Input from "../components/InputLog";
import ConnectionButton from "../components/ConnectionButton";
import RedirectButton from "../components/RedirectButton";
import colors from "../assets/colors";
import SwitchMode from "../components/SwitchMode";

export default function SignUpScreen({
  setToken,
  setId,
  dayNightMode,
  setDayNightMode,
  userLang,
  setUserLang,
  navigation,
}) {
  // get name screen
  const route = useRoute();
  // const axios = require("axios");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    try {
      // A chaque fois que je clique, je remets à null error
      setError(null);
      if (email && username && password && confirmPassword) {
        if (password === confirmPassword) {
          // build dataForm
          const formData = new FormData();
          formData.append("email", email);
          formData.append("userName", username);
          formData.append("password", password);
          //  send request to api
          const response = await axios.post(
            "https://lisnkids-api.herokuapp.com/api/signup",
            formData,
            {
              headers: {
                Authorization: "Bearer LRCes!e2021vg",
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.data.token) {
            setToken(response.data.token);
            setId(response.data._id);
            setIsLoading(true);
          } else {
            setError("Une erreur s'est produite. Veuillez réessayer");
          }
        } else {
          setError("les mots de passe ne sont pas identiques");
        }
      } else {
        setError("Tous les champs doivent être rempli");
      }
    } catch (error) {
      setError("Une erreur s'est produite. Veuillez réessayer");
      console.log(error);
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
      <KeyboardAwareScrollView style={[styles.keyboard]}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.wrapper}>
            <View style={styles.logoContainer}>
              <Logo width={150} height={120} dayNightMode={dayNightMode} />
              <MainTitle
                text={`Série audio pour enfants. ${"\n"} En illimité`}
                color="white"
                fontSize={18}
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
              {/* USERNAME */}
              <Input
                placeHolder="Nom du parent"
                setFunction={setUsername}
                dayNightMode={dayNightMode}
              />
              {/* PASS */}

              <Input
                placeHolder="Mot de passe"
                setFunction={setPassword}
                secure={true}
                dayNightMode={dayNightMode}
              />

              {/* CONFIRM PASSWORD */}
              <Input
                placeHolder="Confirmation du mot de passe"
                setFunction={setConfirmPassword}
                // On peut l'écrire sans le secure={true}
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
              <ConnectionButton
                text="S'inscrire"
                screenRedirection="SignIn"
                submitFunction={submit}
                dayNightMode={dayNightMode}
                isActive={route.name === "SignUp" ? true : false}
              />
              {/* btn redirection */}
              <RedirectButton
                text="Se connecter"
                screenRedirection="SignIn"
                dayNightMode={dayNightMode}
                isActive={route.name === "SignIn" ? true : false}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  scrollView: {
    marginTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
    flex: 1,
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
    position: "absolute",
    bottom: 0,
    left: 20,
  },
});
