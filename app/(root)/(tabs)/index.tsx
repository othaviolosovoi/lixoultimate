import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";

import "../../globals.css";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Button,
  Pressable,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";

import { useAuth } from "../../../context/AuthContext";
import { Redirect } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  const { user, session, signout, loading } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [mode, setMode] = useState<CameraMode>("picture");
  const [facing, setFacing] = useState<CameraType>("back");
  const [recording, setRecording] = useState(false);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
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

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    setUri(photo?.uri ?? null);
  };

  const renderPicture = () => {
    return (
      <View>
        {uri && (
          <Image source={{ uri }} style={{ width: 300, aspectRatio: 1 }} />
        )}
        <Button onPress={() => setUri(null)} title="Take another picture" />
      </View>
    );
  };

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

  // return (
  //   <SafeAreaView className="flex-1 justify-center items-center">
  //     <TouchableOpacity
  //       className="bg-black p-3 rounded-md items-center m-5"
  //       onPress={signout}
  //     >
  //       <Text className="color-white text-lg">Sair</Text>
  //     </TouchableOpacity>
  //     <View className="px-5">
  //       <Text className="text-2xl">Olá {user.name}!</Text>
  //     </View>
  //   </SafeAreaView>
  // );

  const renderCamera = () => {
    return (
      <>
        <View className="flex-row justify-between items-center w-full px-4 h-24 bg-[#0d0d0d]">
          <View>
            <Text className="text-white">{user.name}</Text>
          </View>
          <View>
            <Text className="text-white">LixoCoins</Text>
          </View>
        </View>
        <CameraView
          style={styles.camera}
          ref={ref}
          facing={facing}
          mute={false}
          responsiveOrientationWhenOrientationLocked
        >
          <TouchableOpacity className="bg-[#0d0d0d86] rounded-full w-12 h-12 items-center justify-center absolute top-4 left-4">
            <MaterialIcons name="question-mark" size={24} color="white" />
          </TouchableOpacity>
          <View className="absolute bottom-0 left-0 w-full">
            <Pressable className="absolute bottom-32 left-8">
              {<AntDesign name="picture" size={32} color="white" />}
            </Pressable>

            <Pressable
              onPress={takePicture}
              className="absolute bottom-32 left-1/2 -translate-x-1/2"
            >
              {({ pressed }) => (
                <View
                  className={`bg-red border-[5px] border-white w-[85px] h-[85px] rounded-full items-center justify-center ${
                    pressed ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <View className={`w-[70px] h-[70px] rounded-full bg-white`} />
                </View>
              )}
            </Pressable>
          </View>
        </CameraView>
      </>
    );
  };

  return (
    <SafeAreaView
      className="flex-1 bg-[#0d0d0d] items-center
     justify-center"
    >
      {uri ? renderPicture() : renderCamera()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});
