import { Tabs } from "expo-router";
import { View } from "react-native";
import { BottomTabBar } from "../../components/BottomTabBar";
import { TopNavBar } from "../../components/TopNavBar";

export default function TabLayout() {
  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }}>
      <TopNavBar />
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <BottomTabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
          }}
        />
        <Tabs.Screen
          name="farms"
          options={{
            title: "Farms",
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            title: "Saved",
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
          }}
        />
      </Tabs>
    </View>
  );
}

