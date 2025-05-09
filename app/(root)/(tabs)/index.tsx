import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";

import "../../globals.css";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import Preview from "../preview";

import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

import { useAuth } from "../../../context/AuthContext";
import { Redirect, router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Header from "../../components/header";
import Permission from "../../components/permission";

export default function Index() {
  const { user, session, signout, loading } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

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

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    setUri(photo?.uri ?? null);
  };

  const renderPicture = () => {
    const source = uri || image;
    return source ? (
      <Preview
        uri={source}
        onReset={() => {
          setUri(null);
          setImage(null);
        }}
      />
    ) : null;
  };

  const pickImage = async () => {
    // Request permission to access media library
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permission to access media library denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      exif: true, // Still needed for assetId
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const pickedImage = result.assets[0];
      console.log(result.assets);
      setImage(pickedImage.uri);

      // Try to get full EXIF data from MediaLibrary
      if (pickedImage.assetId) {
        try {
          const assetInfo = await MediaLibrary.getAssetInfoAsync(
            pickedImage.assetId
          );
          const fullExif = assetInfo.exif as {
            GPSLatitude?: number;
            GPSLongitude?: number;
          };
          console.log("Full EXIF from MediaLibrary:", fullExif);

          if (
            fullExif?.GPSLatitude !== undefined &&
            fullExif?.GPSLongitude !== undefined
          ) {
            console.log("✅ GPS Data Found:");
            console.log("Latitude:", fullExif.GPSLatitude);
            console.log("Longitude:", fullExif.GPSLongitude);
          } else {
            console.log("⚠️ No GPS data found in EXIF.");
          }
        } catch (err) {
          console.error("Error fetching EXIF from MediaLibrary:", err);
        }
      } else {
        console.warn("No assetId found, cannot fetch EXIF from MediaLibrary.");
      }
    } else {
      console.log("Image picker canceled or no assets found.");
    }
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
            <Pressable
              onPress={pickImage}
              className="absolute bottom-32 left-8"
            >
              {<MaterialIcons name="photo-library" size={32} color="white" />}
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
      {uri || image ? renderPicture() : renderCamera()}
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
