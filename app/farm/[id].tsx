import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Building2, Heart, MapPin, Phone, Share2, Star, Verified } from "lucide-react-native";
import { useState } from "react";
import { FlatList, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImageGallery } from "../../components/ImageGallery";
import { ListingCard } from "../../components/ListingCard";
import { LocationMap } from "../../components/LocationMap";
import { ReviewCard } from "../../components/ReviewCard";
import { Button } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Text } from "../../components/ui/Text";
import { useGetFarmById } from "../../lib/hooks/useFarms";
import { useListings } from "../../lib/hooks/useListings";

export default function FarmDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: farm, isLoading, error } = useGetFarmById(id || "");
  const { listings = [], isLoading: loadingListings, refetch: refetchListings } = useListings({ farm_id: farm?.id, limit: 20 });
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (isLoading || loadingListings) {
    return (
      <SafeAreaView className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }} edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner size="large" color="#11964a" text="Loading farm..." />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !farm || !listings) {
    return (
      <SafeAreaView className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }} edges={["top"]}>
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

  const { name, location, avatar_url, total_rating } = farm;

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
    <View className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }}>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Image Gallery with Floating Header */}
          <View className="relative" style={{ height: 420 }}>
            {farmImages.length > 0 ? (
              <ImageGallery images={farmImages} height={420} />
            ) : (
              <View className="w-full bg-gray-200 items-center justify-center" style={{ height: 420 }}>
                <Building2 size={80} color="#9CA3AF" />
              </View>
            )}
            
            {/* Floating Header Actions */}
            <View className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4 pt-3">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-11 h-11 items-center justify-center rounded-full"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                activeOpacity={0.8}
              >
                <ArrowLeft size={22} color="#1F2937" strokeWidth={2.5} />
              </TouchableOpacity>
              <View className="flex-row items-center gap-2">
                <TouchableOpacity
                  onPress={handleShare}
                  className="w-11 h-11 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                  activeOpacity={0.8}
                >
                  <Share2 size={20} color="#1F2937" strokeWidth={2.5} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  className="w-11 h-11 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                  activeOpacity={0.8}
                >
                  <Heart
                    size={20}
                    color={isSaved ? "#EF4444" : "#1F2937"}
                    fill={isSaved ? "#EF4444" : "transparent"}
                    strokeWidth={2.5}
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Parallax Content Card - Overlapping the image */}
            <View 
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl pt-6 px-5"
              style={{ 
                backgroundColor: '#FFFFFF',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              {/* Farm Name & Verification */}
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                    {name}
                  </Text>
                  <View className="flex-row items-center flex-wrap gap-2">
                    {farm.email_verified && (
                      <View className="flex-row items-center gap-1 bg-primary/5 px-2.5 py-1 rounded-full">
                        <Verified size={12} color="#11964a" fill="#11964a" strokeWidth={2.5} />
                        <Text className="text-primary text-[10px] font-semibold">Verified Farm</Text>
                      </View>
                    )}
                    {total_rating && (
                      <View className="flex-row items-center gap-1">
                        <Star size={14} color="#EAB308" fill="#EAB308" strokeWidth={2} />
                        <Text className="text-sm font-semibold text-gray-900">{total_rating?.toFixed(1)}</Text>
                        <Text className="text-xs text-gray-500">({mockReviews.length})</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Location */}
              <View className="flex-row items-center gap-2 pb-4">
                <MapPin size={14} color="#6B7280" strokeWidth={2} />
                <Text className="text-xs text-gray-600">
                  {location || "Location not specified"}
                </Text>
              </View>
            </View>
          </View>

          {/* Continuing white background */}
          <View className="bg-white" style={{ backgroundColor: '#FFFFFF' }}>

            {/* About Section */}
            {farm.farm_bio && (
              <View className="bg-white px-5 py-6 border-t border-gray-100" style={{ backgroundColor: '#FFFFFF' }}>
                <Text className="text-lg font-bold text-gray-900 mb-3">About This Farm</Text>
                <Text
                  className="text-sm text-gray-700 leading-6"
                  numberOfLines={isDescriptionExpanded ? undefined : 4}
                >
                  {farm.farm_bio}
                </Text>
                {farm.farm_bio?.length > 150 && (
                  <TouchableOpacity
                    onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="mt-3 flex-row items-center gap-1"
                  >
                    <Text className="text-primary font-semibold text-sm">
                      {isDescriptionExpanded ? "Show less" : "Read more"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Listings Section */}
            {listings.length > 0 && (
              <View className="bg-white px-5 py-6 border-t border-gray-100" style={{ backgroundColor: '#FFFFFF' }}>
                <View className="flex-row items-center justify-between mb-4">
                  <View>
                    <Text className="text-lg font-bold text-gray-900 mb-1">
                      Available Listings
                    </Text>
                    <Text className="text-xs text-gray-500">{listings.length} active listings</Text>
                  </View>
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
            <View className="bg-white px-5 py-6 border-t border-gray-100" style={{ backgroundColor: '#FFFFFF' }}>
              <View className="flex-row items-center justify-between mb-5">
                <View>
                  <Text className="text-lg font-bold text-gray-900 mb-1">
                    Reviews & Ratings
                  </Text>
                  {mockReviews.length > 0 && (
                    <View className="flex-row items-center gap-2">
                      <Star size={16} color="#EAB308" fill="#EAB308" strokeWidth={2} />
                      <Text className="text-sm text-gray-600">
                        {total_rating?.toFixed(1)} • {mockReviews.length} {mockReviews.length === 1 ? "review" : "reviews"}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              {mockReviews.length > 0 ? (
                <View className="gap-3">
                  {mockReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </View>
              ) : (
                <View className="py-8 items-center">
                  <Star size={40} color="#D1D5DB" />
                  <Text className="text-gray-500 text-sm mt-3 font-medium">No reviews yet</Text>
                  <Text className="text-gray-400 text-xs mt-1">
                    Be the first to review this farm
                  </Text>
                </View>
              )}
            </View>

            {/* Location Section */}
            <View className="bg-white px-5 py-6 border-t border-gray-100" style={{ backgroundColor: '#FFFFFF' }}>
              <View className="flex-row items-center gap-2 mb-4">
                <MapPin size={18} color="#11964a" strokeWidth={2.5} />
                <Text className="text-lg font-bold text-gray-900">Location</Text>
              </View>
              <Text className="text-sm text-gray-700 mb-4">{location || "Location not specified"}</Text>
              <View className="rounded-2xl overflow-hidden">
                <LocationMap location={location || "Location not specified"} />
              </View>
            </View>

            {/* Bottom Spacing */}
            <View className="h-8" />
          </View>
        </ScrollView>

        {/* Sticky CTA Button */}
        <View 
          className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200"
          style={{ 
            backgroundColor: '#FFFFFF',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 10,
          }}
        >
          <SafeAreaView edges={["bottom"]}>
            <View className="px-5 pt-4 pb-2">
              <View className="flex-row items-center gap-3">
                <TouchableOpacity
                  onPress={handleContact}
                  className="flex-row items-center justify-center gap-2 bg-gray-100 rounded-2xl px-6 py-4"
                  activeOpacity={0.7}
                >
                  <Phone size={20} color="#1F2937" strokeWidth={2.5} />
                  <Text className="text-gray-900 font-bold text-base">Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleContact}
                  className="flex-1 bg-primary rounded-2xl px-8 py-4"
                  style={{
                    shadowColor: "#11964a",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                  activeOpacity={0.9}
                >
                  <Text className="text-white font-bold text-base text-center">
                    Contact Farm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </SafeAreaView>
    </View>
  );
}

