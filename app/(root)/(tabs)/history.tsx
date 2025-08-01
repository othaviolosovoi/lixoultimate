// Conteúdo de history.tsx MODIFICADO

import React from "react";
import Header from "../../components/header";
import { SafeAreaView, Text, View } from "react-native";
import { Redirect, router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import MinhasDeteccoesScreen from "../../components/MinhasDeteccoesScreen";

export default function History() {
  const { user, session, signout, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#0D0D0D]">
        <View className="w-16 h-16 rounded-full border-4 border-t-4 border-t-[#008D80] border-[#0d0d0d] animate-spin" />
        <Text className="text-white font-nunitoBold text-2xl mt-4">
          Carregando...
        </Text>
      </SafeAreaView>
    );
  }

  if (!session || !user) {
    return <Redirect href="/welcome" />;
  }

  return (
    <>
      <View className="flex-1 bg-[#0D0D0D]">
        <Header
          // user={user}
          path={require("../../../assets/images/coin_icon.png")}
          onProfilePress={() => {
            router.push("/profile");
          }}
          onLogoutPress={signout}
          onLixoCoinPress={() => {
            router.push("/lixo-coins");
          }}
        />

        {user.$id ? (
          <MinhasDeteccoesScreen userId={user.$id} />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white font-poppinsRegular text-lg">
              Não foi possível carregar o ID do usuário.
            </Text>
          </View>
        )}
      </View>
    </>
  );
}
