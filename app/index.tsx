import { Redirect } from "expo-router";

export default function IndexScreen() {
  // Redirect to login screen on app load
  return <Redirect href="/login" />;
}

