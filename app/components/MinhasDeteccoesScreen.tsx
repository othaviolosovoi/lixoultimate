import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  RefreshControl, // Import for pull-to-refresh
} from 'react-native';

import LixoItem from './lixoItem';
import { WasteDetectionData } from '@/types/user_waste_images';

const SERVER_URL_DATABASE = process.env.EXPO_PUBLIC_SERVER_URL_DATABASE;

interface MinhasDeteccoesScreenProps {
  userId: string;
}

export default function MinhasDeteccoesScreen({ userId }: MinhasDeteccoesScreenProps) {
  const [detectionsList, setDetectionsList] = useState<WasteDetectionData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false); // For pull-to-refresh UI
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches user detections from the server.
   * @param isInitialLoad - Determines if it's the first data load to show a full-screen indicator.
   */
  const fetchUserDetections = useCallback(async (isInitialLoad = false) => {
    if (!userId) {
      setError('ID do usuário não fornecido.');
      if (isInitialLoad) setIsLoading(false);
      return;
    }
    
    if (isInitialLoad) {
      setIsLoading(true);
    } else {
      // For manual pull-to-refresh, we use a different state
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const response = await fetch(
        `${SERVER_URL_DATABASE}/detections/user/${userId}/`
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`,
        );
      }
      const data: WasteDetectionData[] = await response.json();
      setDetectionsList(data);
    } catch (err) {
      console.error('Failed to fetch user detections:', err);
      setError(
        err instanceof Error ? err.message : 'Ocorreu um erro desconhecido ao buscar detecções.',
      );
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      }
      setIsRefreshing(false);
    }
  }, [userId]); // The function depends on userId

  // Effect for initial load
  useEffect(() => {
    // Fetch data immediately when the component mounts
    fetchUserDetections(true);
  }, [fetchUserDetections]);

  // Handler for the manual pull-to-refresh action
  const onRefresh = () => {
    fetchUserDetections(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={parentStyles.containerCentered}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={parentStyles.loadingText}>Carregando detecções...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={parentStyles.containerCentered}>
        <Text style={parentStyles.errorText}>Erro ao carregar: {error}</Text>
      </SafeAreaView>
    );
  }

  if (detectionsList.length === 0) {
    return (
      <SafeAreaView style={parentStyles.containerCentered}>
        <Text style={parentStyles.emptyText}>Nenhuma detecção encontrada.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={parentStyles.container}>
      <FlatList
        data={detectionsList}
        renderItem={({ item }) => <LixoItem itemData={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={parentStyles.listContentContainer}
        // Add RefreshControl for pull-to-refresh functionality
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#A0A0A0" // For iOS
            colors={['#A0A0A0']} // For Android
          />
        }
      />
    </SafeAreaView>
  );
}


const parentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  listContentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Nunito-Regular',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    fontFamily: 'Nunito-Regular',
  },
  emptyText: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
    fontFamily: 'Nunito-Regular',
  },
});
