"use client";

import { useAuthUser } from "../providers/AuthUserProvider";
import type { AuthUserState } from "../stores/authUserStore";

export const useGetCurrentUser = (): Pick<AuthUserState, "user" | "loading" | "refreshUser"> => {
  const { user, loading, refreshUser } = useAuthUser();
  return { user, loading, refreshUser };
}; 