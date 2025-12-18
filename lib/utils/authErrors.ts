/**
 * Authentication error message utilities
 */

export function getAuthErrorMessage(error: any): string {
  if (!error) return 'An unknown error occurred';

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle AWS Cognito errors
  if (error.name || error.__type) {
    const errorName = error.name || error.__type;
    
    switch (errorName) {
      case 'NotAuthorizedException':
      case 'IncorrectUsernameOrPasswordException':
        return 'Incorrect email or password';
      case 'UserNotConfirmedException':
        return 'Please verify your email address before signing in';
      case 'UserNotFoundException':
        return 'User not found. Please sign up first';
      case 'UsernameExistsException':
        return 'An account with this email already exists';
      case 'InvalidPasswordException':
        return 'Password does not meet requirements';
      case 'LimitExceededException':
        return 'Too many attempts. Please try again later';
      case 'CodeMismatchException':
        return 'Invalid verification code';
      case 'ExpiredCodeException':
        return 'Verification code has expired';
      case 'PasswordResetRequiredException':
        return 'Password reset is required';
      case 'ACCOUNT_NOT_CONFIRMED':
        return 'Please verify your email address';
      case 'RESET_PASSWORD_REQUIRED':
        return 'Password reset is required';
      case 'MFA_REQUIRED':
        return 'Multi-factor authentication is required';
      case 'INVALID_TOKEN':
        return 'Invalid authentication token';
      default:
        return error.message || `Authentication error: ${errorName}`;
    }
  }

  // Handle error messages
  if (error.message) {
    // Check for common error patterns
    if (error.message.includes('network') || error.message.includes('Network')) {
      return 'Network error. Please check your connection';
    }
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again';
    }
    return error.message;
  }

  return 'An unknown error occurred';
}

