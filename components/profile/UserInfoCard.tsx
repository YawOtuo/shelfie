import { View } from "react-native";
import { Mail, Phone, MapPin } from "lucide-react-native";
import { Text } from "../ui/Text";
import { Card } from "../ui/Card";

interface UserInfoCardProps {
  email: string;
  phone: string;
  location: string;
}

export function UserInfoCard({ email, phone, location }: UserInfoCardProps) {
  return (
    <Card className="mx-4" padding="md">
      <View className="flex-col">
        <View className="flex-row items-center mb-3">
          <Mail color="#6B7280" size={18} />
          <Text className="ml-3 text-gray-700 flex-1">{email}</Text>
        </View>
        <View className="flex-row items-center mb-3">
          <Phone color="#6B7280" size={18} />
          <Text className="ml-3 text-gray-700 flex-1">{phone}</Text>
        </View>
        <View className="flex-row items-center">
          <MapPin color="#6B7280" size={18} />
          <Text className="ml-3 text-gray-700 flex-1">
            {location}
          </Text>
        </View>
      </View>
    </Card>
  );
}

