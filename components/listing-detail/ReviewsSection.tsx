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
    <View className="px-4 py-4 bg-white mx-4 my-3 rounded-xl shadow-sm border border-gray-100">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2.5">
          <Star size={20} color="#EAB308" fill="#EAB308" />
          <View>
            <Text className="text-lg font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </Text>
            <Text className="text-xs text-gray-600">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </Text>
          </View>
        </View>
      </View>
      {reviews.length > 0 ? (
        <View>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </View>
      ) : (
        <View className="py-6 items-center">
          <Star size={40} color="#D1D5DB" />
          <Text className="text-gray-500 text-sm mt-2">No reviews yet</Text>
          <Text className="text-gray-400 text-xs mt-1">
            Be the first to review this listing
          </Text>
        </View>
      )}
    </View>
  );
}

