import { cva, type VariantProps } from "class-variance-authority";
import { Package, Search, Building2 } from "lucide-react-native";
import { View } from "react-native";
import { cn } from "../../lib/utils";
import { Text } from "./Text";

const emptyStateVariants = cva("px-4 items-center justify-center", {
  variants: {
    size: {
      sm: "py-8",
      md: "py-12",
      lg: "py-16",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const iconContainerVariants = cva("rounded-full bg-gray-100 items-center justify-center", {
  variants: {
    size: {
      sm: "w-12 h-12",
      md: "w-16 h-16",
      lg: "w-20 h-20",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const iconSizes = {
  sm: 24,
  md: 32,
  lg: 40,
};

const titleVariants = cva("font-semibold text-gray-900 text-center mb-2", {
  variants: {
    size: {
      sm: "text-base",
      md: "text-lg",
      lg: "text-xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const messageVariants = cva("text-gray-500 text-center mb-4 max-w-xs", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface EmptyStateProps extends VariantProps<typeof emptyStateVariants> {
  icon?: React.ReactNode;
  iconType?: "package" | "search" | "building";
  title: string;
  message?: string;
  action?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function EmptyState({
  icon,
  iconType = "package",
  title,
  message,
  action,
  size = "md",
}: EmptyStateProps) {
  const getDefaultIcon = () => {
    const iconProps = { size: iconSizes[size || "md"], color: "#9CA3AF" };
    switch (iconType) {
      case "search":
        return <Search {...iconProps} />;
      case "building":
        return <Building2 {...iconProps} />;
      default:
        return <Package {...iconProps} />;
    }
  };

  return (
    <View className={cn(emptyStateVariants({ size }))}>
      <View className="mb-4">
        {icon || (
          <View className={cn(iconContainerVariants({ size }))}>
            {getDefaultIcon()}
          </View>
        )}
      </View>
      <Text className={cn(titleVariants({ size }))}>{title}</Text>
      {message && <Text className={cn(messageVariants({ size }))}>{message}</Text>}
      {action && <View className="mt-2">{action}</View>}
    </View>
  );
}

