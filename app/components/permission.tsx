import { Text, View, TouchableOpacity, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Permission({
  requestPermission,
  cameraGranted,
  locationGranted,
  canAskAgain,
}: {
  requestPermission: () => void;
  cameraGranted?: boolean;
  locationGranted?: boolean;
  canAskAgain?: boolean;
}) {
  const getPermissionMessage = () => {
    if (!cameraGranted && !locationGranted) {
      return "Precisamos da sua permissão para usar a câmera e acessar sua localização";
    } else if (!cameraGranted) {
      return "Precisamos da sua permissão para usar a câmera";
    } else if (!locationGranted) {
      return "Precisamos da sua permissão para acessar sua localização";
    }
    return "Precisamos de permissões para continuar";
  };

  const getButtonText = () => {
    if (canAskAgain === false) {
      return "Abrir Configurações";
    }
    return "Permitir";
  };

  const handlePress = () => {
    if (canAskAgain === false) {
      // Open device settings if permissions were permanently denied
      Linking.openSettings();
    } else {
      requestPermission();
    }
  };

  return (
    <View className="flex-1 align-items-center justify-center bg-[#0d0d0d] px-6">
      <Text className="text-center font-poppinsBold text-white text-2xl mb-3">
        {getPermissionMessage()}
      </Text>
      {canAskAgain === false && (
        <Text className="text-center font-nunitoRegular text-gray-400 text-sm mb-5">
          Você negou as permissões. Por favor, ative-as nas configurações do
          dispositivo.
        </Text>
      )}
      <TouchableOpacity
        activeOpacity={0.8}
        className="rounded-full overflow-hidden w-3/4 mx-auto"
        onPress={handlePress}
      >
        <LinearGradient
          colors={["#45BF55", "#008D80"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ borderRadius: 9999 }}
          className="py-4"
        >
          <Text className="text-xl font-poppinsBold text-center p-1">
            {getButtonText()}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
