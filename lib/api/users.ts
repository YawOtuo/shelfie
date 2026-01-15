import { inventoryAxios } from '../axiosinstance';
import { User, CreateUserInput, UpdateUserInput } from '../types/user';

export const getAllUsers = async (): Promise<User[]> => {
  const response = await inventoryAxios.get<User[]>('/users');
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await inventoryAxios.get<User>(`/users/${id}`);
  return response.data;
};

export const getUserByUid = async (uid: string): Promise<User> => {
  const response = await inventoryAxios.get<User>(`/users/getUserByUid/${uid}`);
  return response.data;
};

export const createUser = async (data: CreateUserInput): Promise<User> => {
  const response = await inventoryAxios.post<User>('/users', data);
  return response.data;
};

export const updateUser = async (
  id: number,
  data: Partial<CreateUserInput>
): Promise<User> => {
  const response = await inventoryAxios.put<User>(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await inventoryAxios.delete(`/users/${id}`);
};

export const acceptUser = async (id: number): Promise<User> => {
  const response = await inventoryAxios.get<User>(`/users/${id}/accept`);
  return response.data;
};

export const deacceptUser = async (id: number): Promise<User> => {
  const response = await inventoryAxios.get<User>(`/users/${id}/de-accept`);
  return response.data;
};


