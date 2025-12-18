import { } from "../hooks/useHybridSavedFarms";
import { } from "../hooks/useHybridSavedListings";

interface SavedItemsSyncProviderProps {
  children: React.ReactNode;
}

export default function SavedItemsSyncProvider({ children }: SavedItemsSyncProviderProps) {
  // These hooks will automatically sync AsyncStorage items to backend when user logs in
  // useSyncLocalSavedListingsToBackend();
  // useSyncLocalSavedFarmsToBackend();
  
  // These hooks will automatically sync backend items to AsyncStorage when user logs in
  // useSyncBackendSavedListingsToLocalStorage();
  // useSyncBackendSavedFarmsToLocalStorage();
  
  return <>{children}</>;
}

