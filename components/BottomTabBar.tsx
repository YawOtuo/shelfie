import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Building2, Heart, Home, Search, User } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "./ui/Text";

const tabIcons = {
  "index": Home,
  "search": Search,
  "farms": Building2,
  "saved": Heart,
  "profile": User,
};

export function BottomTabBar(props: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { state, descriptors, navigation } = props;

  return (
    <View
      className="bg-white rounded-t-3xl"
      style={{
        backgroundColor: '#FFFFFF',
        height: 60 + insets.bottom,
        paddingBottom: 8 + insets.bottom,
        paddingTop: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 8,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
      }}
    >
      <View className="flex-row items-center justify-around h-full px-2">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const Icon = tabIcons[route.name as keyof typeof tabIcons] || Home;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              className={`flex-1 items-center justify-center py-2 mx-1 rounded-2xl ${isFocused ? "bg-primary/5" : ""}`}
              activeOpacity={0.7}
            >
              <View className="items-center justify-center">
                <Icon
                  size={22}
                  color={isFocused ? "#11964a" : "#9CA3AF"}
                  {...(route.name === "saved" ? { fill: isFocused ? "#11964a" : "transparent" } : {})}
                />
                <Text
                  className={`text-[10px] mt-1 ${isFocused ? "text-primary" : "text-gray-400"}`}
                  variant={isFocused ? "semibold" : "regular"}
                >
                  {typeof label === "string" ? label : route.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

