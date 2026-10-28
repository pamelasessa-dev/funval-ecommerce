import { api } from "../lib/axios";

export interface LoginFormData {
  email: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  user_role: string;
  user_name: string;
}

export const authService = {
  login: async (datos: LoginFormData): Promise<TokenResponse> => {
    const respuesta = await api.post<TokenResponse>("/auth/login", datos);

    return respuesta.data;
  },
};
