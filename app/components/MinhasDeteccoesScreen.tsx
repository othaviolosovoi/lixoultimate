import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import LixoItem from './lixoItem';
import { WasteDetectionData } from '@/types/user_waste_images';

interface MinhasDeteccoesScreenProps {
  userId: string;
}

export default function MinhasDeteccoesScreen({ userId }: MinhasDeteccoesScreenProps) {
  const [detectionsList, setDetectionsList] = useState<WasteDetectionData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetections = async () => {
      if (!userId) {
        setError('ID do usuário não fornecido.');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      setDetectionsList([]);

      try {
        const response = await fetch(
          `https://e0c6-177-95-30-7.ngrok-free.app/detections/user/${userId}/`
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`,
          );
        }
        const data: WasteDetectionData[] = await response.json();
        console.log("Lista de detecções recebidas:", data);
        setDetectionsList(data);
      } catch (err) {
        console.error('Failed to fetch user detections:', err);
        setError(
          err instanceof Error ? err.message : 'Ocorreu um erro desconhecido ao buscar detecções.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetections();
  }, [userId]);

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
        {/* Botao tentar novamente */}
      </SafeAreaView>
    );
  }

  if (detectionsList.length === 0) {
    return (
      <SafeAreaView style={parentStyles.containerCentered}>
        <Text style={parentStyles.emptyText}>Nenhuma detecção encontrada para este usuário.</Text>
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
        // ListHeaderComponent={<Text style={parentStyles.headerTitle}>Minhas Detecções</Text>}
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
  // headerTitle: {
  //   fontSize: 24,
  //   fontFamily: 'Nunito-Bold',
  //   color: '#FFFFFF',
  //   marginLeft: 10,
  //   marginBottom: 15,
  //   marginTop:10,
  // }
});