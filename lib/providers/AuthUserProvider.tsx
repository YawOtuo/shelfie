import React, { createContext, useContext } from "react";
import { useAuthUserStore } from "../stores/authUserStore";
import type { AuthUserState } from "../stores/authUserStore";

const AuthUserContext = createContext<AuthUserState | null>(null);

export function AuthUserProvider({ children }: { children: React.ReactNode }) {
  const store: AuthUserState = useAuthUserStore();
  return <AuthUserContext.Provider value={store}>{children}</AuthUserContext.Provider>;
}

export function useAuthUser(): AuthUserState {
  const ctx = useContext(AuthUserContext);
  if (!ctx) throw new Error("useAuthUser must be used within an AuthUserProvider");
  return ctx;
}

