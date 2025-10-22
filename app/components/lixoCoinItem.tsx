import React from 'react';
import { View, Text, Image } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";


interface LixoCoinItemProps {
    id: string;
    date: string;
    status: string;
}

const formatDate = (isoDateString?: string): string => {
  if (!isoDateString) return 'Data indisponível';
  try {
    const dateObj = new Date(isoDateString);
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (e) {
    return 'Data inválida';
  }
};

export default function LixoCoinItem({ date, status }: LixoCoinItemProps) {
    let transactionValue: number | null = null;
    let valueColor = '#FFFFFF';
    let valueColor2 = '#FFFFFF';
    let description = 'Processando';
    let icon;

    switch (status) {
        case 'Coletado':
        case 'Não encontrado':
            transactionValue = 100;
            valueColor = '#45BF55';
            valueColor2 = '#008D80';
            description = 'Resíduo coletado';
            icon = require('../../assets/images/coin_icon.png');
            break;
        case 'A coletar':
        case 'Pendente':
            transactionValue = 100;
            valueColor = '#45BF55';
            valueColor2 = '#008D80';
            description = 'Resíduo A coletar';
            icon = require('../../assets/images/coin_icon.png');
            break;
        case 'Recusado':
        case 'Recusada':
            transactionValue = -50;
            valueColor = '#F22742';
            valueColor2 = '#FF576D';
            description = 'Detecção recusada';
            icon = require('../../assets/images/coin_icon_red.png');
            break;
        default:
            return null;
    }

    const formattedDate = formatDate(date);
    const valueString = transactionValue > 0 ? `+${transactionValue}` : `${transactionValue}`;

    return (
        <View className='w-full border-b border-gray-700 flex-row justify-between items-center py-4'>
            <View className='flex-col'>
                <Text className="text-white font-nunito text-[18px]">{description}</Text>
                
                <View className="flex-row items-center mt-1">  
                    <Text style={{color: '#A6A6A6', fontSize: 40, fontFamily: 'Nunito-Medium'}}>
                                        <MaskedView maskElement={
                                            <Text className='bg-transparent' style={{fontSize: 40, fontFamily: 'Nunito-Bold'}}>
                                                {valueString}
                                            </Text>
                                        }>
                                            <LinearGradient
                                                start={{x:0, y:0}}
                                                end={{x:1, y:1}}
                                                colors={[valueColor ?? "#A6A6A6", valueColor2 ?? "#A6A6A6"]}
                                            >
                                                <Text className='opacity-0' style={{fontSize: 40, fontFamily: 'Nunito-Bold'}}>
                                                    {valueString}
                                                </Text>
                                            </LinearGradient>
                                        </MaskedView>
                                    </Text>
                    <Image source={icon} className="w-9 h-9 ml-2" />
                </View>
            </View>
            <Text className="text-[#A6A6A6] font-nunito text-[12px] ">{formattedDate}</Text>       
        </View>
    );
}