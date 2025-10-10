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
  latitude: number | null;
  longitude: number | null;
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
    const photo = await cameraRef.current?.takePictureAsync();
    if (!photo?.uri) {
      throw new Error("Falha ao capturar a foto");
    }

    setUri(photo.uri);
    setJsonResult(null);

    (async () => {
      try {
        const now = new Date();
        const offsetMs = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
        const adjustedDate = new Date(now.getTime() - offsetMs);
        const dateTaken = `${adjustedDate.toISOString().slice(0, -1)}-03:00`;

        // Check current permission status without requesting again
        const { status } = await Location.getForegroundPermissionsAsync();

        let latitude: number | null = null;
        let longitude: number | null = null;

        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          latitude = location.coords.latitude;
          longitude = location.coords.longitude;
        } else {
          // Permissions should have been granted upfront, but if not, use null values
          console.warn(
            "Location permission not granted. Photo will be sent without geolocation."
          );
        }

        const fileInfo = await FileSystem.readAsStringAsync(photo.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const jsonObject: JsonResult = {
          base64: fileInfo,
          latitude,
          longitude,
          dateTaken,
          userId,
        };

        setJsonResult(jsonObject);
      } catch (backgroundErr) {
        console.error("Erro no processamento em segundo plano:", backgroundErr);
        Alert.alert(
          "Erro",
          "Falha ao processar os dados da foto. Tente novamente."
        );
        setUri(null);
        setJsonResult(null);
      }
    })();
  } catch (err) {
    console.error("takePicture falhou:", err);
    Alert.alert("Erro", "Falha ao capturar a foto. Tente novamente.");
    setUri(null);
    setJsonResult(null);
  }
};

export const pickImage = async (
  setImage: (image: string | null) => void,
  setJsonResult: (jsonResult: JsonResult | null) => void,
  userId: string
) => {
  try {
    const res = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      copyToCacheDirectory: true,
    });

    if (res.canceled) {
      return;
    }

    const pickedFile = res.assets[0];
    const fileUri = pickedFile.uri;

    setImage(fileUri);
    setJsonResult(null);

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
          Alert.alert(
            "Dados EXIF Ausentes",
            "A imagem selecionada não possui metadados. Por favor, escolha uma foto original da câmera."
          );
          setImage(null);
          setJsonResult(null);
          return;
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
          Alert.alert(
            "Localização Ausente",
            "A imagem selecionada não possui informações de GPS. Por favor, escolha uma foto tirada com localização ativada."
          );
          setImage(null);
          setJsonResult(null);
          return;
        }

        const latitude =
          GPSLatitudeRef === "S"
            ? -Math.abs(GPSLatitude)
            : Math.abs(GPSLatitude);
        const longitude =
          GPSLongitudeRef === "W"
            ? -Math.abs(GPSLongitude)
            : Math.abs(GPSLongitude);

        let dateTaken: string;
        if (typeof DateTimeOriginal === "number") {
          dateTaken = new Date(DateTimeOriginal * 1000).toISOString();
        } else if (
          typeof DateTimeOriginal === "string" ||
          typeof DateTime === "string"
        ) {
          const exifDate = (DateTimeOriginal || DateTime) as string;
          dateTaken = exifDate.replace(/(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3");
        } else if (GPSDateStamp && Array.isArray(GPSTimeStamp)) {
          const [year, month, day] = (GPSDateStamp as string)
            .split(":")
            .map(Number);
          const [hour, minute, second] = GPSTimeStamp.map(Number);
          dateTaken = new Date(
            year,
            month - 1,
            day,
            hour,
            minute,
            second
          ).toISOString();
        } else {
          Alert.alert(
            "Data Ausente",
            "A imagem selecionada não possui informações de data. Por favor, escolha outra foto."
          );
          setImage(null);
          setJsonResult(null);
          return;
        }

        const jsonObject: JsonResult = {
          base64: fileInfo,
          latitude,
          longitude,
          dateTaken,
          userId,
        };

        setJsonResult(jsonObject);
      } catch (backgroundErr: any) {
        console.error(
          "pickImage falhou no processamento em segundo plano:",
          backgroundErr
        );
        Alert.alert(
          "Erro ao Processar Imagem",
          "Não foi possível processar a imagem selecionada. Tente escolher outra foto."
        );
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
