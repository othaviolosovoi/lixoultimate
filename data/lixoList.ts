import { ImageProps } from "react-native";


export interface Lixo {
    id: number;
    endereco: string;
    date: Date;
    // Coletado || Recusado || Pendente || Processando
    status: string;
    imagem: ImageProps["source"]
}

const img = require("../assets/images/teste_imagem.jpeg")

export const lixoList: Lixo[] = [
    {
        id: 1,
        endereco: "q",
        date: new Date("2025-05-10"),
        status: "Coletado",
        imagem: img
    },
    {
        id: 2,
        endereco: "Loremizxctametasdasdasasdasdasdasasascxd",
        date: new Date("2025-05-10"),
        status: "Pendente",
        imagem: img
    },
    {
        id: 3,
        endereco: "Lor sdvsdvdsvdssdvdsvdsvsdvvedss",
        date: new Date("2025-05-10"),
        status: "Recusado",
        imagem: img
    },
    {
        id: 4,
        endereco: "Lorem ipsum dolor sit amet",
        date: new Date("2025-05-10"),
        status: "Em Espera",
        imagem: img
    },
    {
        id: 5,
        endereco: "Lorem ipsum dolor sit amet",
        date: new Date("2025-05-10"),
        status: "Pendente",
        imagem: img
    },
    {
        id: 6,
        endereco: "Lorem ipsum dolor sit amet",
        date: new Date("2025-05-10"),
        status: "Coletado",
        imagem: img
    },
    {
        id: 7,
        endereco: "Lorem ipsum dolor sit amet",
        date: new Date("2025-05-10"),
        status: "Em Espera",
        imagem: img
    },
    {
        id: 8,
        endereco: "Lorem ipsum dolor sit amet",
        date: new Date("2025-05-10"),
        status: "Coletado",
        imagem: img
    },
    {
        id: 9,
        endereco: "Lorem ipsum dolor sit amet",
        date: new Date("2025-05-10"),
        status: "Pendente",
        imagem: img
    },
    {
        id: 10,
        endereco: "Lorem ipsum dolor sit amet",
        date: new Date("2025-05-10"),
        status: "Coletado",
        imagem: img
    }
];