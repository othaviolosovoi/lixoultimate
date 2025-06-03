import React, { useState } from 'react';
import Header from '../../components/header';
import {Image, SafeAreaView, Text, View} from "react-native";
import {Redirect, router} from "expo-router";
import {useAuth} from "@/context/AuthContext";
import ListaScrollavel from "@/app/components/scrollableList";
import {lixoList} from "@/data/lixoList";


export default function History() {
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




                <View className="w-full pl-8 pr-8 pt-8 gap-2">
                    <View className='rounded-xl items-start'>
                        <Text style={{color: 'white', fontSize: 25, fontFamily: 'Poppins-Bold'}}>
                            Recentes ({lixoList.length})
                        </Text>

                    </View>
                    <ListaScrollavel/>

                    {/*FAZER MODAL*/}
                    {/*<View className='w-full rounded-xl bg-[#262626] flex flex-row justify-between'>*/}
                    {/*    /!*1*!/*/}
                    {/*    <View className=' justify-center p-2'>*/}
                    {/*        /!*  IMAGEM AQUI  *!/*/}
                    {/*        <Image className="rounded-xl bg-white p-8 w-7 h-7 object-cover" source={require("../../../assets/images/teste_imagem.jpeg")} />*/}
                    {/*    </View>*/}


                    {/*    /!*2*!/*/}
                    {/*    <View className='pt-2 pb-2'>*/}
                    {/*    <View>*/}
                    {/*            <Text style={{color: '#D9D9D9', fontSize: 18, fontFamily: 'Nunito-Bold'}}>*/}
                    {/*                Foto #1q*/}
                    {/*            </Text>*/}
                    {/*        </View>*/}
                    {/*        <View>*/}
                    {/*            <Text style={{color: 'white', fontSize: 14, fontFamily: 'Nunito-Bold'}}>*/}
                    {/*                Rua Pereira Estéfano, 24...*/}
                    {/*            </Text>*/}
                    {/*            <Text style={{color: 'white', fontSize: 12, fontFamily: 'Nunito-Bold'}}>*/}
                    {/*                10/03/2025 - 14h30*/}
                    {/*            </Text>*/}
                    {/*        </View>*/}
                    {/*    </View>*/}

                    {/*    /!*3*!/*/}
                    {/*    <View className='justify-center p-4'>*/}
                    {/*        /!*  SÍMBOLO AQUI  *!/*/}
                    {/*        <View className='items-center'>*/}
                    {/*            <Image alt="Ícone X" className="rounded-xl p-4 w-4 h-4 object-cover" source={require("../../../assets/images/x_circle.png")} />*/}
                    {/*        </View>*/}
                    {/*        <View className='items-center'>*/}
                    {/*            <Text style={{color: '#F22742', fontSize:12, fontFamily:'Nunito-Bold'}}>Recusada</Text>*/}
                    {/*        </View>*/}


                    {/*    </View>*/}

                    {/*</View>*/}


                </View>
            </View>

        </>
    )
}
