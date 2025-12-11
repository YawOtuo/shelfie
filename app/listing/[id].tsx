import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { DetailHeader } from "../../components/DetailHeader";
import { ImageGallery } from "../../components/ImageGallery";
import { ContactFarmSheet } from "../../components/listing-detail/ContactFarmSheet";
import { ListingDescription } from "../../components/listing-detail/ListingDescription";
import { ListingHeader } from "../../components/listing-detail/ListingHeader";
import { LocationSection } from "../../components/listing-detail/LocationSection";
import { PlaceOrderSheet } from "../../components/listing-detail/PlaceOrderSheet";
import { PriceCard } from "../../components/listing-detail/PriceCard";
import { PriceCardSheet } from "../../components/listing-detail/PriceCardSheet";
import { ReviewsSection } from "../../components/listing-detail/ReviewsSection";
import { SimilarListings } from "../../components/listing-detail/SimilarListings";
import { FrozenDetails } from "../../components/listing/FrozenDetails";
import { FullAnimalDetails } from "../../components/listing/FullAnimalDetails";
import { SharedPortionDetails } from "../../components/listing/SharedPortionDetails";
import { Button } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Text } from "../../components/ui/Text";
import { useFarm } from "../../lib/hooks/useFarms";
import { useListing, useListings } from "../../lib/hooks/useListings";

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const listingId = id ? parseInt(id, 10) : 0;
  const { listing, isLoading, error } = useListing(listingId);
  const { farm: farmData } = useFarm(listing?.farm_id?.toString() || "");
  const farm = farmData ?? null;
  const [isSaved, setIsSaved] = useState(false);
  const [isContactSheetVisible, setIsContactSheetVisible] = useState(false);
  const [isOrderSheetVisible, setIsOrderSheetVisible] = useState(false);
  const [isPriceCardVisible, setIsPriceCardVisible] = useState(false);

  // Fetch similar listings (same category, exclude current listing)
  const { listings: similarListings } = useListings({
    category: listing?.category,
    limit: 4,
  });

  const filteredSimilarListings = similarListings.filter(
    (item) => item.id !== listingId
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <DetailHeader showBack={true} />
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner size="large" color="#11964a" text="Loading listing..." />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !listing) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <DetailHeader showBack={true} />
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
    images,
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
    <SafeAreaView className="flex-1 bg-white px-2" edges={["top", "bottom", "left", "right"]}>
      <DetailHeader
        showBack={true}
        onShare={handleShare}
        onSave={handleSave}
        isSaved={isSaved}
      />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={{ paddingTop: insets.top + 40 }}>
          <ListingHeader
            title={title}
            farm={farm}
            displayLocation={displayLocation}
            listing={listing}
          />
        </View>

        {/* Image Gallery */}
        <View className="px-4 mb-4">
          <ImageGallery images={images || []} height={220} />
        </View>

        {/* Description */}
        <ListingDescription description={descriptionForComponent} />

        {/* Divider */}
        <View className="h-3 bg-white" />

        {/* Price Card */}
        <PriceCard
          listing={listing}
          price={price}
          displayLocation={displayLocation}
          isSaved={isSaved}
          onSave={handleSave}
          onPlaceOrder={handlePlaceOrder}
        />

        {/* Divider */}
        <View className="h-3 bg-white" />

        {/* Type-Specific Details */}
        {type === "FULL_ANIMAL" && full_animal_details && (
          <>
            <FullAnimalDetails details={full_animal_details} breed={breed} />
            <View className="h-3 bg-gray-50" />
          </>
        )}

        {type === "SHARED_PORTIONS" && shared_portion_details && (
          <>
            <SharedPortionDetails details={shared_portion_details} />
            <View className="h-3 bg-gray-50" />
          </>
        )}

        {type === "FROZEN" && frozen_details && (
          <>
            <FrozenDetails details={frozen_details} />
            <View className="h-3 bg-gray-50" />
          </>
        )}


        {/* Location */}
        <LocationSection displayLocation={displayLocation} />

        {/* Reviews Section */}
        <ReviewsSection reviews={mockReviews} />

        {/* Similar Listings */}
        <SimilarListings listings={filteredSimilarListings} />

        {/* Bottom Spacing */}
      </ScrollView>

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
    </SafeAreaView>
  );
}
