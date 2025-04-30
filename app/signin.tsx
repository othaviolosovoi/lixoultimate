import "./globals.css";
import {
  SafeAreaView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Redirect, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const signin = () => {
  const router = useRouter();
  const { session, signin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null);
    try {
      await signin({ email, password });
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
      <View className="absolute z-0 w-full mt-14 flex justify-center items-center ">
        <Image
          source={require("../assets/images/logo_no_bg.png")}
          className="w-28 h-28"
        />
        <Text className="font-black text-3xl mt-[-8px]">Vetiver</Text>
      </View>
      <SafeAreaView className="flex-1">
        <View className="flex-[1] bg-transparent">
          <Ionicons
            onPress={() => router.push("/welcome")}
            className="ml-5 mt-10"
            name="chevron-back"
            size={28}
            color="black"
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
                Bem vindo de volta
              </Text>
              <Text className="text-lg text-white text-center">
                Entre na sua conta
              </Text>
            </View>
            <View className="gap-5">
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

              <View>
                <MaskedView
                  maskElement={
                    <Text
                      className="text-lg font-bold "
                      style={{ textAlign: "right" }}
                    >
                      Esqueci minha senha
                    </Text>
                  }
                >
                  <LinearGradient
                    colors={["#45BF55", "#008D80"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: 24 }}
                  />
                </MaskedView>
              </View>
            </View>

            {error && (
              <Text className="text-red-500 text-center mb-3">{error}</Text>
            )}
          </View>
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              className="rounded-full overflow-hidden"
              onPress={handleSubmit}
            >
              <LinearGradient
                colors={["#45BF55", "#008D80"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 9999 }}
                className="py-4"
              >
                <Text className="text-black text-xl font-black text-center p-1">
                  ENTRAR
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <View className="mt-4">
              <Text className="text-gray-400 text-center text-lg">
                Não tem uma conta?{" "}
                <Text
                  className="text-green-500 font-bold"
                  onPress={() => router.push("/register")}
                >
                  Registrar
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
              className="bg-black border border-white rounded-lg flex-row items-center justify-center gap-3  mt-2"
            >
              <Ionicons name="logo-google" size={24} color="white" />
              <Text className="text-white  text-xl py-4 ">
                Entrar com o Google
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default signin;
