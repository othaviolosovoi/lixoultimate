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
  latitude: number | null; // Allow null if location permission is denied
  longitude: number | null; // Allow null if location permission is denied
  dateTaken: string;
  userId: string;
}

/**
 * Captures a picture, displays it immediately, and processes its data in the background.
 */
export const takePicture = async (
  cameraRef: RefObject<CameraView>,
  setUri: (uri: string | null) => void,
  setJsonResult: (jsonResult: JsonResult | null) => void,
  userId: string
) => {
  try {
    // 1. Take the picture
    const photo = await cameraRef.current?.takePictureAsync();
    if (!photo?.uri) {
      throw new Error("Falha ao capturar a foto");
    }

    // 2. Immediately display the picture to the user
    setUri(photo.uri);
    // Initially, set jsonResult to null so the send button is disabled until data is ready
    setJsonResult(null);

    // 3. Process location and other data in the background
    (async () => {
      try {
        // Capture date taken and adjust to UTC-03:00 (Brazil, São Paulo)
        const now = new Date();
        const offsetMs = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
        const adjustedDate = new Date(now.getTime() - offsetMs);
        const dateTaken = `${adjustedDate.toISOString().slice(0, -1)}-03:00`;
        console.log("Data:", dateTaken);

        // Request location permissions
        console.log("Solicitando permissões de localização...");
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        let latitude: number | null = null;
        let longitude: number | null = null;
        
        if (status === "granted") {
          console.log("Obtendo localização atual...");
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          latitude = location.coords.latitude;
          longitude = location.coords.longitude;
          console.log("Localização coletada:", { latitude, longitude });
        } else {
          console.log("Permissão de localização negada");
          Alert.alert(
            "Aviso",
            "Permissão de localização negada. A foto será enviada sem georreferenciamento."
          );
        }

        // Convert photo to base64
        console.log("Convertendo foto para base64...");
        const fileInfo = await FileSystem.readAsStringAsync(photo.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        console.log("Base64 criada, tamanho:", fileInfo.length);

        // Create JSON object
        const jsonObject: JsonResult = {
          base64: fileInfo,
          latitude,
          longitude,
          dateTaken,
          userId,
        };
        console.log("JSON Object criado:", JSON.stringify(jsonObject, null, 2));

        // 4. Update state with the complete JSON object, enabling the send button
        setJsonResult(jsonObject);
      } catch (backgroundErr) {
        console.error("Erro no processamento em segundo plano:", backgroundErr);
        Alert.alert(
          "Erro",
          "Falha ao processar os dados da foto. Tente novamente."
        );
        // Clear the preview if background processing fails
        setUri(null);
        setJsonResult(null);
      }
    })();
  } catch (err) {
    console.error("takePicture falhou:", err);
    Alert.alert(
      "Erro",
      "Falha ao capturar a foto. Tente novamente."
    );
    setUri(null);
    setJsonResult(null);
  }
};

/**
 * Picks an image, displays it immediately, and processes its EXIF data in the background.
 */
export const pickImage = async (
  setImage: (image: string | null) => void,
  setJsonResult: (jsonResult: JsonResult | null) => void,
  userId: string
) => {
  console.log("Função pickImage iniciada");
  try {
    const res = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      copyToCacheDirectory: true,
    });

    if (res.canceled) {
      console.log("Document picker cancelado");
      return;
    }

    const pickedFile = res.assets[0];
    const fileUri = pickedFile.uri;

    // 1. Immediately display the selected image
    setImage(fileUri);
    // Reset jsonResult until processing is complete
    setJsonResult(null);

    // 2. Process EXIF data and create JSON in the background
    (async () => {
      try {
        const fileInfo = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const arrayBuffer = base64ToArrayBuffer(fileInfo);
        const parser = ExifParser.create(arrayBuffer);
        const result = parser.parse();
        const exif = result.tags;

        if (!exif) {
          throw new Error("Nenhum dado EXIF encontrado na imagem.");
        }

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

        if (
          GPSLatitude === undefined ||
          GPSLongitude === undefined ||
          GPSLatitudeRef === undefined ||
          GPSLongitudeRef === undefined
        ) {
          throw new Error("A imagem selecionada não possui dados de GPS.");
        }

        const latitude =
          GPSLatitudeRef === "S" ? -Math.abs(GPSLatitude) : Math.abs(GPSLatitude);
        const longitude =
          GPSLongitudeRef === "W"
            ? -Math.abs(GPSLongitude)
            : Math.abs(GPSLongitude);

        let dateTaken: string;
        if (typeof DateTimeOriginal === "number") {
          dateTaken = new Date(DateTimeOriginal * 1000).toISOString();
        } else if (typeof DateTimeOriginal === "string" || typeof DateTime === "string") {
          const exifDate = (DateTimeOriginal || DateTime) as string;
          dateTaken = exifDate.replace(/(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3");
        } else if (GPSDateStamp && Array.isArray(GPSTimeStamp)) {
          const [year, month, day] = (GPSDateStamp as string).split(":").map(Number);
          const [hour, minute, second] = GPSTimeStamp.map(Number);
          dateTaken = new Date(year, month - 1, day, hour, minute, second).toISOString();
        } else {
          throw new Error("A imagem selecionada não possui data EXIF válida.");
        }

        const jsonObject: JsonResult = {
          base64: fileInfo,
          latitude,
          longitude,
          dateTaken,
          userId,
        };
        
        console.log("Objeto JSON criado:", JSON.stringify(jsonObject, null, 2));
        
        // 3. Update state with the complete JSON object
        setJsonResult(jsonObject);
      } catch (backgroundErr: any) {
        console.error("pickImage falhou no processamento em segundo plano:", backgroundErr);
        Alert.alert("Erro", backgroundErr.message || "Falha ao processar a imagem. Tente novamente.");
        setImage(null);
        setJsonResult(null);
      }
    })();
  } catch (err) {
    console.error("pickImage falhou:", err);
    Alert.alert("Erro", "Falha ao selecionar a imagem. Tente novamente.");
    setImage(null);
    setJsonResult(null);
  }
};


export const renderPicture = (
  uri: string | null,
  image: string | null,
  setUri: (uri: string | null) => void,
  setImage: (image: string | null) => void,
  setJsonResult: (jsonResult: object | null) => void,
  jsonResult?: object | null
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
      jsonResult={jsonResult}
    />
  ) : null;
};

export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};
