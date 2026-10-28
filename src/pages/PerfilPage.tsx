import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InputFotoPerfil } from "../components/InputFotoPerfil";
import { useAuthStore } from "../store/useAuthStore";
import {
  perfilService,
  type PerfilFormData,
  type UserProfile,
} from "../services/perfil";
import { usuariosService } from "../services/usuarios";

export function PerfilPage() {
  const navigate = useNavigate();
  const nombreActual = useAuthStore((state) => state.usuarioNombre);
  const correoActual = useAuthStore((state) => state.usuarioEmail);
  const avatarActual = useAuthStore((state) => state.usuarioAvatar);
  const actualizarPerfil = useAuthStore((state) => state.actualizarPerfil);
  const [perfil, setPerfil] = useState<UserProfile | null>(null);
  const [foto, setFoto] = useState<File>();
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PerfilFormData>({
    defaultValues: { email: correoActual ?? "", name: nombreActual ?? "" },
  });

  useEffect(() => {
    perfilService
      .obtener()
      .then((usuario) => {
        setPerfil(usuario);
        reset({ email: usuario.email, name: usuario.name });
      })
      .catch(() => setError("No se pudo cargar tu perfil."));
  }, [reset]);

  const onSubmit = async (datos: PerfilFormData) => {
    if (!perfil) return;
    try {
      setError("");
      setExito("");
      const actualizado = await perfilService.actualizar(
        { name: datos.name },
        foto,
      );
      let correoFinal = actualizado.email;
      if (datos.email !== perfil.email) {
        const usuarioActualizado = await usuariosService.actualizar(perfil.id, {
          email: datos.email,
          name: datos.name,
        });
        correoFinal = usuarioActualizado.email;
      }
      setPerfil({ ...actualizado, email: correoFinal });
      actualizarPerfil(actualizado.name, actualizado.avatar_url, correoFinal);
      setFoto(undefined);
      setExito("Tu perfil se actualizó correctamente.");
    } catch {
      setError(
        "No se pudo actualizar el perfil. Revisa los datos e inténtalo nuevamente.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 text-slate-900">
      <header className="border-b border-violet-100 bg-white/90 shadow-sm shadow-violet-100/50 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <span className="font-bold tracking-tight">Funval E-commerce</span>
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50"
          >
            <ArrowLeft className="size-4" /> Dashboard
          </button>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-5 py-9 sm:px-8 sm:py-12">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-violet-700">
          Mi cuenta
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Editar perfil</h1>
        <p className="mt-2 text-sm text-slate-500">
          Actualiza tus datos y tu foto de perfil.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-7 rounded-3xl border border-violet-100 bg-white p-6 shadow-xl shadow-violet-100/70 sm:p-9"
        >
          {error && (
            <p
              role="alert"
              className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
            >
              {error}
            </p>
          )}
          {exito && (
            <p
              role="status"
              className="mb-5 rounded-xl border border-violet-100 bg-violet-50 p-3 text-sm text-violet-800"
            >
              {exito}
            </p>
          )}
          <div className="mb-8">
            <InputFotoPerfil
              fotoActual={perfil?.avatar_url ?? avatarActual}
              iniciales={(perfil?.name ?? nombreActual ?? "U")
                .slice(0, 2)
                .toUpperCase()}
              onChange={setFoto}
            />
            <p className="mt-2 text-center text-xs text-slate-500">
              Imagen JPG, PNG o WEBP · Máximo 5 MB
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">
              Nombre completo
              <input
                {...register("name", {
                  required: "El nombre es obligatorio",
                  minLength: {
                    value: 2,
                    message: "Escribe al menos 2 caracteres",
                  },
                })}
                className="mt-2 h-12 w-full rounded-xl border border-violet-200 px-4 font-normal outline-none transition focus:border-violet-600 focus:ring-4 focus:ring-violet-600/10"
              />
              {errors.name && (
                <span className="mt-1 block text-xs text-rose-600">
                  {errors.name.message}
                </span>
              )}
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Correo electrónico
              <input
                {...register("email", {
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Ingresa un correo válido",
                  },
                })}
                type="email"
                className="mt-2 h-12 w-full rounded-xl border border-violet-200 px-4 font-normal outline-none transition focus:border-violet-600 focus:ring-4 focus:ring-violet-600/10"
              />
              {errors.email && (
                <span className="mt-1 block text-xs text-rose-600">
                  {errors.email.message}
                </span>
              )}
            </label>
            <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
              URL de la foto de perfil
              <input
                value={perfil?.avatar_url ?? ""}
                readOnly
                placeholder="Se completará al guardar la foto"
                className="mt-2 h-12 w-full rounded-xl border border-violet-100 bg-violet-50/60 px-4 font-normal text-slate-500 outline-none"
              />
              <span className="mt-1 block text-xs font-normal text-slate-500">
                La API genera esta dirección al subir la imagen.
              </span>
            </label>
          </div>
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="h-11 rounded-xl border border-violet-200 px-5 text-sm font-bold text-violet-800 transition hover:bg-violet-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !perfil}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-60"
            >
              <Save className="size-4" />
              {isSubmitting ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
