import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../context/AuthContext";
import { useCoins } from "../../context/CoinsContext";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/header";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

const SERVER_URL_CLASSIFICATION =
  process.env.EXPO_PUBLIC_SERVER_URL_CLASSIFICATION;

export default function Preview({
  uri,
  onReset,
  jsonResult,
}: {
  uri: string;
  onReset: () => void;
  jsonResult?: object | null;
}) {
  const { signout } = useAuth();
  const { refreshCoins } = useCoins();
  const { width, height } = Dimensions.get("window");

  const handleSend = () => {
    if (!jsonResult) {
      console.error("No jsonResult available to send");
      return;
    }

    Toast.show({
      type: "info",
      text1: "Processando... ⏳",
      text2: "Sua foto está sendo analisada.",
      autoHide: false,
    });

    fetch(`${SERVER_URL_CLASSIFICATION}/classify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonResult),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.detail || `HTTP error! status: ${response.status}`;
          throw new Error(errorMessage);
        }
        const result = await response.json();

        Toast.hide();
        Toast.show({
          type: "success",
          text1: "Sucesso! ✅",
          text2: "Sua foto foi analisada.",
        });
        
        // Atualizar as moedas no header
        refreshCoins();
      })
      .catch((error) => {
        console.error("Error sending POST request in background:", error);

        Toast.hide();
        Toast.show({
          type: "error",
          text1: "Erro ao Enviar ❌",
          text2: error.message || "Não foi possível conectar ao servidor.",
        });
      });
    onReset();
  };

  return (
    <>
      <Header
        path={require("../../assets/images/coin_icon.png")}
        onProfilePress={() => {
          router.push("/profile");
        }}
        onLogoutPress={signout}
        onLixoCoinPress={() => {
          router.push("/lixo-coins");
        }}
      />
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
            contentFit="cover"
          />
        )}

        {!jsonResult && (
          <View className="absolute top-0 bottom-0 left-0 right-0 justify-center items-center bg-black/60">
            <View className="bg-[#262626] p-6 rounded-md items-center w-2/4">
              <ActivityIndicator size="large" color="#008D80" />
              <Text className="text-white text-md font-nunito mt-4 text-center">
                Carregando dados da imagem...
              </Text>
            </View>
          </View>
        )}

        <View className="absolute top-4 right-4 w-12 h-12 rounded-full items-center justify-center">
          <View className="bg-black opacity-30 rounded-full p-2 w-full h-full"></View>
          <TouchableOpacity
            className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center"
            onPress={onReset}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {jsonResult && (
          <TouchableOpacity
            className="absolute bottom-36 right-4 w-12 h-12 rounded-full items-center justify-center"
            onPress={handleSend}
          >
            <LinearGradient
              colors={["#45BF55", "#008D80"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 9999 }}
              className=" w-full h-full flex-row justify-center items-center my-auto "
            >
              <Ionicons name="send" size={20} color="black" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}
