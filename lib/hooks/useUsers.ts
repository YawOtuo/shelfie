import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllUsers,
  getUserById,
  getUserByUid,
  createUser,
  updateUser,
  deleteUser,
  acceptUser,
  deacceptUser,
} from '../api/users';
import { CreateUserInput } from '../types/user';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  byUid: (uid: string) => [...userKeys.all, 'uid', uid] as const,
};

// Hooks
export const useUsers = (enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: getAllUsers,
    enabled,
  });
};

export const useUser = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: enabled && !!id,
  });
};

export const useUserByUid = (uid: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.byUid(uid),
    queryFn: () => getUserByUid(uid),
    enabled: enabled && !!uid,
  });
};

// Mutations
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserInput) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateUserInput> }) =>
      updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useAcceptUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => acceptUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
};

export const useDeacceptUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deacceptUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
};


