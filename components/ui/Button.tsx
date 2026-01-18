import { cva, type VariantProps } from "class-variance-authority";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { cn } from "../../lib/utils";
import { Text } from "./Text";

const buttonVariants = cva(
  "flex-row items-center justify-center rounded-2xl",
  {
    variants: {
      variant: {
        primary: "bg-secondary",
        secondary: "bg-gray-200",
        outline: "border-2 border-secondary bg-transparent",
        ghost: "bg-transparent",
        danger: "bg-red-500",
      },
      size: {
        sm: "px-4 py-3",
        md: "px-5 py-4",
        lg: "px-7 py-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const textVariants = cva("font-semibold text-center", {
  variants: {
      variant: {
        primary: "text-white",
        secondary: "text-gray-800",
        outline: "text-secondary",
        ghost: "text-primary",
        danger: "text-white",
      },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  onPress?: () => void;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  label?: string;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  onPress,
  children,
  icon,
  label,
  variant,
  size,
  className,
  textClassName,
  disabled = false,
  loading = false,
}: ButtonProps) {
  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={variant === "primary" || variant === "danger" ? "white" : "#0D0A0B"}
        />
      );
    }

    // If icon and label are provided, render them together
    if (icon && label) {
      return (
        <View className="flex-row items-center justify-center py-1">
          <View className="mr-4">{icon}</View>
          <Text className={cn(textVariants({ variant, size }), textClassName)}>
            {label}
          </Text>
        </View>
      );
    }

    // If only label is provided
    if (label) {
      return (
        <View className="py-1">
          <Text className={cn(textVariants({ variant, size }), textClassName)}>
            {label}
          </Text>
        </View>
      );
    }

    // If only icon is provided
    if (icon) {
      return <View>{icon}</View>;
    }

    // Fallback to children (backward compatibility)
    if (typeof children === "string") {
      return (
        <Text className={cn(textVariants({ variant, size }), textClassName)}>
          {children}
        </Text>
      );
    }

    // If children is a ReactNode and variant is primary/danger, ensure white text
    // Note: For best results, use the label prop or ensure Text components have text-white class
    return children;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        buttonVariants({ variant, size }),
        disabled ? "opacity-50" : "",
        className
      )}
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}
