import "./globals.css";
import { Slot } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden={true} />
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </>
  );
}
