import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Plus, Trash2, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usuariosService } from "../services/usuarios";
import type { UserProfile } from "../services/perfil";
import { EncabezadoPagina } from "../components/EncabezadoPagina";

interface NuevoUsuario {
  email: string;
  name: string;
  password: string;
  role: "cliente" | "admin";
}

export function UsersPage() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<UserProfile[]>([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NuevoUsuario>({ defaultValues: { role: "cliente" } });
  const cargarUsuarios = useCallback(() => {
    setCargando(true);
    return usuariosService
      .listar()
      .then(setUsuarios)
      .catch(() => setError("No se pudo cargar la lista de usuarios."))
      .finally(() => setCargando(false));
  }, []);
  useEffect(() => {
    void cargarUsuarios();
  }, [cargarUsuarios]);

  const crearUsuario = async (datos: NuevoUsuario) => {
    try {
      setError("");
      setMensaje("");
      const nuevo = await usuariosService.crear(datos);
      setUsuarios((actuales) => [nuevo, ...actuales]);
      setMensaje(
        `Se creó la cuenta de ${nuevo.name}. Para agregar una foto, inicia sesión con esa cuenta y abre Editar perfil.`,
      );
      reset({ email: "", name: "", password: "", role: "cliente" });
      setFormularioAbierto(false);
    } catch {
      setError(
        "No se pudo crear el usuario. Comprueba que el correo no esté registrado y vuelve a intentarlo.",
      );
    }
  };

  const eliminarUsuario = async (usuario: UserProfile) => {
    if (
      !window.confirm(
        `¿Eliminar la cuenta de ${usuario.name} (${usuario.email})? Esta acción no se puede deshacer.`,
      )
    )
      return;
    try {
      setError("");
      setMensaje("");
      await usuariosService.eliminar(usuario.id);
      setUsuarios((actuales) =>
        actuales.filter((actual) => actual.id !== usuario.id),
      );
      setMensaje(`Se eliminó la cuenta de ${usuario.name}.`);
    } catch {
      setError(
        "No se pudo eliminar el usuario. Verifica que la API permita DELETE /users/{id}.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 text-slate-900">
      <header className="border-b border-violet-100 bg-white/90 shadow-sm shadow-violet-100/50 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-violet-600 font-bold text-white shadow-md shadow-violet-200">
              F
            </span>
            <span className="text-lg font-bold tracking-tight">
              Funval E-commerce
            </span>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            <ArrowLeft className="size-4" />
            Dashboard
          </button>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-violet-700">
              Administración
            </p>
            <EncabezadoPagina
              titulo="Usuarios"
              descripcion="Crea cuentas de cliente y administra los usuarios registrados."
            />
          </div>
          <button
            onClick={() => {
              setFormularioAbierto((abierto) => !abierto);
              setError("");
            }}
            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-violet-600 px-4 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 sm:self-auto"
          >
            <Plus className="size-4" />
            {formularioAbierto ? "Cerrar formulario" : "Crear usuario"}
          </button>
        </div>
        {error && (
          <p
            role="alert"
            className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
          >
            {error}
          </p>
        )}
        {mensaje && (
          <p
            role="status"
            className="mb-5 rounded-xl border border-violet-100 bg-violet-50 p-4 text-sm text-violet-800"
          >
            {mensaje}
          </p>
        )}

        {formularioAbierto && (
          <form
            onSubmit={handleSubmit(crearUsuario)}
            className="mb-7 rounded-3xl border border-violet-100 bg-white p-6 shadow-lg shadow-violet-100/60 sm:p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-violet-100 text-violet-700">
                <UserPlus className="size-5" />
              </span>
              <div>
                <h2 className="font-bold">Nueva cuenta</h2>
                <p className="text-sm text-slate-500">
                  Completa los datos para registrar un usuario.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Nombre
                <input
                  {...register("name", {
                    required: "El nombre es obligatorio",
                    minLength: {
                      value: 2,
                      message: "Escribe al menos 2 caracteres",
                    },
                  })}
                  className="mt-2 h-11 w-full rounded-xl border border-violet-200 px-4 font-normal outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-600/10"
                />
                {errors.name && (
                  <span className="mt-1 block text-xs text-rose-600">
                    {errors.name.message}
                  </span>
                )}
              </label>
              <label className="text-sm font-semibold text-slate-700">
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
                  className="mt-2 h-11 w-full rounded-xl border border-violet-200 px-4 font-normal outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-600/10"
                />
                {errors.email && (
                  <span className="mt-1 block text-xs text-rose-600">
                    {errors.email.message}
                  </span>
                )}
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Contraseña
                <input
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 6,
                      message: "Usa al menos 6 caracteres",
                    },
                  })}
                  type="password"
                  autoComplete="new-password"
                  className="mt-2 h-11 w-full rounded-xl border border-violet-200 px-4 font-normal outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-600/10"
                />
                {errors.password && (
                  <span className="mt-1 block text-xs text-rose-600">
                    {errors.password.message}
                  </span>
                )}
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Rol
                <select
                  {...register("role")}
                  className="mt-2 h-11 w-full rounded-xl border border-violet-200 bg-white px-4 font-normal outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-600/10"
                >
                  <option value="cliente">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </label>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-11 rounded-xl bg-violet-600 px-5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:opacity-60"
              >
                {isSubmitting ? "Creando…" : "Crear cuenta"}
              </button>
            </div>
          </form>
        )}

        <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white/90 shadow-xl shadow-violet-100/60">
          <div className="border-b border-violet-100 bg-violet-50/70 px-5 py-4">
            <p className="text-sm font-semibold text-violet-950">
              Directorio de usuarios{" "}
              <span className="ml-2 rounded-full bg-white px-2.5 py-1 text-xs text-violet-700">
                {usuarios.length}
              </span>
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-white text-xs uppercase tracking-wide text-violet-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Usuario</th>
                  <th className="px-5 py-4 font-semibold">Correo</th>
                  <th className="px-5 py-4 font-semibold">Rol</th>
                  <th className="px-5 py-4 text-right font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-violet-50">
                {cargando ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      Cargando usuarios…
                    </td>
                  </tr>
                ) : usuarios.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      No hay usuarios para mostrar.
                    </td>
                  </tr>
                ) : (
                  usuarios.map((usuario) => (
                    <tr
                      key={usuario.id}
                      className="transition hover:bg-violet-50/50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {usuario.avatar_url ? (
                            <img
                              src={usuario.avatar_url}
                              alt={`Avatar de ${usuario.name}`}
                              className="size-10 rounded-full object-cover ring-2 ring-violet-100"
                            />
                          ) : (
                            <span className="grid size-10 place-items-center rounded-full bg-violet-100 text-xs font-bold text-violet-800">
                              {usuario.name.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                          <span className="font-semibold text-slate-800">
                            {usuario.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {usuario.email}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold capitalize text-violet-800">
                          {usuario.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => void eliminarUsuario(usuario)}
                          aria-label={`Eliminar usuario ${usuario.name}`}
                          title="Eliminar usuario"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
