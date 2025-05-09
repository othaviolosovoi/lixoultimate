import { Text, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Permission({
  requestPermission,
}: {
  requestPermission: () => void;
}) {
  return (
    <View className="flex-1 align-items-center justify-center bg-[#0d0d0d]">
      <Text className="text-center font-poppinsBold text-white text-2xl mb-5">
        Precisamos da sua permissão para usar a câmera
      </Text>
      <TouchableOpacity
        activeOpacity={0.8}
        className="rounded-full overflow-hidden w-3/4 mx-auto"
        onPress={requestPermission}
      >
        <LinearGradient
          colors={["#45BF55", "#008D80"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ borderRadius: 9999 }}
          className="py-4"
        >
          <Text className="text-xl font-poppinsBold text-center p-1">
            Permitir
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
