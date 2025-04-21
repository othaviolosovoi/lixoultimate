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
import { Redirect } from "expo-router";

const signin = () => {
  const { session, signin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null); // Clear previous errors
    try {
      await signin({ email, password });
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (session) return <Redirect href="/" />;
  return (
    <View className="flex-1 p-5 justify-center">
      <View>
        <Text className="text-7xl text-center font-bold italic">SignIn</Text>

        <Text>Email:</Text>
        <TextInput
          placeholder="Enter your email..."
          className="border-2 rounded-xl p-3 mt-3 mb-3 border-gray-400"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <Text>Password:</Text>
        <TextInput
          className="border-2 rounded-xl p-3 mt-3 mb-3 border-gray-400"
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />

        {error && (
          <Text className="text-red-500 text-center mb-3">{error}</Text>
        )}

        <TouchableOpacity
          className="bg-black p-3 rounded-md items-center mt-3"
          onPress={handleSubmit}
        >
          <Text className="text-white text-lg">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default signin;
