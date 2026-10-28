import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  usuarioNombre: string | null;
  usuarioRol: string | null;
  usuarioAvatar: string | null;
  usuarioEmail: string | null;
  autenticado: boolean;

  login: (token: string, nombre: string, rol: string) => void;
  establecerUsuario: (usuario: {
    name: string;
    role: string;
    email?: string;
    avatar_url?: string | null;
  }) => void;
  logout: () => void;
  esAdmin: () => boolean;
  actualizarPerfil: (
    nombre: string,
    avatar: string | null,
    email?: string,
  ) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      usuarioNombre: null,
      usuarioRol: null,
      usuarioAvatar: null,
      usuarioEmail: null,
      autenticado: false,

      login: (token, nombre, rol) => {
        set({
          token: token,
          usuarioNombre: nombre,
          usuarioRol: rol,
          autenticado: true,
        });
      },
      establecerUsuario: (usuario) =>
        set({
          usuarioNombre: usuario.name,
          usuarioRol: usuario.role,
          usuarioEmail: usuario.email ?? null,
          usuarioAvatar: usuario.avatar_url ?? null,
          autenticado: true,
        }),

      actualizarPerfil: (nombre, avatar, email) =>
        set({
          usuarioNombre: nombre,
          usuarioAvatar: avatar,
          ...(email !== undefined ? { usuarioEmail: email } : {}),
        }),

      logout: () => {
        set({
          token: null,
          usuarioNombre: null,
          usuarioRol: null,
          usuarioAvatar: null,
          usuarioEmail: null,
          autenticado: false,
        });
      },

      esAdmin: () => {
        return get().usuarioRol?.toLowerCase() === "admin";
      },
    }),
    {
      name: "mercado-auth-storage",
    },
  ),
);
