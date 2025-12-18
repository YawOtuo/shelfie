import { useEffect, useRef } from "react";
import * as Location from "expo-location";

// This store would need to be created if it doesn't exist
// import { useUserLocationStore } from "@/lib/stores/useUserLocationStore";

interface LocationProviderProps {
  children: React.ReactNode;
}

export default function LocationProvider({ children }: LocationProviderProps) {
  const hasRequestedPermission = useRef(false);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (hasRequestedPermission.current) return;
      hasRequestedPermission.current = true;

      try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status === 'granted') {
          // Get current location
          const location = await Location.getCurrentPositionAsync({});
          
          // Store location in store if available
          // const setPreciseLocation = useUserLocationStore.getState().setPreciseLocation;
          // setPreciseLocation({
          //   latitude: location.coords.latitude,
          //   longitude: location.coords.longitude,
          //   name: 'Current Location',
          //   display_name: 'Current Location',
          //   country: '',
          //   region: '',
          // });
        } else {
          console.warn('Location permission denied');
        }
      } catch (error) {
        console.error("LocationProvider: Error requesting location:", error);
      }
    };

    requestLocationPermission();
  }, []);

  return <>{children}</>;
}

