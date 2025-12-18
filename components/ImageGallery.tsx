import { View, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Text } from "./ui/Text";

interface ImageGalleryProps {
  images: Array<{ id: number; image_url: string; is_primary?: boolean }>;
  height?: number;
}

export function ImageGallery({ images, height = 400 }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get("window").width;

  if (!images || images.length === 0) {
    return (
      <View
        className="w-full bg-gray-100 items-center justify-center"
        style={{ height }}
      >
        <Text className="text-gray-400 text-4xl">🐄</Text>
      </View>
    );
  }

  const fullWidth = screenWidth;

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / fullWidth);
    setActiveIndex(index);
  };

  const goToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * fullWidth,
      animated: true,
    });
    setActiveIndex(index);
  };

  const goToPrevious = () => {
    if (activeIndex > 0) {
      goToSlide(activeIndex - 1);
    }
  };

  const goToNext = () => {
    if (activeIndex < images.length - 1) {
      goToSlide(activeIndex + 1);
    }
  };

  return (
    <View className="relative">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: 0 }}
        snapToInterval={fullWidth}
        decelerationRate="fast"
      >
        {images.map((image, index) => (
          <View
            key={image.id || index}
            style={{ width: fullWidth }}
          >
            <Image
              source={{ uri: image.image_url }}
              className="w-full"
              style={{ height, width: fullWidth }}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          {activeIndex > 0 && (
            <TouchableOpacity
              onPress={goToPrevious}
              className="absolute left-4 w-10 h-10 items-center justify-center rounded-full bg-white/80 shadow-md"
              style={{ top: "50%", marginTop: -20 }}
            >
              <ChevronLeft size={20} color="#1F2937" />
            </TouchableOpacity>
          )}
          {activeIndex < images.length - 1 && (
            <TouchableOpacity
              onPress={goToNext}
              className="absolute right-4 w-10 h-10 items-center justify-center rounded-full bg-white/80 shadow-md"
              style={{ top: "50%", marginTop: -20 }}
            >
              <ChevronRight size={20} color="#1F2937" />
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <View className="absolute bottom-4 left-0 right-0 flex-row items-center justify-center gap-2">
          {images.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => goToSlide(index)}
              className={`h-2 rounded-full ${
                activeIndex === index ? "bg-white w-6" : "bg-white/50 w-2"
              }`}
            />
          ))}
        </View>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <View className="absolute top-4 right-4 bg-black/50 rounded-full px-3 py-1">
          <Text className="text-white text-xs font-medium">
            {activeIndex + 1} / {images.length}
          </Text>
        </View>
      )}
    </View>
  );
}

