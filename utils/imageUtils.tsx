import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import ExifParser from "exif-parser";
import { Alert } from "react-native";
import { CameraView } from "expo-camera";
import { RefObject } from "react";
import Preview from "@/app/(root)/preview";
import * as Location from "expo-location";
import { useAuth } from "../context/AuthContext";

interface JsonResult {
  base64: string;
  latitude: number;
  longitude: number;
  dateTaken: string;
  userId: string;
}

export const takePicture = async (
  cameraRef: RefObject<CameraView>,
  setUri: (uri: string | null) => void,
  setJsonResult: (jsonResult: JsonResult | null) => void,
  userId: string
) => {
  try {
    // Validate userId
    if (!userId) {
      console.error("User ID is required");
      Alert.alert(
        "Erro",
        "Usuário não autenticado. Faça login para continuar."
      );
      setUri(null);
      setJsonResult(null);
      return;
    }

    // Take the picture
    const photo = await cameraRef.current?.takePictureAsync();
    if (!photo?.uri) {
      throw new Error("Failed to capture photo");
    }

    // Capture date taken and adjust to UTC-03:00 (Brazil, São Paulo)
    const now = new Date();
    const offsetMs = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    const adjustedDate = new Date(now.getTime() - offsetMs);
    const dateTaken = `${adjustedDate.toISOString().slice(0, -1)}-03:00`;
    if (__DEV__) console.log("Date taken:", dateTaken);

    // Request location permissions
    if (__DEV__) console.log("Requesting location permissions...");
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

    // Get current location
    if (__DEV__) console.log("Getting current location...");
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const { latitude, longitude } = location.coords;
    if (__DEV__) console.log("Location obtained:", { latitude, longitude });

    // Convert photo to base64
    if (__DEV__) console.log("Converting photo to base64...");
    const fileInfo = await FileSystem.readAsStringAsync(photo.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    if (__DEV__) console.log("Base64 created, length:", fileInfo.length);

    // Create JSON object
    const jsonObject = {
      base64: fileInfo,
      latitude,
      longitude,
      dateTaken,
      userId,
    };
    if (__DEV__)
      console.log("JSON Object:", JSON.stringify(jsonObject, null, 2));

    // Set states
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
  setJsonResult: (jsonResult: JsonResult | null) => void,
  userId: string
) => {
  if (__DEV__) console.log("pickImage function started");
  try {
    // Validate userId
    if (!userId) {
      console.error("User ID is required");
      Alert.alert(
        "Erro",
        "Usuário não autenticado. Faça login para continuar."
      );
      setImage(null);
      setJsonResult(null);
      return;
    }

    // Request document picker permissions
    if (__DEV__) console.log("Opening document picker...");
    const res = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      copyToCacheDirectory: true,
    });
    if (__DEV__)
      console.log("Document picker response:", JSON.stringify(res, null, 2));

    if (res.canceled) {
      if (__DEV__) console.log("Document picker canceled");
      return;
    }

    const pickedFile = res.assets[0];
    const fileUri = pickedFile.uri;
    if (__DEV__)
      console.log("Picked file:", {
        uri: fileUri,
        name: pickedFile.name,
        mimeType: pickedFile.mimeType,
      });

    if (!pickedFile) {
      if (__DEV__) console.log("No file selected");
      return;
    }

    // Read file as base64
    if (__DEV__) console.log("Reading file as base64...");
    const fileInfo = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    if (__DEV__) console.log("File read as base64, length:", fileInfo.length);

    // Convert base64 to ArrayBuffer
    if (__DEV__) console.log("Converting base64 to ArrayBuffer...");
    const arrayBuffer = base64ToArrayBuffer(fileInfo);
    if (__DEV__)
      console.log("ArrayBuffer created, byteLength:", arrayBuffer.byteLength);

    // Parse EXIF data
    if (__DEV__) console.log("Parsing EXIF data...");
    const parser = ExifParser.create(arrayBuffer);
    const result = parser.parse();
    if (__DEV__)
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

    // Extract GPS and date data
    if (__DEV__) console.log("Extracting GPS and date data...");
    const {
      GPSLatitude,
      GPSLongitude,
      GPSLatitudeRef,
      GPSLongitudeRef,
      DateTimeOriginal,
      DateTime,
      GPSDateStamp,
      GPSTimeStamp,
    } = exif;
    if (__DEV__)
      console.log("Raw EXIF data:", {
        GPSLatitude,
        GPSLongitude,
        GPSLatitudeRef,
        GPSLongitudeRef,
        DateTimeOriginal,
        DateTime,
        GPSDateStamp,
        GPSTimeStamp,
      });

    if (
      GPSLatitude === undefined ||
      GPSLongitude === undefined ||
      GPSLatitudeRef === undefined ||
      GPSLongitudeRef === undefined
    ) {
      console.log("Dados GPS não encontrados na imagem.");
      Alert.alert(
        "Aviso",
        "A imagem selecionada não possui dados de GPS, ative esta funcionalidade na câmera do seu dispositivo."
      );
      setImage(null);
      setJsonResult(null);
      return;
    }

    // Adjust GPS coordinates
    const latitude =
      GPSLatitudeRef === "S" ? -Math.abs(GPSLatitude) : Math.abs(GPSLatitude);
    const longitude =
      GPSLongitudeRef === "W"
        ? -Math.abs(GPSLongitude)
        : Math.abs(GPSLongitude);

    // Parse EXIF date
    let dateTaken: string;
    if (typeof DateTimeOriginal === "number") {
      // Handle Unix timestamp
      const date = new Date(DateTimeOriginal * 1000);
      dateTaken = date.toISOString();
      if (isNaN(Date.parse(dateTaken))) {
        throw new Error("Invalid EXIF timestamp");
      }
    } else if (
      typeof DateTimeOriginal === "string" ||
      typeof DateTime === "string"
    ) {
      // Handle string format (YYYY:MM:DD HH:MM:SS)
      const exifDate = DateTimeOriginal || DateTime;
      try {
        const formattedDate = exifDate.replace(
          /(\d{4}):(\d{2}):(\d{2})/,
          "$1-$2-$3"
        );
        dateTaken = `${formattedDate}Z`;
        if (isNaN(Date.parse(dateTaken))) {
          throw new Error("Invalid EXIF date format");
        }
      } catch (error) {
        throw new Error("Invalid EXIF date string");
      }
    } else if (
      GPSDateStamp &&
      Array.isArray(GPSTimeStamp) &&
      GPSTimeStamp.length === 3
    ) {
      // Fallback to GPSDateStamp + GPSTimeStamp
      try {
        const [year, month, day] = GPSDateStamp.split(":").map(Number);
        const [hour, minute, second] = GPSTimeStamp.map(Number);
        const date = new Date(year, month - 1, day, hour, minute, second);
        dateTaken = date.toISOString();
        if (isNaN(Date.parse(dateTaken))) {
          throw new Error("Invalid GPS date/time");
        }
      } catch (error) {
        throw new Error("Invalid GPS date/time format");
      }
    } else {
      console.log("Data EXIF não encontrada na imagem.");
      Alert.alert("Aviso", "A imagem selecionada não possui data EXIF válida.");
      setImage(null);
      setJsonResult(null);
      return;
    }
    if (__DEV__)
      console.log("Parsed EXIF data:", { latitude, longitude, dateTaken });

    // Create JSON object
    const jsonObject = {
      base64: fileInfo,
      latitude,
      longitude,
      dateTaken,
      userId,
    };
    if (__DEV__)
      console.log("JSON Object:", JSON.stringify(jsonObject, null, 2));

    // Set image and JSON result
    setImage(fileUri);
    setJsonResult(jsonObject);
  } catch (err) {
    console.error("pickImage failed:", err);
    Alert.alert("Erro", "Falha ao processar a imagem. Tente novamente.");
    setImage(null);
    setJsonResult(null);
  }
};
