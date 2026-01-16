import { Tabs, usePathname, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import PagerView from "react-native-pager-view";
import { BottomTabBar } from "../../components/BottomTabBar";

export default function TabLayout() {
  const pagerRef = useRef<PagerView>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(0);

  // Map route paths to page indices
  const pathToIndex: Record<string, number> = {
    "/(tabs)": 0,
    "/(tabs)/": 0,
    "/(tabs)/index": 0,
    "/(tabs)/sales": 1,
    "/(tabs)/settings": 2,
  };

  const indexToPath: Record<number, string> = {
    0: "/(tabs)/",
    1: "/(tabs)/sales",
    2: "/(tabs)/settings",
  };

  // Sync pager with navigation when pathname changes
  useEffect(() => {
    const index = pathToIndex[pathname] ?? 0;
    if (index !== currentPage && pagerRef.current) {
      setCurrentPage(index);
      pagerRef.current.setPage(index);
    }
  }, [pathname]);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      const path = indexToPath[page];
      if (path && pathname !== path) {
        router.push(path as any);
      }
    }
  };

  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }}>
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => handlePageChange(e.nativeEvent.position)}
      >
        {/* Each page contains the full Tabs component - PagerView will handle swiping */}
        <View key="0" style={{ flex: 1 }}>
          <Tabs
            screenOptions={{
              headerShown: false,
            }}
            tabBar={(props) => (
              <BottomTabBar
                {...props}
                pagerRef={pagerRef}
              />
            )}
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
        <View key="1" style={{ flex: 1 }}>
          <Tabs
            screenOptions={{
              headerShown: false,
            }}
            tabBar={(props) => (
              <BottomTabBar
                {...props}
                pagerRef={pagerRef}
              />
            )}
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
        <View key="2" style={{ flex: 1 }}>
          <Tabs
            screenOptions={{
              headerShown: false,
            }}
            tabBar={(props) => (
              <BottomTabBar
                {...props}
                pagerRef={pagerRef}
              />
            )}
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
      </PagerView>
    </View>
  );
}
