import React, { useState, useEffect } from "react";
import IsLoading from "../components/isLoading";
import { useNavigation } from "@react-navigation/core";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; //requetes --> gére la navigation (données du tel)
import axios from "axios";
import colors from "../assets/colors";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
export default function SerieScreen({
  dayNightMode,
  setChildrenInfosStorage,
  route,
}) {
  const navigation = useNavigation();
  const { id } = route.params;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addPlaylist, setAddPlaylist] = useState(null);
  const [children, setChildren] = useState(null);
  const [idChildren, setIdChildren] = useState(null);
  const [isCharge, setIsCharge] = useState(false);
  const [tabComparaisonFavoris, setTabComparaisonFavoris] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const formData = new FormData();
      const childrenInfos = await AsyncStorage.getItem("childrenInfos");
      const children = JSON.parse(childrenInfos);
      formData.append("idChildren", children._id);
      // setChildren(JSON.parse(childrenStorage));
      try {
        const res = await axios.get(
          `https://lisnkids.herokuapp.com/api/episodes?id=${id}`,
          {
            headers: {
              Authorization: "Bearer LRCes!e2021vg",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const response = await axios.post(
          `https://lisnkids.herokuapp.com/api/infoChildren`,
          formData,
          {
            headers: {
              Authorization: "Bearer LRCes!e2021vg",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (res.data) {
          setIdChildren(response.data);
          // Comparer episodes avec plyalist
          let tab = [];
          let verif = false;
          for (let i = 0; i < res.data.episodes.length; i++) {
            verif = false;
            for (let y = 0; y < response.data.myPlaylists.length; y++) {
              if (
                response.data.myPlaylists[y].idEpisodes ===
                  res.data.episodes[i]._id &&
                response.data.myPlaylists[y].isTrash == false
              ) {
                verif = true;
              }
            }

            if (verif === true) {
              let newTab = { ...res.data.episodes[i] };
              newTab.fav = true;
              tab.push(newTab);
            }
            if (verif === false) {
              let newTab = { ...res.data.episodes[i] };
              newTab.fav = false;
              tab.push(newTab);
            }
          }
          setTabComparaisonFavoris(tab);
          setData(res.data);
          setIsLoading(false);
        } else {
          setError("Une erreur s'est produite. Veuillez réessayer");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [isCharge]);
  // ---------- HANDLE CLICK
  const handleAddPlaylistEpisode = async (idEpisode) => {
    try {
      const formData = new FormData();
      const childrenInfos = await AsyncStorage.getItem("childrenInfos");
      const children = JSON.parse(childrenInfos);
      formData.append("idChildren", children._id);
      formData.append("idEpisode", idEpisode);
      const res = await axios.post(
        `https://lisnkids.herokuapp.com/api/addEpisodeMyplaylists`,
        formData,
        {
          headers: {
            Authorization: "Bearer LRCes!e2021vg",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data) {
        setChildrenInfosStorage(res.data);
        setIdChildren(res.data);
        setAddPlaylist(res.data);
        setIsCharge(!isCharge);
      } else {
        setError("Une erreur s'est produite. Veuillez réessayer");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSelectEpisode = (item) => {
    try {
      navigation.navigate("Episode", {
        item: item, // épisode choisi
        data: data.episodes, // tout les épisodes
      });
    } catch (error) {
      alert(error.response.data.error);
    }
  };
  return isLoading ? (
    <IsLoading dayNightMode={dayNightMode} />
  ) : (
    <View
      style={
        (styles.container,
        {
          backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
          flex: 1,
        })
      }
    >
      <FlatList
        data={tabComparaisonFavoris}
        ListHeaderComponent={
          <>
            <StatusBar hidden={true} />
            <Image style={styles.hero} source={{ uri: data.image }} />
            <View style={styles.allEpisodes}>
              <Text
                style={{
                  color: dayNightMode ? colors.accentColor : "white",
                  backgroundColor: dayNightMode
                    ? colors.bgNight
                    : colors.overlayNight,
                  fontWeight: "bold",
                  paddingHorizontal: 10,
                  width: "95%",
                  height: 38,
                  textAlignVertical: "center",
                  alignSelf: "center",
                  bottom: 10,
                }}
              >
                {data.title}
              </Text>
              <Text
                style={
                  ({
                    color: dayNightMode
                      ? colors.overlayNight
                      : colors.overlayNight,
                  },
                  styles.resume)
                }
              >
                {data.description}
              </Text>
            </View>
          </>
        }
        renderItem={({ item, index }) => {
          return (
            <View style={styles.episode}>
              <View style={styles.cardEpisode}>
                <Image style={styles.imgEpisode} source={{ uri: item.image }} />
                {item.fav === false ? (
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      alignSelf: "flex-end",
                    }}
                  >
                    <AntDesign
                      name="plus"
                      size={40}
                      color="white"
                      style={{
                        color: colors.accentColor,
                        // backgroundColor: "rgba(100, 100, 100, 0.2)",
                        padding: 5,
                      }}
                      onPress={() => {
                        handleAddPlaylistEpisode(item._id);
                      }}
                    />
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      position: "absolute",
                      alignSelf: "flex-end",
                    }}
                  >
                    <AntDesign
                      name="checkcircle"
                      size={40}
                      color="white"
                      style={{
                        color: colors.accentColor,
                        // backgroundColor: "rgba(100, 100, 100, 0.5)",
                        padding: 5,
                      }}
                    />
                  </View>
                )}
                <TouchableOpacity
                  style={styles.row}
                  onPress={async () => {
                    handleSelectEpisode(item);
                  }}
                >
                  <FontAwesome
                    name="play"
                    size={38}
                    color={colors.accentColor}
                    style={{ marginRight: 10 }}
                  />
                  <View style={{ paddingRight: 15 }}>
                    <Text style={{ color: colors.overlayNight }}>
                      Épisode {index + 1}
                    </Text>
                    <Text
                      style={{
                        color: dayNightMode
                          ? colors.bgNight
                          : colors.overlayDay,
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
  },
  player: {
    height: 200,
    width: 250,
    borderColor: "black",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  containerPlay: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardEpisode: {
    width: "95%",
  },
  imgEpisode: {
    height: 200,
    width: "100%",
    resizeMode: "cover",
  },
  episode: {
    height: 270,
    width: "100%",
    marginTop: 15,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  hero: {
    width: "100%",
    height: 300,
  },
  allEpisodes: {
    justifyContent: "center",
    alignContent: "center",
  },
  resume: {
    color: colors.overlayNight,
    paddingHorizontal: 20,
    fontWeight: "bold",
    // marginBottom: 7,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
  },
});
