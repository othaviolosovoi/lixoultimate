import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import GradientText from "@/app/components/gradientText";
import TextoGuia from "@/app/components/textoGuia";

export default function Page3() {
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
                    3. Ganhe LixoCoins
                </GradientText>

            </Text>

            {/* Descrição */}
            <View style={{marginBottom: 20}}>
                <TextoGuia tamanho={16} cor="#FFFFFF" negrito={false}>
                    Ganhe pontos por cada contribuição!
                </TextoGuia>

            </View>

            <View style={{marginBottom: 10}}>
                <TextoGuia tamanho={16} cor="#FFFFFF" negrito={true}>
                    • Foto foi aprovada? <TextoGuia tamanho={16} cor="#FFFFFF" negrito={false}>Você ganha LixoCoins.</TextoGuia>
                </TextoGuia>
            </View>

            {/* Imagem 3 */}
            <View style={{ alignItems: "center", marginBottom: 20}}>
                <Image
                    source={require("@/assets/images/imagem7.jpg")}
                    style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 3, // ajuste conforme a proporção da imagem (ex: 1.5, 0.75 etc)
                        // borderRadius: 12,
                    }}
                    resizeMode="contain"
                />
            </View>


            <View style={{marginBottom: 10}}>
                <TextoGuia tamanho={16} cor="#FFFFFF" negrito={true}>
                    • Lixo foi coletado? <TextoGuia tamanho={16} cor="#FFFFFF" negrito={false}>Você ganha um bônus de LixoCoin.</TextoGuia>
                </TextoGuia>
            </View>


            {/* Imagem 4 */}
            <View style={{ alignItems: "center", marginBottom: 20}}>
                <Image
                    source={require("@/assets/images/imagem8.jpg")}
                    style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 2.7, // ajuste conforme a proporção da imagem (ex: 1.5, 0.75 etc)
                        // borderRadius: 12,
                    }}
                    resizeMode="contain"
                />
            </View>



            <View style={{marginBottom: 10}}>
                <TextoGuia tamanho={16} cor="#FFFFFF" negrito={true}>
                    • Foto foi recusada? <TextoGuia tamanho={16} cor="#FFFFFF" negrito={false}>Você perde alguns LixoCoins.</TextoGuia>
                </TextoGuia>
            </View>


            {/* Imagem 5 */}
            <View style={{ alignItems: "center", marginBottom: 20}}>
                <Image
                    source={require("@/assets/images/imagem9.jpg")}
                    style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 3, // ajuste conforme a proporção da imagem (ex: 1.5, 0.75 etc)
                        // borderRadius: 12,
                    }}
                    resizeMode="contain"
                />
            </View>


            <View style={{marginBottom: 10}}>
                <TextoGuia tamanho={16} cor="#FFFFFF" negrito={false}>
                    <TextoGuia tamanho={16} cor="#FFFFFF" negrito={true}>Por Enquanto</TextoGuia>, os LixoCoins funcionam como pontuação. No futuro, você poderá usá-los de outras formas!
                </TextoGuia>
            </View>

            {/* Espaço extra no fim */}
            <View/>
        </ScrollView>
    );
}
