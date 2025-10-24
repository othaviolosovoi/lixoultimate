import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import GradientText from "@/app/components/gradientText";
import TextoGuia from "@/app/components/textoGuia";

export default function Page1() {
    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
                paddingTop: 0,
                // padding: 10,
                backgroundColor: "#0D0D0D",
            }}
            showsVerticalScrollIndicator={false}
        >
            {/* Título */}
            <Text
                style={{
                    marginBottom: 10,
                }}
            >
                <GradientText style={{ fontSize: 20, fontFamily: 'Nunito-Bold' }}>
                    1. Ative a Localização
                </GradientText>

            </Text>

            {/* Descrição */}
            <View style={{marginBottom: 20}}>
                <TextoGuia tamanho={16} cor="#FFFFFF" negrito={false}>
                    Para o app funcionar, precisamos saber onde o lixo está.
                </TextoGuia>

            </View>

            <View style={{marginBottom: 10}}>
                <TextoGuia tamanho={16} cor="#FFFFFF" negrito={true}>
                    • Usando a câmera do app: <TextoGuia tamanho={16} cor="#FFFFFF" negrito={false}>Permita o acesso à localização.</TextoGuia>
                </TextoGuia>
            </View>

            {/* Imagem 1 */}
            <View style={{ alignItems: "center", marginBottom: 20}}>
                <Image
                    source={require("@/assets/images/imagem1.jpg")}
                    style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 2.2, // ajuste conforme a proporção da imagem (ex: 1.5, 0.75 etc)
                        // borderRadius: 12,
                    }}
                    resizeMode="contain"
                />
            </View>

            <View style={{marginBottom: 10}}>
                <TextoGuia tamanho={16} cor="#FFFFFF" negrito={true}>
                    • Enviando fotos da galeria: <TextoGuia tamanho={16} cor="#FFFFFF" negrito={false}>Ative a opção de "Salvar local" nas
                    configurações da sua câmera antes de tirar a foto.</TextoGuia>
                </TextoGuia>
            </View>


            {/* Imagem 2 */}
            <View style={{ alignItems: "center", marginBottom: 10}}>
                <Image
                    source={require("@/assets/images/imagem2.jpg")}
                    style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 1.5, // ajuste conforme a proporção da imagem (ex: 1.5, 0.75 etc)
                        // borderRadius: 12,
                    }}
                    resizeMode="contain"
                />
            </View>

            {/* Espaço extra no fim */}
            <View/>
        </ScrollView>
    );
}
