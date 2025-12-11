import { View, TouchableOpacity } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Heart, Share2 } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text } from "./ui/Text";

interface DetailHeaderProps {
  title?: string;
  showBack?: boolean;
  onShare?: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

export function DetailHeader({
  title,
  showBack = true,
  onShare,
  onSave,
  isSaved = false,
}: DetailHeaderProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(isSaved);
  const insets = useSafeAreaInsets();

  const handleSave = () => {
    setSaved(!saved);
    onSave?.();
  };

  return (
    <View className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm">
      <View 
        className="flex-row items-center justify-between px-4 py-3"
        style={{ paddingTop: insets.top + 12 }}
      >
        {showBack && (
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-md shadow-lg"
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        {title && (
          <View className="flex-1 px-4">
            <Text className="text-base font-semibold text-white" numberOfLines={1}>
              {title}
            </Text>
          </View>
        )}
        <View className="flex-row items-center gap-2">
          {onShare && (
            <TouchableOpacity
              onPress={onShare}
              className="w-10 h-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-md shadow-lg"
            >
              <Share2 size={18} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          {onSave && (
            <TouchableOpacity
              onPress={handleSave}
              className="w-10 h-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-md shadow-lg"
            >
              <Heart
                size={18}
                color={saved ? "#EF4444" : "#FFFFFF"}
                fill={saved ? "#EF4444" : "transparent"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

