import { Platform } from 'react-native';

/**
 * Replace localhost with the appropriate address for the current platform
 * - Physical devices: Use EXPO_PUBLIC_LOCAL_IP (your computer's IP like 192.168.1.100)
 * - Android emulator: Use 10.0.2.2
 * - iOS simulator: Use localhost
 */
export function getNetworkUrl(url: string): string {
  // If URL doesn't contain localhost, return as-is
  if (!url.includes('localhost') && !url.includes('127.0.0.1')) {
    return url;
  }

  // Check if we have a custom local IP set (for physical devices)
  const localIP = process.env.EXPO_PUBLIC_LOCAL_IP;
  if (localIP) {
    return url.replace(/localhost|127\.0\.0\.1/g, localIP);
  }

  // Platform-specific defaults
  if (Platform.OS === 'android') {
    // For Android emulator, use 10.0.2.2
    // Note: For physical Android device, you MUST set EXPO_PUBLIC_LOCAL_IP
    return url.replace(/localhost|127\.0\.0\.1/g, '10.0.2.2');
  }

  // iOS simulator can use localhost
  return url;
}

