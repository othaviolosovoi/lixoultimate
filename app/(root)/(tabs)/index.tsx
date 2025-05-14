import "../../globals.css";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import Preview from "../preview";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import ExifParser from "exif-parser";
import { useAuth } from "../../../context/AuthContext";
import { Redirect, router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Header from "../../components/header";
import Permission from "../../components/permission";

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
          setJsonResult(null);
        }}
      />
    ) : null;
  };

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    try {
      console.log("Converting base64 to ArrayBuffer with atob...");
      const binaryString = atob(base64);
      console.log("Binary string created, length:", binaryString.length);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      console.log("ArrayBuffer created, byteLength:", bytes.buffer.byteLength);
      return bytes.buffer;
    } catch (error) {
      console.error("base64ToArrayBuffer failed:", error);
      throw error;
    }
  };

  const pickImage = async () => {
    console.log("pickImage function started");
    try {
      // Request document picker permissions
      console.log("Opening document picker...");
      const res = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });
      console.log("Document picker response:", JSON.stringify(res, null, 2));

      if (res.canceled) {
        console.log("Document picker canceled");
        return;
      }

      const pickedFile = res.assets[0];
      const fileUri = pickedFile.uri;
      console.log("Picked file:", {
        uri: fileUri,
        name: pickedFile.name,
        mimeType: pickedFile.mimeType,
      });

      if (!pickedFile) {
        console.log("No file selected");
        return;
      }

      // Read file as base64
      console.log("Reading file as base64...");
      const fileInfo = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log("File read as base64, length:", fileInfo.length);

      // Convert base64 to ArrayBuffer
      console.log("Converting base64 to ArrayBuffer...");
      const arrayBuffer = base64ToArrayBuffer(fileInfo);
      console.log("ArrayBuffer created, byteLength:", arrayBuffer.byteLength);

      // Parse EXIF data
      console.log("Parsing EXIF data...");
      const parser = ExifParser.create(arrayBuffer);
      const result = parser.parse();
      console.log(
        "EXIF Result from exif-parser:",
        JSON.stringify(result, null, 2)
      );

      const exif = result.tags;
      if (!exif) {
        console.error("No EXIF data found");
        Alert.alert("Error", "No EXIF data found in the image.");
        setImage(null);
        setJsonResult(null);
        return;
      }

      // Extract GPS data
      console.log("Extracting GPS data...");
      const { GPSLatitude, GPSLongitude, GPSLatitudeRef, GPSLongitudeRef } =
        exif;
      console.log("Raw GPS data:", {
        GPSLatitude,
        GPSLongitude,
        GPSLatitudeRef,
        GPSLongitudeRef,
      });

      if (
        GPSLatitude !== undefined &&
        GPSLongitude !== undefined &&
        GPSLatitudeRef &&
        GPSLongitudeRef
      ) {
        // Adjust coordinates
        const latitude =
          GPSLatitudeRef === "S"
            ? -Math.abs(GPSLatitude)
            : Math.abs(GPSLatitude);
        const longitude =
          GPSLongitudeRef === "W"
            ? -Math.abs(GPSLongitude)
            : Math.abs(GPSLongitude);
        console.log("Parsed GPS Coordinates from exif-parser:", {
          latitude,
          longitude,
        });

        // Create JSON object
        const jsonObject = {
          base64: fileInfo,
          latitude,
          longitude,
        };
        console.log("JSON Object:", JSON.stringify(jsonObject, null, 2));

        // Set image and JSON result only if GPS data is valid
        setImage(fileUri);
        setJsonResult(jsonObject);
      } else {
        console.log("Dados GPS não encontrados na imagem.");
        Alert.alert(
          "Aviso",
          "A imagem selecionada não possui dados de GPS, ative esta funcionalidade na câmera do seu dispositivo."
        );
        setImage(null);
        setJsonResult(null);
      }
    } catch (err) {
      console.error("pickImage failed:", err);
      Alert.alert("Erro", "Falha ao processar a imagem. Tente novamente.");
      setImage(null);
      setJsonResult(null);
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
    <SafeAreaView className="flex-1 bg-[#0d0d0d] items-center justify-center">
      {uri || image ? renderPicture() : renderCamera()}
      {jsonResult && (
        <View className="absolute top-10 bg-[#0d0d0d] p-4 rounded-lg">
          <Text className="text-white font-nunitoBold">
            Latitude: {(jsonResult as any).latitude.toFixed(6)}
          </Text>
          <Text className="text-white font-nunitoBold">
            Longitude: {(jsonResult as any).longitude.toFixed(6)}
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
