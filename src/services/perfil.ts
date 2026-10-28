import { api } from "../lib/axios";

export interface PerfilFormData {
  email: string;
  name: string;
}

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar_url: string | null;
}

export const perfilService = {
  //datos del usuaario logeado
  obtener: () => api.get<UserProfile>("/auth/me").then((r) => r.data),
  //obtener nos permite acceder a auth/me para ver si el usuario ya tiene foto guardad
  // ya que el login nos devuelve solo el token(nombre, rol)
  actualizar: (datos: Pick<PerfilFormData, "name">, foto?: File) => {
    const formData = new FormData(); //creamos paquete vacío
    formData.append("name", datos.name);
    if (foto) {
      formData.append("foto", foto);
    }

    return api.put<UserProfile>("/auth/perfil", formData).then((r) => r.data);
  },
};
