import React from "react";
import {
    ImageBackground,
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
export default function WindowOnly({ dayNightMode, userInfo, infos }) {
    const navigation = useNavigation();
    const route = useRoute();

    return (
        <View>
            <TouchableOpacity
                title="Go to Profile"
                onPress={() => {
                    if (route.name === "ChildrenProfiles") {
                        navigation.navigate("Home", {
                            screen: "Home",
                            params: {
                                screen: "Profile",
                                params: { userId: 123 },
                            },
                        });
                    } else {
                        // A dynamiser, click vers profil du user connecté
                        navigation.navigate("Profile", { userId: 123 });
                    }
                }}
            >
                <View style={styles.container}>
                    {/* Fenetre */}
                    {infos && (
                        <ImageBackground
                            style={styles.avatar}
                            source={{
                                uri: dayNightMode
                                    ? infos.avatar.daySelected
                                    : infos.avatar.nightSelected,
                            }}
                        >
                            {/* photo de l'avatar, avec en fond un bg en fonction du mode */}
                            <Image
                                source={require("../assets/img/profil/window-only.png")}
                                style={styles.window}
                            />
                        </ImageBackground>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // for delete ecart bottom of image window and avatar
        marginTop: 9,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    window: {
        width: 50,
        height: 50,
        alignItems: "center",
    },
    bgAvatar: {
        width: 50,
        height: 50,
    },
    avatar: {
        width: 50,
        height: 50,
    },
});
