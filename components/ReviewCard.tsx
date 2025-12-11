import { View } from "react-native";
import { Star } from "lucide-react-native";
import { Text } from "./ui/Text";

interface Review {
  id: number;
  user_name?: string;
  rating: number;
  comment?: string;
  created_at?: string;
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        color={index < rating ? "#EAB308" : "#D1D5DB"}
        fill={index < rating ? "#EAB308" : "transparent"}
      />
    ));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <View className="bg-white rounded-xl border border-gray-200 p-4 mb-3">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center">
            <Text className="text-gray-600 font-semibold text-sm">
              {review.user_name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <View>
            <Text className="text-sm font-semibold text-gray-900">
              {review.user_name || "Anonymous"}
            </Text>
            {review.created_at && (
              <Text className="text-xs text-gray-500">{formatDate(review.created_at)}</Text>
            )}
          </View>
        </View>
        <View className="flex-row items-center gap-1">
          {renderStars(review.rating)}
        </View>
      </View>
      {review.comment && (
        <Text className="text-sm text-gray-700 leading-5">{review.comment}</Text>
      )}
    </View>
  );
}

