import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import HomeScreen from "./containers/HomeScreen";
import ProfileScreen from "./containers/ProfileScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import SettingsScreen from "./containers/SettingsScreen";
import ChoiceLangScreen from "./containers/ChoiceLangScreen";
import GuidanceScreen1 from "./containers/GuidanceScreen1";
import GuidanceScreen2 from "./containers/GuidanceScreen2";
import SettingParentScreen from "./containers/SettingParentScreen";
import ParentSecretCodeScreen from "./containers/ParentSecretCodeScreen";
import AddFirstChildren from "./containers/AddFirstChildren";
import PlayStoryScreen from "./containers/PlayStoryScreen";
import SerieScreen from "./containers/SerieScreen";
import EpisodeScreen from "./containers/EpisodeScreen";
import PlayListScreen from "./containers/PlayListScreen";
import AddOtherChildren from "./containers/AddOtherChildren";
import ChoiceEditChildrenScreen from "./containers/ChoiceEditChildrenScreen";
import EditChildrenScreen from "./containers/EditChildrenScreen";
import HeaderOnlyModeNight from "./components/HeaderOnlyModeNight";
import ProtectedNightModeModalScreen from "./containers/ProtectedNightModeModalScreen";
import ProtectedNightModeScreen from "./containers/ProtectedNightModeScreen";
import HeaderModeParentOnly from "./components/HeaderModeParentOnly";
import colors from "./assets/colors";
import Header from "./components/Header";
import Logo from "./components/Logo";
import BackButton from "./components/BackButton";
import SwitchMode from "./components/SwitchMode";
import IsLoading from "./components/isLoading";
import GuidanceSuggestionScreen from "./containers/GuidanceSuggestionScreen";
import { Settings } from "react-native";
import DeleteProfilChildren from "./containers/DeleteProfilChildren";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  ScrollView,
  Button,
} from "react-native";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [idChildrenSelecterForEdit, setIdChildrenSelecterForEdit] = useState(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userLang, setUserLang] = useState(null);
  // suggest to user to read the guidances the first time post inscription
  const [userGuidanceSuggestion, setUserGuidanceSuggestion] = useState(false);

  // guidance screens
  const [userGuidance, setUserGuidance] = useState({
    guidance1: false,
    guidance2: false,
  });

  // day and night mode : true goes for day Mode & false for Night Mode
  const [dayNightMode, setDayNightMode] = useState(false);
  // parent secret code state
  const [parentSecretCode, setParentSecretCode] = useState(null);
  // true ? parent access mode : child access mode
  const [parentMode, setParentMode] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [parentAccess, setParentAccess] = useState(true); // parent set secret code first time
  // Children profiles
  const [childrenProfiles, setChildrenProfiles] = useState(false);
  const [childrenExist, setChildrenExist] = useState(false);
  const [displayedScreen, setDisplayedScreen] = useState("Home");

  const [childrenInfos, setChildrenInfos] = useState(null);
  //control navigation parent mode
  const [settingScreen, setSettingScreen] = useState(null);
  // console.log(childrenInfos);
  // AsyncStorage.clear();
  const [switchProtected, setSwitchProtected] = useState(false);

  const setToken = async (token) => {
    if (token) {
      AsyncStorage.setItem("userToken", token);
    } else {
      AsyncStorage.removeItem("userToken");
    }

    setUserToken(token);
  };
  const setId = async (id) => {
    if (id) {
      AsyncStorage.setItem("userId", id);
    } else {
      AsyncStorage.removeItem("userId");
    }
    setUserId(id);
  };
  const setChildrenInfosStorage = async (infoChildren) => {
    if (infoChildren) {
      AsyncStorage.setItem("childrenInfos", JSON.stringify(infoChildren));
    } else {
      AsyncStorage.removeItem("childrenInfos");
    }
    setChildrenInfos(infoChildren);
  };
  const setLang = async (lang) => {
    if (lang) {
      AsyncStorage.setItem("userLang", lang);
    } else {
      AsyncStorage.removeItem("userLang");
    }

    setUserLang(lang);
  };
  const setParentSecret = async (code) => {
    if (code) {
      AsyncStorage.setItem(
        "parentSecretCode",
        JSON.stringify(parentSecretCode)
      );
      setParentSecretCode(true);
    } else {
      AsyncStorage.removeItem("parentSecretCode");
      setParentSecretCode(false);
    }
  };
  // user guidance : confirm have read guidance
  const setGuidance = async (userGuidance) => {
    if (userGuidance) {
      AsyncStorage.setItem("userGuidance", JSON.stringify(userGuidance));
      setUserGuidance(userGuidance);
    } else {
      AsyncStorage.removeItem("userGuidance");
      setUserGuidance({
        guidance1: false,
        guidance2: false,
      });
    }
  };
  // user guidance suggestop, : confirm have read guidance
  const setGuidanceSuggestionStorage = async (userGuidanceSuggestion) => {
    if (userGuidanceSuggestion) {
      AsyncStorage.setItem(
        "userGuidanceSuggestion",
        JSON.stringify(userGuidanceSuggestion)
      );
      setUserGuidanceSuggestion(userGuidanceSuggestion);
    } else {
      AsyncStorage.removeItem("userGuidanceSuggestion");
      setUserGuidanceSuggestion(false);
    }
  };
  // user guidance : confirm have read guidance
  const setChildrenExistAsync = async (childrenExist) => {
    if (childrenExist) {
      AsyncStorage.setItem("childrenExist", JSON.stringify(childrenExist));
      setChildrenExist(true);
    } else {
      AsyncStorage.removeItem("childrenExist");
      setChildrenExist(false);
    }
  };

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      // We should also handle error for production apps
      const userTokenLocal = await AsyncStorage.getItem("userToken");
      const userLangLocal = await AsyncStorage.getItem("userLang");
      const childrenInfoLocal = await AsyncStorage.getItem("childrenInfos");
      const userGuidanceLocal = await AsyncStorage.getItem("userGuidance");
      const guidanceSuggestionLocal = await AsyncStorage.getItem(
        "userGuidanceSuggestion"
      );
      const ChildrenExistLocal = await AsyncStorage.getItem("childrenExist");
      const ParentSecretLocal = await AsyncStorage.getItem("parentSecretCode");

      if (childrenInfoLocal) {
        setChildrenInfos(childrenInfoLocal);
      }
      setUserToken(userTokenLocal);
      setUserLang(userLangLocal);
      if (ParentSecretLocal) {
        setParentSecretCode(true);
      } else {
        setParentSecretCode(false);
      }
      if (userGuidanceLocal) {
        setUserGuidance(JSON.parse(userGuidanceLocal));
      }
      if (guidanceSuggestionLocal) {
        setUserGuidanceSuggestion(JSON.parse(guidanceSuggestionLocal));
      } else {
        setUserGuidanceSuggestion(false);
      }
      if (ChildrenExistLocal) {
        setChildrenExist(true);
      } else {
        setChildrenExist(false);
      }
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  return (
    <NavigationContainer>
      {isLoading && <IsLoading dayNightMode={dayNightMode} />}
      {isLoading ? null : userToken === null ? ( // We haven't finished checking for the token yet
        // No token found, user isn't signed in
        <Stack.Navigator
          // permet de rendre transparent le fond du header (pour supprimer la borderBottom)
          screenOptions={{
            headerShown: true,
            headerTransparent: true,
            headerTintColor: dayNightMode ? colors.bgNight : colors.bgDay,
          }}
        >
          <Stack.Screen
            name="SignIn"
            options={{
              // Ajout du header
              animationEnabled: false,
              title: "SignIn",
              tabBarLabel: "Settings",
              headerTitle: (props) => (
                <Header
                  {...props}
                  dayNightMode={dayNightMode}
                  setDayNightMode={setDayNightMode}
                />
              ),
              headerStyle: {
                backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
              },
            }}
          >
            {() => (
              <SignInScreen
                setToken={setToken}
                setId={setId}
                setLang={setLang}
                setParentSecret={setParentSecret}
                dayNightMode={dayNightMode}
                setDayNightMode={setDayNightMode}
                setGuidance={setGuidance}
                setGuidanceSuggestionStorage={setGuidanceSuggestionStorage}
                setParentAccess={setParentAccess}
                setChildrenExistAsync={setChildrenExistAsync}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="SignUp"
            options={{
              // Ajout du header
              animationEnabled: false,
              title: "Settings",
              tabBarLabel: "Settings",
              headerTitle: (props) => (
                <Header
                  {...props}
                  dayNightMode={dayNightMode}
                  setDayNightMode={setDayNightMode}
                  isEnabled={isEnabled}
                  setIsEnabled={setIsEnabled}
                />
              ),
              headerStyle: {
                backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
              },
            }}
          >
            {(props) => (
              <SignUpScreen
                {...props}
                setToken={setToken}
                setId={setId}
                dayNightMode={dayNightMode}
                setDayNightMode={setDayNightMode}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        // User is signed in
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
            headerTransparent: true,
            headerTintColor: dayNightMode ? colors.bgNight : colors.bgDay,
          }}
        >
          {/* user language not already chosen */}
          {!userLang && (
            <Stack.Screen
              name="choiceLang"
              options={{
                // Ajout du header
                animationEnabled: false,
                title: "Settings",
                tabBarLabel: "Settings",
                headerTitle: (props) => (
                  <Header
                    {...props}
                    dayNightMode={dayNightMode}
                    setDayNightMode={setDayNightMode}
                    isEnabled={isEnabled}
                    setIsEnabled={setIsEnabled}
                  />
                ),
                headerStyle: {
                  backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
                },
              }}
            >
              {() => (
                <ChoiceLangScreen
                  userId={userId}
                  setLang={setLang}
                  dayNightMode={dayNightMode}
                  setDayNightMode={setDayNightMode}
                />
              )}
            </Stack.Screen>
          )}
          {/* parent secret code */}
          {!parentSecretCode && (
            <Stack.Screen
              name="parentSecretCode"
              options={{
                // Ajout du header
                animationEnabled: false,
                title: "parentSecreCode",
                tabBarLabel: "Settings",
                headerTitle: (props) => (
                  <Header
                    {...props}
                    dayNightMode={dayNightMode}
                    setDayNightMode={setDayNightMode}
                    isEnabled={isEnabled}
                    setIsEnabled={setIsEnabled}
                  />
                ),
                headerStyle: {
                  backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
                },
              }}
            >
              {() => (
                <ParentSecretCodeScreen
                  parentSecretCode={parentSecretCode}
                  setParentSecret={setParentSecret}
                  dayNightMode={dayNightMode}
                  setDayNightMode={setDayNightMode}
                />
              )}
            </Stack.Screen>
          )}
          {/* guidance suggestion */}
          {!userGuidanceSuggestion && (
            <Stack.Screen
              name="guidanceSuggestion"
              options={{
                // Ajout du header
                animationEnabled: false,
                title: "guidanceSuggestion",
                tabBarLabel: "Settings",
                headerTitle: (props) => (
                  <Header
                    {...props}
                    dayNightMode={dayNightMode}
                    setDayNightMode={setDayNightMode}
                    isEnabled={isEnabled}
                    setIsEnabled={setIsEnabled}
                  />
                ),
                headerStyle: {
                  backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
                },
              }}
            >
              {() => (
                <GuidanceSuggestionScreen
                  setGuidanceSuggestionStorage={setGuidanceSuggestionStorage}
                  userGuidance={userGuidance}
                  setGuidance={setGuidance}
                  dayNightMode={dayNightMode}
                  setDayNightMode={setDayNightMode}
                />
              )}
            </Stack.Screen>
          )}
          {/* guidance 1 & guidance 2  */}
          {!userGuidance.guidance1 && userGuidanceSuggestion && (
            <Stack.Screen
              name="guidance1"
              options={{
                // Ajout du header
                animationEnabled: false,
                title: "Settings",
                tabBarLabel: "Settings",
                headerTitle: (props) => (
                  <Header
                    {...props}
                    dayNightMode={dayNightMode}
                    setDayNightMode={setDayNightMode}
                    isEnabled={isEnabled}
                    setIsEnabled={setIsEnabled}
                  />
                ),
                headerStyle: {
                  backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
                },
              }}
            >
              {() => (
                <GuidanceScreen1
                  userGuidance={userGuidance}
                  setGuidance={setGuidance}
                  dayNightMode={dayNightMode}
                  setDayNightMode={setDayNightMode}
                />
              )}
            </Stack.Screen>
          )}
          {/* user language not already chosen  */}
          {!userGuidance.guidance2 && userGuidanceSuggestion && (
            <Stack.Screen
              name="guidance2"
              options={{
                // Ajout du header
                animationEnabled: false,
                title: "Settings",
                tabBarLabel: "Settings",
                headerTitle: (props) => (
                  <Header
                    {...props}
                    dayNightMode={dayNightMode}
                    setDayNightMode={setDayNightMode}
                    isEnabled={isEnabled}
                    setIsEnabled={setIsEnabled}
                  />
                ),
                headerStyle: {
                  backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
                },
              }}
            >
              {() => (
                <GuidanceScreen2
                  userGuidance={userGuidance}
                  setGuidance={setGuidance}
                  dayNightMode={dayNightMode}
                  setDayNightMode={setDayNightMode}
                />
              )}
            </Stack.Screen>
          )}
          {parentMode &&
            (!settingScreen ? (
              <Stack.Screen
                name="SettingParentScreen"
                options={{
                  // Ajout du header
                  title: "Settings",
                  tabBarLabel: "Settings",
                  headerTitle: (props) => (
                    <HeaderModeParentOnly
                      {...props}
                      dayNightMode={dayNightMode}
                      setDayNightMode={setDayNightMode}
                      isEnabled={isEnabled}
                      setIsEnabled={setIsEnabled}
                      parentMode={parentMode}
                      setParentMode={setParentMode}
                      setSettingScreen={setSettingScreen}
                    />
                  ),
                  headerStyle: {
                    backgroundColor: dayNightMode
                      ? colors.bgDay
                      : colors.bgNight,
                  },
                }}
              >
                {() => (
                  <SettingParentScreen
                    setToken={setToken}
                    setLang={setLang}
                    setGuidance={setGuidance}
                    setUserGuidance={setUserGuidance}
                    setGuidanceSuggestionStorage={setGuidanceSuggestionStorage}
                    setParentAccess={setParentAccess}
                    setChildrenProfiles={setChildrenProfiles}
                    dayNightMode={dayNightMode}
                    setDayNightMode={setDayNightMode}
                    setParentSecret={setParentSecret}
                    setIsEnabled2={setIsEnabled}
                    isEnabled={isEnabled}
                    setParentMode={setParentMode}
                    setChildrenInfosStorage={setChildrenInfosStorage}
                    setParentMode={setParentMode}
                    setChildrenExistAsync={setChildrenExistAsync}
                    setSettingScreen={setSettingScreen}
                  />
                )}
              </Stack.Screen>
            ) : settingScreen === "ChoiceEditChildren" ? (
              <Stack.Screen
                name="ChoiceEditChildren"
                options={{
                  // Ajout du header
                  title: "ChoiceEditChildren",
                  tabBarLabel: "ChoiceEditChildren",
                  headerTitle: (props) => (
                    <HeaderModeParentOnly
                      {...props}
                      dayNightMode={dayNightMode}
                      setDayNightMode={setDayNightMode}
                      isEnabled={isEnabled}
                      setIsEnabled={setIsEnabled}
                      parentMode={parentMode}
                      setParentMode={setParentMode}
                      setSettingScreen={setSettingScreen}
                    />
                  ),
                  headerStyle: {
                    backgroundColor: dayNightMode
                      ? colors.bgDay
                      : colors.bgNight,
                  },
                }}
              >
                {() => (
                  <ChoiceEditChildrenScreen
                    idChildrenSelecterForEdit={idChildrenSelecterForEdit}
                    setIdChildrenSelecterForEdit={setIdChildrenSelecterForEdit}
                    setToken={setToken}
                    setParentSecret={setParentSecret}
                    setIsEnabled={setIsEnabled}
                    isEnabled={isEnabled}
                    setParentMode={setParentMode}
                    setChildrenInfosStorage={setChildrenInfosStorage}
                    setParentMode={setParentMode}
                    setSettingScreen={setSettingScreen}
                    dayNightMode={dayNightMode}
                  />
                )}
              </Stack.Screen>
            ) : settingScreen === "EditChildren" ? (
              <Stack.Screen
                name="EditChildren"
                options={{
                  // Ajout du header
                  title: "EditChildren",
                  tabBarLabel: "EditChildren",
                  headerTitle: (props) => (
                    <HeaderModeParentOnly
                      {...props}
                      dayNightMode={dayNightMode}
                      setDayNightMode={setDayNightMode}
                      isEnabled={isEnabled}
                      setIsEnabled={setIsEnabled}
                      parentMode={parentMode}
                      setParentMode={setParentMode}
                      setSettingScreen={setSettingScreen}
                    />
                  ),
                  headerStyle: {
                    backgroundColor: dayNightMode
                      ? colors.bgDay
                      : colors.bgNight,
                  },
                }}
              >
                {(props) => (
                  <EditChildrenScreen
                    {...props}
                    dayNightMode={dayNightMode}
                    setToken={setToken}
                    parentMode={setParentMode}
                    setParentMode={setParentMode}
                    setSettingScreen={setSettingScreen}
                    idChildrenSelecterForEdit={idChildrenSelecterForEdit}
                    setIdChildrenSelecterForEdit={setIdChildrenSelecterForEdit}
                    isEnabled={isEnabled}
                    setIsEnabled={setIsEnabled}
                  />
                )}
              </Stack.Screen>
            ) : // Ajout de la page pour supprimer enfant -------
            settingScreen === "DeleteProfilChildren" ? (
              <Stack.Screen
                name="DeleteProfilChildren"
                options={{
                  // Ajout du header
                  title: "DeleteProfilChildren",
                  tabBarLabel: "DeleteProfilChildren",
                  headerTitle: (props) => (
                    <HeaderModeParentOnly
                      {...props}
                      dayNightMode={dayNightMode}
                      setDayNightMode={setDayNightMode}
                      isEnabled={isEnabled}
                      setIsEnabled={setIsEnabled}
                      parentMode={parentMode}
                      setParentMode={setParentMode}
                      setSettingScreen={setSettingScreen}
                    />
                  ),
                  headerStyle: {
                    backgroundColor: dayNightMode
                      ? colors.bgDay
                      : colors.bgNight,
                  },
                }}
              >
                {(props) => (
                  <DeleteProfilChildren
                    {...props}
                    dayNightMode={dayNightMode}
                    setToken={setToken}
                    parentMode={setParentMode}
                    setParentMode={setParentMode}
                    setSettingScreen={setSettingScreen}
                    idChildrenSelecterForEdit={idChildrenSelecterForEdit}
                    setIdChildrenSelecterForEdit={setIdChildrenSelecterForEdit}
                    isEnabled={isEnabled}
                    setIsEnabled={setIsEnabled}
                  />
                )}
              </Stack.Screen>
            ) : (
              // Ajout de la page pour supprimer enfant -------
              settingScreen === "AddOtherChildren" && (
                <Stack.Screen
                  name="AddOtherChildren"
                  options={{
                    // Ajout du header
                    title: "Settings",
                    tabBarLabel: "Settings",
                    headerTitle: (props) => (
                      <HeaderModeParentOnly
                        {...props}
                        dayNightMode={dayNightMode}
                        setDayNightMode={setDayNightMode}
                        isEnabled={isEnabled}
                        setIsEnabled={setIsEnabled}
                        parentMode={parentMode}
                        setParentMode={setParentMode}
                        setSettingScreen={setSettingScreen}
                      />
                    ),
                    headerStyle: {
                      backgroundColor: dayNightMode
                        ? colors.bgDay
                        : colors.bgNight,
                    },
                  }}
                >
                  {(props) => (
                    <AddOtherChildren
                      {...props}
                      dayNightMode={dayNightMode}
                      setParentMode={setParentMode}
                      setIsEnabled={setIsEnabled}
                      setSettingScreen={setSettingScreen}
                    />
                  )}
                </Stack.Screen>
              )
            ))}

          {/* Profiles */}

          {!childrenExist && (
            <Stack.Screen
              name="ChildrenProfiles"
              options={{
                // Ajout du header
                title: "Settings",
                tabBarLabel: "Settings",
                headerTitle: (props) => (
                  <HeaderOnlyModeNight
                    {...props}
                    dayNightMode={dayNightMode}
                    setDayNightMode={setDayNightMode}
                    isEnabled={isEnabled}
                    setIsEnabled={setIsEnabled}
                    parentMode={parentMode}
                    setParentMode={setParentMode}
                  />
                ),
                headerStyle: {
                  backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
                },
              }}
            >
              {() => (
                <AddFirstChildren
                  childrenProfiles={childrenProfiles}
                  setChildrenProfiles={setChildrenProfiles}
                  dayNightMode={dayNightMode}
                  setDayNightMode={setDayNightMode}
                  isEnabled={isEnabled}
                  parentMode={parentMode}
                  setParentMode={setParentMode}
                  setChildrenExistAsync={setChildrenExistAsync}
                />
              )}
            </Stack.Screen>
          )}
          {!parentMode && (
            <Stack.Screen
              name="Profile"
              options={{
                // Ajout du header
                animationEnabled: false,
                title: "UserProfile",
                tabBarLabel: "Settings",
                headerTitle: (props) => (
                  // Envoie du header qu'avec le mode nuit/jour (pas dacces au mode parent depuis la page)
                  <HeaderOnlyModeNight
                    {...props}
                    dayNightMode={dayNightMode}
                    setDayNightMode={setDayNightMode}
                    setParentMode={setParentMode}
                    isEnabled={isEnabled}
                    setIsEnabled={setIsEnabled}
                    setSettingScreen={setSettingScreen}
                  />
                ),
                headerStyle: {
                  backgroundColor: dayNightMode ? colors.bgDay : colors.bgNight,
                },
              }}
            >
              {() => (
                <ProfileScreen
                  dayNightMode={dayNightMode}
                  setChildrenInfosStorage={setChildrenInfosStorage}
                  setParentMode={setParentMode}
                  isEnabled={isEnabled}
                  setIsEnabled={setIsEnabled}
                  setSettingScreen={setSettingScreen}
                />
              )}
            </Stack.Screen>
          )}

          {/* ----------------------------------------------------- */
          /* -----------------------TAB1 Screen Home---------------- */
          /* ----------------------------------------------------- */}

          {!parentMode && (
            <Stack.Screen
              name="Home"
              options={{
                headerShown: false,
                animationEnabled: false,
              }}
            >
              {() => (
                <Tab.Navigator
                  tabBarOptions={{
                    inactiveTintColor: dayNightMode
                      ? colors.overlayNight
                      : colors.overlayDayII,
                    activeTintColor: dayNightMode
                      ? colors.bgNight
                      : colors.bgNight,
                    style: {
                      backgroundColor: dayNightMode
                        ? colors.overlayDayII
                        : colors.overlayNight,
                      borderTopColor: "transparent",
                      borderWidth: 0,
                    },
                  }}
                >
                  <Tab.Screen
                    name="Home"
                    options={{
                      tabBarLabel: "Accueil",
                      tabBarIcon: ({ color, size }) => (
                        <Ionicons name={"ios-home"} size={size} color={color} />
                      ),
                    }}
                  >
                    {() => (
                      <Stack.Navigator
                        screenOptions={{
                          headerShown: true,
                          headerTransparent: false,
                          headerTintColor: dayNightMode
                            ? colors.bgNight
                            : colors.bgDay,
                        }}
                      >
                        {/* <Stack.Screen
                          name="Profile"
                          options={{
                            // Ajout du header
                            animationEnabled: false,
                            title: "UserProfile",
                            tabBarLabel: "Settings",
                            headerTitle: (props) => (
                              <HeaderOnlyModeNight
                                {...props}
                                dayNightMode={dayNightMode}
                                setDayNightMode={setDayNightMode}
                                setParentMode={setParentMode}
                                isEnabled={isEnabled}
                                setIsEnabled={setIsEnabled}
                                setSettingScreen={setSettingScreen}
                              />
                            ),
                            headerStyle: {
                              backgroundColor: dayNightMode
                                ? colors.bgDay
                                : colors.bgNight,
                            },
                          }}
                        >
                          {() => (
                            <ProfileScreen
                              dayNightMode={dayNightMode}
                              setChildrenInfosStorage={setChildrenInfosStorage}
                              setParentMode={setParentMode}
                              isEnabled={isEnabled}
                              setIsEnabled={setIsEnabled}
                              setSettingScreen={setSettingScreen}
                            />
                          )}
                        </Stack.Screen> */}
                        <Stack.Screen
                          name="Home"
                          options={{
                            // Ajout du header
                            animationEnabled: false,
                            title: "Home",
                            tabBarLabel: "Home",

                            headerTitle: (props) => (
                              <Header
                                {...props}
                                dayNightMode={dayNightMode}
                                setDayNightMode={setDayNightMode}
                                isEnabled={isEnabled}
                                setIsEnabled={setIsEnabled}
                                parentMode={parentMode}
                                setParentMode={setParentMode}
                                setSettingScreen={setSettingScreen}
                              />
                            ),
                            headerStyle: {
                              backgroundColor: dayNightMode
                                ? colors.bgDay
                                : colors.bgNight,
                            },
                          }}
                        >
                          {() => (
                            <HomeScreen
                              dayNightMode={dayNightMode}
                              isEnabled={isEnabled}
                              setIsEnabled={setIsEnabled}
                              parentMode={parentMode}
                              setParentMode={setParentMode}
                            />
                          )}
                        </Stack.Screen>

                        {/* <Stack.Screen
                          name="Serie"
                          options={{
                            // Ajout du header
                            animationEnabled: false,
                            title: "AddOtherChildren",
                            tabBarLabel: "AddOtherChildren",
                            headerTitle: (props) => (
                              <Header
                                {...props}
                                dayNightMode={dayNightMode}
                                setDayNightMode={setDayNightMode}
                              />
                            ),
                            headerStyle: {
                              backgroundColor: dayNightMode
                                ? colors.bgDay
                                : colors.bgNight,
                            },
                          }}
                        >
                          {(props) => (
                            <ProfileScreen
                              {...props}
                              dayNightMode={dayNightMode}
                            />
                          )}
                        </Stack.Screen> */}
                        <Stack.Screen
                          name="Serie"
                          options={{
                            // Ajout du header
                            title: "Serie",

                            headerTitle: (props) => (
                              <Header
                                {...props}
                                dayNightMode={dayNightMode}
                                setDayNightMode={setDayNightMode}
                                isEnabled={isEnabled}
                                setIsEnabled={setIsEnabled}
                                parentMode={parentMode}
                                setParentMode={setParentMode}
                                setSettingScreen={setSettingScreen}
                              />
                            ),
                            headerStyle: {
                              backgroundColor: dayNightMode
                                ? colors.bgDay
                                : colors.bgNight,
                            },
                          }}
                        >
                          {(props) => (
                            <SerieScreen
                              {...props}
                              dayNightMode={dayNightMode}
                              setChildrenInfosStorage={setChildrenInfosStorage}
                              isEnabled={isEnabled}
                              setIsEnabled={setIsEnabled}
                              parentMode={parentMode}
                              setParentMode={setParentMode}
                            />
                          )}
                        </Stack.Screen>
                        <Stack.Screen
                          name="AddOtherChildren"
                          options={{
                            // Ajout du header
                            title: "Settings",
                            tabBarLabel: "Settings",
                            headerTitle: (props) => (
                              <Header
                                {...props}
                                dayNightMode={dayNightMode}
                                setDayNightMode={setDayNightMode}
                                isEnabled={isEnabled}
                                setIsEnabled={setIsEnabled}
                                parentMode={parentMode}
                                setParentMode={setParentMode}
                              />
                            ),
                            headerStyle: {
                              backgroundColor: dayNightMode
                                ? colors.bgDay
                                : colors.bgNight,
                            },
                          }}
                        >
                          {(props) => (
                            <AddOtherChildren
                              {...props}
                              dayNightMode={dayNightMode}
                            />
                          )}
                        </Stack.Screen>

                        <Stack.Screen
                          name="Episode"
                          options={{
                            // Ajout du header
                            title: "Episode",

                            animationEnabled: false,

                            headerTitle: (props) => (
                              <Header
                                {...props}
                                dayNightMode={dayNightMode}
                                setDayNightMode={setDayNightMode}
                                isEnabled={isEnabled}
                                setIsEnabled={setIsEnabled}
                                parentMode={parentMode}
                                setParentMode={setParentMode}
                                setSettingScreen={setSettingScreen}
                              />
                            ),
                            headerStyle: {
                              backgroundColor: dayNightMode
                                ? colors.bgDay
                                : colors.bgNight,
                            },
                          }}
                        >
                          {(props) => (
                            <EpisodeScreen
                              {...props}
                              dayNightMode={dayNightMode}
                              isEnabled={isEnabled}
                              setIsEnabled={setIsEnabled}
                              parentMode={parentMode}
                              setParentMode={setParentMode}
                            />
                          )}
                        </Stack.Screen>
                      </Stack.Navigator>
                    )}
                  </Tab.Screen>

                  <Tab.Screen
                    name="PlayList"
                    options={{
                      tabBarLabel: "PlayList",
                      tabBarIcon: ({ color, size }) => (
                        <AntDesign name="bars" size={24} color={color} />
                      ),
                    }}
                  >
                    {() => (
                      <Stack.Navigator
                        screenOptions={{
                          headerShown: true,
                          headerTransparent: false,
                          headerTintColor: dayNightMode
                            ? colors.bgNight
                            : colors.bgDay,
                        }}
                      >
                        <Stack.Screen
                          name="PlayList"
                          options={{
                            // Ajout du header
                            title: "PlayList",
                            tabBarLabel: "PlayList",
                            headerTitle: (props) => (
                              <Header
                                {...props}
                                dayNightMode={dayNightMode}
                                setDayNightMode={setDayNightMode}
                                isEnabled={isEnabled}
                                setIsEnabled={setIsEnabled}
                                parentMode={parentMode}
                                setParentMode={setParentMode}
                                setSettingScreen={setSettingScreen}
                              />
                            ),
                            headerStyle: {
                              backgroundColor: dayNightMode
                                ? colors.bgDay
                                : colors.bgNight,
                            },
                          }}
                        >
                          {() => (
                            <PlayListScreen
                              setToken={setToken}
                              setChildrenProfiles={setChildrenProfiles}
                              dayNightMode={dayNightMode}
                              setDayNightMode={setDayNightMode}
                              setChildrenInfosStorage={setChildrenInfosStorage}
                              isEnabled={isEnabled}
                              setIsEnabled={setIsEnabled}
                              parentMode={parentMode}
                              setParentMode={setParentMode}
                              setSettingScreen={setSettingScreen}
                            />
                          )}
                        </Stack.Screen>
                        <Stack.Screen
                          name="Episode"
                          options={{
                            // Ajout du header
                            title: "Episode",

                            animationEnabled: false,

                            headerTitle: (props) => (
                              <Header
                                {...props}
                                dayNightMode={dayNightMode}
                                setDayNightMode={setDayNightMode}
                                isEnabled={isEnabled}
                                setIsEnabled={setIsEnabled}
                                parentMode={parentMode}
                                setParentMode={setParentMode}
                                setSettingScreen={setSettingScreen}
                              />
                            ),
                            headerStyle: {
                              backgroundColor: dayNightMode
                                ? colors.bgDay
                                : colors.bgNight,
                            },
                          }}
                        >
                          {(props) => (
                            <EpisodeScreen
                              {...props}
                              dayNightMode={dayNightMode}
                              isEnabled={isEnabled}
                              setIsEnabled={setIsEnabled}
                              parentMode={parentMode}
                              setParentMode={setParentMode}
                            />
                          )}
                        </Stack.Screen>
                      </Stack.Navigator>
                    )}
                  </Tab.Screen>
                  <Tab.Screen
                    name="ProtectedNightMode"
                    options={{
                      tabBarLabel: "Mode Protégé",
                      tabBarIcon: ({ color, size }) => (
                        <Ionicons
                          name="lock-closed-sharp"
                          size={size}
                          color={color}
                        />
                      ),
                    }}
                  >
                    {() => (
                      <Stack.Navigator
                        screenOptions={{
                          headerShown: true,
                          headerTransparent: false,
                          headerTintColor: dayNightMode
                            ? colors.bgNight
                            : colors.bgDay,
                        }}
                      >
                        <Stack.Screen
                          name="ProtectedNightModeModal"
                          options={{
                            // Ajout du header
                            title: "ProtectedNightModeModal",
                            tabBarLabel: "ProtectedNightModeModal",
                            headerTitle: (props) => (
                              <Header
                                {...props}
                                dayNightMode={dayNightMode}
                                setDayNightMode={setDayNightMode}
                                isEnabled={isEnabled}
                                setIsEnabled={setIsEnabled}
                                parentMode={parentMode}
                                setParentMode={setParentMode}
                              />
                            ),
                            headerStyle: {
                              backgroundColor: dayNightMode
                                ? colors.bgDay
                                : colors.bgNight,
                            },
                          }}
                        >
                          {() => (
                            <ProtectedNightModeModalScreen
                              setToken={setToken}
                              setLang={setLang}
                              setGuidance={setGuidance}
                              setSwitchProtected={setSwitchProtected}
                              setUserGuidance={setUserGuidance}
                              setGuidanceSuggestionStorage={
                                setGuidanceSuggestionStorage
                              }
                              setChildrenProfiles={setChildrenProfiles}
                              dayNightMode={dayNightMode}
                              setDayNightMode={setDayNightMode}
                              isEnabled={isEnabled}
                              setIsEnabled={setIsEnabled}
                              parentMode={parentMode}
                              setParentMode={setParentMode}
                              setSettingScreen={setSettingScreen}
                            />
                          )}
                        </Stack.Screen>
                        <Stack.Screen
                          name="ProtectedNightMode"
                          options={{
                            // Ajout du header
                            title: "ProtectedNightMode",
                            tabBarLabel: "ProtectedNightMode",
                            headerShown: false,
                          }}
                        >
                          {() => (
                            <ProtectedNightModeScreen
                              setToken={setToken}
                              setLang={setLang}
                              setGuidance={setGuidance}
                              setSwitchProtected={setSwitchProtected}
                              switchProtected={switchProtected}
                              setUserGuidance={setUserGuidance}
                              setGuidanceSuggestionStorage={
                                setGuidanceSuggestionStorage
                              }
                              setChildrenProfiles={setChildrenProfiles}
                              dayNightMode={dayNightMode}
                              setDayNightMode={setDayNightMode}
                              isEnabled={isEnabled}
                              setIsEnabled={setIsEnabled}
                              parentMode={parentMode}
                              setParentMode={setParentMode}
                              setSettingScreen={setSettingScreen}
                            />
                          )}
                        </Stack.Screen>
                      </Stack.Navigator>
                    )}
                  </Tab.Screen>
                </Tab.Navigator>
              )}
            </Stack.Screen>
          )}

          {/* ----------------------------------------------------- */
          /* -----------------------TAB SCREEN PLAYLIST------------ */
          /* ----------------------------------------------------- 
          <Stack.Screen
            name="Tab2"
            options={{ headerShown: false, animationEnabled: false }}
          >
            {() => (
              <Tab.Navigator
                tabBarOptions={{
                  activeTintColor: "#94A2E3",
                  inactiveTintColor: "#94A2E3",
                }}
              >
                <Tab.Screen
                  name="Home"
                  options={{
                    tabBarLabel: "Thing",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"ios-home"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        headerShown: true,
                        headerTransparent: false,
                        headerTintColor: dayNightMode
                          ? colors.bgNight
                          : colors.bgDay,
                      }}
                    >
                      <Stack.Screen
                        name="Home1"
                        options={{
                          // Ajout du header
                          animationEnabled: false,
                          title: "SignIn",
                          tabBarLabel: "Settings",
                          headerTitle: (props) => (
                            <Header
                              {...props}
                              dayNightMode={dayNightMode}
                              setDayNightMode={setDayNightMode}
                            />
                          ),
                          headerStyle: {
                            backgroundColor: dayNightMode
                              ? colors.bgDay
                              : colors.bgNight,
                          },
                        }}
                      >
                        {() => <HomeScreen dayNightMode={dayNightMode} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
           ----------------------------------------------------- */
          /* -----------------------TAB SCREEN PLAYLIST------------ */
          /* ----------------------------------------------------- */}

          {/* <Stack.Screen
            name="Tab3"
            options={{ headerShown: false, animationEnabled: false }}
          >
            {() => (
              <Tab.Navigator
                tabBarOptions={{
                  activeTintColor: "#94A2E3",
                  inactiveTintColor: "#94A2E3",
                }}
              >
                <Tab.Screen
                  name="Home"
                  options={{
                    tabBarLabel: "Thing",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"ios-home"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        headerShown: true,
                        headerTransparent: false,
                        headerTintColor: dayNightMode
                          ? colors.bgNight
                          : colors.bgDay,
                      }}
                    >
                      <Stack.Screen
                        name="Home3"
                        options={{
                          // Ajout du header
                          animationEnabled: false,
                          title: "SignIn",
                          tabBarLabel: "Settings",
                          headerTitle: (props) => (
                            <Header
                              {...props}
                              dayNightMode={dayNightMode}
                              setDayNightMode={setDayNightMode}
                            />
                          ),
                          headerStyle: {
                            backgroundColor: dayNightMode
                              ? colors.bgDay
                              : colors.bgNight,
                          },
                        }}
                      >
                        {() => <HomeScreen dayNightMode={dayNightMode} />}
                      </Stack.Screen>
                      <Stack.Screen
                        name="Prof"
                        options={{
                          // Ajout du header
                          animationEnabled: false,
                          title: "UserProfile",
                          tabBarLabel: "Settings",
                          headerTitle: (props) => (
                            <Header
                              {...props}
                              dayNightMode={dayNightMode}
                              setDayNightMode={setDayNightMode}
                            />
                          ),
                          headerStyle: {
                            backgroundColor: dayNightMode
                              ? colors.bgDay
                              : colors.bgNight,
                          },
                        }}
                      >
                        {() => <ProfileScreen dayNightMode={dayNightMode} />}
                      </Stack.Screen>
                      <Stack.Screen
                        name="PlayStory4"
                        options={{
                          title: "PlayStory4",
                        }}
                      >
                        {() => <PlayStoryScreen />}
                      </Stack.Screen>
                      {/* <Stack.Screen
                        name="Serie"
                        options={{
                          title: "Serie",
                        }}
                      >
                        {() => <SerieScreen />}
                      </Stack.Screen> 
                      <Stack.Screen
                        name="Episode"
                        options={{
                          title: "Episode",
                        }}
                      >
                        {(props) => <EpisodeScreen {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen> 
          {/* ----------------------------------------------------- */
          /* -----------------------TAB SCREEN SERIE------------ */
          /* ----------------------------------------------------- 
          <Stack.Screen
            name="Tab4"
            options={{ headerShown: false, animationEnabled: false }}
          >
            {() => (
              <Tab.Navigator
                tabBarOptions={{
                  activeTintColor: "#94A2E3",
                  inactiveTintColor: "#94A2E3",
                }}
              >
                <Tab.Screen
                  name="Home"
                  options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"ios-home"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        headerShown: true,
                        headerTransparent: false,
                        headerTintColor: dayNightMode
                          ? colors.bgNight
                          : colors.bgDay,
                      }}
                    >
                      {/* <Stack.Screen
                        name="Home"
                        options={{
                          // Ajout du header
                          animationEnabled: false,
                          title: "SignIn",
                          tabBarLabel: "Settings",
                          headerTitle: (props) => (
                            <Header
                              {...props}
                              dayNightMode={dayNightMode}
                              setDayNightMode={setDayNightMode}
                            />
                          ),
                          headerStyle: {
                            backgroundColor: dayNightMode
                              ? colors.bgDay
                              : colors.bgNight,
                          },
                        }}
                      >
                        {() => <HomeScreen dayNightMode={dayNightMode} />}
                      </Stack.Screen> 
                      <Stack.Screen
                        name="Serie"
                        options={{
                          // Ajout du header
                          title: "Serie",
                          headerTitle: (props) => (
                            <Header
                              {...props}
                              dayNightMode={dayNightMode}
                              setDayNightMode={setDayNightMode}
                            />
                          ),
                          headerStyle: {
                            backgroundColor: dayNightMode
                              ? colors.bgDay
                              : colors.bgNight,
                          },
                        }}
                      >
                        {() => <SerieScreen dayNightMode={dayNightMode} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
          {/* ----------------------------------------------------- */
          /* -----------------------TAB SCREEN EPISODE------------ */
          /* ----------------------------------------------------- 
          <Stack.Screen
            name="Tab5"
            options={{ headerShown: false, animationEnabled: false }}
          >
            {() => (
              <Tab.Navigator
                tabBarOptions={{
                  activeTintColor: "#94A2E3",
                  inactiveTintColor: "#94A2E3",
                }}
              >
                <Tab.Screen
                  name="Home"
                  options={{
                    tabBarLabel: "Thing",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"ios-home"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        headerShown: true,
                        headerTransparent: false,
                        headerTintColor: dayNightMode
                          ? colors.bgNight
                          : colors.bgDay,
                      }}
                    >
                      <Stack.Screen
                        name="Home"
                        options={{
                          // Ajout du header
                          animationEnabled: false,
                          title: "SignIn",
                          tabBarLabel: "Settings",
                          headerTitle: (props) => (
                            <Header
                              {...props}
                              dayNightMode={dayNightMode}
                              setDayNightMode={setDayNightMode}
                            />
                          ),
                          headerStyle: {
                            backgroundColor: dayNightMode
                              ? colors.bgDay
                              : colors.bgNight,
                          },
                        }}
                      >
                        {() => <HomeScreen dayNightMode={dayNightMode} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
                      </Stack.Screen> */}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
