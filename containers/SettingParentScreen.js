import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  SafeAreaView,
} from "react-native";
import colors from "../assets/colors";
import MainTitle from "../components/MainTitle";
import SwitchNotif from "../components/SwitchNotif";
import Constants from "expo-constants";
// NEED TO FIND SOLUTION FOR OPEN MULTIPLE MODALS ON SAME SCREEN !!
import ModalTrueFalse from "../components/ModalTrueFalseSettings";
import ModalInput from "../components/ModalInputSettings";
import SwitchMode from "../components/SwitchMode";
import { Entypo } from "@expo/vector-icons";
import IsLoading from "../components/isLoading";

const SettingParentScreen = ({
  setToken,
  dayNightMode,
  setDayNightMode,
  setLang,
  setGuidance,
  setUserGuidance,
  setGuidanceSuggestionStorage,
  setChildrenProfiles,
  setParentSecret,
  setChildrenInfosStorage,
  setParentMode,
  setIsEnabled2,
  setChildrenExistAsync,
  setSettingScreen,
}) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalUpEmail, setModalUpEmail] = useState(false);
  const [modalUpPassword, setModalUpPassword] = useState(false);
  const [modalUpSecretCode, setModalUpSecretCode] = useState(false);
  // AJOUT amande + axio asyncstorage ... for request
  const [isCharge, setIsCharge] = useState(false);
  const [parent, setParent] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getParentInfo = async () => {
      try {
        setError(null);
        // build dataForm
        const formData = new FormData();
        const userId = await AsyncStorage.getItem("userId");
        formData.append("_id", userId);

        //  send request to api
        const response = await axios.post(
          "https://lisnkids.herokuapp.com/api/userCard",
          formData,
          {
            headers: {
              Authorization: "Bearer LRCes!e2021vg",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data) {
          setParent(response.data);
          setIsLoading(false);
        } else {
          setError("Une erreur s'est produite. Veuillez réessayer");
        }
      } catch (error) {
        console.log(error);
        setError("Une erreur s'est produite. Veuillez réessayer");
      }
    };
    getParentInfo();
  }, [isCharge]);

  return isLoading ? (
    <>
      <IsLoading dayNightMode={dayNightMode} />
    </>
  ) : (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
          paddingTop: Constants.statusBarHeight + 40,
          flex: 1,
        },
      ]}
      blurRadius={1}
    >
      <StatusBar hidden={true} />
      <View scrollbars="none" blurRadius={modalVisible ? 7 : 0}>
        <MainTitle
          text="Espace Parents"
          color="white"
          fontSize={18}
          textAlign="left"
          marginBottom={20}
        />

        {/* test rechargement page a chaque changement sur le user parent
        <TouchableOpacity
          onPress={() => {
            setIsCharge(!isCharge);
          }}
        >
          <Text>test recharge page</Text>
        </TouchableOpacity> */}

        {/* 🙎‍♀️🙎‍♀️🙎‍♀️🙎‍♀️🙎‍♀️🙎‍♀️ */}
        <View style={styles.theme}>
          <MainTitle
            text="🙎‍♀️ Mon compte"
            color="white"
            fontSize={16}
            textAlign="left"
            marginBottom={8}
          />
          <Text style={styles.text}>Email : {parent.email}</Text>

          <TouchableOpacity>
            <Pressable
              onPress={() => setModalUpEmail(true)}
              style={styles.buttonOpacity}
            >
              <Text style={styles.text}>Modifier mon adresse e-mail</Text>
              {/* Open ModalInput Component */}
              <ModalInput
                isCharge={isCharge}
                setIsCharge={setIsCharge}
                value={modalUpEmail}
                setValue={setModalUpEmail}
                placeHolder="E-mail..."
                text="email"
                dayNightMode={dayNightMode}
              />
              <Entypo name="chevron-small-right" size={24} color="white" />
            </Pressable>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonOpacity}>
            <Pressable
              onPress={() => setModalUpPassword(true)}
              style={styles.buttonOpacity}
            >
              <Text style={styles.text}>Modifier mon mot de passe</Text>
              <ModalInput
                isCharge={isCharge}
                setIsCharge={setIsCharge}
                value={modalUpPassword}
                setValue={setModalUpPassword}
                placeHolder="Nouveau mot de passe..."
                text={"mot de passe"}
                dayNightMode={dayNightMode}
              />
              <Entypo name="chevron-small-right" size={24} color="white" />
            </Pressable>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonOpacity}>
            <Pressable
              onPress={() => setModalUpSecretCode(true)}
              style={styles.buttonOpacity}
            >
              <Text style={styles.text}>Modifier mon code secret</Text>
              <ModalInput
                isCharge={isCharge}
                setIsCharge={setIsCharge}
                value={modalUpSecretCode}
                setValue={setModalUpSecretCode}
                placeHolder="Code secret..."
                text={"code secret"}
                dayNightMode={dayNightMode}
              />
              <Entypo name="chevron-small-right" size={24} color="white" />
            </Pressable>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonOpacity}>
            <Text style={styles.text}>Annuler mon abonnement</Text>
            <Entypo name="chevron-small-right" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {/* 👨‍👧‍👦👨‍👧‍👦👨‍👧‍👦👨‍👧‍👦👨‍👧‍👦 */}
        <View style={styles.theme}>
          <MainTitle
            text="👨‍👧‍👦 Gestion des profils enfants"
            color="white"
            fontSize={16}
            textAlign="left"
            marginBottom={8}
          />
          <TouchableOpacity
            style={styles.buttonOpacity}
            onPress={() => setSettingScreen("ChoiceEditChildren")}
          >
            <Text style={styles.text}>Modifier les profils enfant</Text>
            <Entypo name="chevron-small-right" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonOpacity}>
            <Pressable
              onPress={() => setSettingScreen("DeleteProfilChildren")}
              style={styles.buttonOpacity}
            >
              <Text style={styles.text}>Supprimer un profil</Text>
              {/* dont work because of multiply modals */}
              {/* <ModalTrueFalse
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
              /> */}
              <Entypo name="chevron-small-right" size={24} color="white" />
            </Pressable>
          </TouchableOpacity>
        </View>
        {/* 🙋🙋🙋🙋🙋 */}
        <View style={styles.theme}>
          <MainTitle
            text="🙋 Service Client"
            color="white"
            fontSize={16}
            textAlign="left"
            marginBottom={8}
          />
          <TouchableOpacity style={styles.buttonOpacity}>
            <Text style={styles.text}>Contacter l'équipe de choc !</Text>
            <Entypo name="chevron-small-right" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {/* ⚙️⚙️⚙️⚙️⚙️ */}
        <View style={styles.theme}>
          <MainTitle
            text="⚙️ Paramètres de l'application"
            color="white"
            fontSize={16}
            textAlign="left"
            marginBottom={8}
          />
          <View style={styles.buttonOpacity}>
            <Text style={styles.text}>
              Notifications mobiles {isEnabled ? "activées" : "désactivées"}
            </Text>
            <SwitchNotif
              isEnabled={isEnabled}
              setIsEnabled={setIsEnabled}
              dayNightMode={dayNightMode}
            />
          </View>
          <TouchableOpacity style={styles.buttonOpacity}>
            <Text style={styles.text}>🇫🇷 Français</Text>
            <Entypo name="chevron-small-right" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonOpacity}>
            <Text style={styles.text}>Données et stockage</Text>
            <Entypo name="chevron-small-right" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {/* 🖋️🖋️🖋️🖋️🖋️ */}
        <View style={styles.theme}>
          <MainTitle
            text="🖋️ Mentions légales"
            color="white"
            fontSize={16}
            textAlign="left"
            marginBottom={8}
          />
          <TouchableOpacity style={styles.buttonOpacity}>
            <Text style={styles.text}>Conditions d'utilisation</Text>
            <Entypo name="chevron-small-right" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonOpacity}>
            <Text style={styles.text}>Confidentialité</Text>
            <Entypo name="chevron-small-right" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {/* Deconnexion */}
        <View style={styles.theme}>
          <TouchableOpacity
            style={{ marginBottom: 40 }}
            title="Log Out"
            onPress={() => {
              // tomporary code
              setToken(null);
              setLang(null);
              setGuidance(null);
              setUserGuidance({
                guidance1: false,
                guidance2: false,
              });
              setGuidanceSuggestionStorage(false);
              setChildrenProfiles(false);
              setParentSecret(false);
              setChildrenInfosStorage(null);
              setParentMode(false);
              setChildrenExistAsync(null);
              setIsEnabled2(false);
            }}
          >
            <Text style={[styles.text]}>Se déconnecter </Text>
          </TouchableOpacity>
        </View>
        <SwitchMode
          setDayNightMode={setDayNightMode}
          dayNightMode={dayNightMode}
        />
      </View>
    </ScrollView>
  );
};

export default SettingParentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
  },
  containerSwitchMode: {
    position: "relative",
  },
  theme: {
    marginBottom: 40,
  },
  buttonOpacity: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    marginVertical: 15,
  },
});
