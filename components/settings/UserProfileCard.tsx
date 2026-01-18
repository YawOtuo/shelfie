import { TouchableOpacity, View, Platform } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { colors } from "../../lib/colors";

interface UserProfileCardProps {
  username?: string;
  email?: string;
  phoneNumber?: string;
  onPress: () => void;
}

export function UserProfileCard({
  username,
  email,
  phoneNumber,
  onPress,
}: UserProfileCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
    >
      <Card 
        className="overflow-hidden"
        style={{
          backgroundColor: colors.white,
          ...Platform.select({
            ios: {
              shadowColor: colors.gray[400],
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            },
            android: {
              elevation: 2,
            },
          }),
        }}
      >
        <View 
          className="absolute top-0 left-0 right-0 h-24"
          style={{ 
            backgroundColor: colors.primary[500],
            opacity: 0.08,
          }} 
        />
        <View className="p-5">
          <View className="flex-row items-center">
            <View 
              className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
              style={{
                backgroundColor: colors.primary.DEFAULT,
                ...Platform.select({
                  ios: {
                    shadowColor: colors.primary.DEFAULT,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  },
                  android: {
                    elevation: 4,
                  },
                }),
              }}
            >
              <Text className="text-white text-lg" variant="bold">
                {username?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg text-gray-900 mb-1" variant="bold">
                {username || "User"}
              </Text>
              <Text className="text-xs text-gray-500">
                {email || phoneNumber || "No contact info"}
              </Text>
            </View>
            <ChevronRight color={colors.gray[400]} size={20} />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
