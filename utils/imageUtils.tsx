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
    // Take the picture
    const photo = await cameraRef.current?.takePictureAsync();
    if (!photo?.uri) {
      throw new Error("Falha ao capturar a foto");
    }

    // Capture date taken and adjust to UTC-03:00 (Brazil, São Paulo)
    const now = new Date();
    const offsetMs = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    const adjustedDate = new Date(now.getTime() - offsetMs);
    const dateTaken = `${adjustedDate.toISOString().slice(0, -1)}-03:00`;
    console.log("Data:", dateTaken);

    // Request location permissions
    console.log("Solicitando permissões de localizzação...");
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permissão de localização negada");
      Alert.alert(
        "Aviso",
        "Permissão de localização negada. Ative a localização para georreferenciar a foto."
      );
      setUri(null);
      setJsonResult(null);
      return;
    }

    // Get current location
    console.log("Obtendo localização atual...");
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const { latitude, longitude } = location.coords;
    console.log("Localização coletada:", { latitude, longitude });

    // Convert photo to base64
    console.log("Convertendo foto para base64...");
    const fileInfo = await FileSystem.readAsStringAsync(photo.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log("Base64 criada, tamanho:", fileInfo.length);

    // Create JSON object
    const jsonObject = {
      base64: fileInfo,
      latitude,
      longitude,
      dateTaken,
      userId,
    };
    console.log("JSON Object:", JSON.stringify(jsonObject, null, 2));
    console.log("Base64, tamanho:", fileInfo.length);

    // Set states
    setUri(photo.uri);
    setJsonResult(jsonObject);
  } catch (err) {
    console.error("takePicture falhou:", err);
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
    console.log("Convertendo base64 para ArrayBuffer com atob...");
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    console.log("ArrayBuffer criado, byteLength:", bytes.buffer.byteLength);
    return bytes.buffer;
  } catch (error) {
    console.error("base64ToArrayBuffer falhou:", error);
    throw error;
  }
};

export const pickImage = async (
  setImage: (image: string | null) => void,
  setJsonResult: (jsonResult: JsonResult | null) => void,
  userId: string
) => {
  console.log("Função pickImage iniciada");
  try {
    // Request document picker permissions
    console.log("Abrindo document picker...");
    const res = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      copyToCacheDirectory: true,
    });
    console.log("Resposta document picker:", JSON.stringify(res, null, 2));

    if (res.canceled) {
      console.log("Document picker cancelado");
      return;
    }

    const pickedFile = res.assets[0];
    const fileUri = pickedFile.uri;
    console.log("Arquivo escolhido:", {
      uri: fileUri,
      name: pickedFile.name,
      mimeType: pickedFile.mimeType,
    });

    if (!pickedFile) {
      console.log("Nenhum arquivo escolhido");
      return;
    }

    // Read file as base64
    console.log("Lendo arquivo como base64...");
    const fileInfo = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log("Arquivo lido como base64, tamanho:", fileInfo.length);

    // Convert base64 to ArrayBuffer
    console.log("Convertendo base64 para ArrayBuffer...");
    const arrayBuffer = base64ToArrayBuffer(fileInfo);
    console.log("ArrayBuffer criado, byteLength:", arrayBuffer.byteLength);

    // Parse EXIF data
    console.log("Analisando dados EXIF...");
    const parser = ExifParser.create(arrayBuffer);
    const result = parser.parse();
    console.log("Dados EXIF analisados:", JSON.stringify(result, null, 2));

    const exif = result.tags;
    if (!exif) {
      console.error("Nenhum dado EXIF encontrado");
      Alert.alert("Erro", "Nenhum dado EXIF encontrado na imagem.");
      setImage(null);
      setJsonResult(null);
      return;
    }

    // Extract GPS and date data
    console.log("Extraindo dados GPS e data...");
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
    console.log("Dados EXIF puros:", {
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
        throw new Error("Timestamp EXIF inválido");
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
        dateTaken = `${formattedDate}`;
        if (isNaN(Date.parse(dateTaken))) {
          throw new Error("Formato de data EXIF inválido");
        }
      } catch (error) {
        throw new Error("String de data EXIF inválido");
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
          throw new Error("date/time GPS inválido");
        }
      } catch (error) {
        throw new Error("Formato date/time GPS date/time format");
      }
    } else {
      console.log("Data EXIF não encontrada na imagem.");
      Alert.alert("Aviso", "A imagem selecionada não possui data EXIF válida.");
      setImage(null);
      setJsonResult(null);
      return;
    }
    console.log("Dados EXIF analisados:", { latitude, longitude, dateTaken });

    // Create JSON object
    const jsonObject = {
      base64: fileInfo,
      latitude,
      longitude,
      dateTaken,
      userId,
    };
    console.log("Objeto JSON:", JSON.stringify(jsonObject, null, 2));
    console.log("Base64, tamanho:", fileInfo.length);

    // Set image and JSON result
    setImage(fileUri);
    setJsonResult(jsonObject);
  } catch (err) {
    console.error("pickImage falhou:", err);
    Alert.alert("Erro", "Falha ao processar a imagem. Tente novamente.");
    setImage(null);
    setJsonResult(null);
  }
};
