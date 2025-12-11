import { View, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "../../components/ui/Text";
import { useState } from "react";
import { useFarm } from "../../lib/hooks/useFarms";
import { useListings } from "../../lib/hooks/useListings";
import { ImageGallery } from "../../components/ImageGallery";
import { DetailHeader } from "../../components/DetailHeader";
import { LocationMap } from "../../components/LocationMap";
import { ReviewCard } from "../../components/ReviewCard";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Button } from "../../components/ui/Button";
import { ListingCard } from "../../components/ListingCard";
import { MapPin, Star, Building2, Verified, Phone, Mail } from "lucide-react-native";

export default function FarmDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { farm, isLoading, error } = useFarm(id || "");
  const { listings } = useListings({ farm_id: farm?.id, limit: 20 });
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <DetailHeader showBack={true} />
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner size="large" color="#11964a" text="Loading farm..." />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !farm) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <DetailHeader showBack={true} />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-center text-red-500 text-base mb-4">
            Error loading farm. Please try again.
          </Text>
          <Button onPress={() => router.back()} variant="primary">
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const { name, location, avatar_url, total_rating, description, verified, listings_count } = farm;

  // Mock farm images - replace with actual API data when available
  const farmImages = avatar_url
    ? [{ id: 1, image_url: avatar_url, is_primary: true }]
    : [];

  const handleShare = () => {
    // Implement share functionality
    console.log("Share farm:", farm.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // Implement save functionality
  };

  const handleContact = () => {
    // Implement contact functionality
    console.log("Contact farm:", farm.id);
  };

  const handleListingPress = (listingId: number) => {
    router.push(`/listing/${listingId}`);
  };

  // Mock reviews - replace with actual API data when available
  const mockReviews = [
    {
      id: 1,
      user_name: "John Doe",
      rating: 5,
      comment: "Excellent farm with high-quality livestock. Very professional!",
      created_at: "2024-01-15",
    },
    {
      id: 2,
      user_name: "Jane Smith",
      rating: 4,
      comment: "Great service and good prices. Would buy from again.",
      created_at: "2024-01-10",
    },
    {
      id: 3,
      user_name: "Mike Johnson",
      rating: 5,
      comment: "Best farm in the area. Highly recommended!",
      created_at: "2024-01-05",
    },
  ];

  const renderListingItem = ({ item }: { item: any }) => (
    <View className="mb-4" style={{ width: "48%" }}>
      <ListingCard
        listing={item}
        onPress={() => handleListingPress(item.id)}
        isHandpicked={false}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <DetailHeader
        showBack={true}
        title={name}
        onShare={handleShare}
        onSave={handleSave}
        isSaved={isSaved}
      />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        {farmImages.length > 0 ? (
          <ImageGallery images={farmImages} height={300} />
        ) : (
          <View className="h-[300px] bg-gray-100 items-center justify-center">
            <Building2 size={64} color="#9CA3AF" />
          </View>
        )}

        {/* Header Info */}
        <View className="px-4 pt-6 pb-4 border-b border-gray-100">
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-2">
                <Text className="text-2xl font-bold text-primary">{name}</Text>
                {verified && (
                  <View className="flex-row items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                    <Verified size={16} color="#3B82F6" fill="#3B82F6" />
                    <Text className="text-blue-600 text-xs font-medium">Verified</Text>
                  </View>
                )}
              </View>
              <View className="flex-row items-center gap-2">
                <MapPin size={16} color="#6B7280" />
                <Text className="text-gray-600 text-sm">{location || "Location not specified"}</Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center gap-4 mt-3">
            <View className="flex-row items-center gap-1">
              <Star size={20} color="#EAB308" fill="#EAB308" />
              <Text className="text-lg font-bold text-gray-900">{total_rating.toFixed(1)}</Text>
              <Text className="text-gray-500 text-sm">({mockReviews.length} reviews)</Text>
            </View>
            {listings_count !== undefined && (
              <View className="flex-row items-center gap-1">
                <Building2 size={16} color="#6B7280" />
                <Text className="text-gray-600 text-sm">{listings_count} listings</Text>
              </View>
            )}
          </View>
        </View>

        {/* Description */}
        {description && (
          <View className="px-4 py-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-3">About this farm</Text>
            <Text
              className="text-gray-700 leading-6"
              numberOfLines={isDescriptionExpanded ? undefined : 4}
            >
              {description}
            </Text>
            {description.length > 150 && (
              <TouchableOpacity
                onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="mt-2"
              >
                <Text className="text-primary font-medium">
                  {isDescriptionExpanded ? "Show less" : "Show more"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Listings Section */}
        {listings.length > 0 && (
          <View className="px-4 py-4 border-b border-gray-100">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-900">
                Available Listings
              </Text>
              <Text className="text-gray-500 text-sm">{listings.length} listings</Text>
            </View>
            <FlatList
              data={listings}
              renderItem={renderListingItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between", gap: 8 }}
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: 8 }}
            />
          </View>
        )}

        {/* Reviews Section */}
        <View className="px-4 py-4 border-b border-gray-100">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">Reviews</Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-gray-600 text-sm">{total_rating.toFixed(1)}</Text>
              <Text className="text-gray-400">•</Text>
              <Text className="text-gray-600 text-sm">{mockReviews.length} reviews</Text>
            </View>
          </View>
          {mockReviews.length > 0 ? (
            mockReviews.map((review) => <ReviewCard key={review.id} review={review} />)
          ) : (
            <Text className="text-gray-500 text-sm">No reviews yet</Text>
          )}
        </View>

        {/* Location Map */}
        <View className="px-4 py-4 pb-8">
          <LocationMap location={location || "Location not specified"} />
        </View>
      </ScrollView>

      {/* Fixed Action Bar */}
      <View className="px-4 py-4 border-t border-gray-200 bg-white">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={handleContact}
            className="flex-1 flex-row items-center justify-center gap-2 bg-gray-100 rounded-lg py-3"
          >
            <Phone size={18} color="#1F2937" />
            <Text className="text-gray-900 font-semibold">Call</Text>
          </TouchableOpacity>
          <Button onPress={handleContact} variant="primary" size="lg" className="flex-1">
            Contact
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

