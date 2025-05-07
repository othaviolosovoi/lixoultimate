import { Text, View, Button, Dimensions, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

export default function Preview({
  uri,
  onReset,
}: {
  uri: string;
  onReset: () => void;
}) {
  const { user } = useAuth();
  const { width, height } = Dimensions.get("window");

  return (
    <>
      <View className="flex-row justify-between items-center w-full px-4 h-24 bg-[#0d0d0d]">
        <View>
          <Text className="text-white">{user?.name}</Text>
        </View>
        <View>
          <Text className="text-white">LixoCoins</Text>
        </View>
      </View>
      <View style={{ flex: 1, position: "relative" }}>
        {uri && (
          <Image
            source={{ uri }}
            style={{
              width: width,
              height: height,
              top: 0,
              left: 0,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
            contentFit="cover" // Ensures the image covers the entire area
          />
        )}
        <View className="absolute top-4 right-4 w-9 h-9 rounded-full items-center justify-center">
          <View className="bg-black opacity-30 rounded-full p-2 w-full h-full">
            {/* Background container with opacity */}
          </View>
          <TouchableOpacity
            className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center"
            onPress={onReset}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className="absolute bottom-36 right-4 w-12 h-12 rounded-full items-center justify-center">
          <LinearGradient
            colors={["#45BF55", "#008D80"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 9999 }}
            className=" w-full h-full flex-row justify-center items-center my-auto "
          >
            <Ionicons name="send" size={20} color="black" />
          </LinearGradient>
        </View>
      </View>
    </>
  );
}
