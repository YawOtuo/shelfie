import { View } from "react-native";
import { Text } from "../ui/Text";
import { Scale, Package, Users, Calendar, Scissors, Box } from "lucide-react-native";
import { SharedPortionListing } from "../../lib/types/listing";

interface SharedPortionDetailsProps {
  details: SharedPortionListing;
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

export function SharedPortionDetails({ details }: SharedPortionDetailsProps) {
  const {
    total_weight,
    portion_size,
    portions_available,
    minimum_portion_order,
    cut_preference,
    processing_date,
    packaging_options,
  } = details;

  return (
    <View className="bg-white px-5 py-6 border-t border-gray-100" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View className="mb-5">
        <Text className="text-lg font-bold text-gray-900 mb-1">Portion Details</Text>
        <Text className="text-xs text-gray-500">Shared portion specifications and options</Text>
      </View>

      {/* Primary Information Grid */}
      <View className="mb-5">
        <View className="flex-row flex-wrap gap-3">
          <DetailCard icon={Scale} label="Total Weight" value={total_weight} unit="kg" />
          <DetailCard icon={Package} label="Portion Size" value={portion_size} unit="kg" />
          <DetailCard icon={Users} label="Available" value={portions_available} unit="portions" />
          <DetailCard icon={Package} label="Min Order" value={minimum_portion_order} unit="portions" />
        </View>
      </View>

      {/* Processing & Packaging Details */}
      {(cut_preference || processing_date || packaging_options) && (
        <View className="pt-5 border-t border-gray-100">
          <Text className="text-sm font-semibold text-gray-700 mb-3">Processing & Packaging</Text>
          <View className="gap-3">
            {cut_preference && (
              <DetailSection icon={Scissors} label="Cut Preference" value={cut_preference} />
            )}
            {processing_date && (
              <DetailSection icon={Calendar} label="Processing Date" value={processing_date} />
            )}
            {packaging_options && (
              <DetailSection icon={Box} label="Packaging Options" value={packaging_options} />
            )}
          </View>
        </View>
      )}
    </View>
  );
}
