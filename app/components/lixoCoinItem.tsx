import React, { useState } from 'react';
import {View, Text, TouchableOpacity, Modal, StyleSheet, Image} from 'react-native';
import {Lixo} from "@/data/lixoList";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import GradientTextMask from "@/app/components/gradientText";



export default function LixoCoinItem({id, date, status} : Lixo) {

    let simbolo;
    let quantidadeLixoCoin;
    let quantidadeLixoCoinDisplay;
    let aviso;

    let color1;
    let color2;


    switch(status){
        case 'Coletado':
            color1='#45BF55'
            color2='#008D80'
            simbolo=require('../../assets/images/coin_icon.png')
            aviso='Resíduo Coletado'
            quantidadeLixoCoin=50
            quantidadeLixoCoinDisplay=`+${quantidadeLixoCoin}`
            break

        case 'Pendente':
            color1='#45BF55'
            color2='#008D80'
            simbolo=require('../../assets/images/coin_icon.png')
            aviso='Resíduo Pendente'
            quantidadeLixoCoin=30
            quantidadeLixoCoinDisplay=`+${quantidadeLixoCoin}`
            break

        case 'Recusado':
            color1='#F22742'
            color2='#FF576D'
            simbolo=require('../../assets/images/coin_icon_red.png')
            aviso='Resíduo Recusado'
            quantidadeLixoCoin=-80
            quantidadeLixoCoinDisplay=`${quantidadeLixoCoin}`
            break

        default:
            simbolo=require('../../assets/images/processing_circle.png')
            aviso='Carregando...'

    }

    return (
            <View className='w-full border-b border-gray-700 flex-row justify-between'>




                    <View className='w-full rounded-md flex flex-row justify-between'>


                        <View className='w-full flex flex-row items-start justify-around py-2'>



                            {/*1*/}
                            <View className='flex-1'>
                                <View>
                                    <Text style={{ color: '#FFFFFF', fontSize:  16, fontFamily: 'Nunito-Regular'}}>
                                        {aviso}
                                    </Text>
                                </View>
                                <View className='flex-row items-center gap-2'>

                                    <Text style={{color: '#A6A6A6', fontSize: 40, fontFamily: 'Nunito-Medium'}}>
                                        <MaskedView maskElement={
                                            <Text className='bg-transparent' style={{fontSize: 40, fontFamily: 'Nunito-Bold'}}>
                                                {quantidadeLixoCoinDisplay}
                                            </Text>
                                        }>
                                            <LinearGradient
                                                start={{x:0, y:0}}
                                                end={{x:1, y:1}}
                                                colors={[color1 ?? "#A6A6A6", color2 ?? "#A6A6A6"]}

                                            >
                                                <Text className='opacity-0' style={{fontSize: 40, fontFamily: 'Nunito-Bold'}}>
                                                    {quantidadeLixoCoinDisplay}
                                                </Text>
                                            </LinearGradient>
                                        </MaskedView>
                                    </Text>
                                    <View className='items-center'>
                                        <Image alt="Ícone" className="rounded-sm w-9 h-9 object-cover" source={simbolo} />
                                    </View>

                                </View>
                            </View>

                            {/*3*/}
                            <View className='justify-start items-start'>
                                {/*  SÍMBOLO AQUI  */}




                                <Text style={{color: '#A6A6A6', fontSize: 12, fontFamily: 'Nunito-Medium'}}>
                                    {date.toLocaleDateString("pt-BR")}
                                </Text>




                            </View>


                        </View>

                        {/*3*/}
                        {/*<View className='bg-amber-950 justify-center items-center py-4'>*/}
                        {/*    /!*  SÍMBOLO AQUI  *!/*/}
                        {/*    <View className='items-center'>*/}
                        {/*        <Image alt="Ícone" className="rounded-sm p-4 object-cover" source={simbolo} />*/}
                        {/*    </View>*/}

                        {/*    <View className='justify-start items-center'>*/}

                        {/*        <MaskedView maskElement={*/}
                        {/*            <Text className='bg-transparent' style={{fontSize: 12, fontFamily: 'Nunito-Bold'}}>*/}
                        {/*                {status}*/}
                        {/*            </Text>*/}
                        {/*        }>*/}
                        {/*            <LinearGradient*/}
                        {/*                start={{x:0, y:0}}*/}
                        {/*                end={{x:1, y:1}}*/}
                        {/*                colors={[color1 ?? "#A6A6A6", color2 ?? "#A6A6A6"]}*/}

                        {/*            >*/}
                        {/*                <Text className='opacity-0' style={{fontSize: 12, fontFamily: 'Nunito-Bold'}}>*/}
                        {/*                    {status}*/}
                        {/*                </Text>*/}
                        {/*            </LinearGradient>*/}
                        {/*        </MaskedView>*/}

                        {/*    </View>*/}


                        {/*</View>*/}

                    </View>




                {/*3*/}
                {/*<View className='bg-amber-950 justify-center items-center py-4'>*/}
                {/*    /!*  SÍMBOLO AQUI  *!/*/}
                {/*    <View className='items-center'>*/}
                {/*        <Image alt="Ícone" className="rounded-sm p-4 object-cover" source={simbolo} />*/}
                {/*    </View>*/}

                {/*    <View className='justify-start items-center'>*/}

                {/*        <MaskedView maskElement={*/}
                {/*            <Text className='bg-transparent' style={{fontSize: 12, fontFamily: 'Nunito-Bold'}}>*/}
                {/*                {status}*/}
                {/*            </Text>*/}
                {/*        }>*/}
                {/*            <LinearGradient*/}
                {/*                start={{x:0, y:0}}*/}
                {/*                end={{x:1, y:1}}*/}
                {/*                colors={[color1 ?? "#A6A6A6", color2 ?? "#A6A6A6"]}*/}

                {/*            >*/}
                {/*                <Text className='opacity-0' style={{fontSize: 12, fontFamily: 'Nunito-Bold'}}>*/}
                {/*                    {status}*/}
                {/*                </Text>*/}
                {/*            </LinearGradient>*/}
                {/*        </MaskedView>*/}

                {/*    </View>*/}


                {/*</View>*/}

            </View>


    );
}

const styles = StyleSheet.create({
    botao: {
        backgroundColor: '#262626',
        padding: 16,
        borderRadius: 12,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#262626',
        // alignItems:"",
        borderRadius: 5,
        // width: '80%',
        paddingBottom: 20
    },
    exitCross:{
        alignItems:'flex-end',
        justifyContent:'flex-end'

    }
});
