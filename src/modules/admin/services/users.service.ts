import { api } from "../../../core/api/http-client";
import { User } from "../../../core/types/user";

const USERS_ENDPOINT = '/users';

export async function getUsers() {
  const { data } = await api.get<User[]>(USERS_ENDPOINT);
  return data;
}

export async function getUsersByFilter(params: { role?: string; date?: string }) {
  const { data } = await api.get<User[]>(USERS_ENDPOINT, { params });
  return data;
}
