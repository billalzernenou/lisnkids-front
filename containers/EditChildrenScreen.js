import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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
import RNPickerSelect, { defaultStyles } from "react-native-picker-select";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import Constants from "expo-constants";
import MainTitle from "../components/MainTitle";
import WindowOnly from "../components/WindowOnly";
import { TextInput } from "react-native-gesture-handler";
import { useEffect } from "react";

//components
import ModalInputParrentMode from "../components/ModalInputParrentMode";
import IsLoading from "../components/isLoading";
import { Colors } from "react-native/Libraries/NewAppScreen";
import colors from "../assets/colors";

export default function EditChildrenScreen({
  dayNightMode,
  setSettingScreen,
  idChildrenSelecterForEdit,
  setIdChildrenSelecterForEdit,

  navigation,
  isEnabled,
  setIsEnabled,
  parentMode,
  setParentMode,
}) {
  const route = useRoute();
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);
  const [clickedOnAvatar, setClickedOnAvatar] = useState(false);
  const [allAvatar, setAllAvatar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [nameChildren, setNameChildren] = useState("");
  const [ageChildren, setAgeChildren] = useState("");
  const [avatarSelected, setAvatarSelected] = useState("");
  const [childrenInfo, setChildrenInfo] = useState(null);
  const tabAge = [];
  for (let i = 1; i <= 12; i++) {
    tabAge.push({
      label: `${i} ${i === 1 ? "an" : "ans"}`,
      value: i,
      color: colors.textNight,
    });
  }
  useEffect(() => {
    const fetchData = async () => {
      // Je récupère les infos du storage a chaque rechargement
      const formData = new FormData();

      formData.append("idChildren", idChildrenSelecterForEdit._id);
      // setChildren(JSON.parse(childrenStorage));
      try {
        const response = await axios.post(
          `https://lisnkids-api.herokuapp.com/api/infoChildren`,
          formData,
          {
            headers: {
              Authorization: "Bearer LRCes!e2021vg",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data) {
          setChildrenInfo(response.data);
          setIsLoading(false);
        } else {
          setError("Une erreur s'est produite. Veuillez réessayer");
        }
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchData();
  }, []);
  // FONCTION POUR SELECTIONNER UN AVATAR
  const getAllAvatar = async () => {
    setIsLoadingAvatar(true);
    try {
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

  // Edit children
  const editTheChildren = async () => {
    setError(null);
    if (!nameChildren || !avatarSelected || !ageChildren) {
      setError("Merci de remplir tous les champs");
    } else {
      try {
        const formData = new FormData();

        // const userId = await AsyncStorage.getItem("userId");
        formData.append("_id", idChildrenSelecterForEdit._id);
        formData.append("firstName", nameChildren);
        formData.append("daySelected", avatarSelected.daySelected);
        formData.append("dayUnselected", avatarSelected.dayUnselected);
        formData.append("nightSelected", avatarSelected.nightSelected);
        formData.append("nightUnselected", avatarSelected.nightUnselected);
        formData.append("onlySelected", avatarSelected.onlySelected);
        formData.append("onlyUnselected", avatarSelected.onlyUnselected);
        formData.append("nameAvatar", avatarSelected.title);
        formData.append("age", ageChildren);
        const response = await axios.post(
          "https://lisnkids-api.herokuapp.com/api/update_children",
          formData,
          {
            headers: {
              Authorization: "Bearer LRCes!e2021vg",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data) {
          setSettingScreen(null);
        } else {
          setError("Une erreur s'est produite. Veuillez réessayer");
        }
      } catch (error) {
        if (error.response.data.message === "children already exists") {
          setError("Cet enfant existe déjà");
        }
        if (error.response.data.message === "Limit of 4 children exceeded") {
          setError("Vous avez atteint le nombre maximum de profil");
          navigation.navigate("Profile");
        }
        console.log(error.response.data.message);
      }
    }
  };

  return isLoading ? (
    <>
      <IsLoading />
    </>
  ) : (
    // ne pose pas de pb sans
    // return isLoading ? (
    //   <>
    //     <IsLoading />
    //   </>
    // ) : isEnabled ? (
    //   <ModalInputParrentMode
    //     setIsEnabled={setIsEnabled}
    //     setParentMode={setParentMode}
    //     dayNightMode={dayNightMode}
    //   />
    // ) : (
    <>
      <ScrollView
        style={[
          styles.safeAreaView,
          {
            backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
            flex: 1,
            paddingTop: Constants.statusBarHeight + 60,
          },
        ]}
      >
        <StatusBar hidden={true} />

        <View>
          <MainTitle
            text={`Modification du profil de ${childrenInfo.firstName}`}
            color="white"
            fontSize={16}
            textAlign="center"
            marginBottom={8}
          />
          {/* btn go back */}
          <TouchableOpacity
            style={{}}
            title="go back"
            onPress={() => {
              setSettingScreen("ChoiceEditChildren");
            }}
          >
            {/* <Ionicons
              name="arrow-back-outline"
              size={24}
              color={dayNightMode ? colors.textDay : colors.textNight}
            /> */}
            <Text
              style={{
                color: dayNightMode ? colors.textDay : colors.overlayNight,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Annuler
            </Text>
          </TouchableOpacity>
        </View>
        {/* Si je clique sur un avatar, la liste des avatars s'affichent, sinon j'affiche les profils */}
        {/* CREATION DE PROFIL */}
        {!clickedOnAvatar ? (
          <ScrollView contentContainerStyle={[styles.scroll]}>
            <View style={[styles.container]}>
              <StatusBar hidden={true} />
              {/* Les fenetres vide pour choisir son profil */}
              <View style={[styles.windowContainer]}>
                {/* BTN pour choisir avatar */}
                <View style={[styles.windowWrapper]}>
                  <TouchableOpacity onPress={getAllAvatar}>
                    {avatarSelected ? (
                      // Si j'ai cliqué sur un avatar dans la liste, j'affiche ce nouvel avatar
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
                      // Sinon j'affiche l'avatar actuel de l'enfant
                      <ImageBackground
                        style={styles.avatarEmpty}
                        source={{
                          uri: dayNightMode
                            ? childrenInfo.avatar.daySelected
                            : childrenInfo.avatar.nightSelected,
                        }}
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
                        placeholder={idChildrenSelecterForEdit.firstName}
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
                        label:
                          String(idChildrenSelecterForEdit.age) === 1
                            ? `${String(idChildrenSelecterForEdit.age)} an`
                            : `${String(idChildrenSelecterForEdit.age)} ans`,
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
              {/* BUTTON VALIDATION EDIT CHILDREN */}
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
                  title="Edit children"
                  onPress={editTheChildren}
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
          <View>
            <FlatList
              // horizontal={false}
              // numColumns={2}
              data={allAvatar}
              keyExtractor={(item) => String(item._id)}
              renderItem={({ item, index }) => (
                <View key={index}>
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
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    // justifyContent: "space-between",
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },

  container: {
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
    marginBottom: -25,
    // width: 140,
    // height: 250,
    alignItems: "center",
    // backgroundColor: "red",
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
    marginTop: 20,
    marginBottom: 40,
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  // BTN VALIDATION
  btnValidationWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30,
  },
  btnValidation: {
    // backgroundColor: "red",

    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 80 / 2,
  },
});
{
  /* <Button
        title="add child"
        onPress={() => {
          setSettingScreen(null);
        }}
      ></Button>

      <Button
        title="go back"
        onPress={() => {
          setSettingScreen("ChoiceEditChildren");
        }}
      /> */
}
