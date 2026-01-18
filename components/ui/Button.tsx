import { cva, type VariantProps } from "class-variance-authority";
import { ActivityIndicator, TouchableOpacity } from "react-native";
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
        sm: "px-3 py-2",
        md: "px-4 py-3",
        lg: "px-6 py-4",
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
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  onPress,
  children,
  variant,
  size,
  className,
  textClassName,
  disabled = false,
  loading = false,
}: ButtonProps) {
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
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" || variant === "danger" ? "white" : "#0D0A0B"}
        />
      ) : typeof children === "string" ? (
        <Text className={cn(textVariants({ variant, size }), textClassName)}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
