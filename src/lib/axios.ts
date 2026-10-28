import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "https://api-funval-g6.onrender.com",
  //borramos el content type del header para que no se convierta nuestro formdata a json
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
