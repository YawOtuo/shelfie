import { View } from "react-native";
import { Star } from "lucide-react-native";
import { Text } from "../ui/Text";
import { ReviewCard } from "../ReviewCard";

interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <View className="bg-white px-5 py-6 border-t border-gray-100" style={{ backgroundColor: '#FFFFFF' }}>
      <View className="flex-row items-center justify-between mb-5">
        <View>
          <Text className="text-lg font-bold text-gray-900 mb-1">
            Reviews & Ratings
          </Text>
          {reviews.length > 0 && (
            <View className="flex-row items-center gap-2">
              <Star size={16} color="#EAB308" fill="#EAB308" strokeWidth={2} />
              <Text className="text-sm text-gray-600">
                {averageRating.toFixed(1)} • {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </Text>
            </View>
          )}
        </View>
      </View>
      {reviews.length > 0 ? (
        <View className="gap-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </View>
      ) : (
        <View className="py-8 items-center">
          <Star size={40} color="#D1D5DB" />
          <Text className="text-gray-500 text-sm mt-3 font-medium">No reviews yet</Text>
          <Text className="text-gray-400 text-xs mt-1">
            Be the first to review this listing
          </Text>
        </View>
      )}
    </View>
  );
}

