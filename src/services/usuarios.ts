import { api } from "../lib/axios";
import type { UserProfile } from "./perfil";

export const usuariosService = {
  listar: async (): Promise<UserProfile[]> => {
    const { data } = await api.get<UserProfile[] | { users: UserProfile[] }>(
      "/users/",
    );
    return Array.isArray(data) ? data : data.users;
  },
  crear: async (usuario: {
    email: string;
    name: string;
    password: string;
    role: string;
  }) => (await api.post<UserProfile>("/users/", usuario)).data,
  actualizar: async (
    id: number,
    usuario: {
      email?: string;
      name?: string;
      password?: string;
      role?: string;
    },
  ) => (await api.put<UserProfile>(`/users/${id}`, usuario)).data,
  eliminar: async (id: number) => api.delete(`/users/${id}`),
};
