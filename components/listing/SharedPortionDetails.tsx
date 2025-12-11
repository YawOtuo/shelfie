import { View } from "react-native";
import { Text } from "../ui/Text";
import { Scale, Package, Users, Calendar } from "lucide-react-native";
import { SharedPortionListing } from "../../lib/types/listing";

interface SharedPortionDetailsProps {
  details: SharedPortionListing;
}

export function SharedPortionDetails({ details }: SharedPortionDetailsProps) {
  const {
    total_weight,
    portion_size,
    portions_available,
    minimum_portion_order,
    cut_preference,
    processing_date,
    packaging_options,
  } = details;

  return (
    <View className="px-4 py-4">
      <Text className="text-lg font-bold text-gray-900 mb-4">Portion Details</Text>
      <View className="flex-row flex-wrap gap-3">
        <View className="w-[48%] bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center gap-2 mb-2">
            <Scale size={18} color="#11964a" />
            <Text className="text-xs text-gray-500 uppercase tracking-wide">Total Weight</Text>
          </View>
          {total_weight ? (
            <Text className="text-base font-semibold text-gray-900">
              {total_weight} kg
            </Text>
          ) : (
            <Text className="text-base font-semibold text-gray-400">N/A</Text>
          )}
        </View>
        <View className="flex-1 min-w-[140px] bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center gap-2 mb-2">
            <Package size={18} color="#11964a" />
            <Text className="text-xs text-gray-500 uppercase tracking-wide">Portion Size</Text>
          </View>
          {portion_size ? (
            <Text className="text-base font-semibold text-gray-900">
              {portion_size} kg
            </Text>
          ) : (
            <Text className="text-base font-semibold text-gray-400">N/A</Text>
          )}
        </View>
        <View className="flex-1 min-w-[140px] bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center gap-2 mb-2">
            <Users size={18} color="#11964a" />
            <Text className="text-xs text-gray-500 uppercase tracking-wide">Available</Text>
          </View>
          {portions_available !== undefined && portions_available !== null ? (
            <Text className="text-base font-semibold text-gray-900">
              {portions_available} portions
            </Text>
          ) : (
            <Text className="text-base font-semibold text-gray-400">N/A</Text>
          )}
        </View>
        <View className="flex-1 min-w-[140px] bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center gap-2 mb-2">
            <Package size={18} color="#11964a" />
            <Text className="text-xs text-gray-500 uppercase tracking-wide">Min Order</Text>
          </View>
          {minimum_portion_order ? (
            <Text className="text-base font-semibold text-gray-900">
              {minimum_portion_order} portions
            </Text>
          ) : (
            <Text className="text-base font-semibold text-gray-400">N/A</Text>
          )}
        </View>
      </View>

      <View className="mt-4">
        <View className="bg-white rounded-xl p-4 shadow-sm mb-3">
          <View className="flex-row items-center gap-2 mb-2">
            <Package size={18} color="#11964a" />
            <Text className="text-sm font-semibold text-gray-900">Cut Preference</Text>
          </View>
          {cut_preference ? (
            <Text className="text-sm text-gray-700">{cut_preference}</Text>
          ) : (
            <Text className="text-sm text-gray-400">N/A</Text>
          )}
        </View>
        <View className="bg-white rounded-xl p-4 shadow-sm mb-3">
          <View className="flex-row items-center gap-2 mb-2">
            <Calendar size={18} color="#11964a" />
            <Text className="text-sm font-semibold text-gray-900">Processing Date</Text>
          </View>
          {processing_date ? (
            <Text className="text-sm text-gray-700">{processing_date}</Text>
          ) : (
            <Text className="text-sm text-gray-400">N/A</Text>
          )}
        </View>
        <View className="bg-white rounded-xl p-4 shadow-sm mb-3">
          <View className="flex-row items-center gap-2 mb-2">
            <Package size={18} color="#11964a" />
            <Text className="text-sm font-semibold text-gray-900">Packaging Options</Text>
          </View>
          {packaging_options ? (
            <Text className="text-sm text-gray-700">{packaging_options}</Text>
          ) : (
            <Text className="text-sm text-gray-400">N/A</Text>
          )}
        </View>
      </View>
    </View>
  );
}
