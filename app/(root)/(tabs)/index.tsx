import "../../globals.css";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Redirect, router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Header from "../../components/header";
import Permission from "../../components/permission";
import {
  takePicture,
  renderPicture,
  pickImage,
} from "../../../utils/imageUtils";

export default function Index() {
  const { user, session, signout, loading } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [jsonResult, setJsonResult] = useState<object | null>(null);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return <Permission requestPermission={requestPermission} />;
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#0d0d0d]">
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

  const renderCamera = () => {
    console.log(user.$id);
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
            <Pressable
              onPress={() =>
                pickImage(setImage, setJsonResult, user?.$id || "")
              }
              className="absolute bottom-32 left-8"
            >
              {<MaterialIcons name="photo-library" size={32} color="white" />}
            </Pressable>

            <Pressable
              onPress={() =>
                takePicture(ref, setUri, setJsonResult, user?.$id || "")
              }
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
    <SafeAreaView className="flex-1 bg-[#0d0d0d] items-center justify-center">
      {renderPicture(uri, image, setUri, setImage, setJsonResult, jsonResult) ||
        renderCamera()}
      {jsonResult && (
        <View className="absolute top-10 bg-[#0d0d0d] p-4 rounded-lg">
          <Text className="text-white font-nunitoBold">
            Latitude: {(jsonResult as any).latitude.toFixed(6)}
          </Text>
          <Text className="text-white font-nunitoBold">
            Longitude: {(jsonResult as any).longitude.toFixed(6)}
          </Text>
          <Text className="text-white font-nunitoBold">
            Data: {(jsonResult as any).dateTaken}
          </Text>
          <Text className="text-white font-nunitoBold">
            ID: {(jsonResult as any).userId}
          </Text>
        </View>
      )}
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
