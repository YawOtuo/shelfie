import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { runOnJS } from "react-native-reanimated";

interface SwipeableTabWrapperProps {
  children: ReactNode;
  tabIndex: number;
}

const tabRoutes = ["/(tabs)/", "/(tabs)/sales", "/(tabs)/settings"];

export function SwipeableTabWrapper({ children, tabIndex }: SwipeableTabWrapperProps) {
  const router = useRouter();

  const navigateToTab = (route: string) => {
    router.push(route as any);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-5, 5])
    .onEnd((event) => {
      const { translationX, velocityX } = event;
      const swipeThreshold = 50;
      const velocityThreshold = 500;

      // Check if swipe is significant enough
      const isSignificantSwipe = Math.abs(translationX) > swipeThreshold || Math.abs(velocityX) > velocityThreshold;

      if (isSignificantSwipe) {
        if (translationX > 0 || velocityX > 0) {
          // Swipe right - go to previous tab
          if (tabIndex > 0) {
            runOnJS(navigateToTab)(tabRoutes[tabIndex - 1]);
          }
        } else if (translationX < 0 || velocityX < 0) {
          // Swipe left - go to next tab
          if (tabIndex < tabRoutes.length - 1) {
            runOnJS(navigateToTab)(tabRoutes[tabIndex + 1]);
          }
        }
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {children}
      </View>
    </GestureDetector>
  );
}
