import { Image, TouchableOpacity, View } from "react-native";
import { Edit, User } from "lucide-react-native";
import { Text } from "../ui/Text";

interface ProfileHeaderProps {
  name: string;
  avatar?: string | null;
  onEditPress: () => void;
}

export function ProfileHeader({ name, avatar, onEditPress }: ProfileHeaderProps) {
  return (
    <View className="bg-white pb-6">
      <View className="items-center pt-6 pb-4">
        <TouchableOpacity
          onPress={onEditPress}
          className="relative mb-4"
        >
          <View className="w-24 h-24 rounded-full bg-primary items-center justify-center border-4 border-white shadow-lg">
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                className="w-full h-full rounded-full"
              />
            ) : (
              <User color="white" size={40} />
            )}
          </View>
          <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary border-2 border-white items-center justify-center">
            <Edit color="white" size={14} />
          </View>
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-900 mb-1">
          {name}
        </Text>
        <TouchableOpacity onPress={onEditPress}>
          <Text className="text-primary text-sm">Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

