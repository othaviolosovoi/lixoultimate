import {useAuth} from "@/context/AuthContext";
import {SafeAreaView, Text, View} from "react-native";
import {Redirect, router} from "expo-router";
import {lixoList} from "@/data/lixoList";
import React from "react";
import LixoCoinHeader from "@/app/components/lixoCoinHeader";

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
    return(
        <>
            <View className="flex-1 bg-black items-center">
                <LixoCoinHeader
                    user={user}
                    path={require("../../assets/images/coin_icon.png")}
                    onReturnPress={() => {
                        router.push("/profile");
                    }}
                />
            </View>
        </>
    )


}

