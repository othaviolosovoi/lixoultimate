import React from 'react';
import { Text, Platform } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

type GradientTextProps = {
    text: string;
    cor1: any;
    cor2: any;
    tamanho: number;
    fonte: string;
};

const GradientText: React.FC<GradientTextProps> = ({ text, cor1, cor2, tamanho, fonte }) => {
    if (Platform.OS === 'android') {
        // fallback no Android (sem gradiente, usa cor sólida)
        return (
            <Text style={{ fontSize: tamanho, fontFamily: fonte, color: cor1 }}>
                {text}
            </Text>
        );
    }

    return (
        <MaskedView
            maskElement={
                <Text
                    style={{
                        fontSize: tamanho,
                        fontFamily: fonte,
                        color: 'black',
                        textAlign: 'center',
                    }}
                >
                    {text}
                </Text>
            }
        >
            <LinearGradient
                colors={[cor1, cor2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
            />
        </MaskedView>
    );
};

export default GradientText;