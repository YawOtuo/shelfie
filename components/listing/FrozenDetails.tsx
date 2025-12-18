import { View } from "react-native";
import { Text } from "../ui/Text";
import { Scale, Package, Calendar, Award, Snowflake, Scissors } from "lucide-react-native";
import { FrozenListing } from "../../lib/types/listing";

interface FrozenDetailsProps {
  details: FrozenListing;
}

interface DetailCardProps {
  icon: React.ComponentType<any>;
  label: string;
  value: string | number | null | undefined;
  unit?: string;
}

function DetailCard({ icon: Icon, label, value, unit }: DetailCardProps) {
  const hasValue = value !== undefined && value !== null && value !== "";
  
  return (
    <View 
      className="w-[48%] bg-white rounded-xl p-4 border border-gray-100"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <View className="flex-row items-center gap-2 mb-2">
        <Icon size={14} color="#6B7280" strokeWidth={2} />
        <Text className="text-xs text-gray-500 font-medium">
          {label}
        </Text>
      </View>
      {hasValue ? (
        <Text className="text-lg font-bold text-gray-900 capitalize">
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

export function FrozenDetails({ details }: FrozenDetailsProps) {
  const {
    weight,
    cut_type,
    packaging_type,
    storage_instructions,
    shelf_life,
    processing_date,
    certification,
  } = details;

  return (
    <View className="bg-white px-5 py-6 border-t border-gray-100" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View className="mb-5">
        <Text className="text-lg font-bold text-gray-900 mb-1">Frozen Product Details</Text>
        <Text className="text-xs text-gray-500">Product specifications and storage information</Text>
      </View>

      {/* Primary Information Grid */}
      <View className="mb-5">
        <View className="flex-row flex-wrap gap-3">
          <DetailCard icon={Scale} label="Weight" value={weight} unit="kg" />
          <DetailCard icon={Scissors} label="Cut Type" value={cut_type} />
          <DetailCard icon={Package} label="Packaging" value={packaging_type} />
          <DetailCard icon={Calendar} label="Shelf Life" value={shelf_life} />
        </View>
      </View>

      {/* Storage & Certification Details */}
      {(storage_instructions || processing_date || certification) && (
        <View className="pt-5 border-t border-gray-100">
          <Text className="text-sm font-semibold text-gray-700 mb-3">Storage & Certification</Text>
          <View className="gap-3">
            {storage_instructions && (
              <DetailSection icon={Snowflake} label="Storage Instructions" value={storage_instructions} />
            )}
            {processing_date && (
              <DetailSection icon={Calendar} label="Processing Date" value={processing_date} />
            )}
            {certification && (
              <DetailSection icon={Award} label="Certification" value={certification} />
            )}
          </View>
        </View>
      )}
    </View>
  );
}
