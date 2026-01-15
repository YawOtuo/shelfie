import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";

export function useImagePicker() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const pickImage = useCallback(async () => {
    try {
      setLoading(true);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to add images!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => asset.uri);
        setImages((prev) => [...prev, ...newImages]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Failed to pick image");
    } finally {
      setLoading(false);
    }
  }, []);

  const removeImage = useCallback((uri: string) => {
    setImages((prev) => prev.filter((img) => img !== uri));
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
  }, []);

  const setInitialImages = useCallback((uris: string[]) => {
    setImages(uris);
  }, []);

  return {
    images,
    pickImage,
    removeImage,
    clearImages,
    setInitialImages,
    loading,
  };
}

