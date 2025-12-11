import { View } from "react-native";
import { Text } from "../ui/Text";
import { Scale, Package, Calendar, Award, Snowflake } from "lucide-react-native";
import { FrozenListing } from "../../lib/types/listing";

interface FrozenDetailsProps {
  details: FrozenListing;
}

export function FrozenDetails({ details }: FrozenDetailsProps) {
  const {
    weight,
    cut_type,
    packaging_type,
    storage_instructions,
    shelf_life,
    processing_date,
    certification,
  } = details;

  return (
    <View className="px-4 py-4">
      <Text className="text-lg font-bold text-gray-900 mb-4">Frozen Product Details</Text>
      <View className="flex-row flex-wrap gap-3">
        <View className="w-[48%] bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center gap-2 mb-2">
            <Scale size={18} color="#11964a" />
            <Text className="text-xs text-gray-500 uppercase tracking-wide">Weight</Text>
          </View>
          {weight ? (
            <Text className="text-base font-semibold text-gray-900">
              {weight} kg
            </Text>
          ) : (
            <Text className="text-base font-semibold text-gray-400">N/A</Text>
          )}
        </View>
        <View className="flex-1 min-w-[140px] bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center gap-2 mb-2">
            <Package size={18} color="#11964a" />
            <Text className="text-xs text-gray-500 uppercase tracking-wide">Cut Type</Text>
          </View>
          {cut_type ? (
            <Text className="text-base font-semibold text-gray-900 capitalize">
              {cut_type}
            </Text>
          ) : (
            <Text className="text-base font-semibold text-gray-400">N/A</Text>
          )}
        </View>
        <View className="flex-1 min-w-[140px] bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center gap-2 mb-2">
            <Package size={18} color="#11964a" />
            <Text className="text-xs text-gray-500 uppercase tracking-wide">Packaging</Text>
          </View>
          {packaging_type ? (
            <Text className="text-base font-semibold text-gray-900 capitalize">
              {packaging_type}
            </Text>
          ) : (
            <Text className="text-base font-semibold text-gray-400">N/A</Text>
          )}
        </View>
        <View className="flex-1 min-w-[140px] bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center gap-2 mb-2">
            <Calendar size={18} color="#11964a" />
            <Text className="text-xs text-gray-500 uppercase tracking-wide">Shelf Life</Text>
          </View>
          {shelf_life ? (
            <Text className="text-base font-semibold text-gray-900">
              {shelf_life}
            </Text>
          ) : (
            <Text className="text-base font-semibold text-gray-400">N/A</Text>
          )}
        </View>
      </View>

      <View className="mt-4">
        <View className="bg-white rounded-xl p-4 shadow-sm mb-3">
          <View className="flex-row items-center gap-2 mb-2">
            <Snowflake size={18} color="#11964a" />
            <Text className="text-sm font-semibold text-gray-900">Storage Instructions</Text>
          </View>
          {storage_instructions ? (
            <Text className="text-sm text-gray-700">{storage_instructions}</Text>
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
            <Award size={18} color="#11964a" />
            <Text className="text-sm font-semibold text-gray-900">Certification</Text>
          </View>
          {certification ? (
            <Text className="text-sm text-gray-700">{certification}</Text>
          ) : (
            <Text className="text-sm text-gray-400">N/A</Text>
          )}
        </View>
      </View>
    </View>
  );
}
