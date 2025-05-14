import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import ExifParser from "exif-parser";
import { Alert } from "react-native";
import { CameraView } from "expo-camera";
import { RefObject } from "react";
import Preview from "@/app/(root)/preview";
import * as Location from "expo-location";

interface JsonResult {
  base64: string;
  latitude: number;
  longitude: number;
}

export const takePicture = async (
  cameraRef: RefObject<CameraView>,
  setUri: (uri: string | null) => void,
  setJsonResult: (jsonResult: JsonResult | null) => void
) => {
  try {
    const photo = await cameraRef.current?.takePictureAsync();
    if (!photo?.uri) {
      throw new Error("Failed to capture photo");
    }

    console.log("Requesting location permissions...");
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Location permission denied");
      Alert.alert(
        "Aviso",
        "Permissão de localização negada. Ative a localização para georreferenciar a foto."
      );
      setUri(null);
      setJsonResult(null);
      return;
    }

    console.log("Getting current location...");
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const { latitude, longitude } = location.coords;
    console.log("Location obtained:", { latitude, longitude });

    console.log("Converting photo to base64...");
    const fileInfo = await FileSystem.readAsStringAsync(photo.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log("Base64 created, length:", fileInfo.length);

    const jsonObject = {
      base64: fileInfo,
      latitude,
      longitude,
    };
    console.log("JSON Object:", JSON.stringify(jsonObject, null, 2));

    setUri(photo.uri);
    setJsonResult(jsonObject);
  } catch (err) {
    console.error("takePicture failed:", err);
    Alert.alert(
      "Erro",
      "Falha ao capturar a foto ou obter localização. Tente novamente."
    );
    setUri(null);
    setJsonResult(null);
  }
};

export const renderPicture = (
  uri: string | null,
  image: string | null,
  setUri: (uri: string | null) => void,
  setImage: (image: string | null) => void,
  setJsonResult: (jsonResult: JsonResult | null) => void
) => {
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

export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  try {
    console.log("Converting base64 to ArrayBuffer with atob...");
    const binaryString = atob(base64);
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

export const pickImage = async (
  setImage: (image: string | null) => void,
  setJsonResult: (jsonResult: JsonResult | null) => void
) => {
  console.log("pickImage function started");
  try {
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

    console.log("Reading file as base64...");
    const fileInfo = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log("File read as base64, length:", fileInfo.length);

    console.log("Converting base64 to ArrayBuffer...");
    const arrayBuffer = base64ToArrayBuffer(fileInfo);
    console.log("ArrayBuffer created, byteLength:", arrayBuffer.byteLength);

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
      Alert.alert("Erro", "Nenhum dado EXIF encontrado na imagem.");
      setImage(null);
      setJsonResult(null);
      return;
    }

    console.log("Extracting GPS data...");
    const { GPSLatitude, GPSLongitude, GPSLatitudeRef, GPSLongitudeRef } = exif;
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
      const latitude =
        GPSLatitudeRef === "S" ? -Math.abs(GPSLatitude) : Math.abs(GPSLatitude);
      const longitude =
        GPSLongitudeRef === "W"
          ? -Math.abs(GPSLongitude)
          : Math.abs(GPSLongitude);
      console.log("Parsed GPS Coordinates from exif-parser:", {
        latitude,
        longitude,
      });

      const jsonObject = {
        base64: fileInfo,
        latitude,
        longitude,
      };
      console.log("JSON Object:", JSON.stringify(jsonObject, null, 2));

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
