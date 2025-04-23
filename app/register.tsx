import "./globals.css";
import {
  SafeAreaView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Redirect, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Image } from "expo-image";

export default function Register() {
  const { session, register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    // Validate password match

    try {
      await register({ name, email, password });
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (session) return <Redirect href="/" />;

  return (
    <LinearGradient
      colors={["#45BF55", "#008D80", "#000000"]}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-[1] bg-transparent">
          <Ionicons
            onPress={() => router.back()}
            className="ml-5 mt-10"
            name="chevron-back"
            size={28}
            color="white"
          />
        </View>
        <View
          className="flex-[3] bg-black p-6 overflow-hidden justify-evenly"
          style={{
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
        >
          <View>
            <View className="justify-evenly gap-4 mb-8">
              <Text className="text-4xl text-white text-center font-black">
                Registrar
              </Text>
              <Text className="text-lg text-white text-center">
                Crie sua conta
              </Text>
              <View className="flex-row items-center bg-[#262626] rounded-lg p-3 mt-3">
                <Ionicons name="person-outline" size={24} color="#9CA3AF" />
                <TextInput
                  placeholder="Nome"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 text-gray-400 text-xl ml-2"
                  value={name}
                  onChangeText={(text) => setName(text)}
                />
              </View>
              <View className="flex-row items-center bg-[#262626] rounded-lg p-3 mt-3">
                <Ionicons name="mail-outline" size={24} color="#9CA3AF" />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 text-gray-400 text-xl ml-2"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                />
              </View>
              <View className="flex-row items-center bg-[#262626] rounded-lg p-3 mt-3">
                <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color="#9CA3AF"
                />
                <TextInput
                  placeholder="Senha"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 text-gray-400 text-xl ml-2"
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  secureTextEntry
                />
              </View>

              {error && (
                <Text className="text-red-500 text-center mb-3">{error}</Text>
              )}
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              className="rounded-full overflow-hidden"
              onPress={handleRegister}
            >
              <LinearGradient
                colors={["#45BF55", "#008D80"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 9999 }}
                className="py-4"
              >
                <Text className="text-black text-xl font-black text-center p-1">
                  REGISTRAR
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <View className="mt-4">
              <Text className="text-gray-400 text-center text-lg">
                Já possui uma conta?{" "}
                <Text
                  className="text-green-500 font-bold"
                  onPress={() => router.push("/signin")}
                >
                  Entrar
                </Text>
              </Text>
            </View>
            <View className="flex-row items-center my-5">
              <View className="flex-1 h-[1px] bg-white" />
              <Text className="text-white mx-4 font-black">OU</Text>
              <View className="flex-1 h-[1px] bg-white" />
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-black border border-white rounded-lg flex-row items-center justify-center gap-3 mt-2"
            >
              <Image
                style={{ width: 20, height: 20 }}
                source={require("../assets/images/logo_google.png")}
                contentFit="cover"
              />
              <Text className="text-white text-xl py-4">
                Entrar com o Google
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
