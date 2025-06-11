import React from 'react';
import {FlatList, View, StyleSheet, ListRenderItemInfo} from 'react-native';
import {Lixo, lixoList} from "@/data/lixoList";
import LixoItem from "@/app/components/lixoItem";
import SeparatorItem from "@/app/components/SeparatorItem";
import {SafeAreaView} from "react-native-safe-area-context";
import LixoCoinItem from "@/app/components/lixoCoinItem";


export default function LixoCoinListaScrollavel() {
    function renderItem({ item }: ListRenderItemInfo<Lixo>) {
        return <LixoCoinItem {...item} />;
    }
    return (
        <View style={styles.container}>


            <FlatList
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={SeparatorItem}
                data={lixoList}
                renderItem={renderItem}

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
    item: {

        padding: 0,
        marginBottom: 6,
    },
    scrollContainer: {
        maxHeight: 50,
        borderRadius: 12,

    },
});
