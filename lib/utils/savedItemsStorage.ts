// Saved items AsyncStorage utilities for React Native
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export interface LocalSavedItem {
  id: number;
  type: 'listing' | 'farm';
  timestamp: number;
}

const SAVED_LISTINGS_KEY = 'livestockly-saved-listings';
const SAVED_FARMS_KEY = 'livestockly-saved-farms';

// Hook for listings in AsyncStorage
export const useSavedListingsInLocalStorage = () => {
  const [savedListings, setSavedListingsState] = useState<LocalSavedItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved listings from AsyncStorage on mount
  useEffect(() => {
    const loadSavedListings = async () => {
      try {
        const stored = await AsyncStorage.getItem(SAVED_LISTINGS_KEY);
        if (stored) {
          setSavedListingsState(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading saved listings from storage:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadSavedListings();
  }, []);

  // Save to AsyncStorage whenever state changes
  const saveToStorage = useCallback(async (items: LocalSavedItem[]) => {
    try {
      setSavedListingsState(items);
      await AsyncStorage.setItem(SAVED_LISTINGS_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving listings to storage:', error);
    }
  }, []);

  return {
    getSavedListings: (): LocalSavedItem[] => savedListings || [],
    saveListing: async (id: number): Promise<void> => {
      const current = savedListings || [];
      if (!current.some(item => item.id === id)) {
        await saveToStorage([...current, { id, type: 'listing', timestamp: Date.now() }]);
      }
    },
    removeListing: async (id: number): Promise<void> => {
      const current = savedListings || [];
      await saveToStorage(current.filter(item => item.id !== id));
    },
    isListingSaved: (id: number): boolean => {
      return (savedListings || []).some(item => item.id === id);
    },
    clearAllSavedListings: async (): Promise<void> => {
      await saveToStorage([]);
    },
    getListingsToSync: (): LocalSavedItem[] => {
      return (savedListings || []).filter(item => item.timestamp > 0);
    },
    savedListings,
    setSavedListings: saveToStorage
  };
};

// Hook for farms in AsyncStorage
export const useSavedFarmsInLocalStorage = () => {
  const [savedFarms, setSavedFarmsState] = useState<LocalSavedItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved farms from AsyncStorage on mount
  useEffect(() => {
    const loadSavedFarms = async () => {
      try {
        const stored = await AsyncStorage.getItem(SAVED_FARMS_KEY);
        if (stored) {
          setSavedFarmsState(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading saved farms from storage:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadSavedFarms();
  }, []);

  // Save to AsyncStorage whenever state changes
  const saveToStorage = useCallback(async (items: LocalSavedItem[]) => {
    try {
      setSavedFarmsState(items);
      await AsyncStorage.setItem(SAVED_FARMS_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving farms to storage:', error);
    }
  }, []);

  return {
    getSavedFarms: (): LocalSavedItem[] => savedFarms || [],
    saveFarm: async (id: number): Promise<void> => {
      const current = savedFarms || [];
      if (!current.some(item => item.id === id)) {
        await saveToStorage([...current, { id, type: 'farm', timestamp: Date.now() }]);
      }
    },
    removeFarm: async (id: number): Promise<void> => {
      const current = savedFarms || [];
      await saveToStorage(current.filter(item => item.id !== id));
    },
    isFarmSaved: (id: number): boolean => {
      return (savedFarms || []).some(item => item.id === id);
    },
    clearAllSavedFarms: async (): Promise<void> => {
      await saveToStorage([]);
    },
    getFarmsToSync: (): LocalSavedItem[] => {
      return (savedFarms || []).filter(item => item.timestamp > 0);
    },
    savedFarms,
    setSavedFarms: saveToStorage
  };
};

// Fallback utilities for non-React contexts (using AsyncStorage)
export const savedItemsStorageUtils = {
  // Get all saved items from AsyncStorage
  getSavedItems: async (): Promise<LocalSavedItem[]> => {
    try {
      const saved = await AsyncStorage.getItem(SAVED_LISTINGS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error reading saved items from AsyncStorage:', error);
      return [];
    }
  },

  // Save an item to AsyncStorage
  saveItem: async (id: number, type: 'listing' | 'farm'): Promise<void> => {
    try {
      const savedItems = await savedItemsStorageUtils.getSavedItems();
      const existingIndex = savedItems.findIndex(item => item.id === id && item.type === type);
      
      if (existingIndex === -1) {
        savedItems.push({
          id,
          type,
          timestamp: Date.now()
        });
        await AsyncStorage.setItem(SAVED_LISTINGS_KEY, JSON.stringify(savedItems));
      }
    } catch (error) {
      console.error('Error saving item to AsyncStorage:', error);
    }
  },

  // Remove an item from AsyncStorage
  removeItem: async (id: number, type: 'listing' | 'farm'): Promise<void> => {
    try {
      const savedItems = await savedItemsStorageUtils.getSavedItems();
      const filteredItems = savedItems.filter(item => !(item.id === id && item.type === type));
      await AsyncStorage.setItem(SAVED_LISTINGS_KEY, JSON.stringify(filteredItems));
    } catch (error) {
      console.error('Error removing item from AsyncStorage:', error);
    }
  },

  // Check if an item is saved in AsyncStorage
  isItemSaved: async (id: number, type: 'listing' | 'farm'): Promise<boolean> => {
    try {
      const savedItems = await savedItemsStorageUtils.getSavedItems();
      return savedItems.some(item => item.id === id && item.type === type);
    } catch (error) {
      console.error('Error checking saved item in AsyncStorage:', error);
      return false;
    }
  },

  // Get saved items by type
  getSavedItemsByType: async (type: 'listing' | 'farm'): Promise<LocalSavedItem[]> => {
    const savedItems = await savedItemsStorageUtils.getSavedItems();
    return savedItems.filter(item => item.type === type);
  },

  // Clear all saved items (useful for logout)
  clearAllSavedItems: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(SAVED_LISTINGS_KEY);
      await AsyncStorage.removeItem(SAVED_FARMS_KEY);
    } catch (error) {
      console.error('Error clearing saved items from AsyncStorage:', error);
    }
  },

  // Get items that need to be synced to backend (items saved while logged out)
  getItemsToSync: async (): Promise<LocalSavedItem[]> => {
    const savedItems = await savedItemsStorageUtils.getSavedItems();
    return savedItems.filter(item => item.timestamp > 0); // All items with timestamps
  }
}; 