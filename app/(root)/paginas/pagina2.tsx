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
                    2. Acompanhe seu Envio no Histórico
                </GradientText>

            </Text>

            {/* Descrição */}
            <View style={{marginBottom: 20}}>
                <TextoGuia tamanho={16} cor="#FFFFFF" negrito={false}>
                    Veja o que aconteceu com cada foto que você enviou na aba "Histórico".
                </TextoGuia>

            </View>

            <View style={{marginBottom: 10}}>
                <TextoGuia tamanho={16} cor="#FFFFFF" negrito={true}>
                    • A Coletar: <TextoGuia tamanho={16} cor="#FFFFFF" negrito={false}>Lixo identificado! Agora é só aguardar a coleta.</TextoGuia>
                </TextoGuia>
            </View>

            {/* Imagem 3 */}
            <View style={{ alignItems: "center", marginBottom: 20}}>
                <Image
                    source={require("@/assets/images/imagem3.jpg")}
                    style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 4, // ajuste conforme a proporção da imagem (ex: 1.5, 0.75 etc)
                        // borderRadius: 12,
                    }}
                    resizeMode="contain"
                />
            </View>


            <View style={{marginBottom: 10}}>
                <TextoGuia tamanho={16} cor="#FFFFFF" negrito={true}>
                    • Coletado: <TextoGuia tamanho={16} cor="#FFFFFF" negrito={false}>Ótima notícia! O lixo já foi retirado.</TextoGuia>
                </TextoGuia>
            </View>


            {/* Imagem 4 */}
            <View style={{ alignItems: "center", marginBottom: 20}}>
                <Image
                    source={require("@/assets/images/imagem4.jpg")}
                    style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 3.7, // ajuste conforme a proporção da imagem (ex: 1.5, 0.75 etc)
                        // borderRadius: 12,
                    }}
                    resizeMode="contain"
                />
            </View>



            <View style={{marginBottom: 10}}>
                <TextoGuia tamanho={16} cor="#FFFFFF" negrito={true}>
                    • Recusado: <TextoGuia tamanho={16} cor="#FFFFFF" negrito={false}>Não encontramos lixo na imagem.</TextoGuia>
                </TextoGuia>
            </View>


            {/* Imagem 5 */}
            <View style={{ alignItems: "center", marginBottom: 20}}>
                <Image
                    source={require("@/assets/images/imagem5.jpg")}
                    style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 4, // ajuste conforme a proporção da imagem (ex: 1.5, 0.75 etc)
                        // borderRadius: 12,
                    }}
                    resizeMode="contain"
                />
            </View>


            <View style={{marginBottom: 10}}>
                <TextoGuia tamanho={16} cor="#FFFFFF" negrito={false}>
                    Você também verá o
                    <TextoGuia tamanho={16} cor="#FFFFFF" negrito={true}> endereço</TextoGuia>,
                    a
                    <TextoGuia tamanho={16} cor="#FFFFFF" negrito={true}> data</TextoGuia>
                    , um
                    <TextoGuia tamanho={16} cor="#FFFFFF" negrito={true}> contorno do lixo encontrado </TextoGuia>
                     na foto e as
                    <TextoGuia tamanho={16} cor="#FFFFFF" negrito={true}> classes identificadas </TextoGuia>
                    , como Papel, Plástico, Metal e Vidro.
                </TextoGuia>
            </View>


            {/* Imagem 6 */}
            <View style={{ alignItems: "center", marginBottom: 20}}>
                <Image
                    source={require("@/assets/images/imagem6.jpg")}
                    style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 0.5, // ajuste conforme a proporção da imagem (ex: 1.5, 0.75 etc)
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
