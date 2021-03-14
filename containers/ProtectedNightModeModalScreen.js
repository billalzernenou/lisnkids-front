import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRoute } from "@react-navigation/native";
import IsLoading from "../components/isLoading";
import { AntDesign } from "@expo/vector-icons";
import ModalInput from "../components/ModalVerifCodeCadenas";
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
    Pressable,
    ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import Constants from "expo-constants";
import colors from "../assets/colors";
import MainTitle from "../components/MainTitle";

export default function MyComponent({ dayNightMode, setSwitchProtected }) {
    const navigation = useNavigation();
    const route = useRoute();
    const [state, setState] = useState(null);
    const [error, setError] = useState(null);
    const [infosChildren, setChildrenInfos] = useState(null);
    const [data, setData] = useState(null);
    const [data1, setData1] = useState(null);
    const [data0, setData0] = useState(null);
    const [value, setValue] = useState(false);
    const [text, setText] = useState(
        "Voulez-vous passer en mode nocturne protégé ?"
    );
    const [text2, setText2] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingButton, setIsLoadingButton] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stored = await AsyncStorage.getItem("childrenInfos");
                const infos = JSON.parse(stored);
                // save episode for player audio
                const formData0 = new FormData();
                formData0.append("idChildren", infos._id);
                const response0 = await axios.post(
                    "https://lisnkids.herokuapp.com/api/listMyPlaylistEpisode",
                    formData0,
                    {
                        headers: {
                            Authorization: "Bearer LRCes!e2021vg",
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                setData0(response0.data);
                const formData = new FormData();

                formData.append("idChildren", infos._id);

                //  display PlayList
                const response = await axios.post(
                    "https://lisnkids.herokuapp.com/api/listMyPlaylist",
                    formData,
                    {
                        headers: {
                            Authorization: "Bearer LRCes!e2021vg",
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                setData(response.data);

                const formData3 = new FormData();
                const userId = await AsyncStorage.getItem("userId");
                formData3.append("_id", userId);
                const response1 = await axios.post(
                    "https://lisnkids.herokuapp.com/api/userCard",
                    formData3,
                    {
                        headers: {
                            Authorization: "Bearer LRCes!e2021vg",
                        },
                    }
                );
                setData1(response1.data.account.secretCode);
                setChildrenInfos(infos);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const refuse = () => {
        navigation.push("Home");
    };

    const valid = async () => {
        if (text === "Voulez-vous passer en mode nocturne protégé ?") {
            setText(
                "Pour Jouer la liste d'écoute en mode protégé, tous les episodes doivent être téléchargés pour être disponibles hors ligne."
            );
            setText2("Télécharger la liste d'écoute compléte ?");
        } else if (text2 === "Télécharger la liste d'écoute compléte ?") {
            try {
                setIsLoadingButton(true);
                const formData = new FormData();
                formData.append("idChildren", infosChildren._id);
                const response = await axios.post(
                    "https://lisnkids.herokuapp.com/api/downloadEpisodeAllChildren",
                    formData,
                    {
                        headers: {
                            Authorization: "Bearer LRCes!e2021vg",
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                setData(response.data);
                setIsLoadingButton(false);
                setValue(!value);
            } catch (error) {
                console.log(error);
            }
        }
    };

    return isLoading ? (
        <IsLoading dayNightMode={dayNightMode} />
    ) : (
        <ScrollView
            contentContainerStyle={styles.scrollView}
            style={{
                backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
                flex: 1,
                paddingTop: Constants.statusBarHeight + 40,
            }}
        >
            <View
                style={{
                    flex: 1,
                    width: "100%",

                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                }}
            >
                <Text style={[styles.textAsk]}>{`${text}`}</Text>
                <View
                    style={{
                        height: 50,
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        alignSelf: "center",
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontSize: 20,
                            fontWeight: "bold",
                        }}
                    >{`${text2}`}</Text>
                </View>

                <View>
                    {isLoadingButton ? (
                        <ActivityIndicator size="large" color="white" />
                    ) : (
                        <View style={{ flexDirection: "row", marginTop: 40 }}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => refuse()}
                            >
                                <AntDesign
                                    name="close"
                                    size={24}
                                    color="white"
                                    style={{ alignSelf: "center" }}
                                />
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonCheck]}
                                onPress={() => valid()}
                            >
                                <AntDesign
                                    name="check"
                                    size={32}
                                    color="white"
                                    //   onPress={
                                    //     () => setValid(true)
                                    //     // puis rentrer les valeurs dans le back
                                    //   }
                                    style={{ alignSelf: "center" }}
                                />
                            </Pressable>
                        </View>
                    )}
                </View>
                <ModalInput
                    placeHolder={"Votre code secret"}
                    text={"Veuilez entrer votre code secret"}
                    dayNightMode={dayNightMode}
                    value={value}
                    setValue={setValue}
                    setSwitchProtected={setSwitchProtected}
                    data0={data0}
                    data1={data1}
                />
            </View>
            <StatusBar hidden={true} />
        </ScrollView>
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
    button: {
        padding: 40,
    },
    textAsk: {
        color: "white",
        fontSize: 20,
        marginTop: 40,
        textAlign: "center",
        marginHorizontal: 30,
    },
    buttonClose: {
        width: 40,
        height: 40,
    },
    buttonCheck: {
        width: 60,
        height: 60,

        marginLeft: 20,
    },
    button: {
        backgroundColor: colors.overlayDay,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
    },
});
