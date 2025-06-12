import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Lixo } from '@/data/lixoList';

interface ExtratoItemProps {
    item: Lixo;
}

const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export default function ExtratoItem({ item }: ExtratoItemProps) {
    let value: number;
    let description: string;
    let valueColor: string;
    let iconBgColor: string;

    switch (item.status) {
        case 'Coletado':
            value = 100;
            description = 'Resíduo Coletado';
            valueColor = '#4CAF50';
            iconBgColor = 'bg-green-700';
            break;
        case 'Pendente':
        case 'A coletar':
            value = 100;
            description = 'Detecção Enviada';
            valueColor = '#FFEB3B'; 
            iconBgColor = 'bg-yellow-500';
            break;
        case 'Recusado':
        case 'Recusada':
            value = -50;
            description = 'Detecção Recusada';
            valueColor = '#F44336'; 
            iconBgColor = 'bg-red-700';
            break;
        default:
            return null;
    }

    const valueString = value > 0 ? `+${value}` : `${value}`;

    return (
        <View className="flex-row justify-between items-center py-4 border-b border-gray-700">

            <View>
                <Text className="text-white text-base font-semibold">{description}</Text>
                <Text style={{ color: valueColor }} className="text-lg font-bold mt-1">
                    {valueString}
                </Text>
            </View>

            <View className="items-end">
                <Text className="text-gray-400 text-xs">{formatDate(item.date)}</Text>
                <View className={`w-10 h-10 rounded-full justify-center items-center mt-1 ${iconBgColor}`}>
                    <FontAwesome5 name="coins" size={16} color="white" />
                </View>
            </View>
        </View>
    );
}
