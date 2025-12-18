import { Redirect } from "expo-router";

export default function IndexScreen() {
  // Redirect to home screen on app load
  return <Redirect href="/(tabs)" />;
}

