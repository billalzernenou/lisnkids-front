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
import { useNavigation } from "@react-navigation/native";
// COMPONENTS
import MainTitle from "./MainTitle";
import Input from "./Input";
import colors from "../assets/colors";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { Colors } from "react-native/Libraries/NewAppScreen";

const modalVerifSecretCode = ({
  placeHolder,
  value,
  setValue,
  text,
  dayNightMode,
  setIsEnabled,
  setSettingScreen,
  setParentMode,
}) => {
  const [textInput, setTextInput] = useState("");
  const [valid, setValid] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const verifSecretCode = async () => {
    setError(null);
    try {
      if (textInput) {
        const formData = new FormData();
        const userId = await AsyncStorage.getItem("userId");
        formData.append("_id", userId);
        const response = await axios.post(
          "https://lisnkids-api.herokuapp.com/api/userCard",
          formData,
          {
            headers: {
              Authorization: "Bearer LRCes!e2021vg",
            },
          }
        );
        if (response.data.account.secretCode === Number(textInput)) {
          setValue(!value);
          setIsEnabled(true);
          setSettingScreen("AddOtherChildren");
          setParentMode(true);

          // navigation.push("AddOtherChildren");
        } else {
          setError("Vous n'êtes pas autorisé");
        }
      } else {
        setError("Merci de saisir le code secret");
      }
    } catch (error) {
      setError("Une erreur s'est produite. Veuillez réessayer");
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
              text={text}
              color={"white"}
              style={styles.modalText}
              marginBottom={20}
              textAlign="center"
            />
            <View style={{ width: "90%" }}>
              <TextInput
                style={styles.inputCode}
                placeholder={placeHolder}
                maxLength={4}
                fontSize={16}
                placeholderTextColor={colors.overlayDay}
                keyboardType="numeric"
                onChangeText={(textInput) => {
                  setTextInput(textInput);
                  setError(null);
                }}
                secureTextEntry={true}
              />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setValue(!value);
                  setError(null);
                  setIsEnabled(false);
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
                onPress={verifSecretCode}
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
  errorContainer: { height: 1, width: "100%", marginVertical: 3 },
  error: {
    textAlign: "center",
  },
});

export default modalVerifSecretCode;
