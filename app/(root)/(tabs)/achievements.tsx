import {useAuth} from "@/context/AuthContext";
import {SafeAreaView, Text, View} from "react-native";
import {Redirect, router} from "expo-router";
import Header from "@/app/components/header";
import React from "react";
import {lixoList} from "@/data/lixoList";



export default function Achievements() {
    const { user, session, signout, loading } = useAuth();

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-[#0d0d0d]">
                {/* make a loading spinner */}
                <View className="w-16 h-16 rounded-full border-4 border-t-4 border-t-[#008D80] border-[#0d0d0d] animate-spin" />
                <Text className="text-white font-nunitoBold text-2xl mt-4">
                    Carregando...
                </Text>
            </SafeAreaView>
        );
    }

    if (!session) {
        return <Redirect href="/welcome" />;
    }




    type Status = "Coletado" | "Pendente" | "Recusado";


    const statusContador = lixoList.reduce<Record<Status, number>>((acc, item) => {
        if (!acc[item.status as Status]) {
            acc[item.status as Status] = 0;
        }

        // Incrementa o contador do status
        acc[item.status as Status]++;
        return acc;
    }, {
        Coletado: 0,
        Pendente: 0,
        Recusado: 0
    });

    return(
        <>
            <View className="flex-1 bg-black">
                <Header
                    user={user}
                    path={require("../../../assets/images/coin_icon.png")}
                    onProfilePress={() => {
                        router.push("/profile");
                    }}
                    onLogoutPress={signout}
                    onLixoCoinPress={() => {

                        router.push("/lixo-coins");
                    }}
                />

                <View className="w-full pl-8 pr-8 pt-8">
                    <View className='rounded-xl items-start'>
                        <Text style={{color: 'white', fontSize: 25, fontFamily: 'Poppins-Bold'}}>
                            Meu Desempenho
                        </Text>

                    </View>
                </View>


                {/*</View>*/}
                <View className='grid grid-flow-col grid-rows-3 gap-2 w-full pl-8 pr-8'>

                    <View className='flex flex-row gap-4'>

                        <View className='w-1/2 aspect-square rounded-xl bg-[#262626]'>
                            <View className="pl-4 pt-2">
                                <Text style={{color: '#D9D9D9', fontSize: 18, fontFamily: 'Nunito-Bold'}}>
                                    Fotos Tiradas
                                </Text>
                            </View>
                            <View className="items-center">
                                <Text style={{color: 'white', fontSize: 80, fontFamily: 'Nunito-Bold'}}>
                                    {statusContador.Coletado + statusContador.Pendente + statusContador.Recusado}
                                </Text>
                            </View>
                        </View>


                        <View className='flex flex-col gap-2 w-1/2'>
                            <View className='w-auto rounded-xl bg-[#262626] row-span-3 flex justify-center'>
                                <View className="pl-4 pt-2">
                                    <Text style={{color: '#D9D9D9', fontSize: 18, fontFamily: 'Nunito-Bold'}}>
                                        Coletadas
                                    </Text>
                                </View>
                                <View className="pl-4">
                                    <Text style={{color: '#45BF55', fontSize: 36, fontFamily: 'Nunito-Bold'}}>
                                        {statusContador.Coletado}
                                    </Text>
                                </View>
                            </View>


                            <View className='rounded-xl bg-[#262626] row-span-3 flex justify-center'>
                                <View className="pl-4 pt-2">
                                    <Text style={{color: '#D9D9D9', fontSize: 18, fontFamily: 'Nunito-Bold'}}>
                                        Pendentes
                                    </Text>
                                </View>
                                <View className="pl-4">
                                    <Text style={{color: '#DBF227', fontSize: 36, fontFamily: 'Nunito-Bold'}}>
                                        {statusContador.Pendente}
                                    </Text>
                                </View>
                            </View>

                        </View>

                    </View>

                    <View className='flex flex-row gap-4'>
                        <View className='w-1/2 rounded-xl bg-[#262626] row-span-3 flex justify-center'>
                            <View className="pl-4 pt-2">
                                <Text style={{color: '#D9D9D9', fontSize: 18, fontFamily: 'Nunito-Bold'}}>
                                    Dias Ativos
                                </Text>
                            </View>
                            <View className="pl-4">
                                <Text style={{color: 'white', fontSize: 36, fontFamily: 'Nunito-Bold'}}>
                                    12
                                </Text>
                            </View>
                        </View>


                        <View className='w-1/2 rounded-xl bg-[#262626] row-span-3 flex justify-center'>
                            <View className="pl-4 pt-2">
                                <Text style={{color: '#D9D9D9', fontSize: 18, fontFamily: 'Nunito-Bold'}}>
                                    Recusadas
                                </Text>
                            </View>
                            <View className="pl-4">
                                <Text style={{color: '#F22742', fontSize: 36, fontFamily: 'Nunito-Bold'}}>
                                    {statusContador.Recusado}
                                </Text>
                            </View>
                        </View>

                    </View>

                </View>
                <View className="w-full pl-8 pr-8 pt-8">
                    <View className='rounded-xl items-start'>
                        <Text style={{color: 'white', fontSize: 25, fontFamily: 'Poppins-Bold'}}>
                            Missões
                        </Text>

                    </View>
                </View>

                <View className="w-full pl-8 pr-8">

                    <View className='border border-red-100 items-center p-8 rounded-xl'>
                        <Text style={{color: '#D9D9D9', fontSize: 18, fontFamily: 'Nunito-Bold'}}>
                            Em Desenvolvimento
                        </Text>

                    </View>

                </View>
            </View>
        </>
    )
}
