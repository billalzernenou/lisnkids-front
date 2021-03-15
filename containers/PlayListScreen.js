import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRoute } from "@react-navigation/native";
import {
  AntDesign,
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar,
  Platform,
  FlatList,
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
import { Colors } from "react-native/Libraries/NewAppScreen";
export default function PlayListScreen({
  dayNightMode,
  setChildrenInfosStorage,
}) {
  const route = useRoute();
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);
  const [data0, setData0] = useState([]);
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [isCharge, setIsCharge] = useState(false);
  const [children, setChildren] = useState(null);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      setIsCharge(!isCharge);
      // Call any action
    });
    // Function to get information on the child's playslist
    const getUserInfo = async () => {
      try {
        setError(null);
        // build dataForm
        const formData = new FormData();

        const childrenInfo = await AsyncStorage.getItem("childrenInfos");
        let idChildren = JSON.parse(childrenInfo);
        idChildren = idChildren._id;
        setChildren(idChildren);

        // save episode for player audio
        const formData0 = new FormData();
        formData0.append("idChildren", idChildren);
        //  send request to api
        const response0 = await axios.post(
          "https://lisnkids-api.herokuapp.com/api/listMyPlaylistEpisode",
          formData0,
          {
            headers: {
              Authorization: "Bearer LRCes!e2021vg",
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response0.data) {
          if (response0.data !== "PlayList vide" && response0.data.length > 0) {
            setState(false);
            setData0(response0.data);
          } else {
            setState(true);
          }
        } else {
          setError("Pas d'infos. Veuillez réessayer");
        }
        // end save episode for player audio

        // Start episode for playlist
        formData.append("idChildren", idChildren);

        //  display PlayList
        const response = await axios.post(
          "https://lisnkids-api.herokuapp.com/api/listMyPlaylist",
          formData,
          {
            headers: {
              Authorization: "Bearer LRCes!e2021vg",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data) {
          setData(response.data);
          setIsLoading(false);
        } else {
          setError("Pas d'infos. Veuillez réessayer");
        }
        // end episode for playlist
      } catch (error) {
        setError("Une erreur s'est produite. Veuillez réessayer");
      }
    };
    getUserInfo();
  }, [isCharge, navigation]);

  const trashEpisode = async (idplayslist) => {
    // trash episode in the playlist
    setError(null);
    try {
      const childrenInfo = await AsyncStorage.getItem("childrenInfos");

      let idChildren = JSON.parse(childrenInfo);
      idChildren = idChildren._id;

      // build dataForm
      const formData = new FormData();
      formData.append("idPlayLists", idplayslist);
      formData.append("idChildren", idChildren);

      //  send request to api
      const response = await axios.post(
        "https://lisnkids-api.herokuapp.com/api/trashEpisodeMyplaylists",
        formData,
        {
          headers: {
            Authorization: "Bearer LRCes!e2021vg",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        setIsCharge(!isCharge);
      } else {
        setError(
          "Une erreur s'est produite dans Trash Episode. Veuillez réessayer"
        );
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const downloadEpisode = async (idplayslist) => {
    // download episode episode in the playlist
    setError(null);
    try {
      // build dataForm
      const formData = new FormData();
      formData.append("idPlayLists", idplayslist);
      //  send request to api
      const response = await axios.post(
        "https://lisnkids-api.herokuapp.com/api/downloadEpisodeMyplaylists",
        formData,
        {
          headers: {
            Authorization: "Bearer LRCes!e2021vg",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data) {
        setIsCharge(!isCharge);
      } else {
        setError("Une erreur s'est produite1. Veuillez réessayer");
      }
    } catch (error) {
      setError("Une erreur s'est produite2. Veuillez réessayer");
    }
  };

  const handleSelectEpisode = async () => {
    if (data0 !== "PlayList vide" && data0.length !== 0) {
      // Launch the playlist to PlayerAudio
      setState(false);
      navigation.navigate("Episode", {
        item: data0[0],
        data: data0,
      });
    } else {
      // display PlayList empty
      setState(true);
    }
  };
  const moveItem = async () => {
    setError("Le déplacement n'est pas disponible dans cette version.");
  };
  return (
    <View
      contentContainerStyle={styles.scrollView}
      style={{
        backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
        flex: 1,
        paddingTop: Constants.statusBarHeight + 40,
      }}
    >
      <StatusBar hidden={true} />
      <View
        style={
          {
            // ne sert a rien
            // backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
            // marginTop: 0,
            // width: "95%",
            // textAlignVertical: "center",
            // alignSelf: "center",
            // borderColor: dayNightMode ? colors.bgFooterPlayer : colors.bgNight,
            // borderBottomWidth: 4,
            // borderRadius: 50,
            // backgroundColor: "red",
          }
        }
      >
        {state ? (
          <View style={styles.playlisVide}>
            <MainTitle
              text={"La liste d'écoute est vide 💨"}
              color="white"
              fontSize={20}
              textAlign="center"
            />
            <Text
              style={{
                fontSize: 15,
                marginLeft: 25,
                marginBottom: 15,
                marginRight: 25,
                color: "white",
                alignItems: "center",
                textAlign: "center",
                marginTop: 25,
              }}
            >
              Pour y ajouter des histoires, cliquez sur le + dans l'angle droit
              des illustrations de chaque épisode. Ou directement de la page des
              séries
            </Text>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              marginLeft: 15,
              marginBottom: 10,
              marginRight: 15,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                playMyList();
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  handleSelectEpisode();
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <MainTitle
                      text={"Ma liste d'écoute"}
                      color={"white"}
                      style={styles.modalText}
                      marginBottom={0}
                      fontSize={16}
                    />
                  </View>
                  <Image
                    style={{
                      width: 15,
                      height: 15,
                      resizeMode: "contain",
                      marginLeft: 5,
                      marginTop: 2,
                    }}
                    source={require("../assets/img/logo-icons/playAccent.png")}
                  />
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={data.myPlaylists}
          renderItem={({ item, index }) => {
            return (
              <View>
                {item.isTrash === false && (
                  <View
                    style={{
                      backgroundColor: dayNightMode
                        ? colors.overlayNight
                        : colors.overlayNight,
                      borderBottomColor: dayNightMode
                        ? colors.bgFooterPlayer
                        : colors.bgNight,
                      borderBottomWidth: 4,

                      flexDirection: "row",
                      flex: 1,
                      textAlignVertical: "center",
                      alignSelf: "center",
                      width: "95%",
                      borderTopRightRadius: index === 0 ? 20 : 0,
                      borderTopLeftRadius: index === 0 ? 20 : 0,
                      borderBottomRightRadius:
                        index == data.myPlaylists.length - 1 ? 20 : 0,
                      borderBottomLeftRadius:
                        index === data.myPlaylists.length - 1 ? 20 : 0,
                    }}
                  >
                    <Image
                      style={{
                        height: 100,
                        width: "35%",
                        resizeMode: "cover",

                        borderTopLeftRadius: index === 0 ? 20 : 0,
                        borderBottomLeftRadius:
                          index === data.myPlaylists.length - 1 ? 20 : 0,
                      }}
                      source={{ uri: item.image }}
                    />
                    <View style={styles.downloaded}>
                      <Text>{item.downloaded}</Text>
                      {item.downloaded ? (
                        <Entypo
                          name="check"
                          size={30}
                          color={colors.accentColor}
                        />
                      ) : (
                        <TouchableOpacity
                          onPress={async () => {
                            downloadEpisode(item._id);
                          }}
                        >
                          <Feather
                            name="download"
                            size={24}
                            color={colors.accentColor}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={styles.titleSeriesEpisodes}>
                      <Text
                        style={{
                          color: dayNightMode
                            ? colors.overlayDay
                            : colors.textDay,
                          fontWeight: "bold",
                          textAlignVertical: "center",
                          alignSelf: "center",
                          // bottom: 10,
                          fontSize: 13,
                          textAlign: "left",
                          paddingRight: 1,
                        }}
                      >
                        {item.title}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={async () => {
                          moveItem();
                        }}
                      >
                        <Image
                          style={[styles.iconleft, { marginBottom: 10 }]}
                          source={
                            dayNightMode
                              ? require("../assets/img/logo-icons/moveitem.png")
                              : require("../assets/img/logo-icons/moveItemight.png")
                          }
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={async () => {
                          trashEpisode(item._id);
                        }}
                      >
                        <Image
                          style={styles.iconleft}
                          source={
                            dayNightMode
                              ? require("../assets/img/logo-icons/trash.png")
                              : require("../assets/img/logo-icons/trashNight.png")
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          }}
          keyExtractor={(item) => item._id}
        />
      </View>
      <View>
        <View style={styles.errorContainer}>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  scrollView: {},
  errorContainer: { height: 20, width: "100%", marginVertical: 8 },
  error: {
    color: "red",
    textAlign: "center",
  },
  text: {
    color: "white",
  },
  title: {
    color: "white",
    fontWeight: "bold",
  },
  card: { backgroundColor: colors.overlayNight },
  iconleft: {
    //width: "30",
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  downloaded: {
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 5,
  },
  titleSeriesEpisodes: {
    margin: 10,
    textAlignVertical: "center",
    alignSelf: "center",
    width: "35%",
  },
});
