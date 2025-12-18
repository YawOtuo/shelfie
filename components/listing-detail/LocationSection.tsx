import { View } from "react-native";
import { MapPin } from "lucide-react-native";
import { Text } from "../ui/Text";
import { LocationMap } from "../LocationMap";

interface LocationSectionProps {
  displayLocation: string;
}

export function LocationSection({ displayLocation }: LocationSectionProps) {
  return (
    <View className="bg-white px-5 py-6 border-t border-gray-100" style={{ backgroundColor: '#FFFFFF' }}>
      <View className="flex-row items-center gap-2 mb-4">
        <MapPin size={18} color="#11964a" strokeWidth={2.5} />
        <Text className="text-lg font-bold text-gray-900">Location</Text>
      </View>
      <Text className="text-sm text-gray-700 mb-4">{displayLocation}</Text>
      <View className="rounded-2xl overflow-hidden">
        <LocationMap location={displayLocation} />
      </View>
    </View>
  );
}

