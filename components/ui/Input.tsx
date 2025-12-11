import { cva, type VariantProps } from "class-variance-authority";
import { TextInput, View } from "react-native";
import { cn } from "../../lib/utils";
import { Text } from "./Text";

const inputVariants = cva(
  "w-full rounded-2xl px-4 border text-base rounded-2xl",
  {
    variants: {
      variant: {
        default: "border-gray-300 bg-white text-gray-900",
        error: "border-red-500 bg-white text-gray-900",
      },
      size: {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3 text-base",
        lg: "px-5 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface InputProps extends VariantProps<typeof inputVariants> {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  editable?: boolean;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  variant,
  size,
  className,
  label,
  error,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "sentences",
  editable = true,
}: InputProps) {
  return (
    <View className="w-full">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
        className={cn(
          inputVariants({ variant: error ? "error" : variant, size }),
          className
        )}
      />
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
