import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
} from "react-native";
import * as Location from "expo-location";
import { WasteDetectionData } from "@/types/user_waste_images";
import Svg, { Polygon, ClipPath, Rect, G } from "react-native-svg";

export interface LixoItemProps {
  itemData: WasteDetectionData;
}

const formatModalDateTime = (isoDateString?: string): string => {
  if (!isoDateString) return "Data indisponível";
  try {
    const dateObj = new Date(isoDateString);
    const date = dateObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    return `${date} - ${hours}:${minutes}`;
  } catch (e) {
    console.error("Error formatting modal date/time:", e);
    return "Data inválida";
  }
};

const formatDate = (isoDateString?: string): string => {
  if (!isoDateString) return "Data indisponível";
  try {
    const dateObj = new Date(isoDateString);
    return dateObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Data inválida";
  }
};

async function getAddressFromCoordinates(
  latitude?: number,
  longitude?: number
): Promise<{ cardAddress: string; modalAddress: string }> {
  const fallback = {
    cardAddress: "Endereço não encontrado",
    modalAddress: "Endereço não encontrado",
  };

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return {
      cardAddress: "Coordenadas inválidas",
      modalAddress: "Coordenadas inválidas",
    };
  }

  try {
    const addresses = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (addresses && addresses.length > 0) {
      const address = addresses[0];

      const cardAddress = [
        address.street,
        address.streetNumber,
        address.subregion,
      ]
        .filter(Boolean)
        .join(", ");

      const modalAddress =
        [address.street, address.streetNumber].filter(Boolean).join(", ") +
        (address.district ? ` - ${address.district}` : "");

      return { cardAddress, modalAddress };
    } else {
      return fallback;
    }
  } catch (error) {
    console.error("Erro ao buscar endereço:", error);
    return {
      cardAddress: "Não foi possível buscar o endereço",
      modalAddress: "Não foi possível buscar o endereço",
    };
  }
}

const STATUS_COLORS = {
  Coletado: {
    color: "#45BF55",
    simbolo: require("../../assets/images/ok_circle.png"),
    avisoStatus: "Coleta realizada com sucesso!",
  },
  "A coletar": {
    color: "#DBF227",
    simbolo: require("../../assets/images/pending_circle.png"),
    avisoStatus: "Aguardando a coleta dos resíduos",
  },
  Recusada: {
    color: "#F22742",
    simbolo: require("../../assets/images/x_circle.png"),
    avisoStatus: "A imagem não possui resíduos.",
  },
  default: {
    color: "#A6A6A6",
    simbolo: require("../../assets/images/processing_circle.png"),
    avisoStatus: "Status desconhecido...",
  },
};

const MATERIAL_ICONS: { [key: string]: string } = {
  papel: "🔵",     // Azul - #4A90E2
  plastico: "🔴",  // Vermelho - #D0021B
  vidro: "🟢",     // Verde - #7ED321
  metal: "🟡",     // Laranja - #F5A623
};

function isNewFormat(detectionPoints: any): boolean {
  return (
    detectionPoints &&
    typeof detectionPoints === "object" &&
    !Array.isArray(detectionPoints) &&
    "lixo_detections" in detectionPoints &&
    "class_counts" in detectionPoints
  );
}

function getAllContours(
  detectionPoints: any
): Array<{ contour: number[][]; className: string; color: string }> {
  if (!detectionPoints) return [];

  if (isNewFormat(detectionPoints)) {
    const contours: Array<{
      contour: number[][];
      className: string;
      color: string;
    }> = [];

    detectionPoints.lixo_detections.forEach((lixoDetection: any) => {
      const hasSubClasses = lixoDetection.sub_classes && lixoDetection.sub_classes.length > 0;
      
      // Só adiciona o contorno "lixo" se NÃO houver subclasses
      if (lixoDetection.lixo_contour && !hasSubClasses) {
        contours.push({
          contour: lixoDetection.lixo_contour,
          className: "lixo",
          color: "#8a13cfff",
        });
      }

      // Adiciona os contornos das subclasses quando existirem
      if (hasSubClasses) {
        lixoDetection.sub_classes.forEach((subClass: any) => {
          const colorMap: { [key: string]: string } = {
            papel: "#4A90E2",
            plastico: "#D0021B",
            vidro: "#7ED321",
            metal: "#f5e023ff",
            
          };

          contours.push({
            contour: subClass.contour,
            className: subClass.class_name,
            color: colorMap[subClass.class_name] || "#FFFFFF",
          });
        });
      }
    });

    return contours;
  }

  if (Array.isArray(detectionPoints)) {
    return detectionPoints.map((detection: any) => ({
      contour: detection.contour_normalized,
      className: detection.class_name || "lixo",
      color: "#45BF55",
    }));
  }

  return [];
}

