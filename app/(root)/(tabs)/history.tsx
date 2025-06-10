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
            <SafeAreaView className="flex-1 justify-center items-center">
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
            <View className="items-center flex-1 bg-[#0D0D0D]">
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




                <View className="w-11/12">
                    {/*<View className='flex flex-row rounded-xl pb-1 justify-between items-center'>*/}
                    {/*    <View className='flex flex-row items-center'>*/}
                    {/*        <Text style={{color: '#A6A6A6', fontSize: 24, fontFamily: 'Poppins-Bold'}}>*/}
                    {/*            Recentes*/}
                    {/*        </Text>*/}
                    {/*        <Text style={{color: '#A6A6A6', fontSize: 18, fontFamily: 'Poppins-Bold'}}>*/}
                    {/*            ({lixoList.length})*/}
                    {/*        </Text>*/}
                    {/*    </View>*/}

                    {/*    <Image source={require('@/assets/images/navigate_next.png')}/>*/}

                    {/*</View>*/}

                    <View className="w-full pt-4">
                        <View className='flex flex-row rounded-sm justify-between items-center'>
                            <View className='flex flex-row items-center'>
                                <Text style={{color: '#A6A6A6', fontSize: 24, fontFamily: 'Poppins-Bold'}}>
                                    Recentes
                                </Text>
                                <Text style={{color: '#A6A6A6', fontSize: 18, fontFamily: 'Poppins-Bold'}}>
                                    ({lixoList.length})
                                </Text>
                            </View>

                            <Image source={require('@/assets/images/navigate_next.png')}/>

                        </View>
                    </View>


                    <ListaScrollavel/>

                </View>
            </View>

        </>
    )
}
