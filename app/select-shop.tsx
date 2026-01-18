import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConnectShopStep } from "../components/login/ConnectShopStep";
import { Text } from "../components/ui/Text";

export default function SelectShopScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-primary-200">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={["left", "right", "top"]}>
        {/* Header with back button */}
        <View className="flex-row items-center px-6 py-4">
          <TouchableOpacity
            onPress={() => router.replace("/login")}
            className="mr-3 p-2 -ml-2"
            activeOpacity={0.7}
          >
            <ArrowLeft color="rgba(102, 82, 55, 0.7)" size={24} />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-primary-900 flex-1" variant="bold">
            Shelfie
          </Text>
        </View>

        {/* Shop Selection Component */}
        <ConnectShopStep
          onSuccess={() => router.replace("/(tabs)")}
        />
      </SafeAreaView>
    </View>
  );
}
