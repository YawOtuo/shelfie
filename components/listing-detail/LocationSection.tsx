import { View } from "react-native";
import { MapPin } from "lucide-react-native";
import { Text } from "../ui/Text";
import { LocationMap } from "../LocationMap";

interface LocationSectionProps {
  displayLocation: string;
}

export function LocationSection({ displayLocation }: LocationSectionProps) {
  return (
    <View className="px-4 py-4 bg-white mx-4 my-3 rounded-xl shadow-sm border border-gray-100">
      <View className="flex-row items-center gap-2 mb-3">
        <MapPin size={18} color="#11964a" />
        <Text className="text-lg font-bold text-gray-900">Location</Text>
      </View>
      <Text className="text-sm text-gray-700 mb-3">{displayLocation}</Text>
      <LocationMap location={displayLocation} />
    </View>
  );
}

