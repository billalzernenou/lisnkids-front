import React, { useState, useEffect } from "react";
import IsLoadingProtected from "../components/isLoadingProtected";
import { useRoute } from "@react-navigation/native";
import { Text, View, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import ModalInput from "../components/ModalVerifCodeCadenasProtected";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// *** JE T'AI MIS PAR DEFAUT DES SONS DANS SOUNDLIST - SUPPRIME CET IMPORT :
import soundList from "../assets/data.json";
export default function ProtectedNightModeScreen({
  setSwitchProtected,
  switchProtected,
}) {
  const toggleSwitch = () => {
    setValue(true);
    if (value1) {
      setSwitchProtected((previousState) => !previousState);
    }
  };

  const route = useRoute();
  const { item, data } = route.params;
  // *** SUPPRIME LES DEUX LIGNES EN DESSOUS ET DECOMMENTE LA LIGNE DU DESSUS QUAND TU RECUPERERAS TES DONNEES :

  // *** TU N'AS RIEN A MODIFIER APRES CE COMMENTAIRE !!
  const [sound, setSound] = useState(null);
  const [playingStatus, setPlayingStatus] = useState("nosound");
  const [paused, setPaused] = useState(false);
  const [currentSoundData, setCurrentSoundData] = useState(item);
  const [rankSong, setRankSong] = useState(item.rank);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(false);
  const [value1, setValue1] = useState(false);
  const [data1, setData1] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = new FormData();
        const userId = await AsyncStorage.getItem("userId");
        formData.append("_id", userId);
        const response = await axios.post(
          "https://lisnkids-api.herokuapp.com/api/userCard",
          formData,
          {
            headers: {
              Authorization: "Bearer LRCes!e2021vg",
            },
          }
        );
        setData1(response.data.account.secretCode);
        setIsLoading(true);
      } catch (error) {
        console.Log(error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        sound && playAndPause();
        return sound
          ? () => {
              console.log("Unloading Sound");
              sound.unloadAsync();
              setIsLoading(true);
            }
          : undefined;
      } catch (error) {
        alert(error.message);
      }
    };
    fetchData();
  }, [sound]);
  // -------------  PLAYER MUSIC :
  const togglePlay = async () => {
    setPaused(!paused);
    if (playingStatus === "nosound") {
      const { sound } = await Audio.Sound.createAsync(
        {
          uri: currentSoundData.audio,
        },
        {
          isLooping: false,
        },
        updateScreenForSoundStatus // fonction appelé toute les 500 millis secondes
      );
      setSound(sound);
    } else {
      playAndPause();
    }
  };
  const togglePrevious = () => {
    if (sound) {
      sound.unloadAsync();
      setPlayingStatus("nosound");
    }
    const newRank = rankSong - 1;
    setRankSong(newRank);
    setCurrentSoundData(data[newRank - 1]);
  };
  const toggleNext = () => {
    if (sound) {
      sound.unloadAsync();
      setPlayingStatus("nosound");
    }
    const newRank = rankSong + 1;
    setRankSong(newRank);
    setCurrentSoundData(data[newRank - 1]);
  };
  const playAndPause = () => {
    if (playingStatus === "nosound") {
      console.log("nosound");
      playRecording();
    }
    if (playingStatus === "donepause" || playingStatus === "finished") {
      console.log("donepause || finished");
      pauseAndPlayRecording();
    }
    if (playingStatus === "playing") {
      console.log("playing");
      pauseAndPlayRecording();
    }
  };
  const playRecording = async () => {
    await sound.playAsync();
    setPlayingStatus("playing");
  };
  const pauseAndPlayRecording = async () => {
    if (sound) {
      if (playingStatus === "playing") {
        await sound.pauseAsync();
        setPlayingStatus("donepause");
      } else if (playingStatus === "finished") {
        await sound.replayAsync();
        setPlayingStatus("playing");
      } else {
        await sound.playAsync();
        setPlayingStatus("playing");
      }
    }
  };
  const updateScreenForSoundStatus = (status) => {
    if (status.isPlaying && playingStatus !== "playing") {
      setPlayingStatus("playing");
    } else if (!status.isPlaying && playingStatus === "playing") {
      setPlayingStatus("donepause");
    }
    if (status.didJustFinish) {
      setPlayingStatus("finished");
    }
  };
  return isLoading ? (
    <View
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        // position: "absolute",
      }}
    >
      <Switch
        styles={[styles.switch]}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={switchProtected ? "#f5dd4b" : "#f4f3f4"}
        onValueChange={toggleSwitch}
        value={switchProtected}
      />
      {/* --------------PLAYER---------------- */}
      <View style={styles.player}>
        <Text
          style={
            (styles.title,
            {
              color: "#2C2C2C",
              fontSize: 14,
              marginBottom: 12,
              textAlign: "center",
            })
          }
        >
          {currentSoundData.rank + ". " + currentSoundData.title}
        </Text>
        {/* --- PREVIOUS --- */}
        <View style={styles.containerPlay}>
          {rankSong !== 1 ? (
            <TouchableOpacity style={styles.button} onPress={togglePrevious}>
              <AntDesign name="stepbackward" size={50} color="#2C2C2C" />
            </TouchableOpacity>
          ) : (
            <View style={styles.button}>
              <AntDesign name="verticleright" size={50} color="#2C2C2C" />
            </View>
          )}
          {/* --- PLAY --- */}
          <TouchableOpacity onPress={togglePlay}>
            {playingStatus === "donepause" ||
            playingStatus === "finished" ||
            playingStatus === "nosound" ? (
              <FontAwesome name="play" size={100} color="#2C2C2C" />
            ) : (
              <FontAwesome name="pause" size={100} color="#2C2C2C" />
            )}
          </TouchableOpacity>
          {/* --- NEXT --- */}
          {rankSong <= data.length - 1 ? (
            <TouchableOpacity style={styles.button} onPress={toggleNext}>
              <AntDesign name="stepforward" size={50} color="#2C2C2C" />
            </TouchableOpacity>
          ) : (
            <View style={styles.button}>
              <AntDesign name="verticleleft" size={50} color="#2C2C2C" />
            </View>
          )}
        </View>
      </View>
      <ModalInput
        placeHolder={"Votre code secret"}
        text={"Veuilez entrer votre code secret"}
        value={value}
        setValue={setValue}
        setSwitchProtected={setSwitchProtected}
        setValue1={setValue1}
        data1={data1}
      />
    </View>
  ) : (
    <IsLoadingProtected />
  );
}
const styles = StyleSheet.create({
  containerPlay: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    padding: 40,
  },
  switch: {
    position: "relative",
    top: 20,
    right: 20,
  },
});
