import { View, ViewStyle } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const cardVariants = cva("rounded-2xl bg-white", {
  variants: {
    variant: {
      default: "shadow-sm",
      elevated: "shadow-lg",
      outline: "border border-gray-200",
    },
    padding: {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
  },
});

interface CardProps extends VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function Card({ children, variant, padding, className, style }: CardProps) {
  return (
    <View className={cn(cardVariants({ variant, padding }), className)} style={style}>
      {children}
    </View>
  );
}
