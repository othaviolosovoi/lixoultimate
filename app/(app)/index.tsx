import "../globals.css";

import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Index() {
  const { user, session, signout } = useAuth();

  return (
    <SafeAreaView>
      <TouchableOpacity
        className="bg-black p-3 rounded-md items-center m-5"
        onPress={signout}
      >
        <Text className="color-white text-lg">Logout</Text>
      </TouchableOpacity>
      <View className="px-5">
        {session && <Text className="text-2xl">Hello {user.name}!</Text>}
      </View>
    </SafeAreaView>
  );
}
