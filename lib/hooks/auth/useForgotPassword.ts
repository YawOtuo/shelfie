import { useState } from "react";
import { resetPassword, confirmResetPassword } from "./cognito";
import { getAuthErrorMessage } from "../../utils/authErrors";

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [codeSent, setCodeSent] = useState(false);
  const [identifier, setIdentifier] = useState<string>("");

  const sendResetCode = async (identifier: string) => {
    setLoading(true);
    setErrorText(undefined);
    setSuccessMessage(undefined);
    
    try {
      // Determine if identifier is email or phone
      const isEmail = identifier.includes('@');
      const username = isEmail ? identifier : identifier; // For phone, we'll use the formatted number
      
      await resetPassword({ username });
      
      setIdentifier(username);
      setCodeSent(true);
      setSuccessMessage(
        isEmail 
          ? `Reset code sent to ${identifier}. Check your email.`
          : `Reset code sent to ${identifier}. Check your SMS.`
      );
    } catch (error: any) {
      setErrorText(getAuthErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const confirmReset = async (code: string, newPassword: string) => {
    setLoading(true);
    setErrorText(undefined);
    setSuccessMessage(undefined);
    
    try {
      if (!identifier) {
        throw new Error("No identifier found. Please try the reset process again.");
      }
      
      await confirmResetPassword({ username: identifier, confirmationCode: code, newPassword });
      
      setSuccessMessage("Password reset successful! You can now login with your new password.");
      setCodeSent(false);
      setIdentifier("");
    } catch (error: any) {
      setErrorText(getAuthErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setLoading(false);
    setErrorText(undefined);
    setSuccessMessage(undefined);
    setCodeSent(false);
    setIdentifier("");
  };

  return {
    loading,
    errorText,
    successMessage,
    codeSent,
    identifier,
    sendResetCode,
    confirmReset,
    resetState,
  };
};
