import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Pressable,
  View,
  Dimensions,
} from "react-native";
// COMPONENTS
import MainTitle from "./MainTitle";
import Input from "./Input";
import colors from "../assets/colors";
import { AntDesign } from "@expo/vector-icons";

const ModalInput = ({ modalVisible, setModalVisible, placeHolder }) => {
  const [email, setEmail] = useState("");
  const [valid, setValid] = useState(false);
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
          <View style={styles.modalView}>
            <MainTitle
              text={"Modifier mon profil"}
              color={"white"}
              style={styles.modalText}
              marginBottom={20}
            />
            <View style={{ width: "90%" }}>
              <Input
                placeHolder={placeHolder}
                setFunction={setEmail}
                dayNightMode={true}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <AntDesign
                  name="close"
                  size={24}
                  color="white"
                  style={{ alignSelf: "center" }}
                />
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonCheck]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <AntDesign
                  name="check"
                  size={32}
                  color="white"
                  //   onPress={
                  //     () => setValid(true)
                  //     // puis rentrer les valeurs dans le back
                  //   }
                  style={{ alignSelf: "center" }}
                />
              </Pressable>
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
    backgroundColor: colors.overlayDayII,
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
    backgroundColor: colors.overlayDayII,
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
});

export default ModalInput;
