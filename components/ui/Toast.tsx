import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle2, X, XCircle, Info } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import { cn } from "../../lib/utils";
import { Text } from "./Text";

const toastVariants = cva(
  "flex-row items-center px-4 py-3 rounded-xl shadow-lg border",
  {
    variants: {
      variant: {
        success: "bg-green-50 border-green-200",
        error: "bg-red-50 border-red-200",
        info: "bg-blue-50 border-blue-200",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
);

interface ToastProps extends VariantProps<typeof toastVariants> {
  message: string;
  onClose: () => void;
  duration?: number;
  className?: string;
}

export function Toast({
  message,
  variant = "success",
  onClose,
  duration = 3000,
  className,
}: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle2 size={20} color="#10B981" />;
      case "error":
        return <XCircle size={20} color="#EF4444" />;
      case "info":
        return <Info size={20} color="#3B82F6" />;
      default:
        return null;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "info":
        return "text-blue-800";
      default:
        return "text-gray-800";
    }
  };

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
      className="absolute top-12 left-4 right-4 z-50"
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleClose}
        className={cn(toastVariants({ variant }), className)}
      >
        <View className="mr-3">{getIcon()}</View>
        <View className="flex-1">
          <Text className={cn("text-sm font-medium", getTextColor())}>
            {message}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleClose}
          className="ml-2 p-1"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={16} color={variant === "success" ? "#10B981" : variant === "error" ? "#EF4444" : "#3B82F6"} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}
