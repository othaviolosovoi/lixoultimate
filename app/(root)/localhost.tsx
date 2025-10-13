// app/localhost.js
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { account } from "../../lib/appwriteConfig.js";
import { useAuth } from "../../context/AuthContext";

export default function OAuthRedirect() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const userId = searchParams.userId as string | undefined;
  const secret = searchParams.secret as string | undefined;
  const { setUser, setSession, setLoading } = useAuth();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      try {
        if (!userId || !secret) {
          console.error("Missing userId or secret in OAuth redirect");
          setLoading(false);
          router.replace("/signin");
          return;
        }

        console.log("Processing OAuth redirect with userId:", userId);

        const session = await account.createSession(userId, secret);
        if (!session) {
          throw new Error("Failed to create session");
        }

        const responseUser = await account.get();
        setUser(responseUser);
        setSession(session);
        setLoading(false);

        console.log("OAuth redirect successful, redirecting to home");
        router.replace("/");
      } catch (error) {
        if (error instanceof Error) {
          console.error("OAuth redirect error:", error.message);
        } else {
          console.error("OAuth redirect error:", error);
        }
        setLoading(false);
        router.replace("/signin");
      }
    };

    handleOAuthRedirect();
  }, [userId, secret]);

  return null;
}
