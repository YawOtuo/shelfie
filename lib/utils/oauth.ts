/**
 * OAuth state utilities for React Native
 * Handles encoding/decoding OAuth state for deep linking
 */

export interface OAuthState {
  userType?: 'buyer' | 'seller';
  flowType?: 'login' | 'signup';
  redirectTo?: string;
  farmDataKey?: string;
  [key: string]: any;
}

/**
 * Create OAuth state string from metadata
 */
export function createOAuthState(metadata: OAuthState): string {
  try {
    const stateData = {
      ...metadata,
      timestamp: Date.now(),
    };
    return encodeURIComponent(JSON.stringify(stateData));
  } catch (error) {
    console.error('Error creating OAuth state:', error);
    return '';
  }
}

/**
 * Parse OAuth state string to metadata
 */
export function parseOAuthState(state: string | null | undefined): OAuthState | null {
  if (!state) return null;
  
  try {
    const decoded = decodeURIComponent(state);
    const parsed = JSON.parse(decoded);
    
    // Validate timestamp (optional: expire old states)
    if (parsed.timestamp) {
      const age = Date.now() - parsed.timestamp;
      // Expire states older than 1 hour
      if (age > 60 * 60 * 1000) {
        console.warn('OAuth state expired');
        return null;
      }
    }
    
    return parsed;
  } catch (error) {
    console.error('Error parsing OAuth state:', error);
    return null;
  }
}

