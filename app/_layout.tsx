import "./globals.css";
import { Slot, SplashScreen } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Nunito-Black": require("../assets/fonts/Nunito-Black.ttf"),
    "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
    "Nunito-Light": require("../assets/fonts/Nunito-Light.ttf"),
    "Nunito-Medium": require("../assets/fonts/Nunito-Medium.ttf"),
    "Nunito-Regular": require("../assets/fonts/Nunito-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </SafeAreaView>
  );
}
