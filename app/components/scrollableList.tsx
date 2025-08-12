// import React from 'react';
// import {FlatList, View, StyleSheet, ListRenderItemInfo} from 'react-native';
// import {Lixo, lixoList} from "@/data/lixoList";
// import LixoItem from "@/app/components/lixoItem";
// import SeparatorItem from "@/app/components/SeparatorItem";

// export default function ListaScrollavel() {
//     function renderItem({ item }: ListRenderItemInfo<Lixo>) {
//         return <LixoItem {...item} />;
//     }
//     return (
//         <View style={styles.container}>

//             <FlatList
//                 keyExtractor={(item) => item.id.toString()}
//                 ItemSeparatorComponent={SeparatorItem}
//                 data={lixoList}
//                 renderItem={renderItem}
//                 style={{ height: "78%" }}
//             />

//         </View>

//     );
// }

// const styles = StyleSheet.create({

//     container: {
//         padding: 0,
//     },
//     item: {
//         padding: 0,
//         marginBottom: 8,
//     },
//     scrollContainer: {
//         maxHeight: 50,
//         borderRadius: 12,
//     },
// });
