import React, { useState, useEffect } from "react";
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
  Platform,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ImageBackground,
  FlatList,
} from "react-native";

import { useNavigation } from "@react-navigation/core";
import Constants from "expo-constants";
import colors from "../assets/colors";
import MainTitle from "../components/MainTitle";
import IsLoading from "../components/isLoading";
import WindowAvatar from "../components/WindowAvatar";
import WindowAvatarEmpty from "../components/WindowAvatarEmpty";
import ModalVerifSecretCode from "../components/modalVerifSecretCode";

export default function ChoiceEditChildrenScreen({
  dayNightMode,
  setSettingScreen,
  idChildrenSelecterForEdit,
  setIdChildrenSelecterForEdit,
  caca,
  setParentMode,
}) {
  const route = useRoute();
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setError(null);

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
          if (response.data.childrens.length !== 0) {
            // 1-je mets à jour mon state avec les infos des enfants , poru afficher ensuite tous mes profils
            setUserInfo(response.data);
            setIsLoading(false);
          } else {
            setParentMode(true);
            setSettingScreen("AddOtherChildren");
            setIsLoading(false);
          }
        } else {
          setError("Une erreur s'est produite. Veuillez réessayer");
        }
      } catch (error) {
        console.log(error);
        setError("Une erreur s'est produite. Veuillez réessayer");
      }
    };
    getUserInfo();
  }, []);

  return isLoading ? (
    <IsLoading />
  ) : (
    <ScrollView
      contentContainerStyle={[
        styles.scrollView,
        {
          backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
          flex: 1,

          justifyContent: "center",
          paddingTop: Constants.statusBarHeight,
        },
      ]}
    >
      <StatusBar hidden={true} />
      <View>
        <MainTitle
          text={`Cliquez sur le profil enfant à modifier`}
          color="white"
          fontSize={16}
          textAlign="center"
          marginBottom={8}
        />
      </View>

      {/* PROFIL ENFANT */}
      <View
        style={{
          alignItems: "center",
        }}
      >
        <FlatList
          numColumns={2}
          data={userInfo.childrens}
          keyExtractor={(item) => String(item._id)}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.btnWindowChildren]}
              onPress={() => {
                // setChildrenInfosStorage(item);
                setIdChildrenSelecterForEdit(item);
                setSettingScreen("EditChildren");
              }}
            >
              <WindowAvatar
                nameChildren={item.firstName}
                urlAvatar={
                  dayNightMode
                    ? item.avatar.daySelected
                    : item.avatar.nightSelected
                }
              />

              {/* BTN pour choisir avatar
                  <View style={[styles.windowWrapper]}>
                    <ImageBackground
                      style={styles.avatarImgWindow}
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
                    {/* Name children */}
              {/* <View style={styles.windowName}>
                      <ImageBackground
                        style={styles.imgName}
                        source={require("../assets/img/profil/name_only.png")}
                      >
                        <Text style={{ color: "white" }}>Nom de l'enfant</Text>
                      </ImageBackground>
                    </View>
                    {/* modal */}
              {/* <ModalVerifSecretCode
                      dayNightMode={dayNightMode}
                      value={modalUpSecretCode}
                      setValue={setModalUpSecretCode}
                      placeHolder="Entrez votre code secret.."
                      text="Saisissez votre code secret pour créer un nouveau profil"
                    />
                    {/* </View> */}
              {/* </View>  */}
            </TouchableOpacity>
            // ) : (
            //   <WindowAvatar
            //     nameChildren={item.firstName}
            //     urlAvatar={
            //       dayNightMode
            //         ? item.avatar.daySelected
            //         : item.avatar.nightSelected
            //     }
            //   />
            // )
          )}
        />
      </View>

      <View>
        <View style={styles.errorContainer}>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    backgroundColor: "red",
  },

  errorContainer: { height: 20, width: "100%", marginVertical: 8 },
  error: {
    color: "red",
    textAlign: "center",
  },
  text: {
    color: "white",
  },
  // Avatar empty

  btnWindowChildren: {
    justifyContent: "center",
    alignContent: "center",
    marginHorizontal: 5,
    marginVertical: 10,
  },
  windowContainer: {
    width: 140,
    // height: 280,
    // marginBottom: 15,
    // width: 140,
    // height: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  windowWrapper: {
    // height: 250,
    // width: 230,
    height: 150,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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

  inputName: {
    color: "white",
    textAlign: "center",

    width: "100%",
    paddingHorizontal: 10,
  },

  windowName: {
    marginTop: -20,
    height: 35,
    width: "100%",
    alignItems: "center",
  },
  imgName: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
  },
});

{
  /* <View>
  <Button
    title="go to child 1"
    onPress={() => {
      setSettingScreen("EditChildren");
    }}
  />
</View>; */
}
