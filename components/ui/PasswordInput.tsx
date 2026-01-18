import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { cn } from "../../lib/utils";
import { Button } from "./Button";
import { Input, type InputProps } from "./Input";

interface PasswordInputProps extends Omit<InputProps, "secureTextEntry"> {
  showPasswordToggle?: boolean;
}

export function PasswordInput({
  showPasswordToggle = true,
  className,
  ...props
}: PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className="w-full">
      <View className="relative">
        <Input
          {...props}
          secureTextEntry={!isPasswordVisible}
          className={cn(showPasswordToggle ? "pr-12" : "", className)}
        />
        {showPasswordToggle && (
          <View
            className="absolute right-3"
            style={{
              top: props.label ? 28 : 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              variant="ghost"
              size="sm"
              className="p-1"
            >
              {isPasswordVisible ? (
                <EyeOff size={20} color="rgba(107, 114, 128, 0.6)" />
              ) : (
                <Eye size={20} color="rgba(107, 114, 128, 0.6)" />
              )}
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}
