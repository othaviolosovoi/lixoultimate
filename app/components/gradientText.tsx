import React from 'react';
import { Text, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

// @ts-ignore
const GradientText = ({ children, style, colors = ["#45BF55", "#008D80"] }) => {
    return (
        <MaskedView
            maskElement={
                <Text style={[style, styles.maskText]}>
                    {children}
                </Text>
            }
        >

            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                // @ts-ignore
                colors={colors}
            >
                <Text style={[style, styles.transparentText]}>
                    {children}
                </Text>
            </LinearGradient>
        </MaskedView>
    );
};

const styles = StyleSheet.create({
    maskText: {
        backgroundColor: 'transparent',
    },
    transparentText: {
        opacity: 0,
    },
});

export default GradientText;
