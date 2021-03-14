import React, { useState, useEffect } from "react";
import axios from "axios";
//component
import ModalInputParrentMode from "../components/ModalInputParrentMode";
import { useNavigation } from "@react-navigation/core";
import IsLoading from "../components/isLoading";
import { Entypo } from "@expo/vector-icons";

import {
  Text,
  View,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import colors from "../assets/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({
  dayNightMode,
  isEnabled,
  setIsEnabled,
  setParentMode,
  ParentMode,
}) {
  const navigation = useNavigation();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data2, setData2] = useState(null);
  const [childrenInfos, setChildrenInfos] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const stored = await AsyncStorage.getItem("childrenInfos");
        const infos = JSON.parse(stored);
        setChildrenInfos(infos);

        const res = await axios.get(
          "https://lisnkids.herokuapp.com/api/series",
          {
            headers: {
              Authorization: "Bearer LRCes!e2021vg",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const response = await axios.get(
          "https://lisnkids.herokuapp.com/api/seriesStarsAll",
          {
            headers: {
              Authorization: "Bearer LRCes!e2021vg",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setData2(response.data);
        setData(res.data);
        setIsLoading(false);
      } catch (error) {
        alert(error.response.data.error);
      }
    };
    fetchData();
  }, []);

  const handleSelectEpisode = (item, data, title) => {
    try {
      navigation.navigate("Episode", {
        item: item, // épisode choisi
        data: data, // tout les épisodes
        idSerie: title, // pour récupérer le titre de la série
      });
    } catch (error) {
      alert(error.response.data.error);
    }
  };
  return isLoading ? (
    <IsLoading dayNightMode={dayNightMode} />
  ) : (
    <View
      style={[
        styles.safeAreaView,
        {
          backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
          flex: 1,
        },
      ]}
    >
      {isEnabled && (
        <ModalInputParrentMode
          setIsEnabled={setIsEnabled}
          setParentMode={setParentMode}
        />
      )}
      <StatusBar hidden={true} />
      <ScrollView style={styles.scroll}>
        <View style={styles.title}>
          <Text
            style={styles.nameUser}
          >{`Bonjour ${childrenInfos.firstName},`}</Text>
          <Text
            style={[
              styles.welcome,
              {
                color: dayNightMode ? colors.textDay : colors.textNight,
              },
            ]}
          >
            qu'est ce qu'on écoute aujourd'hui ?
          </Text>
        </View>

        {/* HERO - SERIE STAR */}
        <View style={[styles.carousselHero]}>
          <FlatList
            data={data2}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => String(item._id)}
            renderItem={({ item, index }) => (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.push("Serie", {
                      id: item._id,
                    });
                  }}
                >
                  <View style={[styles.hero]}>
                    <View>
                      <Image
                        style={styles.imgHero}
                        source={{ uri: item.image }}
                      />
                      <View style={[styles.absolute]}>
                        <Text style={styles.textAbsolute}>
                          Nouveaux épisodes
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* NAME SERIE STAR */}
                  <View
                    style={{
                      alignItems: "flex-end",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text style={styles.titleStar}>{`${item.title}`}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        {/* OTHER SERIES */}
        <View style={[styles.otherSeries]}>
          <FlatList
            ListHeaderComponent={<></>}
            data={data}
            keyExtractor={(item) => String(item._id)}
            renderItem={({ item, index }) => (
              <View
                onPress={() => {
                  navigation.push("Serie", {
                    id: item._id,
                  });
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.push("Serie", {
                      id: item._id,
                    });
                  }}
                >
                  <Text
                    style={[
                      styles.titleSeries,
                      {
                        color: dayNightMode ? colors.textDay : colors.textNight,
                      },
                    ]}
                  >
                    {item.title}

                    <Entypo
                      name="eye"
                      size={15}
                      color={dayNightMode ? colors.textDay : colors.textNight}
                    />
                  </Text>
                </TouchableOpacity>
                <ScrollView
                  style={[styles.listEpisode]}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {item.episodes.map((elem, index) => {
                    return (
                      <View key={elem._id} style={[styles.listeEpisodeBlock]}>
                        <TouchableOpacity
                          onPress={async () => {
                            handleSelectEpisode(elem, item.episodes, item);
                          }}
                        >
                          <Image
                            source={{
                              uri: elem.image,
                            }}
                            style={[styles.listEpisodeImage]}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  scroll: {},

  // TOP
  title: {
    paddingHorizontal: 20,
  },
  welcome: { fontWeight: "bold", fontSize: 16 },
  nameUser: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  // HERO
  carousselHero: {
    width: "100%",
  },
  hero: {
    marginTop: 15,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  imgHero: {
    width: Dimensions.get("window").width,
    height: 300,
    resizeMode: "cover",
  },
  absolute: {
    position: "absolute",
    bottom: 5,
    right: 10,
  },
  titleStar: {
    width: "65%",
    paddingRight: 10,
    color: colors.accentColor,
    fontWeight: "bold",
    textAlign: "right",
    fontSize: 15,
  },
  textAbsolute: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgNight,
    color: colors.accentColor,
    paddingHorizontal: 3,
    paddingVertical: 2,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 13,
  },
  otherSeries: {
    marginTop: 20,
  },
  titleSeries: {
    fontSize: 15,
    fontWeight: "700",
    marginHorizontal: 10,
    marginBottom: 7,
    textAlign: "justify",
  },

  listEpisode: {
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
  },
  listeEpisodeBlock: { height: 160, width: 172, marginRight: 20 },
  listEpisodeImage: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    borderRadius: 2,
  },
});
