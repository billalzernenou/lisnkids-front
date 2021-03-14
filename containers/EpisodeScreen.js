import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import colors from "../assets/colors";
import Constants from "expo-constants";

export default function EpisodeScreen({ dayNightMode }) {
  const route = useRoute();
  const { item, data } = route.params;
  const [sound, setSound] = useState(null);
  const [playingStatus, setPlayingStatus] = useState("nosound");
  const [paused, setPaused] = useState(false);
  const [currentSoundData, setCurrentSoundData] = useState(item);
  const [rankSong, setRankSong] = useState(item.rank);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    try {
      sound && playAndPause();
      return sound
        ? () => {
            // console.log("Unloading Sound");
            sound.unloadAsync();
          }
        : undefined;
    } catch (error) {
      alert(error.message);
    }
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
      // setIsLoading(false);
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
      // console.log("nosound");
      playRecording();
    }
    if (playingStatus === "donepause" || playingStatus === "finished") {
      // console.log("donepause || finished");
      pauseAndPlayRecording();
    }
    if (playingStatus === "playing") {
      // console.log("playing");
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
    // console.log(status);
    if (status.isPlaying && playingStatus !== "playing") {
      setPlayingStatus("playing");
    } else if (!status.isPlaying && playingStatus === "playing") {
      setPlayingStatus("donepause");
    }
    if (status.didJustFinish) {
      setPlayingStatus("finished");
    }
  };
  // ----------------- ROTATE DISC :
  const rotateValueHolder = new Animated.Value(0);
  const rotateData = rotateValueHolder.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const discRotate = () => {
    rotateValueHolder.setValue(0);
    Animated.timing(rotateValueHolder, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => discRotate());
  };
  const stopImageRotate = () => {
    Animated.timing(rotateValueHolder).stop();
  };
  const RotateData = rotateValueHolder.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  return !isLoading ? (
    <ScrollView
      style={{
        backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
        flex: 1,
      }}
    >
      <View style={{ alignItems: "center" }}>
        {/*----------------- ILLUSTRATION & TITLE --------------- */}
        <View style={styles.illustration}>
          <Image
            style={{
              // position: "relative",
              // marginTop: 150,
              width: "100%",
              height: 300,
              // top: 0,
              resizeMode: "contain",
              // transform: [{ rotate: RotateData }],
            }}
            source={require("../assets/img/player/disc.png")}
          />
          <Image
            style={
              (styles.image,
              {
                position: "absolute",
                width: "90%",
                height: 230,
              })
            }
            source={{ uri: currentSoundData.image }}
          />
          <View style={styles.icons}>
            {/* <AntDesign
              name="plus"
              size={24}
              color="white"
              style={({ position: "fixed" }, styles.icon)}
            /> */}
          </View>
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
            }}
          >
            {item.libInfos}
          </Text>
        </View>

        {/* --------------PLAYER---------------- */}
        <View style={styles.player}>
          <Text
            style={
              (styles.title,
              {
                color: dayNightMode ? colors.bgNight : colors.overlayDay,
                fontSize: 16,
                fontWeight: "bold",
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
                <AntDesign
                  name="stepbackward"
                  size={35}
                  color={dayNightMode ? colors.overlayDay : colors.overlayNight}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.button}>
                <AntDesign
                  name="verticleright"
                  size={35}
                  color={dayNightMode ? colors.overlayDay : colors.overlayNight}
                />
              </View>
            )}
            {/* --- PLAY --- */}
            <TouchableOpacity onPress={togglePlay}>
              {playingStatus === "donepause" ||
              playingStatus === "finished" ||
              playingStatus === "nosound" ? (
                <FontAwesome name="play" size={70} color={colors.accentColor} />
              ) : (
                <FontAwesome
                  name="pause"
                  size={70}
                  color={colors.accentColor}
                />
              )}
            </TouchableOpacity>
            {/* --- NEXT --- */}
            {rankSong <= data.length - 1 ? (
              <TouchableOpacity style={styles.button} onPress={toggleNext}>
                <AntDesign
                  name="stepforward"
                  size={35}
                  color={dayNightMode ? colors.overlayDay : colors.overlayNight}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.button}>
                <AntDesign
                  name="verticleleft"
                  size={35}
                  color={dayNightMode ? colors.overlayDay : colors.overlayNight}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  ) : (
    <IsLoading dayNightMode={dayNightMode} />
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDay,
  },
  illustration: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    height: 360,
  },
  image: {
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignContent: "center",
    // shadowColor: "#000", // doesnt work
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowOpacity: 0.36,
    // shadowRadius: 6.68,
    // elevation: 11,
  },
  player: {
    height: 200,
    width: 250,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  containerPlay: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    padding: 20,
  },
  icons: {
    flexDirection: "row",
    width: "87%",
    justifyContent: "flex-end",
    bottom: 145,
  },
  icon: {
    backgroundColor: colors.bgNight,
    padding: 7,
    borderRadius: 50,
  },
  serieTitle: {
    fontWeight: "bold",
    paddingHorizontal: 5,
    top: 5,
    alignSelf: "flex-end",
    marginRight: 30,
    maxWidth: 170,
    textAlign: "right",
  },
});
