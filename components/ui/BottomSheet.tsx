import { X } from "lucide-react-native";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "./Text";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: number;
  showHandle?: boolean;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
}

export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  height = SCREEN_HEIGHT * 0.7,
  showHandle = true,
  showCloseButton = true,
  footer,
}: BottomSheetProps) {
  const translateY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      Animated.spring(translateY, {
        toValue: height,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }
  }, [visible, height]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          className="bg-white rounded-t-3xl absolute bottom-0 left-0 right-0"
          style={{
            height,
            transform: [{ translateY }],
          }}
        >
          <SafeAreaView className="flex-1">
            {/* Handle */}
            {showHandle && (
              <View className="items-center pt-3 pb-2">
                <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </View>
            )}

            {/* Header */}
            {(title || showCloseButton) && (
              <View className="px-6 pb-4 border-b border-gray-100">
                <View className="flex-row items-center justify-between">
                  {title && (
                    <Text className="text-2xl font-bold text-gray-900">{title}</Text>
                  )}
                  {showCloseButton && (
                    <TouchableOpacity onPress={onClose}>
                      <X size={24} color="#6B7280" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* Content */}
            <View className="flex-1">{children}</View>

            {/* Footer */}
            {footer && (
              <View className="px-6 pb-6 pt-4 border-t border-gray-100">
                {footer}
              </View>
            )}
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}


