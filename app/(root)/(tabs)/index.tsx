import "../../globals.css";
import { Text, View, SafeAreaView, TouchableOpacity } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { Redirect } from "expo-router";

export default function Index() {
  const { user, session, signout, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-slate-800">
        <Text className="text-2xl">Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (!session) {
    return <Redirect href="/welcome" />;
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-2xl text-red-500">
          Erro: Dados do usuário não encontrados. Faça login novamente.
        </Text>
        <TouchableOpacity
          className="bg-black p-3 rounded-md items-center m-5"
          onPress={() => signout()}
        >
          <Text className="color-white text-lg">Voltar para Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <TouchableOpacity
        className="bg-black p-3 rounded-md items-center m-5"
        onPress={signout}
      >
        <Text className="color-white text-lg">Sair</Text>
      </TouchableOpacity>
      <View className="px-5">
        <Text className="text-2xl">Olá {user.name}!</Text>
      </View>
    </SafeAreaView>
  );
}
