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
} from "react-native";

import { useNavigation } from "@react-navigation/core";
import Constants from "expo-constants";
import colors from "../assets/colors";
import MainTitle from "../components/MainTitle";
import IsLoading from "../components/isLoading";
import { FlatList } from "react-native-gesture-handler";
import WindowAvatar from "../components/WindowAvatar";
import WindowAvatarEmpty from "../components/WindowAvatarEmpty";
import ModalVerifSecretCode from "../components/modalVerifSecretCode";
import ModalInputParrentMode from "../components/ModalInputParrentMode";

export default function ProfileScreen({
   dayNightMode,
   setChildrenInfosStorage,
   setParentMode,
   isEnabled,
   setIsEnabled,
   setSettingScreen,
}) {
   const route = useRoute();
   const [state, setState] = useState(null);
   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [userInfo, setUserInfo] = useState(true);
   const [childrens, setChildrens] = useState(0);
   const navigation = useNavigation();
   const [modalUpSecretCode, setModalUpSecretCode] = useState(false);
   const [secretCode, setSecretCode] = useState(0);

   // FONCTION POUR RECUP INFO SUR LE PARENT ACTUELLEMENT CONNECTE
   useEffect(() => {
      const getUserInfo = async () => {
         try {
            setError(null);
            setChildrenInfosStorage(null);
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
               setUserInfo(response.data);
               // Je copie mon tableau d'objets
               const tab = [...response.data.childrens];
               if (response.data.childrens.length < 4) {
                  tab.push({
                     last: true,
                     firstName: "Nom de l'enfant",
                     avatar: {
                        daySelected:
                           "https://res.cloudinary.com/lisnkids/image/upload/v1615310805/plusDay_egitat.png",
                        nightSelected:
                           "https://res.cloudinary.com/lisnkids/image/upload/v1615310804/plusNight_ff6x4z.png",
                     },
                  });
               }
               setChildrens(tab);
               setSecretCode(response.data.account.secretCode);
               setIsLoading(false);
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
      <View
         contentContainerStyle={styles.scrollView}
         style={{
            backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
            alignContent: "center",
            alignItems: "center",
            flex: 1,
            paddingTop: Constants.statusBarHeight + 40,
         }}
      >
         {/* {isEnabled && (
        <ModalInputParrentMode
          setIsEnabled={setIsEnabled}
          setParentMode={setParentMode}
        />
      )} */}
         <StatusBar hidden={true} />
         {/* <View
        style={{
          backgroundColor: "green",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      > */}
         <View>
            <MainTitle
               text="Qui écoute une série ?"
               color="white"
               fontSize={16}
               textAlign="center"
               marginBottom={8}
            />
         </View>

         {/* PROFIL ENFANT */}
         <View
            style={{
               // alignItems: "center",
               // backgroundColor: "red",
               // backgroundColor: "green",
               flex: 1,
               alignItems: "center",
               justifyContent: "center",
               // justifyContent: "center",
            }}
         >
            <FlatList
               numColumns={2}
               data={childrens}
               keyExtractor={(item) => String(item._id)}
               renderItem={({ item, index }) => (
                  <TouchableOpacity
                     style={[styles.btnWindowChildren]}
                     onPress={() => {
                        setChildrenInfosStorage(item);
                        navigation.navigate("Home");
                     }}
                  >
                     {item.last ? (
                        // AJOUT DUN PROFIL
                        // Si j'ai moins de 4 profils, j'affiche une fenetre pour ajouter un profil
                        <TouchableOpacity
                           style={[styles.windowContainer]}
                           onPress={() => {
                              // demande du code secret avant d'aller sur la page d'ajout
                              setIsEnabled(true);
                              // replaced
                              setModalUpSecretCode(true);
                           }}
                        >
                           {/* <View style={[styles.windowContainer]}> */}
                           {/* BTN pour choisir avatar */}
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
                              <View style={styles.windowName}>
                                 <ImageBackground
                                    style={styles.imgName}
                                    source={require("../assets/img/profil/name_only.png")}
                                 >
                                    <Text style={{ color: "white" }}>
                                       Nom de l'enfant
                                    </Text>
                                 </ImageBackground>
                              </View>
                              {/* modal */}
                              <ModalVerifSecretCode
                                 dayNightMode={dayNightMode}
                                 setParentMode={setParentMode}
                                 setIsEnabled={setIsEnabled}
                                 setSettingScreen={setSettingScreen}
                                 value={modalUpSecretCode}
                                 setValue={setModalUpSecretCode}
                                 placeHolder="Entrez votre code secret.."
                                 text="Saisissez votre code secret pour créer un nouveau profil"
                              />
                              {/* </View> */}
                           </View>
                        </TouchableOpacity>
                     ) : (
                        <WindowAvatar
                           nameChildren={item.firstName}
                           urlAvatar={
                              dayNightMode
                                 ? item.avatar.daySelected
                                 : item.avatar.nightSelected
                           }
                        />
                     )}
                  </TouchableOpacity>
               )}
            />
         </View>

         <View>
            <View style={styles.errorContainer}>
               {error && <Text style={styles.error}>{error}</Text>}
            </View>
         </View>
         {/* </View> */}
      </View>
   );
}
const styles = StyleSheet.create({
   container: {
      alignItems: "center",
      justifyContent: "center",
   },

   scrollView: {},
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
      // alignContent: "center",
      marginHorizontal: 5,
      marginVertical: 5,
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
