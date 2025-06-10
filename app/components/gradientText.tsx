import React from 'react';
import { Text } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';


type GradientTextMaskProps = {
    text: any;
    fontSize?: number;
    fontFamily?: string;
    color1?: any;
    color2?: any;
};

export const GradientTextMask: React.FC<GradientTextMaskProps> = ({
       text,
       fontSize = 12,
       fontFamily = 'Nunito-Medium',
       color1 = '#ff0000',
       color2 = '#0000ff',
    }) => {
    return (
        <MaskedView
            maskElement={
                <Text
                    className="bg-transparent"
                    style={{ fontSize, fontFamily }}
                >
                    {text}
                </Text>
            }
        >
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={[color1 ?? "#A6A6A6", color2 ?? "#A6A6A6"]}
            >
                <Text
                    className="opacity-0"
                    style={{ fontSize, fontFamily }}
                >
                    {text}
                </Text>
            </LinearGradient>
        </MaskedView>
    );
};

export default GradientTextMask;
