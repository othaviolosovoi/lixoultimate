import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import GradientText from "@/app/components/gradientText";
import TextoGuia from "@/app/components/textoGuia";

export default function Page2() {
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
                    4. Veja Suas Conquistas
                </GradientText>

            </Text>

            {/* Descrição */}
            <View style={{marginBottom: 20}}>
                <TextoGuia tamanho={16} cor="#FFFFFF" negrito={false}>
                    Na tela "Conquistas", você pode ver seu impacto:
                </TextoGuia>

            </View>

            <View style={{marginBottom: 10}}>
                <TextoGuia tamanho={16} cor="#FFFFFF" negrito={true}>
                    • O total
                    <TextoGuia tamanho={16} cor="#FFFFFF" negrito={false}> de fotos que você enviou e seus </TextoGuia>
                    dias de atividade no app.
                </TextoGuia>
            </View>

            {/* Imagem 3 */}
            <View style={{ alignItems: "center", marginBottom: 20}}>
                <Image
                    source={require("@/assets/images/imagem10.jpg")}
                    style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 1.2, // ajuste conforme a proporção da imagem (ex: 1.5, 0.75 etc)
                        // borderRadius: 12,
                    }}
                    resizeMode="contain"
                />
            </View>


            <View style={{marginBottom: 10}}>
                <TextoGuia tamanho={16} cor="#FFFFFF" negrito={true}>
                    • No futuro:<TextoGuia tamanho={16} cor="#FFFFFF" negrito={false}> teremos missões para você ganhar ainda mais LixoCoins!</TextoGuia>
                </TextoGuia>
            </View>




            {/* Espaço extra no fim */}
            <View/>
        </ScrollView>
    );
}
