import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Heart, Share2 } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImageGallery } from "../../components/ImageGallery";
import { ContactFarmSheet } from "../../components/listing-detail/ContactFarmSheet";
import { ListingDescription } from "../../components/listing-detail/ListingDescription";
import { ListingHeader } from "../../components/listing-detail/ListingHeader";
import { LocationSection } from "../../components/listing-detail/LocationSection";
import { PlaceOrderSheet } from "../../components/listing-detail/PlaceOrderSheet";
import { PriceCardSheet } from "../../components/listing-detail/PriceCardSheet";
import { ReviewsSection } from "../../components/listing-detail/ReviewsSection";
import { SimilarListings } from "../../components/listing-detail/SimilarListings";
import { FrozenDetails } from "../../components/listing/FrozenDetails";
import { FullAnimalDetails } from "../../components/listing/FullAnimalDetails";
import { SharedPortionDetails } from "../../components/listing/SharedPortionDetails";
import { Button } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Text } from "../../components/ui/Text";
import { useGetFarmById } from "../../lib/hooks/useFarms";
import { useGetListingImages } from "../../lib/hooks/useListingImages";
import { useGetListingById, useListings } from "../../lib/hooks/useListings";

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const listingId = id ? parseInt(id, 10) : 0;
  const { data: listing, isLoading, error } = useGetListingById(listingId);
  const { data: farmData } = useGetFarmById(listing?.farm_id?.toString() || "");
  const farm = farmData || null;
  
  // Fetch all images from backend
  const { data: imagesData, isLoading: isLoadingImages } = useGetListingImages(listingId);
  const allImages = imagesData?.images || [];
  
  const [isSaved, setIsSaved] = useState(false);
  const [isContactSheetVisible, setIsContactSheetVisible] = useState(false);
  const [isOrderSheetVisible, setIsOrderSheetVisible] = useState(false);
  const [isPriceCardVisible, setIsPriceCardVisible] = useState(false);

  // Fetch similar listings (same category, exclude current listing)
  const { listings: similarListings } = useListings({
    category: listing?.category,
    limit: 4,
  });

  // Combine images from backend API and listing object
  // Use backend API images as primary source, merge with listing images if needed
  const listingImages = listing?.images || [];
  
  // Create a map of image URLs to avoid duplicates
  type ImageItem = { id: number; image_url: string; is_primary?: boolean; created_at?: string };
  const imageMap = new Map<string, ImageItem>();
  
  // Add images from backend API first (these are the source of truth)
  allImages.forEach((img: { id: number; image_url: string; is_primary?: boolean; created_at?: string }) => {
    if (img.image_url) {
      imageMap.set(img.image_url, {
        id: img.id,
        image_url: img.image_url,
        is_primary: img.is_primary,
        created_at: img.created_at,
      });
    }
  });
  
  // Add listing images that aren't already in the map (fallback)
  listingImages.forEach((img: { id: number; image_url: string; is_primary?: boolean; created_at?: string }) => {
    if (img.image_url && !imageMap.has(img.image_url)) {
      imageMap.set(img.image_url, {
        id: img.id,
        image_url: img.image_url,
        is_primary: img.is_primary,
        created_at: img.created_at || new Date().toISOString(),
      });
    }
  });
  
  // Convert map to array and sort: primary image first, then by creation date
  const displayImages = Array.from(imageMap.values()).sort((a, b) => {
    // Primary image first
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    // Then by creation date (newest first)
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });

  const filteredSimilarListings = similarListings.filter(
    (item) => item.id !== listingId
  );

  if (isLoading || isLoadingImages) {
    return (
      <SafeAreaView className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }} edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner size="large" color="#11964a" text="Loading listing..." />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !listing) {
    return (
      <SafeAreaView className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }} edges={["top"]}>
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-center text-red-500 text-base mb-4">
            Error loading listing. Please try again.
          </Text>
          <Button onPress={() => router.back()} variant="primary">
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const {
    title,
    farm_location,
    location,
    selling_price_per_unit,
    type,
    template,
    category,
    breed,
    description,
    slaughterable,
    number_of_portions,
    full_animal_details,
    shared_portion_details,
    frozen_details,
  } = listing;

  const price = selling_price_per_unit ?? null;
  const displayLocation = farm_location || location || "Location not specified";
  const descriptionForComponent = description ?? null;
  const supportsGroupBuying =
    type === "FULL_ANIMAL" &&
    slaughterable === true &&
    (number_of_portions === undefined || number_of_portions >= 2);

  const handleShare = () => {
    // Implement share functionality
    console.log("Share listing:", listing.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // Implement save functionality
  };

  const handleContact = () => {
    setIsContactSheetVisible(true);
  };

  const handlePlaceOrder = () => {
    setIsOrderSheetVisible(true);
  };


  const handleViewFarm = () => {
    setIsContactSheetVisible(false);
    if (listing.farm_id) {
      router.push(`/farm/${listing.farm_id}`);
    }
  };

  const handleConfirmOrder = () => {
    console.log("Place order");
    setIsOrderSheetVisible(false);
  };

  // Mock reviews - replace with actual API data when available
  const mockReviews = [
    {
      id: 1,
      user_name: "John Doe",
      rating: 5,
      comment: "Great quality livestock, exactly as described! The farm was professional and the animals were healthy.",
      created_at: "2024-01-15",
    },
    {
      id: 2,
      user_name: "Jane Smith",
      rating: 4,
      comment: "Good value for money. Would recommend.",
      created_at: "2024-01-10",
    },
  ];

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
            {displayImages.length > 0 ? (
              <ImageGallery 
                images={displayImages} 
                height={420} 
              />
            ) : (
              <View className="w-full bg-gray-200 items-center justify-center" style={{ height: 420 }}>
                <Text className="text-gray-500 text-lg">No images available</Text>
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
              {/* Title */}
              <Text className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                {title}
              </Text>
              
              {/* Farm & Location Info */}
              <ListingHeader
                title={title}
                farm={farm}
                displayLocation={displayLocation}
                listing={listing}
              />
            </View>
          </View>

          {/* Continuing white background */}
          <View className="bg-white" style={{ backgroundColor: '#FFFFFF' }}>

          {/* Price & Type Badge */}
          <View className="bg-white px-5 py-5 border-t border-gray-100" style={{ backgroundColor: '#FFFFFF' }}>
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-1">Starting from</Text>
                <Text className="text-3xl font-bold text-primary">
                  GHS {price?.toLocaleString() || "0"}
                </Text>
              </View>
              {type && (
                <View className="bg-primary/5 px-4 py-2 rounded-xl">
                  <Text className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {type === "FULL_ANIMAL" ? "Full Animal" : type === "SHARED_PORTIONS" ? "Shared Portions" : "Frozen"}
                  </Text>
                </View>
              )}
            </View>
            
            {/* Key Features */}
            <View className="flex-row items-center gap-4 pt-3 border-t border-gray-100">
              {listing.delivery && (
                <View className="flex-row items-center gap-1.5">
                  <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <Text className="text-xs font-medium text-gray-700">Delivery</Text>
                </View>
              )}
              <View className="flex-row items-center gap-1.5">
                <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                <Text className="text-xs font-medium text-gray-700">In Stock</Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                <Text className="text-xs font-medium text-gray-700">Secure</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <ListingDescription description={descriptionForComponent} />

          {/* Type-Specific Details */}
          {type === "FULL_ANIMAL" && full_animal_details && (
            <FullAnimalDetails details={full_animal_details} breed={breed} />
          )}

          {type === "SHARED_PORTIONS" && shared_portion_details && (
            <SharedPortionDetails details={shared_portion_details} />
          )}

          {type === "FROZEN" && frozen_details && (
            <FrozenDetails details={frozen_details} />
          )}

          {/* Location */}
          <LocationSection displayLocation={displayLocation} />

          {/* Reviews Section */}
          <ReviewsSection reviews={mockReviews} />

          {/* Similar Listings */}
          <SimilarListings listings={filteredSimilarListings} />

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
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 mb-0.5">Total Price</Text>
                  <Text className="text-xl font-bold text-gray-900">
                    GHS {price?.toLocaleString() || "0"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handlePlaceOrder}
                  className="bg-primary px-8 py-4 rounded-2xl"
                  style={{
                    shadowColor: "#11964a",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                  activeOpacity={0.9}
                >
                  <Text className="text-white font-bold text-base">
                    I'm Interested
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </SafeAreaView>

      {/* Contact Farm Bottom Sheet */}
      <ContactFarmSheet
        visible={isContactSheetVisible}
        onClose={() => setIsContactSheetVisible(false)}
        farm={farm}
        listing={listing}
        displayLocation={displayLocation}
        onViewFarm={handleViewFarm}
      />

      {/* Place Order Bottom Sheet */}
      <PlaceOrderSheet
        visible={isOrderSheetVisible}
        onClose={() => setIsOrderSheetVisible(false)}
        listing={listing}
        price={price}
        displayLocation={displayLocation}
        onConfirmOrder={handleConfirmOrder}
      />

      {/* Price Card Bottom Sheet */}
      <PriceCardSheet
        visible={isPriceCardVisible}
        onClose={() => setIsPriceCardVisible(false)}
        listing={listing}
        price={price}
        displayLocation={displayLocation}
        onPlaceOrder={() => {
          setIsPriceCardVisible(false);
          setIsOrderSheetVisible(true);
        }}
      />
    </View>
  );
}
