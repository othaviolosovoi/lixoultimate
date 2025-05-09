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
  Image,
} from "react-native";
import Preview from "../preview";

import { useAuth } from "../../../context/AuthContext";
import { Redirect, router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../components/header";
import Permission from "../../components/permission";

export default function Index() {
  const { user, session, signout, loading } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    <Permission requestPermission={requestPermission} />;
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#0d0d0d]">
        {/* make a loading spinner */}
        <View className="w-16 h-16 rounded-full border-4 border-t-4 border-t-[#008D80] border-[#0d0d0d] animate-spin" />
        <Text className="text-white font-nunitoBold text-2xl mt-4">
          Carregando...
        </Text>
      </SafeAreaView>
    );
  }

  if (!session) {
    return <Redirect href="/welcome" />;
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    setUri(photo?.uri ?? null);
  };

  const renderPicture = () => {
    return uri ? <Preview uri={uri} onReset={() => setUri(null)} /> : null;
  };

  const renderCamera = () => {
    return (
      <>
        <Header
          user={user}
          path={require("../../../assets/images/coin_icon.png")}
          onProfilePress={() => {
            router.push("/profile");
          }}
          onLogoutPress={signout}
          onLixoCoinPress={() => {
            router.push("/lixo-coins");
          }}
        />
        <CameraView
          style={styles.camera}
          ref={ref}
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
