import React from "react";
import {
    Text,
    View,
    Image,
    TouchableOpacity,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

export default function LixoCoinHeader({
   onReturnPress,
}: {
    onReturnPress: () => void;
}) {

    return (
        <View className="flex-row justify-between items-center w-full px-4 h-24 bg-[#0d0d0d] border-b border-gray-700">
            <TouchableOpacity onPress={onReturnPress} className="justify-center items-center rounded-full">
                <Image className="w-35 h-35 object-cover" source={require("../../assets/images/navigate_next_left.png")} />
            </TouchableOpacity>
            <View className='flex-row gap-2 items-center'>
                <Text style={{color:"#FFFFFF", fontFamily:"Poppins-Bold", fontSize:24}}>Minhas</Text>
                <View>
                    <MaskedView maskElement={
                        <Text className='bg-transparent' style={{fontSize: 24, fontFamily: 'Poppins-Bold'}}>
                            LixoCoins
                        </Text>
                    }>
                        <LinearGradient
                            start={{x:0, y:0}}
                            end={{x:1, y:1}}
                            colors={["#45BF55", "#008D80"]}
                        >
                            <Text className='opacity-0' style={{fontSize: 24, fontFamily: 'Poppins-Bold'}}>
                                LixoCoins
                            </Text>
                        </LinearGradient>
                    </MaskedView>
                </View>
            </View>

            <View className="p-4"></View>
        </View>
    );
}