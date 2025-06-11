import {useAuth} from "@/context/AuthContext";
import {Image, SafeAreaView, Text, View} from "react-native";
import {Redirect, router} from "expo-router";
import {lixoList} from "@/data/lixoList";
import React from "react";
import LixoCoinHeader from "@/app/components/lixoCoinHeader";
import LixoCoinListaScrollavel from "@/app/components/lixoCoinScrollableList";
import ListaScrollavel from "@/app/components/scrollableList";

export default function LixoCoins() {

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


        switch(item.status){
            case "Coletado":
                acc[item.status as Status] = acc[item.status as Status] + 50;
                break

            case "Pendente":
                acc[item.status as Status] = acc[item.status as Status] + 30;
                break

            case "Recusado":
                acc[item.status as Status] = acc[item.status as Status] - 80;
                break

            default:
                acc[item.status as Status] = 0

        }

        return acc;
    }, {
        Coletado: 0,
        Pendente: 0,
        Recusado: 0
    });

    return(
        <>
            <View className="items-center flex-1 bg-[#0D0D0D] gap-2 pb-[4%]">
                <LixoCoinHeader
                    user={user}
                    path={require("../../assets/images/coin_icon.png")}
                    onReturnPress={() => {
                        router.push("/");
                    }}
                />

                <View className='w-11/12 rounded-md bg-[#262626] mt-4 justify-center py-2 px-4'>
                    <View>
                        <Text style={{color: '#A6A6A6', fontSize: 16, fontFamily: 'Nunito-Medium'}}>
                            Saldo Total
                        </Text>
                    </View>
                    <View className='flex-row items-center gap-2'>
                        <Text style={{color: '#FFFFFF', fontSize: 40, fontFamily: 'Nunito-Bold'}}>
                            {statusContador.Coletado + statusContador.Pendente + statusContador.Recusado}
                        </Text>
                        <Image className="w-9 h-9 object-cover" source={require("../../assets/images/coin_icon.png")} />
                    </View>
                </View>

                <View className="w-11/12 py-4 border-b border-gray-700">
                    <View className='flex flex-row rounded-sm justify-between items-center'>
                        <View className='flex flex-row items-center'>
                            <Text style={{color: '#A6A6A6', fontSize: 24, fontFamily: 'Poppins-Bold'}}>
                                Recentes
                            </Text>
                            {/*<Text style={{color: '#A6A6A6', fontSize: 18, fontFamily: 'Poppins-Bold'}}>*/}
                            {/*    ({lixoList.length})*/}
                            {/*</Text>*/}
                        </View>

                        <Image source={require('@/assets/images/navigate_next.png')}/>

                    </View>

                </View>


                <View className="flex-1 w-11/12 items-center h-full">
                    <SafeAreaView style={{ flex: 1}}>
                        <LixoCoinListaScrollavel/>
                    </SafeAreaView>
                </View>





            </View>


        </>
    )


}

