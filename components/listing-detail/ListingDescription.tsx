import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../ui/Text";

interface ListingDescriptionProps {
  description: string | null;
}

export function ListingDescription({ description }: ListingDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View className="px-4 py-4">
      <Text className="text-lg font-bold text-gray-900 mb-3">Description</Text>
      {description ? (
        <>
          <Text
            className="text-sm text-gray-700 leading-5"
            numberOfLines={isExpanded ? undefined : 5}
          >
            {description}
          </Text>
          {description.length > 200 && (
            <TouchableOpacity
              onPress={() => setIsExpanded(!isExpanded)}
              className="mt-2"
            >
              <Text className="text-primary font-semibold text-sm">
                {isExpanded ? "Show less" : "Read more"}
              </Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <Text className="text-sm text-gray-500 italic">
          No description available for this listing.
        </Text>
      )}
    </View>
  );
}

