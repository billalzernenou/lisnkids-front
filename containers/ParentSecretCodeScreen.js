import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Input from "../components/Input";
import colors from "../assets/colors";
import Constants from "expo-constants";
import Logo from "../components/Logo";

export default function ParentSecretCodeScreen({
  parentSecretCode,
  setParentSecret,
  dayNightMode,
}) {
  // form control state for input
  const [secretCodeInput, setSecretCodeInput] = useState("");
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
        <View style={styles.container}>
          {/* LOGO */}
          <Logo width={150} height={50} dayNightMode={dayNightMode} />
          {/* TEXT */}
          <View style={styles.textContent}>
            <Text
              style={[
                styles.text,
                { textAlign: "center", paddingHorizontal: 80 },
              ]}
            >
              Choisissez un <Text style={styles.textBold}>code secret</Text>{" "}
              <Text> pour accéder au</Text>{" "}
              <Text style={styles.textBold}>mode parent.</Text>{" "}
            </Text>
          </View>
          {/* INPUT CODE */}
          <View>
            <TextInput
              style={styles.inputCode}
              placeholder="2021"
              maxLength={4}
              placeholderTextColor="white"
              keyboardType="numeric"
              onChangeText={(secretCode) => {
                setSecretCodeInput(secretCode);
                setError(null);
              }}
            />
            {/* LINE BOTTOM SECRET CODE */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderWidth: 0,
              }}
            >
              <View
                style={{
                  borderBottomColor: "white",
                  borderBottomWidth: 2,
                  width: 20,
                }}
              ></View>
              <View
                style={{
                  borderBottomColor: "white",
                  borderBottomWidth: 2,
                  width: 20,
                }}
              ></View>
              <View
                style={{
                  borderBottomColor: "white",
                  borderBottomWidth: 2,
                  width: 20,
                }}
              ></View>
              <View
                style={{
                  borderBottomColor: "white",
                  borderBottomWidth: 2,
                  width: 20,
                }}
              ></View>
            </View>
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
          {/* BUTTON VALIDATION  */}
          <TouchableOpacity
            title="Set parent secret code"
            style={[
              styles.btnValidation,
              {
                backgroundColor: dayNightMode
                  ? colors.bgNight
                  : colors.overlayNight,
              },
            ]}
            onPress={async () => {
              try {
                //check the content of input --client security side
                if (secretCodeInput.length !== 4 || !Number(secretCodeInput)) {
                  setError("veuillez définir un code valide à 4 chiffres");
                } else {
                  // build dataForm
                  const formData = new FormData();
                  const userId = await AsyncStorage.getItem("userId");
                  formData.append("_id", userId);
                  formData.append("secretCode", secretCodeInput);
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
                  if (response.data.account.secretCode) {
                    setParentSecret(true);
                  } else {
                    setError("Une erreur s'est produite. Veuillez réessayer");
                  }
                }
              } catch (error) {
                setError("Une erreur s'est produite. Veuillez réessayer");
                console.log(error.message);
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Scroll: {
    flex: 1,
  },

  container: {
    flex: 1,
    alignItems: "center",
  },
  textBold: {
    fontWeight: "bold",
    color: "white",
    marginLeft: 2,
  },
  text: {
    color: "white",
  },
  textContent: {
    alignItems: "center",
    marginBottom: 15,
    marginTop: 15,
  },
  inputCode: {
    fontSize: 40,
    textAlign: "center",
    color: "white",
  },
  btnValidation: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 80 / 2,
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
});
