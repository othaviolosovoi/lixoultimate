import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import LixoItem from './lixoItem';
import { WasteDetectionData } from '@/types/user_waste_images';

const SERVER_URL_DATABASE = process.env.EXPO_PUBLIC_SERVER_URL_DATABASE;

interface MinhasDeteccoesScreenProps {
  userId: string;
}

export default function MinhasDeteccoesScreen({ userId }: MinhasDeteccoesScreenProps) {
  const [allDetections, setAllDetections] = useState<WasteDetectionData[]>([]);
  const [filteredDetections, setFilteredDetections] = useState<WasteDetectionData[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [filterValue, setFilterValue] = useState('Todos'); 
  const [filterItems, setFilterItems] = useState([
    { label: 'Mostrar Todas', value: 'Todos' },
    { label: 'Coletado', value: 'Coletado' },
    { label: 'A coletar', value: 'A coletar' },
    { label: 'Recusado', value: 'Recusado' },
  ]);

  const fetchUserDetections = useCallback(async (isInitialLoad = false) => {
    if (!userId) {
      setError('ID do usuário não fornecido.');
      if (isInitialLoad) setIsLoading(false);
      return;
    }
    
    if (isInitialLoad) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const response = await fetch(`${SERVER_URL_DATABASE}/detections/user/${userId}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: WasteDetectionData[] = await response.json();
      setAllDetections(data);
    } catch (err) {
      console.error('Failed to fetch user detections:', err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido ao buscar detecções.');
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      }
      setIsRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserDetections(true);
  }, [fetchUserDetections]);

  useEffect(() => {
    if (filterValue === 'Todos') {
      setFilteredDetections(allDetections);
    } else {
      const filtered = allDetections.filter(item => {
        if (filterValue === 'A coletar') {
          return item.status === 'A coletar' || item.status === 'Pendente';
        }
        if (filterValue === 'Recusado') {
          return item.status === 'Recusado' || item.status === 'Recusada';
        }
        return item.status === filterValue;
      });
      setFilteredDetections(filtered);
    }
  }, [filterValue, allDetections]);

  const onRefresh = () => {
    fetchUserDetections(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={parentStyles.containerCentered}>
        <ActivityIndicator size="large" color="#008D80" />
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
  

  if (allDetections.length === 0) {
    return (
      <SafeAreaView style={parentStyles.containerCentered}>
        <Text style={parentStyles.emptyText}>Nenhuma detecção encontrada.</Text>
      </SafeAreaView>
    );
  }

  return (

    <SafeAreaView style={parentStyles.container}>
      <View style={{ paddingHorizontal: 10, paddingTop: 10, zIndex: 1000 }}>
        <DropDownPicker
          open={open}
          value={filterValue}
          items={filterItems}
          setOpen={setOpen}
          setValue={setFilterValue}
          setItems={setFilterItems}
          placeholder="Filtrar por status"
          // Estilos para o tema escuro
          theme="DARK"
          style={parentStyles.dropdown}
          dropDownContainerStyle={parentStyles.dropdownContainer}
        />
      </View>

      <FlatList
        data={filteredDetections}
        renderItem={({ item }) => <LixoItem itemData={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={parentStyles.listContentContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#A0A0A0"
            colors={['#A0A0A0']}
          />
        }
        ListEmptyComponent={
            <View style={parentStyles.containerCentered}>
                <Text style={parentStyles.emptyText}>Nenhuma detecção encontrada para este filtro.</Text>
            </View>
        }
      />
    </SafeAreaView>
  );
}


const parentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d0d0d',
    padding: 20,
  },
  listContentContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 120,
  },
  emptyText: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
    fontFamily: 'Nunito-Regular',
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
  dropdown: {
    backgroundColor: '#262626',
    borderColor: '#404040',
  },
  dropdownContainer: {
    backgroundColor: '#262626',
    borderColor: '#404040',
  }
});