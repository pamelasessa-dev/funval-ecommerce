import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authService, type LoginFormData } from "../services/auth";
import { perfilService } from "../services/perfil";
import { useAuthStore } from "../store/useAuthStore";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const establecerUsuario = useAuthStore((state) => state.establecerUsuario);
  const [errorServidor, setErrorServidor] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorServidor("");
      const respuesta = await authService.login(data);
      login(respuesta.access_token, respuesta.user_name, respuesta.user_role);
      try {
        establecerUsuario(await perfilService.obtener());
      } catch {
        /* Se conserva el nombre y rol recibidos por login. */
      }
      navigate("/dashboard", { replace: true });
    } catch {
      setErrorServidor(
        "Credenciales incorrectas o error al conectar con el servidor.",
      );
    }
  };

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-violet-50 px-5 py-10 text-slate-900">
      <div
        aria-hidden="true"
        className="absolute -left-28 -top-28 -z-10 size-96 rounded-full bg-fuchsia-200/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -right-20 -z-10 size-[30rem] rounded-full bg-indigo-200/70 blur-3xl"
      />
      <section className="w-full max-w-md rounded-[2rem] bg-gradient-to-br from-violet-700 via-violet-700 to-indigo-800 p-2 shadow-2xl shadow-violet-300/70">
        <div className="rounded-[1.6rem] border border-white/15 bg-white/5 px-6 py-8 text-white backdrop-blur-sm sm:px-9 sm:py-10">
          <div className="mb-8 flex items-center justify-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-white text-lg font-black text-violet-700 shadow-lg">
              F
            </span>
            <span className="text-lg font-bold tracking-tight">
              Funval E-commerce
            </span>
          </div>
          <div className="mb-7 text-center">
            <p className="text-sm font-semibold text-violet-200">
              Bienvenido de vuelta
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Inicia sesión
            </h1>
            <p className="mt-2 text-sm leading-6 text-violet-100">
              Accede a tu cuenta para ver tu espacio en mercado.
            </p>
          </div>
          {errorServidor && (
            <p
              role="alert"
              className="mb-5 rounded-xl border border-rose-200/40 bg-rose-400/15 p-3 text-sm text-rose-50"
            >
              {errorServidor}
            </p>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <label className="block text-sm font-semibold text-white">
              Correo electrónico
              <input
                {...register("email", { required: "El correo es obligatorio" })}
                className="mt-2 h-12 w-full rounded-xl border border-white/70 bg-white px-4 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-200/30"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
              />
              {errors.email && (
                <span className="mt-1 block text-xs font-medium text-rose-100">
                  {errors.email.message}
                </span>
              )}
            </label>
            <label className="block text-sm font-semibold text-white">
              Contraseña
              <input
                {...register("password", {
                  required: "La contraseña es obligatoria",
                })}
                className="mt-2 h-12 w-full rounded-xl border border-white/70 bg-white px-4 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-200/30"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
              />
              {errors.password && (
                <span className="mt-1 block text-xs font-medium text-rose-100">
                  {errors.password.message}
                </span>
              )}
            </label>
            <button
              className="h-12 w-full rounded-xl bg-white text-sm font-bold text-violet-800 shadow-lg transition hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-white/30 disabled:opacity-60"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Iniciando sesión…" : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
