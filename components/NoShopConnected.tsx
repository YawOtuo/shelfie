import { useRouter } from "expo-router";
import { View } from "react-native";
import { EmptyState } from "./ui/EmptyState";
import { Button } from "./ui/Button";

interface NoShopConnectedProps {
  message?: string;
}

export function NoShopConnected({ message }: NoShopConnectedProps) {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center px-6">
      <EmptyState
        title="No Shop Connected"
        message={message || "Please connect to a shop or create one to get started"}
        action={
          <View className="gap-3 mt-4">
            <Button
              onPress={() => router.push("/select-shop")}
              size="md"
            >
              Connect to Shop
            </Button>
            <Button
              onPress={() => router.push("/create-shop")}
              variant="outline"
              size="md"
            >
              Create Shop
            </Button>
          </View>
        }
      />
    </View>
  );
}

