import React from "react";
import { useRoute } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Platform,
  Dimensions,
  ImageBackground,
  ImageBackgroundBase,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import colors from "../assets/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

import RNPickerSelect, { defaultStyles } from "react-native-picker-select";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react/cjs/react.development";
import WindowOnly from "../components/WindowOnly";
import { TextInput } from "react-native-gesture-handler";
import { useEffect } from "react";
import IsLoading from "../components/isLoading";
import { Colors } from "react-native/Libraries/NewAppScreen";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
export default function AddFirstChildren({
  childrenProfiles,
  setChildrenProfiles,
  dayNightMode,
  setChildrenExistAsync,
}) {
  const route = useRoute();
  const [clickedOnAvatar, setClickedOnAvatar] = useState(false);
  const [allAvatar, setAllAvatar] = useState([]);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(true);
  const [avatarSelected, setAvatarSelected] = useState("");
  const [nameChildren, setNameChildren] = useState("");
  const [ageChildren, setAgeChildren] = useState("");
  const [error, setError] = useState(null);
  const tabAge = [];
  for (let i = 1; i <= 12; i++) {
    tabAge.push({
      label: `${i} ${i === 1 ? "an" : "ans"}`,
      value: i,
      color: colors.textNight,
    });
  }

  // FONCTION POUR RECUP INFO SUR LE PARENT ACTUELLEMENT CONNECTE
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setError(null);
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
        if (response.data) {
          setUserInfo(response.data);

          setIsLoading(false);
        } else {
          setError("Une erreur s'est produite. Veuillez réessayer");
        }
      } catch (error) {
        setError("Une erreur s'est produite. Veuillez réessayer");
      }
    };
    getUserInfo();
  }, []);

  // FONCTION POUR SELECTIONNER UN AVATAR
  const getAllAvatar = async () => {
    setIsLoadingAvatar(true);
    try {
      //  send request to api
      // Je récupère tous les avatars, et à l'affichage je ferais un tri
      const formData = new FormData();
      formData.append("", "");
      const response = await axios.post(
        "https://lisnkids-api.herokuapp.com/api/avatars",
        formData,
        {
          headers: {
            Authorization: "Bearer LRCes!e2021vg",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        setAllAvatar(response.data);
        setClickedOnAvatar(true);
        setIsLoadingAvatar(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Ajout du 1er children
  const addFirstChildren = async () => {
    setError(null);
    if (!nameChildren || !avatarSelected || !ageChildren) {
      setError("Merci de remplir tous les champs");
    } else {
      try {
        // build dataForm
        const formData = new FormData();
        const userId = await AsyncStorage.getItem("userId");
        formData.append("_id", userId);
        formData.append("firstName", nameChildren);
        formData.append("daySelected", avatarSelected.daySelected);
        formData.append("dayUnselected", avatarSelected.dayUnselected);
        formData.append("nightSelected", avatarSelected.nightSelected);
        formData.append("nightUnselected", avatarSelected.nightUnselected);
        formData.append("onlySelected", avatarSelected.onlySelected);
        formData.append("onlyUnselected", avatarSelected.onlyUnselected);
        formData.append("nameAvatar", avatarSelected.title);
        formData.append("age", ageChildren);
        //  send request to api
        const response = await axios.post(
          "https://lisnkids-api.herokuapp.com/api/add_children",
          formData,
          {
            headers: {
              Authorization: "Bearer LRCes!e2021vg",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data) {
          setChildrenProfiles(true);
          setChildrenExistAsync(true);
        } else {
          setError("Une erreur s'est produite. Veuillez réessayer");
        }
      } catch (error) {
        if (error.response.data.message === "children already exists") {
          setError("Cet enfant existe déjà");
        }
        if (error.response.data.message === "Limit of 4 children exceeded") {
          setError("Vous avez atteint le nombre maximum de profil");
          // On passe à la home screen quand meme mais ca ne crée pas le profil enfant(à modifier)
          setChildrenProfiles(true);
        }
      }
    }
  };

  return isLoading ? (
    <>
      <IsLoading />
    </>
  ) : (
    <>
      <View
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
        {/* Si je clique sur un avatar, la liste des avatars s'affichent, sinon j'affiche les profils */}
        {/* CREATION DE PROFIL */}

        {!clickedOnAvatar ? (
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={[styles.container]}>
              <StatusBar hidden={true} />
              {/* Les fenetres vide pour choisir son profil */}
              <View style={[styles.windowContainer]}>
                {/* BTN pour choisir avatar */}
                <View style={[styles.windowWrapper]}>
                  <TouchableOpacity onPress={getAllAvatar}>
                    {avatarSelected ? (
                      <ImageBackground
                        style={styles.avatarImgWindow}
                        source={{
                          uri: dayNightMode
                            ? avatarSelected.daySelected
                            : avatarSelected.nightSelected,
                        }}
                      >
                        <Image
                          source={require("../assets/img/profil/window-only.png")}
                          style={styles.windowOnly}
                        />
                      </ImageBackground>
                    ) : (
                      <ImageBackground
                        style={styles.avatarEmpty}
                        source={
                          dayNightMode
                            ? require("../assets/img/logo-icons/plusDay.png")
                            : require("../assets/img/logo-icons/plusNight.png")
                        }
                      >
                        <Image
                          source={require("../assets/img/profil/window-only.png")}
                          style={styles.windowOnly}
                        />
                      </ImageBackground>
                    )}
                  </TouchableOpacity>
                </View>
                {/* Name children */}
                <View style={styles.windowBottom}>
                  <View style={styles.windowName}>
                    <ImageBackground
                      style={styles.imgName}
                      source={require("../assets/img/profil/name_only.png")}
                    >
                      <TextInput
                        style={styles.inputName}
                        onChangeText={(text) => setNameChildren(text)}
                        placeholder="Nom de l'enfant"
                        placeholderTextColor={
                          dayNightMode ? colors.textDay : colors.textNight
                        }
                        color={dayNightMode ? colors.textDay : colors.textNight}
                        value={nameChildren}
                      />
                    </ImageBackground>
                  </View>
                  {/* INPUT AGE */}
                  <View style={styles.inputAge}>
                    <RNPickerSelect
                      onValueChange={(value) => {
                        setAgeChildren(value);
                        setError(null);
                      }}
                      placeholder={{
                        label: "Âge de l'enfant",
                        value: null,
                      }}
                      items={tabAge}
                      style={{
                        ...styles,

                        iconContainer: {
                          top: 10,
                          right: 12,
                        },
                        placeholder: {
                          color: colors.textDay,

                          fontSize: 12,
                          fontWeight: "bold",
                        },
                      }}
                      value={ageChildren}
                      useNativeAndroidPickerStyle={false}
                      textInputProps={{ underlineColor: "yellow" }}
                      Icon={() => {
                        return (
                          <Ionicons
                            name="md-arrow-down"
                            size={24}
                            color={colors.textDay}
                          />
                        );
                      }}
                    />
                  </View>
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
              {/* BUTTON VALIDATION ADD CHILDREN */}
              <View style={styles.btnValidationWrapper}>
                <TouchableOpacity
                  style={[
                    styles.btnValidation,
                    {
                      backgroundColor: dayNightMode
                        ? colors.overlayDayII
                        : colors.overlayNight,
                    },
                  ]}
                  title="add children"
                  onPress={addFirstChildren}
                >
                  <AntDesign
                    name="check"
                    size={52}
                    color="white"
                    style={{ alignSelf: "center" }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        ) : /* LISTE DES AVATARS */
        isLoadingAvatar ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <SafeAreaView>
            <FlatList
              // horizontal={false}
              // numColumns={2}
              data={allAvatar}
              keyExtractor={(item) => String(item._id)}
              renderItem={({ item }) => (
                <View key={item._id}>
                  <TouchableOpacity
                    style={styles.btnListeAvatar}
                    onPress={
                      // Au clic, je récupère l'id de l'avatar et je fais disparaitre la liste d'avatar
                      () => {
                        setAvatarSelected(item);
                        setIsLoadingAvatar(false);
                        setClickedOnAvatar(false);
                      }
                    }
                  >
                    <Image
                      style={styles.imgAvatar}
                      source={{
                        uri: dayNightMode
                          ? item.daySelected
                          : item.nightSelected,
                      }}
                    />
                    <Text style={styles.nameListAvatar}>{item.title}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </SafeAreaView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    // justifyContent: "space-between",
    flex: 1,
    // alignItems: "center",
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // LISTE AVATAR
  btnListeAvatar: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  nameListAvatar: {
    color: "white",
  },
  imgAvatar: {
    // width: width / 2 - 10 * 2,
    // height: height / 2 - 10 * 2,
    width: 150,
    height: 150,
    resizeMode: "cover",
  },
  // WINDOW PROFIL
  windowContainer: {
    width: 240,
    // height: 280,
    // marginBottom: 15,
    marginBottom: -25,

    // width: 140,
    // height: 250,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  windowWrapper: {
    height: 250,
    width: 230,
    // height: 150,
    // width: 130,
  },
  windowOnly: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImgWindow: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmpty: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
    alignItems: "center",
    justifyContent: "center",
  },
  inputName: {
    color: "white",
    textAlign: "center",

    width: "100%",
    paddingHorizontal: 10,
  },
  inputAge: {
    marginVertical: 15,
    width: "70%",
  },
  windowBottom: {
    // marginTop: -45,
    // marginBottom: 10,
    // justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
  },
  windowName: {
    height: 45,
    width: "100%",
    marginTop: -40,
  },
  imgName: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
  },
  // INPUT AGE
  inputAndroid: {
    width: "100%",
    height: 45,
    paddingHorizontal: 15,
    fontWeight: "bold",
    textAlign: "left",
    borderRadius: 25,
    backgroundColor: colors.overlayDayII,

    color: colors.textDay,
    paddingRight: 0, // to ensure the text is never behind the icon
  },
  inputIOS: {
    width: "100%",
    height: 45,
    paddingHorizontal: 15,
    fontWeight: "bold",
    textAlign: "left",
    borderRadius: 25,
    backgroundColor: colors.overlayDayII,
    color: colors.textDay,
    paddingRight: 0,
  },

  // ERROR
  errorContainer: {
    height: 20,
    width: "100%",
    marginTop: 30,
    marginBottom: 15,
  },
  error: {
    // color: "#AB5961",
    textAlign: "center",
  },
  // BTN VALIDATION
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
});
