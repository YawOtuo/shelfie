import { usePathname, useRouter } from "expo-router";
import { Building2, Heart, Home, Search, User } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "./ui/Text";

const tabs = [
  {
    id: "/(tabs)/index",
    label: "Home",
    icon: Home,
    route: "/(tabs)",
  },
  {
    id: "/(tabs)/search",
    label: "Search",
    icon: Search,
    route: "/(tabs)/search",
  },
  {
    id: "/(tabs)/farms",
    label: "Farms",
    icon: Building2,
    route: "/(tabs)/farms",
  },
  {
    id: "/(tabs)/saved",
    label: "Saved",
    icon: Heart,
    route: "/(tabs)/saved",
  },
  {
    id: "/(tabs)/profile",
    label: "Profile",
    icon: User,
    route: "/(tabs)/profile",
  },
];

export function StandaloneBottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isActive = (tabRoute: string) => {
    // Special handling for home route
    if (tabRoute === "/(tabs)") {
      return pathname === "/(tabs)" || pathname === "/(tabs)/index" || pathname?.startsWith("/(tabs)/index");
    }
    return pathname === tabRoute || pathname?.startsWith(tabRoute + "/");
  };

  return (
    <View
      className="bg-white border-t border-gray-200"
      style={{
        backgroundColor: '#FFFFFF',
        height: 60 + insets.bottom,
        paddingBottom: 8 + insets.bottom,
        paddingTop: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <View className="flex-row items-center justify-around h-full">
        {tabs.map((tab) => {
          const active = isActive(tab.route);
          const Icon = tab.icon;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => {
                router.replace(tab.route as any);
              }}
              className={`flex-1 items-center justify-center py-1 rounded-lg ${active ? "bg-primary/10" : ""}`}
              activeOpacity={0.7}
            >
              <View className="items-center justify-center">
                <Icon
                  size={22}
                  color={active ? "#11964a" : "#6B7280"}
                  {...(tab.id === "/(tabs)/saved" ? { fill: active ? "#11964a" : "transparent" } : {})}
                />
                <Text
                  className={`text-[10px] mt-1 ${active ? "text-primary" : "text-gray-500"}`}
                  variant={active ? "semibold" : "regular"}
                >
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

