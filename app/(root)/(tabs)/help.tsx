import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/header";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';
import { useRef, useCallback } from 'react';


// Importa suas páginas
import Page1 from "../paginas/pagina1";
import Page2 from "../paginas/pagina2";
import Page3 from "../paginas/pagina3";
import Page4 from "../paginas/pagina4";

export default function Help() {
    const { signout } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 4;

    const scrollRef = useRef<ScrollView>(null);

    // Resetar scroll quando a aba perder foco
    useFocusEffect(
        useCallback(() => {
            return () => {
                scrollRef.current?.scrollTo({ y: 0, animated: false });
            };
        }, [])
    );

    const getVisiblePages = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    // Função para renderizar a página atual
    const renderPage = () => {
        switch (currentPage) {
            case 1:
                return <Page1 />;
            case 2:
                return <Page2 />;
            case 3:
                return <Page3 />;
            case 4:
                return <Page4 />;
            default:
                return <Page1 />;
        }
    };
    const handleChangePage = (page: number) => {
        setCurrentPage(page);
        scrollRef.current?.scrollTo({ y: 0, animated: true }); // Volta ao topo
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#0D0D0D" }}>
            <View className="flex-1 bg-[#0D0D0D]">
                {/* Cabeçalho fixo */}
                <Header
                    path={require("../../../assets/images/coin_icon.png")}
                    onProfilePress={() => router.push("/profile")}
                    onLogoutPress={signout}
                    onLixoCoinPress={() => router.push("/lixo-coins")}
                />

                {/* Conteúdo fixo: título e paginação */}
                <View className="w-full px-4 pt-4 border-t border-gray-700">
                    <Text
                        style={{
                            color: "#FFFFFF",
                            fontSize: 24,
                            fontFamily: "Poppins-Bold",
                            marginBottom: 12,
                        }}
                    >
                        Guia de Uso
                    </Text>

                    {/* PAGINAÇÃO */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#0D0D0D",
                            paddingVertical: 12,
                            borderRadius: 8,
                            // borderWidth: 1,
                            borderColor: "#262626",
                            gap: 8,
                        }}
                    >
                        {/* Botão anterior */}
                        <TouchableOpacity
                            disabled={currentPage === 1}
                            onPress={() => {
                                setCurrentPage((p) => Math.max(p - 1, 1));
                                scrollRef.current?.scrollTo({ y: 0, animated: true });
                            }}
                            style={{
                                opacity: currentPage === 1 ? 0.3 : 1,
                                width: 42,
                                height: 42,
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 8,
                                backgroundColor: "#1A1A1A",
                            }}
                        >
                            <Ionicons name="chevron-back" size={20} color="#fff" />
                        </TouchableOpacity>

                        {/* Números */}
                        {getVisiblePages().map((page) => (
                            <TouchableOpacity
                                key={page}
                                onPress={() => {setCurrentPage(page); handleChangePage(page)}}
                                style={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: 8,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor:
                                        currentPage === page ? "#404040" : "#1A1A1A",
                                }}
                            >
                                <Text
                                    style={{
                                        color: currentPage === page ? "#fff" : "#aaa",
                                        fontSize: 18,
                                        fontFamily: "Nunito",
                                    }}
                                >
                                    {page}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        {/* Botão próximo */}
                        <TouchableOpacity
                            disabled={currentPage === totalPages}
                            onPress={() => {
                                setCurrentPage((p) => Math.min(p + 1, totalPages));
                                scrollRef.current?.scrollTo({ y: 0, animated: true });
                        }}
                            style={{
                                opacity: currentPage === totalPages ? 0.3 : 1,
                                width: 42,
                                height: 42,
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 8,
                                backgroundColor: "#1A1A1A",
                            }}
                        >
                            <Ionicons name="chevron-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ÁREA SCROLLÁVEL — SOMENTE O CONTEÚDO DAS PÁGINAS */}
                <ScrollView
                    ref={scrollRef}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}
                >
                    {renderPage()}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
