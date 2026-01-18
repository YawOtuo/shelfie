import { cva, type VariantProps } from "class-variance-authority";
import { ActivityIndicator, View } from "react-native";
import { cn } from "../../lib/utils";
import { Text } from "./Text";

const spinnerContainerVariants = cva("items-center justify-center", {
  variants: {
    size: {
      small: "py-4",
      large: "py-8",
    },
  },
  defaultVariants: {
    size: "large",
  },
});

const textVariants = cva("text-gray-600 mt-3", {
  variants: {
    size: {
      small: "text-sm",
      large: "text-base",
    },
  },
  defaultVariants: {
    size: "large",
  },
});

interface LoadingSpinnerProps extends VariantProps<typeof spinnerContainerVariants> {
  size?: "small" | "large";
  color?: string;
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "large",
  color = "#b49a67",
  text,
  className,
}: LoadingSpinnerProps) {
  return (
    <View className={cn(spinnerContainerVariants({ size }), className)}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text className={cn(textVariants({ size }))}>{text}</Text>}
    </View>
  );
}

