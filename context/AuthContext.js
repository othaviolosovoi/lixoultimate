import { useContext, createContext, useState, useEffect } from "react";
import { Text, SafeAreaView } from "react-native";
import { account } from "../lib/appwriteConfig.js";
import { ID } from "react-native-appwrite";

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
      await account.createRecovery(email, "https://example.com/reset-password");
    } catch (error) {
      console.log("Reset password error:", error.message);
      throw new Error("Erro ao enviar email de recuperação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const contextData = { session, user, signin, signout, register, loading };
  return (
    <AuthContext.Provider value={contextData}>
      {loading && showLoadingScreen ? (
        <SafeAreaView>
          <Text className="text-5xl">Loading..</Text>
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
