import { Tabs } from "expo-router";
import { View } from "react-native";
import { BottomTabBar } from "../../components/BottomTabBar";

export default function TabLayout() {
  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }}>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <BottomTabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inventory",
          }}
        />
        <Tabs.Screen
          name="sales"
          options={{
            title: "Sales",
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
          }}
        />
      </Tabs>
    </View>
  );
}
