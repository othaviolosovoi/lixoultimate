import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

import LixoItem from "./lixoItem";
import { WasteDetectionData } from "@/types/user_waste_images";

const SERVER_URL_DATABASE = process.env.EXPO_PUBLIC_SERVER_URL_DATABASE;

interface MinhasDeteccoesScreenProps {
  userId: string;
}

function getClassCounts(detection: WasteDetectionData) {
  if (
    detection.detection_points &&
    typeof detection.detection_points === 'object' &&
    !Array.isArray(detection.detection_points) &&
    'class_counts' in detection.detection_points
  ) {
    return detection.detection_points.class_counts;
  }
  return { papel: 0, plastico: 0, vidro: 0, metal: 0 };
}

function isNewFormat(detection: WasteDetectionData): boolean {
  return (
    detection.detection_points !== undefined &&
    detection.detection_points !== null &&
    typeof detection.detection_points === 'object' &&
    !Array.isArray(detection.detection_points) &&
    'lixo_detections' in detection.detection_points
  );
}

export default function MinhasDeteccoesScreen({
  userId,
}: MinhasDeteccoesScreenProps) {
  const [detections, setDetections] = useState<WasteDetectionData[]>([]);
  const [filteredDetections, setFilteredDetections] = useState<
    WasteDetectionData[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("Todos");
  const [filterItems, setFilterItems] = useState([
    { label: "Mostrar Todas", value: "Todos" },
    { label: "Coletado", value: "Coletado" },
    { label: "A coletar", value: "A coletar" },
    { label: "Recusado", value: "Recusado" },
  ]);
  
  // Paginação
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [allDataCache, setAllDataCache] = useState<WasteDetectionData[]>([]);

  const fetchUserDetections = useCallback(
    async (page: number, isRefresh = false) => {
      if (!userId) {
        setError("ID do usuário não fornecido.");
        setIsLoading(false);
        return;
      }

      if (page === 1) {
        if (isRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        // Usar paginação do backend com skip e limit
        const skip = (page - 1) * PAGE_SIZE;
        const response = await fetch(
          `${SERVER_URL_DATABASE}/detections/user/${userId}?skip=${skip}&limit=${PAGE_SIZE}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Pegar total count do header
        const totalCountHeader = response.headers.get('X-Total-Count');
        if (totalCountHeader) {
          setTotalCount(parseInt(totalCountHeader, 10));
        }
        
        const data: WasteDetectionData[] = await response.json();
        
        // Converter status "Não encontrado" para "Coletado"
        const normalizedData = data.map(detection => ({
          ...detection,
          status: detection.status === "Não encontrado" ? "Coletado" : detection.status
        }));
        
        if (page === 1) {
          setDetections(normalizedData);
          setAllDataCache(normalizedData);
        } else {
          setDetections(prev => [...prev, ...normalizedData]);
          setAllDataCache(prev => [...prev, ...normalizedData]);
        }
        
        // Verificar se há mais dados
        setHasMoreData(normalizedData.length === PAGE_SIZE);
        
        console.log(`Página ${page}: ${normalizedData.length} itens (total: ${totalCountHeader || 'desconhecido'})`);
      } catch (err) {
        console.error("Failed to fetch user detections:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Ocorreu um erro desconhecido ao buscar detecções."
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [userId, PAGE_SIZE]
  );

  useEffect(() => {
    fetchUserDetections(1);
  }, [fetchUserDetections]);

  useEffect(() => {
    if (filterValue === "Todos") {
      setFilteredDetections(detections);
    } else {
      const filtered = detections.filter((item) => {
        if (filterValue === "A coletar") {
          return item.status === "A coletar" || item.status === "Pendente";
        }
        if (filterValue === "Recusado") {
          return item.status === "Recusado" || item.status === "Recusada";
        }
        return item.status === filterValue;
      });
      setFilteredDetections(filtered);
    }
  }, [filterValue, detections]);

  const onRefresh = () => {
    setCurrentPage(1);
    setHasMoreData(true);
    setAllDataCache([]);
    fetchUserDetections(1, true);
  };

  const loadMoreItems = () => {
    if (!isLoadingMore && hasMoreData && filterValue === "Todos") {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchUserDetections(nextPage);
    }
  };

  // Otimização: getItemLayout para melhor performance do FlatList
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 120, // Altura aproximada de cada item
      offset: 120 * index,
      index,
    }),
    []
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#0d0d0d] p-5">
        <ActivityIndicator size="large" color="#008D80" />
        <Text className="mt-2.5 text-base text-white font-nunito">Carregando detecções...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-[#0d0d0d] border-t border-gray-700">
        <View className="w-full px-4 pt-4">
          <View className="rounded-md items-start">
            <Text className="text-white text-2xl font-poppinsBold">
              Meu Histórico
            </Text>
          </View>
        </View>
        <FlatList
          data={[]}
          renderItem={() => null}
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 10, paddingTop: 10, paddingBottom: 120 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#A0A0A0"
              colors={["#A0A0A0"]}
            />
          }
          ListEmptyComponent={
            <View className="justify-center items-center py-10 min-h-[300px]">
              <Text className="text-base text-[#FF6B6B] text-center font-nunito">
                Erro ao carregar: {error}
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0d0d0d] border-t border-gray-700">
      <View className="w-full px-4 pt-4">
        <View className="rounded-md items-start">
          <Text className="text-white text-2xl font-poppinsBold">
            Meu Histórico
          </Text>
        </View>
      </View>
      <View className="px-2.5 pt-2.5 z-[1000]">
        <DropDownPicker
          open={open}
          value={filterValue}
          items={filterItems}
          setOpen={setOpen}
          setValue={setFilterValue}
          setItems={setFilterItems}
          placeholder="Filtrar por status"
          theme="DARK"
          style={{ backgroundColor: "#262626", borderColor: "#404040" }}
          dropDownContainerStyle={{ backgroundColor: "#262626", borderColor: "#404040" }}
        />
      </View>

      <FlatList
        data={filteredDetections}
        renderItem={({ item }) => (
          <LixoItem 
            itemData={item} 
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 10, paddingTop: 10, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#A0A0A0"
            colors={["#A0A0A0"]}
          />
        }
        ListEmptyComponent={
          <View className="justify-center items-center py-10 min-h-[300px]">
            <Text className="text-base text-[#A0A0A0] text-center font-nunito">
              {detections.length === 0 
                ? "Nenhuma detecção encontrada." 
                : "Nenhuma detecção encontrada para este filtro."}
            </Text>
          </View>
        }
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? (
            <View className="p-5 items-center">
              <ActivityIndicator size="small" color="#008D80" />
              <Text className="text-[#A0A0A0] mt-2 font-nunito">
                Carregando mais...
              </Text>
            </View>
          ) : null
        }
        // Otimizações de performance
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        windowSize={10}
        initialNumToRender={10}
        getItemLayout={getItemLayout}
      />
    </SafeAreaView>
  );
}