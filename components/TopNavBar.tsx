import { useRouter } from "expo-router";
import { ShoppingCart, Package, User } from "lucide-react-native";
import { Image, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthUserStore } from "../lib/stores/authUserStore";
import { useHybridCart } from "../lib/hooks/useHybridCart";
import { SearchBar } from "./SearchBar";
import { Text } from "./ui/Text";

interface TopNavBarProps {
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  onSearchPress?: () => void;
  onUserPress?: () => void;
}

export function TopNavBar({
  searchQuery = "",
  onSearchChange,
  onSearchPress,
  onUserPress,
}: TopNavBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthUserStore();
  
  // Get cart data - hook must be called unconditionally
  const cartResult = useHybridCart();
  const cartItemCount = cartResult?.cart?.total_items || 0;

  const handleUserPress = () => {
    if (onUserPress) {
      onUserPress();
    } else {
      if (user) {
        router.push("/(tabs)/profile");
      } else {
        router.push("/login");
      }
    }
  };

  const handleSearchPress = () => {
    if (onSearchPress) {
      onSearchPress();
    } else {
      router.push("/(tabs)/search");
    }
  };

  return (
    <View
      className="bg-white border-b border-gray-100"
      style={{ 
        backgroundColor: '#FFFFFF',
        paddingTop: insets.top,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center justify-between px-4 py-3 gap-3">
        {/* Logo/Name - Enhanced */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/index")}
          className="flex-row items-center"
          activeOpacity={0.7}
        >
          <Text className="text-lg text-primary-dark" variant="bold">
            Livestockly
          </Text>
        </TouchableOpacity>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={onSearchChange}
          onPress={handleSearchPress}
          onFocus={handleSearchPress}
          placeholder="Search livestock, farms..."
        />

        {/* Action Icons - Enhanced with backgrounds */}
        <View className="flex-row items-center gap-2">
          {/* Cart Icon */}
          <TouchableOpacity
            onPress={() => router.push("/cart")}
            className="relative w-10 h-10 items-center justify-center rounded-full bg-gray-50"
            activeOpacity={0.7}
          >
            <ShoppingCart color="#6B7280" size={20} />
            {cartItemCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-primary rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
                <Text className="text-white text-[10px]" variant="bold">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Orders Icon */}
          <TouchableOpacity
            onPress={() => router.push("/orders")}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
            activeOpacity={0.7}
          >
            <Package color="#6B7280" size={20} />
          </TouchableOpacity>

          {/* User Icon - Enhanced */}
          <TouchableOpacity
            onPress={handleUserPress}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200"
            activeOpacity={0.7}
          >
            {user?.avatar_url ? (
              <Image
                source={{ uri: user.avatar_url }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-primary items-center justify-center">
                <User color="#FFFFFF" size={20} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

