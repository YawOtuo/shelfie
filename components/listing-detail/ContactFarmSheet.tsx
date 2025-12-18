import { Linking, ScrollView, TouchableOpacity, View } from "react-native";
import {
  Building2,
  ChevronRight,
  ExternalLink,
  Mail,
  MessageCircle,
  Phone,
  Star,
  MapPin,
} from "lucide-react-native";
import { BottomSheet } from "../ui/BottomSheet";
import { Text } from "../ui/Text";
import { Farm } from "../../lib/types/farm";
import { Listing } from "../../lib/types/listing";

interface ContactFarmSheetProps {
  visible: boolean;
  onClose: () => void;
  farm: Farm | null;
  listing: Listing;
  displayLocation: string;
  onViewFarm: () => void;
}

export function ContactFarmSheet({
  visible,
  onClose,
  farm,
  listing,
  displayLocation,
  onViewFarm,
}: ContactFarmSheetProps) {
  const handleCall = () => {
    const phoneNumber = listing.farm_phone || "+233241234567";
    Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
      console.error("Error opening phone:", err)
    );
  };

  const handleEmail = () => {
    const email = listing.farm_email || farm?.name?.toLowerCase().replace(/\s+/g, "") + "@example.com";
    Linking.openURL(`mailto:${email}`).catch((err) =>
      console.error("Error opening email:", err)
    );
  };

  const handleWhatsApp = () => {
    const phoneNumber = listing.farm_phone?.replace(/\+/g, "") || "233241234567";
    const message = encodeURIComponent(
      `Hello, I'm interested in the listing: ${listing.title}`
    );
    Linking.openURL(`https://wa.me/${phoneNumber}?text=${message}`).catch(
      (err) => console.error("Error opening WhatsApp:", err)
    );
  };

  if (!farm) {
    return null;
  }

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Contact Farm"
      height={500}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Farm Info Card */}
        <View className="px-4 pt-4 pb-3">
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center">
                <Building2 size={28} color="#11964a" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 mb-1">
                  {farm.name}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Star size={14} color="#EAB308" fill="#EAB308" />
                  <Text className="text-sm text-gray-600">
                    {farm.total_rating?.toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <MapPin size={16} color="#6B7280" />
              <Text className="text-sm text-gray-700 flex-1">
                {farm.location || displayLocation}
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Options */}
        <View className="px-4 pb-4">
          <Text className="text-sm font-semibold text-gray-900 mb-3">
            Reach out to this farm
          </Text>

          {/* Phone Call */}
          <TouchableOpacity
            onPress={handleCall}
            className="flex-row items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-full bg-green-50 items-center justify-center">
              <Phone size={20} color="#11964a" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">
                Call Farm
              </Text>
              <Text className="text-sm text-gray-500">
                {listing.farm_phone || "+233 24 123 4567"}
              </Text>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>

          {/* WhatsApp */}
          <TouchableOpacity
            onPress={handleWhatsApp}
            className="flex-row items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-full bg-green-50 items-center justify-center">
              <MessageCircle size={20} color="#25D366" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">
                WhatsApp
              </Text>
              <Text className="text-sm text-gray-500">
                Send a message
              </Text>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity
            onPress={handleEmail}
            className="flex-row items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
              <Mail size={20} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">
                Send Email
              </Text>
              <Text className="text-sm text-gray-500">
                {listing.farm_email || farm.name?.toLowerCase().replace(/\s+/g, "") + "@example.com"}
              </Text>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>

          {/* View Farm Profile */}
          <TouchableOpacity
            onPress={onViewFarm}
            className="flex-row items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
              <ExternalLink size={20} color="#11964a" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">
                View Farm Profile
              </Text>
              <Text className="text-sm text-gray-500">
                See all listings and details
              </Text>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        {farm.farm_bio && (
          <View className="px-4 pb-4">
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              About this farm
            </Text>
            <Text className="text-sm text-gray-600 leading-5">
              {farm.farm_bio}
            </Text>
          </View>
        )}
      </ScrollView>
    </BottomSheet>
  );
}

