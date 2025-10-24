import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface TextoGuiaProps extends TextProps {
    children: React.ReactNode;
    tamanho?: number; // tamanho da fonte
    cor?: string;     // cor do texto
    negrito?: boolean; // se é bold
    fonte?: string;
}

const TextoGuia: React.FC<TextoGuiaProps> = ({
     children,
     tamanho = 20,
     cor = '#000',
     negrito = true,
     fonte = 'Nunito',
     style,
     ...rest
 }) => {
    return (
        <Text
            style={[
                styles.texto,
                { fontSize: tamanho, color: cor, fontFamily: negrito ? 'Nunito-Bold' : 'Nunito-Regular' },
                style,
            ]}
            {...rest}
        >
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    texto: {
        textAlign: 'justify',
        // aqui você pode colocar estilos padronizados que todo texto guia terá
    },
});

export default TextoGuia;
