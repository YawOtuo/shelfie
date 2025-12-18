import { useEffect } from "react";
import { useAuthUser } from "./AuthUserProvider";

export function AuthUserInit() {
  const { refreshUser } = useAuthUser();

  useEffect(() => {
    // Only refresh user if not already authenticated to prevent unnecessary calls
    refreshUser().catch(() => {});
  }, [refreshUser]);

  return null;
}

