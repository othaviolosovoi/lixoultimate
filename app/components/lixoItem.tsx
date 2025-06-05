import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
} from 'react-native';

import { WasteDetectionData } from '@/types/user_waste_images';


export interface LixoItemProps {
  itemData: WasteDetectionData; 
}


const formatDisplayDate = (isoDateString?: string): string => {
  if (!isoDateString) return 'Data indisponível';
  try {
    const dateObj = new Date(isoDateString);
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    return `${hours}h${minutes}min`;
  } catch (e) {
    console.error('Error formatting display date:', e);
    return 'Data inválida';
  }
};

const formatModalDate = (isoDateString?: string): string => {
  if (!isoDateString) return 'Data indisponível';
  try {
    const dateObj = new Date(isoDateString);
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (e) {
    console.error('Error formatting modal date:', e);
    return 'Data inválida';
  }
};

async function getAddressFromCoordinates(
  latitude?: number,
  longitude?: number,
): Promise<string> {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return 'Coordenadas inválidas';
  }

  console.warn('Geocoding API (LixoItem) não implementada. Retornando coordenadas.');
  return `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
}



export default function LixoItem({ itemData }: LixoItemProps) { 
  const [mostrarModal, setMostrarModal] = useState(false);
  const [displayAddress, setDisplayAddress] =
    useState<string>('Buscando endereço...'); 


  useEffect(() => {
    if (itemData && itemData.latitude != null && itemData.longitude != null) {
      setDisplayAddress('Buscando endereço...'); // Reseta ao trocar itemData
      getAddressFromCoordinates(itemData.latitude, itemData.longitude)
        .then(setDisplayAddress)
        .catch(err => {
          console.error('Geocoding error in LixoItem:', err);
          setDisplayAddress('Endereço não encontrado');
        });
    } else {
      setDisplayAddress('Coordenadas indisponíveis');
    }
  }, [itemData])


  if (!itemData) {
    return (
      <View className="h-[80px] justify-center items-center p-3 bg-gray-700 rounded-md my-1 w-full">
        <Text className="text-gray-400 text-sm">Dados da detecção indisponíveis.</Text>
      </View>
    );
  }


  let color;
  let simbolo;
  let avisoStatus;

  switch (itemData.status) { 
    case 'Coletado':
      color = '#45BF55';
      simbolo = require('../../assets/images/ok_circle.png');
      avisoStatus = 'Coleta realizada com sucesso!';
      break;
    case 'Pendente':
    case 'A coletar': 
      color = '#DBF227';
      simbolo = require('../../assets/images/pending_circle.png');
      avisoStatus = 'Aguardando coleta de resíduos...';
      break;
    case 'Recusado':
    case 'Recusada': 
      color = '#F22742';
      simbolo = require('../../assets/images/x_circle.png');
      avisoStatus = 'A imagem não possui resíduos.';
      break;
    default:
      color = '#A6A6A6';
      simbolo = require('../../assets/images/processing_circle.png');
      avisoStatus = 'Status desconhecido...'; 
  }

  const displayDate = formatDisplayDate(itemData.date_taken);
  const modalFullDate = formatModalDate(itemData.date_taken);

  return (
    <View className="mb-3">
      <TouchableOpacity onPress={() => setMostrarModal(true)}>
        <View className="w-full rounded-md bg-[#262626] flex flex-row justify-between p-2">
          {itemData.base64 ? (
            <View className="justify-center mr-2">
              <Image
                className="rounded-sm bg-white w-16 h-16 object-cover"
                source={{ uri: `data:image/jpeg;base64,${itemData.base64}` }}
              />
            </View>
          ) : (
            <View className="w-16 h-16 mr-2 bg-gray-500 rounded-sm" />
          )}
          <View className="flex-1 pt-1 pb-1">
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontFamily: 'Nunito-Bold',
              }}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              Foto #{itemData.id.substring(0, 8)}... {/* id */}
            </Text>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 14,
                fontFamily: 'Nunito-Regular',
                marginVertical: 1,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {displayAddress}
            </Text>
            <Text
              style={{
                color: '#A6A6A6',
                fontSize: 12,
                fontFamily: 'Nunito-Medium',
              }}
            >
              {displayDate}
            </Text>
          </View>
          <View className="w-20 justify-center items-center pl-1">
            <Image
              alt="Ícone Status"
              className="w-6 h-6 object-cover mb-1"
              source={simbolo}
            />
            <Text
              style={{ color, fontSize: 12, fontFamily: 'Nunito-Bold' }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {itemData.status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={mostrarModal}
        transparent
        animationType="fade"
        onRequestClose={() => setMostrarModal(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.exitCross}>
              <TouchableOpacity className="p-2" onPress={() => setMostrarModal(false)}>
                <Image
                  source={require('../../assets/images/X.png')}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </View>
            <View className="items-center px-2 pb-2">
              {itemData.base64 && (
                <Image
                  className="rounded-md bg-white w-64 h-64 object-contain mb-4"
                  source={{ uri: `data:image/jpeg;base64,${itemData.base64}` }}
                  resizeMode="contain"
                />
              )}
            </View>
            <View className="px-4">
              <View className="pb-4">
                <Text style={{color: '#FFFFFF', fontSize: 12, fontFamily: 'Nunito-Bold', marginBottom: 2}}>
                  ID da Detecção
                </Text>
                <Text style={{color: '#FFFFFF', fontSize: 16, fontFamily: 'Nunito-Regular'}}>
                  {itemData.id}
                </Text>
              </View>
              <View className="pb-4">
                <Text style={{color: '#FFFFFF', fontSize: 12, fontFamily: 'Nunito-Bold', marginBottom: 2}}>
                  Endereço
                </Text>
                <Text style={{color: '#FFFFFF', fontSize: 16, fontFamily: 'Nunito-Regular'}}>
                  {displayAddress}
                </Text>
              </View>
              <View className="pb-4">
                <Text style={{color: '#FFFFFF', fontSize: 12, fontFamily: 'Nunito-Bold', marginBottom: 2}}>
                  Data da Captura
                </Text>
                <Text style={{color: '#A6A6A6', fontSize: 16, fontFamily: 'Nunito-Regular'}}>
                  {modalFullDate} às {displayDate}
                </Text>
              </View>
              <View>
                <Text style={{color: '#FFFFFF', fontSize: 12, fontFamily: 'Nunito-Bold', marginBottom: 2}}>
                  Status
                </Text>
                <Text style={{ color, fontSize: 16, fontFamily: 'Nunito-Medium' }}>
                  {avisoStatus}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#262626',
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    paddingBottom: 20,
    // paddingTop: 5
  },
  exitCross: {
    alignItems: 'flex-end',
    // justifyContent: 'flex-end'
  },
});