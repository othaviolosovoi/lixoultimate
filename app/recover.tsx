import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { account } from "../lib/appwriteConfig";
import { LinearGradient } from "expo-linear-gradient";

export default function Recover() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;
  const secret = Array.isArray(params.secret)
    ? params.secret[0]
    : params.secret;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpdatePassword = async () => {
    setError(null);
    setSuccess(null);

    if (!newPassword || !confirmPassword) {
      setError("Por favor, preencha ambos os campos de senha.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (!userId || !secret) {
      setError("Link de recuperação inválido. Solicite um novo link.");
      return;
    }

    try {
      await account.updateRecovery(userId, secret, newPassword);
      setSuccess("Senha atualizada com sucesso! Redirecionando para login...");
      setTimeout(() => router.push("/signin"), 2000);
    } catch (err: any) {
      console.log("Update password error:", err.message, err.code);
      let errorMessage = "Erro ao atualizar a senha. Tente novamente.";
      if (err.code === 400) {
        errorMessage = "Link de recuperação inválido ou expirado.";
      } else if (err.code === 401) {
        errorMessage = "Credenciais inválidas. Solicite um novo link.";
      }
      setError(errorMessage);
    }
  };

  return (
    <LinearGradient
      colors={["#45BF55", "#008D80", "#000000"]}
      className="flex-1"
    >
      <View className="flex-1 justify-center p-6">
        <Text className="text-2xl text-white text-center mb-4 font-poppinsBold">
          Redefinir Senha
        </Text>
        <View className="flex-row items-center bg-[#262626] rounded-lg p-3 mb-4">
          <TextInput
            placeholder="Nova senha"
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-white font-nunitoBold text-xl"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
        </View>
        <View className="flex-row items-center bg-[#262626] rounded-lg p-3 mb-4">
          <TextInput
            placeholder="Confirmar nova senha"
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-white font-nunitoBold text-xl"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
        {error && (
          <Text className="text-red-500 text-center mb-4">{error}</Text>
        )}
        {success && (
          <Text className="text-green-500 text-center mb-4">{success}</Text>
        )}
        <TouchableOpacity
          className="rounded-full overflow-hidden"
          onPress={handleUpdatePassword}
        >
          <LinearGradient
            colors={["#45BF55", "#008D80"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 9999 }}
            className="py-4"
          >
            <Text className="text-xl font-poppinsBold text-center p-1">
              Atualizar Senha
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
