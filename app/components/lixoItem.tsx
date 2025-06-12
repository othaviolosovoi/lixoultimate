import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
} from 'react-native';
import * as Location from 'expo-location';
import { WasteDetectionData } from '@/types/user_waste_images';


export interface LixoItemProps {
  itemData: WasteDetectionData; 
}

const formatModalDateTime = (isoDateString?: string): string => {
  if (!isoDateString) return 'Data indisponível';
  try {
    const dateObj = new Date(isoDateString);
    const date = dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    return `${date} - ${hours}:${minutes}`;
  } catch (e) {
    console.error('Error formatting modal date/time:', e);
    return 'Data inválida';
  }
};

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
    console.error('Error formatting date:', e);
    return 'Data inválida';
  }
};

async function getAddressFromCoordinates(
  latitude?: number,
  longitude?: number,
): Promise<{ cardAddress: string, modalAddress: string }> {
  const fallback = {
      cardAddress: 'Endereço não encontrado',
      modalAddress: 'Endereço não encontrado',
  };

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return {
        cardAddress: 'Coordenadas inválidas',
        modalAddress: 'Coordenadas inválidas',
    };
  }

  try {
    const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });

    if (addresses && addresses.length > 0) {
      const address = addresses[0];
      
      const cardAddress = [address.street, address.streetNumber, address.subregion]
        .filter(Boolean)
        .join(', ');

      const modalAddress = [address.street, address.streetNumber].filter(Boolean).join(', ') + (address.district ? ` - ${address.district}` : '');

      return { cardAddress, modalAddress };
    } else {
      return fallback;
    }
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    return {
        cardAddress: 'Não foi possível buscar o endereço',
        modalAddress: 'Não foi possível buscar o endereço',
    };
  }
}



export default function LixoItem({ itemData }: LixoItemProps) { 
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cardAddress, setCardAddress] = useState<string>('Buscando endereço...'); 
  const [modalAddress, setModalAddress] = useState<string>('Buscando endereço...'); 


  useEffect(() => {
    if (itemData && itemData.latitude != null && itemData.longitude != null) {
      setCardAddress('Buscando endereço...');
      setModalAddress('Buscando endereço...');
      getAddressFromCoordinates(itemData.latitude, itemData.longitude)
        .then(addresses => {
          setCardAddress(addresses.cardAddress);
          setModalAddress(addresses.modalAddress);
        })
        .catch(err => {
          console.error('Geocoding error in LixoItem:', err);
          setCardAddress('Endereço não encontrado');
          setModalAddress('Endereço não encontrado');
        });
    } else {
      setCardAddress('Coordenadas indisponíveis');
      setModalAddress('Coordenadas indisponíveis');
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
      avisoStatus = 'Aguardando a coleta dos resíduos';
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

  const cardDate = formatDate(itemData.date_taken);
  const modalDateTime = formatModalDateTime(itemData.date_taken);

  return (
    <View className="mb-3">
      <TouchableOpacity onPress={() => setMostrarModal(true)}>
        <View className="w-full rounded-md bg-[#262626] flex flex-row justify-between px-3 py-2">
          {itemData.base64 ? (
            <View className="justify-center mr-2">
              <Image
                className="rounded-sm bg-white w-16 h-16 object-cover"
                source={{ uri: `data:image/jpeg;base64,${itemData.base64}`}}
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
              Foto #{itemData.id.substring(0, 8)}...
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
              {cardAddress}
            </Text>
            <Text
              style={{
                color: '#A6A6A6',
                fontSize: 12,
                fontFamily: 'Nunito-Medium',
              }}
            >
              {cardDate}
            </Text>
          </View>
          <View className="w-20 justify-center items-center pl-1">
            <Image
              alt="Ícone Status"
              className="w-[24px] h-[24px] object-cover mb-1"
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

      <Modal
        visible={mostrarModal}
        transparent
        animationType="fade"
        onRequestClose={() => setMostrarModal(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Foto #{itemData.id.substring(0, 5)}</Text>
              <TouchableOpacity className="p-2" onPress={() => setMostrarModal(false)}>
                <Image
                  source={require('../../assets/images/X.png')}
                  style={{ width: 14, height: 14 }}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
              {itemData.base64 && (
                <Image
                  style={{ width: '100%', height: '100%', borderRadius: 8 }}
                  source={{ uri: `data:image/jpeg;base64,${itemData.base64}` }}
                  resizeMode="contain"
                />
              )}
            </View>

            <View style={styles.modalContent}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Endereço</Text>
                    <Text style={styles.infoValue}>{modalAddress}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Data</Text>
                    <Text style={styles.infoValue}>{modalDateTime}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Status</Text>
                    <Text style={[styles.infoValue, { color: color, fontFamily: 'Nunito-Bold' }]}>{avisoStatus}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#262626',
    borderRadius: 5,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
  imageContainer: {
    height: 200,
    marginHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#404040',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 15,
    borderRadius: 5,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    color: '#D0D0D0',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    marginBottom: 2,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
  },
});
