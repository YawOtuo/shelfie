import { Calendar, Heart, Info, Scale, Sparkles, Syringe, Users, Utensils } from "lucide-react-native";
import { View } from "react-native";
import { FullAnimalListing } from "../../lib/types/listing";
import { Text } from "../ui/Text";

interface FullAnimalDetailsProps {
  details: FullAnimalListing;
  breed?: string;
}

interface DetailCardProps {
  icon: React.ComponentType<any>;
  label: string;
  value: string | number | null | undefined;
  unit?: string;
  fullWidth?: boolean;
}

function DetailCard({ icon: Icon, label, value, unit, fullWidth = false }: DetailCardProps) {
  const hasValue = value !== undefined && value !== null && value !== "";
  
  return (
    <View 
      className={`${fullWidth ? 'w-full' : 'w-[48%]'} bg-white rounded-xl p-4 border border-gray-100`}
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <View className="flex-row items-center gap-2 mb-2">
        <Icon size={14} color="#6B7280" strokeWidth={2} />
        <Text className="text-xs text-gray-500 font-medium">
          {label}
        </Text>
      </View>
      {hasValue ? (
        <Text className="text-lg font-bold text-gray-900">
          {value}{unit ? ` ${unit}` : ""}
        </Text>
      ) : (
        <Text className="text-sm font-medium text-gray-400">Not specified</Text>
      )}
    </View>
  );
}

interface DetailSectionProps {
  icon: React.ComponentType<any>;
  label: string;
  value: string | null | undefined;
}

function DetailSection({ icon: Icon, label, value }: DetailSectionProps) {
  const hasValue = value && value.trim() !== "";
  
  return (
    <View className="bg-white rounded-xl p-4 border border-gray-100" style={{ backgroundColor: '#FFFFFF' }}>
      <View className="flex-row items-center gap-2 mb-2">
        <Icon size={14} color="#6B7280" strokeWidth={2} />
        <Text className="text-sm font-semibold text-gray-900">{label}</Text>
      </View>
      {hasValue ? (
        <Text className="text-sm text-gray-700 leading-5">{value}</Text>
      ) : (
        <Text className="text-sm text-gray-400">Not specified</Text>
      )}
    </View>
  );
}

export function FullAnimalDetails({ details, breed }: FullAnimalDetailsProps) {
  const { age, weight, gender, health_status, vaccination_history, feeding_history, special_characteristics, quantity } = details;

  return (
    <View className="bg-white px-5 py-6 border-t border-gray-100" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View className="mb-5">
        <Text className="text-lg font-bold text-gray-900 mb-1">Animal Details</Text>
        <Text className="text-xs text-gray-500">Comprehensive information about the livestock</Text>
      </View>

      {/* Primary Information Grid */}
      <View className="mb-5">
        <View className="flex-row flex-wrap gap-3">
          <DetailCard icon={Users} label="Quantity" value={quantity} />
          <DetailCard icon={Scale} label="Weight" value={weight} unit="kg" />
          <DetailCard icon={Calendar} label="Age" value={age} unit="months" />
          <DetailCard icon={Info} label="Breed" value={breed} />
          <DetailCard icon={Users} label="Gender" value={gender ? gender.toLowerCase() : null} />
        </View>
      </View>

      {/* Health & Care Information */}
      {(health_status || vaccination_history || feeding_history || special_characteristics) && (
        <View className="pt-5 border-t border-gray-100">
          <Text className="text-sm font-semibold text-gray-700 mb-3">Health & Care</Text>
          <View className="gap-3">
            {health_status && (
              <DetailSection icon={Heart} label="Health Status" value={health_status} />
            )}
            {vaccination_history && (
              <DetailSection icon={Syringe} label="Vaccination History" value={vaccination_history} />
            )}
            {feeding_history && (
              <DetailSection icon={Utensils} label="Feeding History" value={feeding_history} />
            )}
            {special_characteristics && (
              <DetailSection icon={Sparkles} label="Special Characteristics" value={special_characteristics} />
            )}
          </View>
        </View>
      )}
    </View>
  );
}
