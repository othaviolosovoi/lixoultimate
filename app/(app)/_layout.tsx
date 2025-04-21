import "../globals.css";
import { Slot, Redirect } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function AppLayout() {
  const { session } = useAuth();

  // If no session, redirect to welcome
  if (!session) return <Redirect href="/welcome" />;

  return <Slot />;
}
