// app/components/header.tsx MODIFICADO

import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/context/AuthContext";

const SERVER_URL_DATABASE = process.env.EXPO_PUBLIC_SERVER_URL_DATABASE;

export default function Header({
  path,
  onProfilePress,
  onLogoutPress,
  onLixoCoinPress,
}: {
  path: ImageSourcePropType;
  onProfilePress: () => void;
  onLogoutPress: () => void;
  onLixoCoinPress: () => void;
}) {
  const { user } = useAuth();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [coins, setCoins] = useState<number>(0);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  useEffect(() => {
    const fetchUserCoins = async () => {
      if (!user?.$id) {
        return;
      }
      try {
        const response = await fetch(`${SERVER_URL_DATABASE}/users/${user.$id}`);
        if (!response.ok) {
          throw new Error('Falha ao buscar os dados do usuário.');
        }
        const userData = await response.json();
        setCoins(userData.coins || 0);
      } catch (error) {
        console.error("Erro ao buscar moedas no Header:", error);
        setCoins(0);
      }
    };

    fetchUserCoins();
  }, [user?.$id]);

  return (
    <View className="flex-row justify-between items-center w-full px-4 h-24 bg-[#0d0d0d]">
      <TouchableOpacity
        onPress={toggleDropdown}
        className="bg-[#008D80] h-12 w-12 rounded-full items-center justify-center"
      >
        <Text className="text-white font-poppinsBold text-2xl">
          {user?.name?.charAt(0).toUpperCase()}
        </Text>
      </TouchableOpacity>

      {dropdownVisible && (
        <View className="absolute top-20 left-4 bg-[#262626] rounded-lg p-2 z-10">
          <TouchableOpacity onPress={onLogoutPress} className="py-2 px-4">
            <Text className="text-white font-nunitoBold text-xl">Sair</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        onPress={onLixoCoinPress}
        className="flex-row gap-2 items-center justify-center bg-[#262626] rounded-lg px-4 py-2"
      >
        <Text className="text-white font-nunitoBold text-2xl">{coins}</Text>
        <Image className="w-7 h-7 object-cover" source={path} />
      </TouchableOpacity>
    </View>
  );
}