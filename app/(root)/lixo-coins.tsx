import { useAuth } from "@/context/AuthContext";
import { Image, SafeAreaView, Text, View, ActivityIndicator } from "react-native";
import { Redirect, router } from "expo-router";
import React, { useState, useEffect } from "react";
import LixoCoinHeader from "@/app/components/lixoCoinHeader";
import LixoCoinListaScrollavel from "@/app/components/lixoCoinScrollableList";
import { WasteDetectionData } from '@/types/user_waste_images';

const SERVER_URL_DATABASE = process.env.EXPO_PUBLIC_SERVER_URL_DATABASE;

export default function LixoCoins() {
    const { user, session } = useAuth();
    const [detections, setDetections] = useState<WasteDetectionData[]>([]);
    const [coins, setCoins] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.$id) {
            if (!session) setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [detectionsResponse, userResponse] = await Promise.all([
                    fetch(`${SERVER_URL_DATABASE}/detections_achievements/user/${user.$id}/`),
                    fetch(`${SERVER_URL_DATABASE}/users/${user.$id}`)
                ]);

                if (!detectionsResponse.ok) {
                    throw new Error(`Erro ao buscar o histórico: ${detectionsResponse.status}`);
                }
                const detectionsData: WasteDetectionData[] = await detectionsResponse.json();
                
                // Converter status "Não encontrado" para "Coletado"
                const normalizedDetections = detectionsData.map(detection => ({
                    ...detection,
                    status: detection.status === "Não encontrado" ? "Coletado" : detection.status
                }));
                
                normalizedDetections.sort((a, b) => new Date(b.date_taken).getTime() - new Date(a.date_taken).getTime());
                setDetections(normalizedDetections);

                if (!userResponse.ok) {
                    throw new Error(`Erro ao buscar as moedas: ${userResponse.status}`);
                }
                const userData = await userResponse.json();
                setCoins(userData.coins || 0);

                // console.log("Dados do usuário:", userData);
                // console.log("Histórico de detecções:", detectionsData);

            } catch (err) {
                console.error("Erro ao buscar dados para LixoCoins:", err);
                setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.$id, session]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-[#0d0d0d]">
                <ActivityIndicator size="large" color="#008D80" />
                <Text className="text-white font-nunitoBold text-2xl mt-4">
                    Carregando...
                </Text>
            </SafeAreaView>
        );
    }

    if (!session) {
        return <Redirect href="/welcome" />;
    }
    
    if (error) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-[#0d0d0d] px-4">
                <Text className="text-red-500 font-nunitoBold text-lg text-center">
                    {error}
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <View className="items-center flex-1 bg-[#0D0D0D] gap-2 pb-4">
            <LixoCoinHeader
                onReturnPress={() => router.push("/")}
            />
            <View className='w-11/12 rounded-md bg-[#262626] mt-4 justify-center py-2 px-4'>
                <View>
                    <Text style={{color: '#A6A6A6', fontSize: 16, fontFamily: 'Nunito-Medium'}}>
                        Saldo Total
                    </Text>
                </View>
                <View className='flex-row items-center gap-2'>
                    <Text style={{color: '#FFFFFF', fontSize: 40, fontFamily: 'Nunito-Bold'}}>
                        {coins}
                    </Text>
                    <Image className="w-9 h-9 object-cover" source={require("../../assets/images/coin_icon.png")} />
                </View>
            </View>

            <View className="w-11/12 py-4 border-b border-gray-700">
                <View className='flex-row items-center'>
                    <Text className="text-white font-poppinsBold text-2xl">
                        Histórico de Transações
                    </Text>
                </View>
            </View>

            <View className="flex-1 w-11/12 items-center h-full">
                <LixoCoinListaScrollavel data={detections} />
            </View>
        </View>
    );
}