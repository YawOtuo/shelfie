/**
 * Phone number formatting utility
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If it starts with 0, replace with country code (assuming +234 for Nigeria)
  // You can adjust this based on your requirements
  if (digits.startsWith('0')) {
    return `+234${digits.substring(1)}`;
  }
  
  // If it doesn't start with +, add it
  if (!digits.startsWith('+')) {
    return `+${digits}`;
  }
  
  return digits;
}
