import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Pressable,
  View,
  Dimensions,
  TextInput,
  Text,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// COMPONENTS
import MainTitle from "./MainTitle";
import Input from "./Input";
import colors from "../assets/colors";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";

const ModalInputParrentMode = ({
  modalVisible,
  setModalVisible,
  placeHolder,
  setIsEnabled,
  setParentMode,

  dayNightMode,
}) => {
  const navigation = useNavigation();
  const [input, setInput] = useState("");
  const [valid, setValid] = useState(false);
  const [error1, setError] = useState(null);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
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
              text={"Veuillez entrer votre code secret"}
              color={"white"}
              style={styles.modalText}
              marginBottom={20}
            />
            <View style={{ width: "90%" }}>
              <Input
                setError={setError}
                style={styles.inputCode}
                placeHolder="Votre code secret"
                secure={true}
                maxLength={4}
                placeholderTextColor="white"
                setFunction={setInput}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
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
                onPress={async () => {
                  //parentcode fit

                  // navigation.navigate("SettingParentScreen");
                  // setIsEnabled(false);
                  setError(null);
                  try {
                    // navigation.navigate("SettingParentScreen");
                    // setIsEnabled(false);
                    // build dataForm
                    const formData = new FormData();
                    const userId = await AsyncStorage.getItem("userId");
                    formData.append("_id", userId);
                    //  send request to api
                    const response = await axios.post(
                      "https://lisnkids-api.herokuapp.com/api/userCard",
                      formData,
                      {
                        headers: {
                          Authorization: "Bearer LRCes!e2021vg",
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    );

                    if (response.data.account.secretCode === Number(input)) {
                      setParentMode(true);
                    } else {
                      setError(
                        "votre secret code n'est pas correct veuillez réssayer "
                      );
                    }
                  } catch (error) {
                    console.log(error);
                    setError("Une erreur s'est produite. Veuillez réessayer");
                  }
                }}
              >
                <AntDesign
                  name="check"
                  size={32}
                  color={
                    dayNightMode ? colors.overlayNight : colors.overlayNight
                  }
                  //   onPress={
                  //     () => setValid(true)
                  //     // puis rentrer les valeurs dans le back
                  //   }
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
  errorContainer: { height: 10, width: "100%", marginVertical: 3 },
  error: {
    textAlign: "center",
    color: "white",
  },
});

export default ModalInputParrentMode;
