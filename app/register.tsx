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

export default function Register() {
  const { session, register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    setError(null); // Clear previous errors
    try {
      await register({ name, email, password });
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (session) return <Redirect href="/" />;

  return (
    <View className="flex-1 p-5 justify-center">
      <View>
        <Text className="text-7xl text-center font-bold italic mb-5">
          Registrar
        </Text>

        <Text>Nome:</Text>
        <TextInput
          placeholder="Digite seu nome..."
          className="border-2 rounded-xl p-3 mt-3 mb-3 border-gray-400"
          value={name}
          onChangeText={(text) => setName(text)}
        />

        <Text>Email:</Text>
        <TextInput
          placeholder="Digite seu email..."
          className="border-2 rounded-xl p-3 mt-3 mb-3 border-gray-400"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <Text>Senha:</Text>
        <TextInput
          className="border-2 rounded-xl p-3 mt-3 mb-3 border-gray-400"
          placeholder="Digite sua senha..."
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />

        {error && (
          <Text className="text-red-500 text-center mb-3">{error}</Text>
        )}

        <TouchableOpacity
          className="bg-black p-3 rounded-md items-center mt-3"
          onPress={handleRegister}
        >
          <Text className="text-white text-lg">Criar Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
