import "./globals.css";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

export default function Welcome() {
  const { session } = useAuth();
  const router = useRouter();

  if (session) return <Redirect href="/" />;

  return (
    <>
      <LinearGradient
        colors={["#45BF55", "#008D80", "#000000"]}
        className="flex-1"
      >
        <SafeAreaView className="flex-1" edges={["bottom"]}>
          <View className="flex-[1] bg-transparent" />
          <View
            className="flex-[2] bg-black p-6 overflow-hidden justify-evenly"
            style={{
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
          >
            <View className="gap-4">
              <Text className="text-white text-4xl font-black text-center mb-4">
                Vetiverde
              </Text>
              <Text className="text-white text-lg text-center mb-8">
                Reporte resíduos descartados incorretamente e ajude a tornar sua
                cidade mais limpa!
              </Text>
            </View>
            <View className="gap-6">
              <TouchableOpacity
                activeOpacity={0.8}
                className="mb-4 rounded-full overflow-hidden"
                onPress={() => router.push("/signin")}
              >
                <LinearGradient
                  colors={["#45BF55", "#008D80"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ borderRadius: 9999 }}
                  className="p-[2px]"
                >
                  <View className="bg-black rounded-full py-4">
                    <MaskedView
                      maskElement={
                        <Text className="text-lg font-black text-center">
                          ENTRAR
                        </Text>
                      }
                    >
                      <LinearGradient
                        colors={["#45BF55", "#008D80"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ height: 24 }}
                      />
                    </MaskedView>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                className="rounded-full overflow-hidden"
                onPress={() => router.push("/register")}
              >
                <LinearGradient
                  colors={["#45BF55", "#008D80"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ borderRadius: 9999 }}
                  className="py-4"
                >
                  <Text className="text-black text-lg font-black text-center">
                    REGISTRAR
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}
