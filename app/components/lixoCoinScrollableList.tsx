import React from 'react';
import { FlatList, View, StyleSheet, ListRenderItemInfo, Text } from 'react-native';
import LixoCoinItem from "@/app/components/lixoCoinItem";
import { WasteDetectionData } from '@/types/user_waste_images';

export default function LixoCoinListaScrollavel({ data }: { data: WasteDetectionData[] }) {
    
    function renderItem({ item }: ListRenderItemInfo<WasteDetectionData>) {
        return <LixoCoinItem 
                 id={item.id} 
                 status={item.status} 
                 date={item.date_taken} 
               />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                keyExtractor={(item) => item.id.toString()}
                data={data}
                renderItem={renderItem}
                ListEmptyComponent={() => (
                    <View className="flex-1 justify-center items-center mt-10">
                        <Text className="text-gray-500 font-nunito text-lg">
                            Nenhuma transação encontrada.
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
        width: "100%",
        alignItems: "center",
        margin:0,
        height: "100%",
        flex: 1
    },
});