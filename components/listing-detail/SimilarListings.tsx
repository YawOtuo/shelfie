import { FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import { ListingCardV3 } from "../ListingCardV3";
import { Text } from "../ui/Text";
import { Listing } from "../../lib/types/listing";

interface SimilarListingsProps {
  listings: Listing[];
}

export function SimilarListings({ listings }: SimilarListingsProps) {
  const router = useRouter();

  if (listings.length === 0) {
    return null;
  }

  return (
    <View className="bg-white px-5 py-6 border-t border-gray-100" style={{ backgroundColor: '#FFFFFF' }}>
      <Text className="text-lg font-bold text-gray-900 mb-4">Similar Listings</Text>
      <FlatList
        data={listings}
        renderItem={({ item }: { item: Listing }) => (
          <View className="mr-4">
            <ListingCardV3
              listing={item}
              onPress={() => router.push(`/listing/${item.id}`)}
            />
          </View>
        )}
        keyExtractor={(item: Listing) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 0, paddingBottom: 0 }}
      />
    </View>
  );
}

