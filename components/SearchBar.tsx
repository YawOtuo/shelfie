import { Search } from "lucide-react-native";
import { TextInput, TouchableOpacity } from "react-native";

type SearchBarVariant = "default" | "hero";

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  variant?: SearchBarVariant;
  editable?: boolean;
  showIcon?: boolean;
}

const variantStyles: Record<SearchBarVariant, string> = {
  default: "flex-1 flex-row items-center border border-gray-100 bg-transparent rounded-xl px-3 ",
  hero: "flex-1 flex-row items-center bg-transparent rounded-2xl border border-gray-100 px-4 py-3.5",
};

export function SearchBar({
  value = "",
  onChangeText,
  onPress,
  onFocus,
  placeholder = "Search livestock, farms...",
  variant = "default",
  editable,
  showIcon = true,
}: SearchBarProps) {
  const isEditable = editable !== undefined ? editable : !!onChangeText;

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const handleFocus = () => {
    if (onFocus) {
      onFocus();
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={variantStyles[variant]}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {showIcon && <Search size={18} color="#9CA3AF" />}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        className={`flex-1 ${showIcon ? "ml-2" : ""} text-sm text-gray-900`}
        editable={isEditable}
        onFocus={handleFocus}
        returnKeyType="search"
      />
    </TouchableOpacity>
  );
}

