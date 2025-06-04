import React, { useState } from 'react';
import {View, Text, TouchableOpacity, Modal, StyleSheet, Image} from 'react-native';
import {Lixo} from "@/data/lixoList";
import GradientText from "@/app/components/gradientText";

export default function LixoItem({id, endereco, date, status, imagem} : Lixo) {
    const [mostrarModal, setMostrarModal] = useState(false)

    let color;
    let simbolo;
    let avisoStatus;

    let color1;
    let color2;
    let tamanho;
    let fonte;

    switch(status){
        case 'Coletado':
            color1='#45BF55'
            color2='#008D80'
            color='#45BF55'
            simbolo=require('../../assets/images/ok_circle.png')
            avisoStatus='Coletada realizada com sucesso!'
            break

        case 'Pendente':
            color1='#F2FF88'
            color2='#DBF227'
            color='#DBF227'
            simbolo=require('../../assets/images/pending_circle.png')
            avisoStatus='Aguardando coleta de resíduos...'
            break

        case 'Recusado':
            color1='#F22742'
            color2='#FF576D'
            color='#F22742'
            simbolo=require('../../assets/images/x_circle.png')
            avisoStatus='A imagem não possui resíduos.'
            break

        default:
            color='#A6A6A6'
            simbolo=require('../../assets/images/processing_circle.png')
            avisoStatus='Aguardando análise...'
    }

    return (
        <View>
            <TouchableOpacity onPress={() => setMostrarModal(true)}>

                <View className='w-full rounded-md bg-[#262626] flex flex-row justify-between'>
                    {/*1*/}
                    <View className='justify-center p-2'>
                        {/*  IMAGEM AQUI  */}
                        <Image className="rounded-sm bg-white p-8 w-4 h-4 object-cover" source={imagem} />
                    </View>


                    {/*2*/}
                    <View className='pt-2 pb-2'>
                        <View>
                            <Text style={{color: '#FFFFFF', fontSize: 16, fontFamily: 'Nunito-Bold'}}>
                                Foto #{id}
                            </Text>
                        </View>
                        <View>
                            <Text style={{color: '#FFFFFF', fontSize: 14, fontFamily: 'Nunito-Regular'}}>
                                {endereco}
                            </Text>
                            <Text style={{color: '#A6A6A6', fontSize: 12, fontFamily: 'Nunito-Medium'}}>
                                {date.toLocaleDateString("pt-BR")}
                            </Text>
                        </View>
                    </View>

                    {/*3*/}
                    <View className='justify-center p-4'>
                        {/*  SÍMBOLO AQUI  */}
                        <View className='items-center'>
                            <Image alt="Ícone" className="rounded-sm p-4 w-4 h-4 object-cover" source={simbolo} />
                        </View>
                        <View className='items-center'>
                            <Text style={{color, fontSize:12, fontFamily:'Nunito-Bold'}}>{status}</Text>
                        </View>


                    </View>

                </View>



            </TouchableOpacity>

            {/* Modal */}
            <Modal visible={mostrarModal} transparent animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.modalContent}>

                        <View style={styles.exitCross}>
                            <View className="pr-2 pt-2">
                                <TouchableOpacity onPress={() => setMostrarModal(false)}>
                                    <Image
                                        source={require("../../assets/images/X.png")}
                                        style={{ width: 20, height: 20 }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>


                        <View className='rounded-sm flex flex-row justify-between'>
                            {/*1*/}
                            <View className='justify-center p-2'>
                                {/*  IMAGEM AQUI  */}
                                <Image className="rounded-sm bg-white p-8 w-4 h-4 object-cover" source={imagem} />
                            </View>

                            {/*2*/}
                            <View className='pt-2 pb-2'>
                                <View>
                                    <Text style={{color: '#FFFFFF', fontSize: 16, fontFamily: 'Nunito-Bold'}}>
                                        Foto #{id}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={{color: '#FFFFFF', fontSize: 14, fontFamily: 'Nunito-Regular'}}>
                                        {endereco}
                                    </Text>
                                    <Text style={{color: '#A6A6A6', fontSize: 12, fontFamily: 'Nunito-Medium'}}>
                                        {date.toLocaleDateString("pt-BR")}
                                    </Text>
                                </View>
                            </View>

                            {/*3*/}
                            <View className='justify-center p-4'>
                                {/*  SÍMBOLO AQUI  */}
                                <View className='items-center'>
                                    <Image alt="Ícone" className="rounded-sm p-4 w-4 h-4 object-cover" source={simbolo} />
                                </View>
                                <View className='items-center'>
                                    <Text style={{color, fontSize:12, fontFamily:'Nunito-Bold'}}>{status}</Text>
                                </View>

                            </View>

                        </View>

                        <View  className='pl-4'>
                            {/*ENDEREÇO*/}
                            <View className='pb-4'>
                                <Text style={{color: '#FFFFFF', fontSize: 12, fontFamily: 'Nunito-Bold'}}>
                                    Endereço
                                </Text>
                                <Text style={{color: '#FFFFFF', fontSize: 16, fontFamily: 'Nunito-Regular'}}>
                                    {endereco}
                                </Text>
                            </View>

                            {/*DATA*/}
                            <View className='pb-4'>
                                <Text style={{color: '#FFFFFF', fontSize: 12, fontFamily: 'Nunito-Bold'}}>
                                    Data
                                </Text>
                                <Text style={{color: '#A6A6A6', fontSize: 16, fontFamily: 'Nunito-Regular'}}>
                                    {date.toLocaleDateString("pt-BR")}
                                </Text>
                            </View>

                            {/*STATUS*/}
                            <View>
                                <Text style={{color: '#FFFFFF', fontSize: 12, fontFamily: 'Nunito-Bold'}}>
                                    Status
                                </Text>
                                <Text style={{color, fontSize: 16, fontFamily: 'Nunito-Medium'}}>
                                    {avisoStatus}
                                </Text>
                                {/*<GradientText cor1={color1} cor2={color2} tamanho={16} text={avisoStatus} fonte='Nunito-Medium'/>*/}


                            </View>

                        </View>

                    </View>
                </View>
            </Modal>
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
        borderRadius: 12,
        // width: '80%',
        paddingBottom: 20
    },
    exitCross:{
        alignItems:'flex-end',
        justifyContent:'flex-end'

    }
});
