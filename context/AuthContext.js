import { useContext, createContext, useState, useEffect } from "react";
import { Text, SafeAreaView, View } from "react-native";
import { account } from "../lib/appwriteConfig.js";
import { ID } from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import { OAuthProvider } from "react-native-appwrite";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    checkAuth();
  };

  const checkAuth = async () => {
    try {
      const currentSession = await account.getSession("current");
      if (currentSession) {
        const response = await account.get();
        setUser(response);
        setSession(currentSession);
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.log("CheckAuth error:", error.message);
      setUser(null);
      setSession(null);
    }
    setLoading(false);
    setShowLoadingScreen(false);
  };

  const register = async ({ name, email, password }) => {
    setLoading(true);
    try {
      await account.create(ID.unique(), email, password, name);
      const responseSession = await account.createEmailPasswordSession(
        email,
        password
      );
      setSession(responseSession);
      const responseUser = await account.get();
      setUser(responseUser);
    } catch (error) {
      console.log("Register error:", error.message);
      let errorMessage = "Erro ao registrar. Tente novamente.";
      if (error.code === 409) {
        errorMessage = "Este email já está registrado.";
      } else if (error.code === 400) {
        errorMessage = "Email ou senha inválidos. Verifique os dados.";
      }
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signin = async ({ email, password }) => {
    setLoading(true);
    try {
      const responseSession = await account.createEmailPasswordSession(
        email,
        password
      );
      setSession(responseSession);
      const responseUser = await account.get();
      setUser(responseUser);
    } catch (error) {
      console.log("Signin error:", error.message);
      let errorMessage = "Erro ao fazer login. Tente novamente.";
      if (error.code === 401) {
        errorMessage = "Email ou senha incorretos.";
      } else if (error.code === 400) {
        errorMessage = "Email ou senha inválidos. Verifique os dados.";
      }
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setLoading(true);
    try {
      const redirectUri = Linking.createURL("/");
      console.log("Redirect URI:", redirectUri);

      const response = await account.createOAuth2Token(
        OAuthProvider.Google,
        redirectUri
      );

      if (!response) throw new Error("Failed to login");

      const browserResult = await openAuthSessionAsync(
        response.toString(),
        redirectUri
      );

      if (browserResult.type !== "success") {
        throw new Error("Failed to login with Google");
      }

      const url = new URL(browserResult.url);
      const secret = url.searchParams.get("secret")?.toString();
      const userId = url.searchParams.get("userId")?.toString();

      if (!secret || !userId) {
        throw new Error("Failed to retrieve secret or userId from URL");
      }

      const session = await account.createSession(userId, secret);

      if (!session) throw new Error("Failed to create session");

      const responseUser = await account.get();
      setUser(responseUser);
      setSession(session);
    } catch (error) {
      console.log("Google login error:", error.message);
      throw new Error("Erro ao fazer login com Google. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const signout = async () => {
    setLoading(true);
    try {
      await account.deleteSession("current");
      setSession(null);
      setUser(null);
    } catch (error) {
      console.log("Signout error:", error.message);
    }
    setLoading(false);
  };

  const resetPassword = async (email) => {
    setLoading(true);
    try {
      const redirectUrl = "lixoultimate://recover";
      console.log(
        "Sending recovery email to:",
        email,
        "with redirect:",
        redirectUrl
      );
      await account.createRecovery(email, redirectUrl);
      return "Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.";
    } catch (error) {
      console.log("Reset password error:", error.message, error.code);
      let errorMessage =
        "Erro ao enviar email de recuperação. Tente novamente.";
      if (error.code === 400) {
        errorMessage = "Email inválido. Verifique o endereço de email.";
      } else if (error.code === 429) {
        errorMessage = "Muitas tentativas. Tente novamente mais tarde.";
      }
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const contextData = {
    session,
    user,
    signin,
    signout,
    register,
    googleLogin,
    resetPassword,
    loading,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading && showLoadingScreen ? (
        <SafeAreaView>
          <View className="flex-1 justify-center items-center bg-black">
            <Text className="text-5xl">Carregando..</Text>
          </View>
        </SafeAreaView>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { useAuth, AuthContext, AuthProvider };
