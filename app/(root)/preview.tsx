import { Text, View, Button, Dimensions, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/header";
import { Redirect, router } from "expo-router";

const SERVER_URL_CLASSIFICATION = process.env.EXPO_PUBLIC_SERVER_URL_CLASSIFICATION;

export default function Preview({
  uri,
  onReset,
  jsonResult,
}: {
  uri: string;
  onReset: () => void;
  jsonResult?: object | null;
}) {
  const { user, signout } = useAuth();
  const { width, height } = Dimensions.get("window");

  /**
   * Sends the classification data to the server without waiting for a response.
   * This allows the UI to be reset immediately.
   */
  const handleSend = () => {
    if (!jsonResult) {
      console.error("No jsonResult available to send");
      return;
    }

    console.log("Sending POST request to:", `${SERVER_URL_CLASSIFICATION}/classify`);

    // The fetch request is initiated, but we don't 'await' its completion.
    // This is a "fire-and-forget" approach.
    fetch(`${SERVER_URL_CLASSIFICATION}/classify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonResult),
    })
      .then(async (response) => {
        // We can still process the response in the background.
        if (!response.ok) {
          // If we get a bad response, we log an error.
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("POST response received in background:", result);
      })
      .catch((error) => {
        // Catch and log any errors that occur during the fetch.
        // This won't block the UI.
        console.error("Error sending POST request in background:", error);
      });

    // Reset the UI immediately after firing the request.
    onReset();
  };

  return (
    <>
      <Header
        user={user}
        path={require("../../assets/images/coin_icon.png")}
        onProfilePress={() => {
          router.push("/profile");
        }}
        onLogoutPress={signout}
        onLixoCoinPress={() => {
          router.push("/lixo-coins");
        }}
      />
      <View style={{ flex: 1, position: "relative" }}>
        {uri && (
          <Image
            source={{ uri }}
            style={{
              width: width,
              height: height,
              top: 0,
              left: 0,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
            contentFit="cover"
          />
        )}
        <View className="absolute top-4 right-4 w-9 h-9 rounded-full items-center justify-center">
          <View className="bg-black opacity-30 rounded-full p-2 w-full h-full"></View>
          <TouchableOpacity
            className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center"
            onPress={onReset}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="absolute bottom-36 right-4 w-12 h-12 rounded-full items-center justify-center"
          onPress={handleSend}
        >
          <LinearGradient
            colors={["#45BF55", "#008D80"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 9999 }}
            className=" w-full h-full flex-row justify-center items-center my-auto "
          >
            <Ionicons name="send" size={20} color="black" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </>
  );
}
