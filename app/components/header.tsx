import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";

export default function Header({
  user,
  path,
  onProfilePress,
  onLogoutPress,
  onLixoCoinPress,
}: {
  user: { name: string };
  path: ImageSourcePropType;
  onProfilePress: () => void;
  onLogoutPress: () => void;
  onLixoCoinPress: () => void;
}) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  return (
    <View className="flex-row justify-between items-center w-full px-4 h-24 bg-[#0d0d0d]">
      <TouchableOpacity
        onPress={toggleDropdown}
        className="bg-[#008D80] h-12 w-12 rounded-full items-center justify-center"
      >
        <Text className="text-white font-poppinsBold text-2xl">
          {user.name.charAt(0).toUpperCase()}
        </Text>
      </TouchableOpacity>

      {dropdownVisible && (
        <View className="absolute top-20 left-4 bg-[#262626] rounded-lg p-2 z-10">
          <TouchableOpacity onPress={onProfilePress} className="py-2 px-4">
            <Text className="text-white font-nunitoBold text-xl">Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogoutPress} className="py-2 px-4">
            <Text className="text-white font-nunitoBold text-xl">Sair</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        onPress={onLixoCoinPress}
        className="flex-row gap-2 items-center justify-center bg-[#262626] rounded-lg px-4 py-2"
      >
        <Text className="text-white font-nunitoBold text-2xl">000</Text>
        <Image className="w-7 h-7 object-cover" source={path} />
      </TouchableOpacity>
    </View>
  );
}
