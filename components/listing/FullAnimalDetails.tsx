import { View } from "react-native";
import { Text } from "../ui/Text";
import { Info, Scale, Calendar, Users, Heart, Syringe, Utensils } from "lucide-react-native";
import { FullAnimalListing } from "../../lib/types/listing";

interface FullAnimalDetailsProps {
  details: FullAnimalListing;
  breed?: string;
}

export function FullAnimalDetails({ details, breed }: FullAnimalDetailsProps) {
  const { age, weight, gender, health_status, vaccination_history, feeding_history, special_characteristics, quantity } = details;

  return (
    <View className="px-4 py-4">
      <Text className="text-lg font-bold text-gray-900 mb-4">Animal Details</Text>
      
      {/* 2x2 Grid for main details */}
      <View className="flex-row flex-wrap gap-3 mb-4">
        {/* Quantity */}
        <View className="w-[48%] bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center gap-2 mb-2">
            <Users size={18} color="#11964a" />
            <Text className="text-xs text-gray-500 uppercase tracking-wide">Quantity</Text>
          </View>
          {quantity !== undefined && quantity !== null ? (
            <Text className="text-base font-semibold text-gray-900">
              {quantity}
            </Text>
          ) : (
            <Text className="text-base font-semibold text-gray-400">N/A</Text>
          )}
        </View>

        {/* Weight */}
        <View className="w-[48%] bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center gap-2 mb-2">
            <Scale size={18} color="#11964a" />
            <Text className="text-xs text-gray-500 uppercase tracking-wide">Weight</Text>
          </View>
          {weight !== undefined && weight > 0 ? (
            <Text className="text-base font-semibold text-gray-900">
              {weight} kg
            </Text>
          ) : (
            <Text className="text-base font-semibold text-gray-400">N/A</Text>
          )}
        </View>

        {/* Age */}
        <View className="w-[48%] bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center gap-2 mb-2">
            <Calendar size={18} color="#11964a" />
            <Text className="text-xs text-gray-500 uppercase tracking-wide">Age</Text>
          </View>
          {age !== undefined && age !== null ? (
            <Text className="text-base font-semibold text-gray-900">
              {age} months
            </Text>
          ) : (
            <Text className="text-base font-semibold text-gray-400">N/A</Text>
          )}
        </View>

        {/* Breed */}
        <View className="w-[48%] bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center gap-2 mb-2">
            <Info size={18} color="#11964a" />
            <Text className="text-xs text-gray-500 uppercase tracking-wide">Breed</Text>
          </View>
          {breed ? (
            <Text className="text-base font-semibold text-gray-900 capitalize" numberOfLines={2}>
              {breed}
            </Text>
          ) : (
            <Text className="text-base font-semibold text-gray-400">N/A</Text>
          )}
        </View>
      </View>

      {/* Gender */}
      <View className="flex-row flex-wrap gap-3 mb-4">
        <View className="w-[48%] bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center gap-2 mb-2">
            <Users size={18} color="#11964a" />
            <Text className="text-xs text-gray-500 uppercase tracking-wide">Gender</Text>
          </View>
          {gender ? (
            <Text className="text-base font-semibold text-gray-900 capitalize">
              {gender.toLowerCase()}
            </Text>
          ) : (
            <Text className="text-base font-semibold text-gray-400">N/A</Text>
          )}
        </View>
      </View>

      {/* Health & History Details in 2x2 Grid */}
      <View className="mt-4">
        <View className="flex-row flex-wrap gap-3">
          {/* Health Status */}
          <View className="w-[48%] bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center gap-2 mb-2">
              <Heart size={18} color="#11964a" />
              <Text className="text-xs text-gray-500 uppercase tracking-wide">Health Status</Text>
            </View>
            {health_status ? (
              <Text className="text-sm font-semibold text-gray-900" numberOfLines={3}>
                {health_status}
              </Text>
            ) : (
              <Text className="text-sm font-semibold text-gray-400">N/A</Text>
            )}
          </View>

          {/* Vaccination History */}
          <View className="w-[48%] bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center gap-2 mb-2">
              <Syringe size={18} color="#11964a" />
              <Text className="text-xs text-gray-500 uppercase tracking-wide">Vaccination</Text>
            </View>
            {vaccination_history ? (
              <Text className="text-sm font-semibold text-gray-900" numberOfLines={3}>
                {vaccination_history}
              </Text>
            ) : (
              <Text className="text-sm font-semibold text-gray-400">N/A</Text>
            )}
          </View>

          {/* Feeding History */}
          <View className="w-[48%] bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center gap-2 mb-2">
              <Utensils size={18} color="#11964a" />
              <Text className="text-xs text-gray-500 uppercase tracking-wide">Feeding</Text>
            </View>
            {feeding_history ? (
              <Text className="text-sm font-semibold text-gray-900" numberOfLines={3}>
                {feeding_history}
              </Text>
            ) : (
              <Text className="text-sm font-semibold text-gray-400">N/A</Text>
            )}
          </View>

          {/* Special Characteristics */}
          <View className="w-[48%] bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center gap-2 mb-2">
              <Info size={18} color="#11964a" />
              <Text className="text-xs text-gray-500 uppercase tracking-wide">Special</Text>
            </View>
            {special_characteristics ? (
              <Text className="text-sm font-semibold text-gray-900" numberOfLines={3}>
                {special_characteristics}
              </Text>
            ) : (
              <Text className="text-sm font-semibold text-gray-400">N/A</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
