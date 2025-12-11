import { View, TouchableOpacity } from "react-native";
import { MapPin, ExternalLink } from "lucide-react-native";
import { Linking } from "react-native";
import { Text } from "./ui/Text";

interface LocationMapProps {
  location: string;
  latitude?: number;
  longitude?: number;
}

export function LocationMap({ location, latitude, longitude }: LocationMapProps) {
  const openInMaps = () => {
    if (latitude && longitude) {
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      Linking.openURL(url).catch((err) => console.error("Failed to open maps:", err));
    } else if (location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
      Linking.openURL(url).catch((err) => console.error("Failed to open maps:", err));
    }
  };

  return (
    <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <View className="px-4 py-3 border-b border-gray-100">
        <Text className="text-lg font-semibold text-gray-900">Location</Text>
      </View>
      
      <View className="h-48 bg-gray-100 items-center justify-center">
        <MapPin size={48} color="#9CA3AF" />
        <Text className="text-gray-500 text-sm mt-2 text-center px-4">
          Map view coming soon
        </Text>
      </View>

      <View className="px-4 py-4">
        <View className="flex-row items-start gap-3">
          <MapPin size={20} color="#11964a" className="mt-0.5" />
          <View className="flex-1">
            <Text className="text-base text-gray-900 font-medium">{location}</Text>
          </View>
        </View>
        
        <TouchableOpacity
          onPress={openInMaps}
          className="mt-4 flex-row items-center justify-center gap-2 bg-primary rounded-lg py-3"
        >
          <Text className="text-white font-semibold">Open in Maps</Text>
          <ExternalLink size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

