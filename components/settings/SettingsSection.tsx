import { View } from "react-native";
import { Card } from "../ui/Card";
import { colors } from "../../lib/colors";

interface SettingsSectionProps {
  children: React.ReactNode;
}

export function SettingsSection({ children }: SettingsSectionProps) {
  return (
    <View className="px-5 mb-2">
      <Card 
        padding="none"
        style={{
          backgroundColor: colors.white,
          overflow: "hidden",
        }}
      >
        {children}
      </Card>
    </View>
  );
}
