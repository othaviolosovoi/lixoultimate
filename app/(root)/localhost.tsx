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
  const { setUser, setSession } = useAuth();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      try {
        if (!userId || !secret) {
          console.error("Missing userId or secret in OAuth redirect");
          router.replace("/signin");
          return;
        }

        const session = await account.createSession(userId, secret);
        if (!session) {
          throw new Error("Failed to create session");
        }

        const responseUser = await account.get();
        setUser(responseUser);
        setSession(session);

        router.replace("/");
      } catch (error) {
        if (error instanceof Error) {
          console.error("OAuth redirect error:", error.message);
        } else {
          console.error("OAuth redirect error:", error);
        }
        router.replace("/signin");
      }
    };

    handleOAuthRedirect();
  }, [userId, secret]);

  return null;
}
