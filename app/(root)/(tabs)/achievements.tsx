// Conteúdo de achievements.tsx MODIFICADO

import { useAuth } from "@/context/AuthContext";
import { SafeAreaView, Text, View, Image, ActivityIndicator } from "react-native";
import { Redirect, router } from "expo-router";
import Header from "@/app/components/header";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { WasteDetectionData } from "@/types/user_waste_images"; // Importe a interface de detecção


const SERVER_URL_DATABASE = process.env.EXPO_PUBLIC_SERVER_URL_DATABASE;

// Defina uma interface para as estatísticas que vamos exibir
interface PerformanceStats {
  totalDetections: number;
  collected: number;
  pending: number;
  refused: number;
  activeDays: number;
}

export default function Achievements() {
  const { user, session, signout, loading: authLoading } = useAuth(); // Renomeado para evitar conflito

  // Estados para os dados de desempenho, carregamento e erro da tela
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Hook para buscar os dados sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      const fetchPerformanceData = async () => {
        // Garante que temos o ID do usuário antes de continuar
        if (!user?.$id) {
          setError("ID do usuário não encontrado.");
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        setError(null);

        try {
          // Usamos Promise.all para fazer as duas requisições em paralelo
          const [detectionsResponse, userResponse] = await Promise.all([
            fetch(`${SERVER_URL_DATABASE}/detections/user/${user.$id}/`),
            fetch(`${SERVER_URL_DATABASE}/users/${user.$id}`)
          ]);

          // Verificação de erro para ambas as respostas
          if (!detectionsResponse.ok || !userResponse.ok) {
            throw new Error('Falha ao buscar os dados de desempenho.');
          }

          const detectionsData: WasteDetectionData[] = await detectionsResponse.json();
          const userData = await userResponse.json();

          // --- Processamento dos Dados ---

          // 1. Contagem das detecções por status
          const statusCounter = detectionsData.reduce((acc, item) => {
            const status = item.status;
            if (status === 'Coletado') {
              acc.collected++;
            } else if (status === 'A coletar' || status === 'Pendente') { // Agrupa status
              acc.pending++;
            } else if (status === 'Recusada' || status === 'Recusado') { // Agrupa status
              acc.refused++;
            }
            return acc;
          }, { collected: 0, pending: 0, refused: 0 });

          // 2. Atualiza o estado com todos os dados calculados e buscados
          setStats({
            totalDetections: detectionsData.length,
            collected: statusCounter.collected,
            pending: statusCounter.pending,
            refused: statusCounter.refused,
            activeDays: userData.activeDays || 0, // Pega 'activeDays' dos dados do usuário
          });

        } catch (err) {
          console.error("Erro ao buscar dados de desempenho:", err);
          setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchPerformanceData();
    }, [user?.$id]) // Re-executa se o ID do usuário mudar
  );

  // Estado de carregamento da autenticação (do useAuth)
  if (authLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#0d0d0d]">
        <ActivityIndicator size="large" color="#008D80" />
        <Text className="text-white font-nunitoBold text-2xl mt-4">
          Carregando...
        </Text>
      </SafeAreaView>
    );
  }

  // Redireciona se não houver sessão
  if (!session) {
    return <Redirect href="/welcome" />;
  }

  // A partir daqui, renderizamos a tela principal
  return (
    <>
      <View className="flex-1 bg-[#0d0d0d] items-center">
        <Header
          user={user}
          path={require("../../../assets/images/coin_icon.png")}
          onProfilePress={() => router.push("/profile")}
          onLogoutPress={signout}
          onLixoCoinPress={() => router.push("/lixo-coins")}
        />

        <View className="w-full px-4 pt-4">
          <View className='rounded-md items-start'>
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontFamily: 'Poppins-Bold' }}>
              Meu Desempenho
            </Text>
          </View>
        </View>

        {/* Lógica de renderização baseada no estado */}
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#008D80" />
            <Text className="text-white mt-2">Buscando seu desempenho...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-red-500 text-center">Erro: {error}</Text>
          </View>
        ) : stats ? (
          // O conteúdo é renderizado aqui se os dados foram carregados com sucesso
          <View className='w-full gap-4 items-center mt-4'>
            <View className='flex flex-row w-full px-4'>
              <View className='w-1/2 rounded-md bg-[#262626] px-4 py-2'>
                <View className="">
                  <Text style={{ color: '#D9D9D9', fontSize: 18, fontFamily: 'Nunito-Medium' }}>
                    Fotos Tiradas
                  </Text>
                </View>
                <View className="items-center justify-center flex-1">
                  <Text style={{ color: 'white', fontSize: 80, fontFamily: 'Nunito-Bold' }}>
                    {stats.totalDetections}
                  </Text>
                </View>
              </View>

              <View className='gap-4 flex flex-col w-1/2 justify-between items-end'>
                <View className='w-11/12 rounded-md bg-[#262626] px-4 py-2'>
                  <View>
                    <Text style={{ color: '#D9D9D9', fontSize: 18, fontFamily: 'Nunito-Medium' }}>
                      Coletadas
                    </Text>
                  </View>
                  <View className="flex flex-row items-center gap-2">
                    <Text style={{ color: '#45BF55', fontSize: 36, fontFamily: 'Nunito-Bold' }}>
                      {stats.collected}
                    </Text>
                    <Image
                      source={require('../../../assets/images/ok_circle.png')}
                      style={{ width: 32, height: 32 }}
                    />
                  </View>
                </View>
                <View className='w-11/12 rounded-md bg-[#262626] px-4 py-2'>
                  <View>
                    <Text style={{ color: '#D9D9D9', fontSize: 18, fontFamily: 'Nunito-Medium' }}>
                      A coletar
                    </Text>
                  </View>
                  <View className="flex flex-row items-center gap-2">
                    <Text style={{ color: '#DBF227', fontSize: 36, fontFamily: 'Nunito-Bold' }}>
                      {stats.pending}
                    </Text>
                    <Image
                      source={require('../../../assets/images/pending_circle.png')}
                      style={{ width: 32, height: 32 }}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View className='flex flex-row w-full px-4'>
              <View className='w-1/2 flex flex-col rounded-md bg-[#262626] justify-center px-4 py-2'>
                <View>
                  <Text style={{ color: '#D9D9D9', fontSize: 18, fontFamily: 'Nunito-Medium' }}>
                    Dias Ativos
                  </Text>
                </View>
                <View className="flex flex-row items-end gap-2">
                  <Text style={{ color: 'white', fontSize: 36, fontFamily: 'Nunito-Bold' }}>
                    {stats.activeDays}
                  </Text>
                  <Text style={{ color: 'white', fontSize: 24, fontFamily: 'Nunito-Bold', lineHeight: 38 }}>
                    dias
                  </Text>
                </View>
              </View>

              <View className='flex flex-col w-1/2 justify-between items-end'>
                <View className='w-11/12 rounded-md bg-[#262626] px-4 py-2 '>
                  <View>
                    <Text style={{ color: '#D9D9D9', fontSize: 18, fontFamily: 'Nunito-Medium' }}>
                      Recusadas
                    </Text>
                  </View>
                  <View className="flex flex-row items-center gap-2">
                    <Text style={{ color: '#F22742', fontSize: 36, fontFamily: 'Nunito-Bold' }}>
                      {stats.refused}
                    </Text>
                    <Image
                      source={require('../../../assets/images/x_circle.png')}
                      style={{ width: 32, height: 32 }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : null}

        {/* Seção Missões (permanece igual) */}
        <View className="w-full pl-4 pr-8 pt-8">
          <View className='rounded-md items-start'>
            <Text style={{ color: 'white', fontSize: 25, fontFamily: 'Poppins-Bold' }}>
              Missões
            </Text>
          </View>
        </View>
        <View className="w-full px-4 mt-2">
          <View className='border-[#A6A6A6] border-2 items-center p-8 rounded-md'>
            <Text style={{ color: '#A6A6A6', fontSize: 18, fontFamily: 'Nunito-Bold' }}>
              Em Desenvolvimento
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}