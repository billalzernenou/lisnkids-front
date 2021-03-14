import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Alert,
  Modal,
  StyleSheet,
  Pressable,
  View,
  Dimensions,
  Text,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

// COMPONENTS
import MainTitle from "./MainTitle";
import Input from "./Input";
import colors from "../assets/colors";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";

const ModalInput = ({
  placeHolder,
  value,
  setValue,
  text,
  isCharge,
  setIsCharge,
  dayNightMode,
}) => {
  const [textInput, setTextInput] = useState("");
  const [valid, setValid] = useState(false);
  const [error1, setError] = useState(null);

  // if(text !== 'email'){
  //   keyboard="numeric"
  // }
  const updateUser = async () => {
    try {
      setError(null);

      if (textInput && String(textInput) != "0000") {
        console.log(String(textInput));
        console.log("input rempli");
        // build dataForm
        const formData = new FormData();
        const userId = await AsyncStorage.getItem("userId");
        formData.append("_id", userId);

        if (text === "email") {
          formData.append("email", textInput);
        } else if (text === "mot de passe") {
          formData.append("password", textInput);
        } else if (text === "code secret") {
          formData.append("secretCode", textInput);
        }
        //  send request to api
        const response = await axios.post(
          "https://lisnkids.herokuapp.com/api/update",
          formData,

          {
            headers: {
              Authorization: "Bearer LRCes!e2021vg",
            },
          }
        );
        if (response.data) {
          setValue(!value);
          setIsCharge(!isCharge);
        } else {
          setError("Une erreur est survenu. Veuillez réessayer");
        }
      } else {
        setError("Merci de remplir le champ");
      }
    } catch (error) {
      setError("Une erreur s'est produite. Veuillez réessayer");
      console.log(error.response.data);
    }
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={value}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setValue(!value);
        }}
      >
        <View style={styles.centeredView}>
          <View
            style={[
              styles.modalView,
              {
                backgroundColor: dayNightMode
                  ? colors.overlayNight
                  : colors.overlayNight,
              },
            ]}
          >
            <MainTitle
              text={`Modifier mon ${text}`}
              color={"white"}
              style={styles.modalText}
              marginBottom={20}
            />
            {/* ERROR */}
            <View style={{ width: "90%" }}>
              {text === "email" && (
                <TextInput
                  style={styles.inputCode}
                  placeholder="Entrez votre nouvel adresse email ..."
                  fontSize={16}
                  placeholderTextColor={colors.overlayDay}
                  onChangeText={(textInput) => {
                    setTextInput(textInput);
                    setError(null);
                  }}
                />
              )}
              {text === "code secret" && (
                <TextInput
                  style={styles.inputCode}
                  placeholder="Entrez votre nouveau code secret ..."
                  maxLength={4}
                  fontSize={16}
                  placeholderTextColor={colors.overlayDay}
                  keyboardType="numeric"
                  onChangeText={(textInput) => {
                    setTextInput(textInput);
                    setError(null);
                  }}
                />
              )}
              {text === "mot de passe" && (
                <Input
                  placeHolder={"Entre votre nouveau mot de passe ..."}
                  setFunction={setTextInput}
                  dayNightMode={dayNightMode}
                  secure={text === "mot de passe" ? true : false}
                  setError={setError}
                />
              )}
            </View>
            <View style={{ flexDirection: "row" }}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setValue(!value);
                  setError(null);
                }}
              >
                <AntDesign
                  name="close"
                  size={24}
                  color={
                    dayNightMode ? colors.overlayNight : colors.overlayNight
                  }
                  style={{ alignSelf: "center" }}
                />
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonCheck]}
                onPress={() => updateUser()}
              >
                <AntDesign
                  name="check"
                  size={32}
                  color={
                    dayNightMode ? colors.overlayNight : colors.overlayNight
                  }
                  style={{ alignSelf: "center" }}
                />
              </Pressable>
            </View>

            <View style={styles.errorContainer}>
              {error1 && (
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
                  {error1}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalView: {
    width: Dimensions.get("window").width,
    // backgroundColor: colors.overlayDayII,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 35,
    alignItems: "center",
  },
  button: {
    backgroundColor: colors.overlayDay,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  buttonOpen: {
    // backgroundColor: colors.overlayDayII,
    padding: 15,
  },
  buttonClose: {
    width: 40,
    height: 40,
  },
  buttonCheck: {
    width: 60,
    height: 60,

    marginLeft: 20,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: 100,
    height: 45,
    paddingHorizontal: 15,
    fontWeight: "bold",
    textAlign: "left",
    borderRadius: 25,
  },
  inputCode: {
    fontSize: 25,
    textAlign: "center",
    color: "white",
    marginBottom: 15,
  },
  errorContainer: { height: 10, width: "100%", marginVertical: 3 },
  error: {
    textAlign: "center",
    color: "white",
  },
});

export default ModalInput;
