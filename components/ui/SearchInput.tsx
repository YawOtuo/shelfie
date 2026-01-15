import { Search, X } from "lucide-react-native";
import { TextInput, TouchableOpacity, View } from "react-native";
import { cn } from "../../lib/utils";

interface SearchInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  className?: string;
  onSearchPress?: () => void;
  onClear?: () => void;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = "Search...",
  className,
  onSearchPress,
  onClear,
}: SearchInputProps) {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChangeText) {
      onChangeText("");
    }
  };

  return (
    <View
      className={cn(
        "flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-200",
        className
      )}
    >
      <Search size={18} color="#6B7280" strokeWidth={2.5} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        style={{ fontFamily: "Poppins_400Regular" }}
        className="flex-1 ml-3 text-gray-900 text-base"
        returnKeyType="search"
        onSubmitEditing={onSearchPress}
      />
      {value && value.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          className="ml-2"
          activeOpacity={0.7}
        >
          <X size={18} color="#6B7280" strokeWidth={2.5} />
        </TouchableOpacity>
      )}
    </View>
  );
}