function getClassCounts(detectionPoints: any) {
  const defaultCounts = { papel: 0, plastico: 0, vidro: 0, metal: 0 };
  
  if (isNewFormat(detectionPoints) && detectionPoints.class_counts) {
    // Start with default counts and override with actual values
    const result = { ...defaultCounts };
    
    // Only update counts that exist in class_counts
    Object.keys(defaultCounts).forEach((material) => {
      if (material in detectionPoints.class_counts) {
        result[material as keyof typeof defaultCounts] = detectionPoints.class_counts[material];
      }
    });
    
    return result;
  }
  return defaultCounts;
}

export default function LixoItem({ itemData }: LixoItemProps) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [zoomModalVisible, setZoomModalVisible] = useState(false);

  const [cardAddress, setCardAddress] = useState("Buscando endereço...");
  const [modalAddress, setModalAddress] = useState("Buscando endereço...");

  const [containerLayout, setContainerLayout] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [zoomContainerLayout, setZoomContainerLayout] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);

  const isNewFormatDetection = useMemo(
    () => isNewFormat(itemData.detection_points),
    [itemData.detection_points]
  );

  const classCounts = useMemo(
    () => getClassCounts(itemData.detection_points),
    [itemData.detection_points]
  );

  // Debug: Log classCounts to verify all materials are present
  useEffect(() => {
    console.log('ClassCounts:', classCounts);
    console.log('ClassCounts keys:', Object.keys(classCounts));
  }, [classCounts]);

  const allContours = useMemo(
    () => getAllContours(itemData.detection_points),
    [itemData.detection_points]
  );

  useEffect(() => {
    if (itemData && itemData.latitude != null && itemData.longitude != null) {
      getAddressFromCoordinates(itemData.latitude, itemData.longitude).then(
        (addresses) => {
          setCardAddress(addresses.cardAddress);
          setModalAddress(addresses.modalAddress);
        }
      );
    }

    if (itemData.base64) {
      const uri = `data:image/jpeg;base64,${itemData.base64}`;
      Image.getSize(
        uri,
        (width, height) => {
          if (height > 0) setImageAspectRatio(width / height);
        },
        () => setImageAspectRatio(1)
      );
    }
  }, [itemData]);

  if (!itemData) {
    return (
      <View className="h-[80px] justify-center items-center p-3 bg-gray-700 rounded-md my-1 w-full">
        <Text className="text-gray-400 text-sm">
          Dados da detecção indisponíveis.
        </Text>
      </View>
    );
  }

  const finalImageDimensions = useMemo(() => {
    if (!containerLayout || !imageAspectRatio)
      return { x: 0, y: 0, width: 0, height: 0 };
    const containerRatio = containerLayout.width / containerLayout.height;
    if (containerRatio > imageAspectRatio) {
      const height = containerLayout.height;
      const width = height * imageAspectRatio;
      return { x: (containerLayout.width - width) / 2, y: 0, width, height };
    } else {
      const width = containerLayout.width;
      const height = width / imageAspectRatio;
      return { x: 0, y: (containerLayout.height - height) / 2, width, height };
    }
  }, [containerLayout, imageAspectRatio]);

  const finalZoomedImageDimensions = useMemo(() => {
    if (!zoomContainerLayout || !imageAspectRatio)
      return { x: 0, y: 0, width: 0, height: 0 };
    const containerRatio =
      zoomContainerLayout.width / zoomContainerLayout.height;
    if (containerRatio > imageAspectRatio) {
      const height = zoomContainerLayout.height;
      const width = height * imageAspectRatio;
      return {
        x: (zoomContainerLayout.width - width) / 2,
        y: 0,
        width,
        height,
      };
    } else {
      const width = zoomContainerLayout.width;
      const height = width / imageAspectRatio;
      return {
        x: 0,
        y: (zoomContainerLayout.height - height) / 2,
        width,
        height,
      };
    }
  }, [zoomContainerLayout, imageAspectRatio]);

  const transformPoints = useCallback(
    (
      points: number[][],
      layout: { width: number; height: number; x: number; y: number }
    ) =>
      points
        .map(
          (point) =>
            `${point[0] * layout.width + layout.x},${
              point[1] * layout.height + layout.y
            }`
        )
        .join(" "),
    []
  );

  const statusConfig =
    STATUS_COLORS[itemData.status as keyof typeof STATUS_COLORS] ||
    STATUS_COLORS.default;
  const { color, simbolo, avisoStatus } = statusConfig;

  const cardDate = formatDate(itemData.date_taken);
  const modalDateTime = formatModalDateTime(itemData.date_taken);

  const hasMaterials = Object.values(classCounts).some(
    (count) => (count as number) > 0
  );

  return (
    <View className="mb-3">
      <TouchableOpacity onPress={() => setMostrarModal(true)}>
        <View className="w-full rounded-md bg-[#262626] flex flex-row justify-between px-3 py-2">
          {itemData.base64 ? (
            <View className="justify-center mr-2">
              <Image
                className="rounded-sm bg-white w-16 h-16 object-cover"
                source={{ uri: `data:image/jpeg;base64,${itemData.base64}` }}
              />
            </View>
          ) : (
            <View className="w-16 h-16 mr-2 bg-gray-500 rounded-sm" />
          )}
          <View className="flex-1 pt-1 pb-1">
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontFamily: "Nunito-Bold",
              }}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              Foto #{itemData.id.substring(0, 8)}...
            </Text>
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 14,
                fontFamily: "Nunito-Regular",
                marginVertical: 1,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {cardAddress}
            </Text>
            <Text
              style={{
                color: "#A6A6A6",
                fontSize: 12,
                fontFamily: "Nunito-Medium",
              }}
            >
              {cardDate}
            </Text>
          </View>
          <View className="w-20 justify-center items-center pl-1">
            <Image
              alt="Ícone Status"
              className="w-[24px] h-[24px] object-cover mb-1"
              source={simbolo}
            />
            <Text
              style={{ color, fontSize: 12, fontFamily: "Nunito-Bold" }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {itemData.status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        visible={mostrarModal}
        transparent
        animationType="fade"
        onRequestClose={() => setMostrarModal(false)}
      >
        <View className="flex-1 bg-black/80 flex justify-center items-center">
          <View className="m-5 bg-[#262626] rounded-md w-[90%] max-w-md shadow-lg shadow-black/25">
            <View className="flex flex-row justify-between items-center px-5 pt-4 pb-2.5">
              <Text className="text-white text-lg font-bold font-nunitoBold">
                Foto #{itemData.id.substring(0, 5)}
              </Text>
              <TouchableOpacity
                className="p-2"
                onPress={() => setMostrarModal(false)}
              >
                <Image
                  source={require("../../assets/images/X.png")}
                  style={{ width: 14, height: 14 }}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setZoomModalVisible(true)}
            >
              <View
                className="h-48 mx-5 flex justify-center items-center"
                onLayout={(event) => {
                  const { width, height } = event.nativeEvent.layout;
                  if (width > 0 && height > 0)
                    setContainerLayout({ width, height });
                }}
              >
                {itemData.base64 && (
                  <Image
                    style={{ width: "100%", height: "100%", borderRadius: 8 }}
                    source={{
                      uri: `data:image/jpeg;base64,${itemData.base64}`,
                    }}
                    resizeMode="contain"
                  />
                )}
                {containerLayout &&
                  imageAspectRatio &&
                  allContours.length > 0 && (
                    <Svg
                      height="100%"
                      width="100%"
                      style={StyleSheet.absoluteFill}
                    >
                      <ClipPath id="clip">
                        <Rect
                          x={finalImageDimensions.x}
                          y={finalImageDimensions.y}
                          width={finalImageDimensions.width}
                          height={finalImageDimensions.height}
                        />
                      </ClipPath>
                      <G clipPath="url(#clip)">
                        {allContours.map((contourData, index) => (
                          <Polygon
                            key={index}
                            points={transformPoints(
                              contourData.contour,
                              finalImageDimensions
                            )}
                            fill={`${contourData.color}33`}
                            stroke={contourData.color}
                            strokeWidth="2"
                          />
                        ))}
                      </G>
                    </Svg>
                  )}
              </View>
            </TouchableOpacity>

            <View className="bg-[#404040] px-5 py-4 mt-4 rounded-md">
              <View className="mb-3">
                <Text className="text-[#D0D0D0] text-sm font-bold font-nunito mb-0.5">
                  Endereço
                </Text>
                <Text className="text-white text-base font-nunito">
                  {modalAddress}
                </Text>
              </View>
              <View className="mb-3">
                <Text className="text-[#D0D0D0] text-sm font-bold font-nunito mb-0.5">
                  Data
                </Text>
                <Text className="text-white text-base font-nunito">
                  {modalDateTime}
                </Text>
              </View>
              <View className="mb-3">
                <Text className="text-[#D0D0D0] text-sm font-nunito font-bold mb-0.5">
                  Status
                </Text>
                <Text
                  className="text-base font-nunito font-bold"
                  style={{ color: color }}
                >
                  {avisoStatus}
                </Text>
              </View>

              {/* Show material breakdown for new format detections */}
              {isNewFormatDetection && hasMaterials && (
                <View className="mb-3 pt-3 border-t border-[#555555]">
                  <Text className="text-[#D0D0D0] text-sm font-bold font-nunito mb-2">
                    Materiais Detectados
                  </Text>
                  <View className="flex flex-row flex-wrap gap-2">
                    {['papel', 'plastico', 'vidro', 'metal'].map((material) => (
                      <View
                        key={material}
                        className="bg-[#333333] px-3 py-2 rounded-md flex flex-row items-center"
                      >
                        <Text className="text-base mr-1">
                          {MATERIAL_ICONS[material]}
                        </Text>
                        <Text className="text-white text-sm font-nunito capitalize">
                          {material}: {classCounts[material as keyof typeof classCounts] || 0}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {isNewFormatDetection && (
                <View className="mt-2 bg-[#008D80] px-3 py-2 rounded-md self-start">
                  <Text className="text-white text-xs font-nunitoBold">
                    ✨ Detecção Avançada com IA
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={zoomModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setZoomModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black bg-opacity-90 flex justify-center items-center"
          activeOpacity={1}
          onPress={() => setZoomModalVisible(false)}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            if (width > 0 && height > 0)
              setZoomContainerLayout({ width, height });
          }}
        >
          <Image
            className="w-full h-full"
            source={{ uri: `data:image/jpeg;base64,${itemData.base64}` }}
            resizeMode="contain"
          />

          {zoomContainerLayout &&
            imageAspectRatio &&
            allContours.length > 0 && (
              <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <ClipPath id="zoomClip">
                  <Rect
                    x={finalZoomedImageDimensions.x}
                    y={finalZoomedImageDimensions.y}
                    width={finalZoomedImageDimensions.width}
                    height={finalZoomedImageDimensions.height}
                  />
                </ClipPath>
                <G clipPath="url(#zoomClip)">
                  {allContours.map((contourData, index) => (
                    <Polygon
                      key={index}
                      points={transformPoints(
                        contourData.contour,
                        finalZoomedImageDimensions
                      )}
                      fill={`${contourData.color}33`}
                      stroke={contourData.color}
                      strokeWidth="3"
                    />
                  ))}
                </G>
              </Svg>
            )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
