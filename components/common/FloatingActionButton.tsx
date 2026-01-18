import { LucideIcon } from "lucide-react-native";
import { TouchableOpacity, Platform } from "react-native";
import { colors } from "../../lib/colors";

interface FloatingActionButtonProps {
  onPress: () => void;
  icon: LucideIcon;
  iconSize?: number;
  iconColor?: string;
}

export function FloatingActionButton({
  onPress,
  icon: Icon,
  iconSize = 24,
  iconColor = colors.white,
}: FloatingActionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center"
      activeOpacity={0.8}
      style={{
        backgroundColor: colors.primary.DEFAULT,
        shadowColor: colors.gray[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Icon size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
}
