import { cva, type VariantProps } from "class-variance-authority";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { cn } from "../../lib/utils";
import { Text } from "./Text";

interface Tab {
  id: string;
  label: string;
}

const tabContainerVariants = cva("mb-4", {
  variants: {
    variant: {
      rounded: "",
      underline: "border-b border-gray-200",
    },
  },
  defaultVariants: {
    variant: "rounded",
  },
});

const tabButtonVariants = cva("", {
  variants: {
    variant: {
      rounded: "px-3 py-1.5 rounded-2xl",
      underline: "mr-6 pb-3",
    },
    active: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      variant: "rounded",
      active: true,
      class: "bg-primary",
    },
    {
      variant: "rounded",
      active: false,
      class: "bg-white border border-gray-200",
    },
  ],
  defaultVariants: {
    variant: "rounded",
    active: false,
  },
});

const tabTextVariants = cva("text-xs", {
  variants: {
    variant: {
      rounded: "font-medium",
      underline: "",
    },
    active: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      variant: "rounded",
      active: true,
      class: "text-white",
    },
    {
      variant: "rounded",
      active: false,
      class: "text-gray-900",
    },
    {
      variant: "underline",
      active: true,
      class: "text-primary ",
    },
    {
      variant: "underline",
      active: false,
      class: "text-gray-600",
    },
  ],
  defaultVariants: {
    variant: "rounded",
    active: false,
  },
});

interface TabsProps extends VariantProps<typeof tabContainerVariants> {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: "rounded" | "underline";
}

export function Tabs({ tabs, activeTab, onTabChange, variant = "rounded" }: TabsProps) {
  return (
    <View className={cn(tabContainerVariants({ variant }))}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={
          variant === "underline"
            ? { paddingHorizontal: 16 }
            : { paddingHorizontal: 16, gap: 10 }
        }
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              className={cn(tabButtonVariants({ variant, active: isActive }))}
              activeOpacity={0.7}
            >
              <Text className={cn(tabTextVariants({ variant, active: isActive }))}>
                {tab.label}
              </Text>
              {variant === "underline" && isActive && (
                <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
