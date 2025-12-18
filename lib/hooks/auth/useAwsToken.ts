import { useState, useEffect } from 'react';
import { fetchAuthSession } from './cognito';
import { tokenManager } from '../../axiosinstance/tokenManager';

interface AwsTokenAttributes {
  email?: string;
  phone_number?: string;
  email_verified?: boolean;
  phone_number_verified?: boolean;
  sub?: string;
  [key: string]: any;
}

export function useAwsToken() {
  const [attributes, setAttributes] = useState<AwsTokenAttributes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenAttributes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const session = await fetchAuthSession();
        const idToken = session?.tokens?.idToken?.toString();
        
        if (!idToken) {
          setAttributes(null);
          return;
        }

        const payload = tokenManager.decodeToken(idToken) as AwsTokenAttributes;
        setAttributes(payload);
      } catch (err) {
        console.error('Error fetching AWS token attributes:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch token attributes');
        setAttributes(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenAttributes();
  }, []);

  return {
    attributes,
    loading,
    error,
    emailVerified: attributes?.email_verified || false,
    phoneVerified: attributes?.phone_number_verified || false,
    email: attributes?.email,
    phoneNumber: attributes?.phone_number,
  };
} 