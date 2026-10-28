import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Heart,
  Mail,
  Package,
  ShieldCheck,
  ShoppingCart,
  UsersRound,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { perfilService } from "../services/perfil";
import { EncabezadoPagina } from "../components/EncabezadoPagina";

function StoreMark() {
  return (
    <span className="grid size-9 place-items-center rounded-xl bg-violet-600 text-base font-bold text-white shadow-md shadow-violet-200">
      e
    </span>
  );
}

function Avatar({
  src,
  name,
  className = "",
}: {
  src?: string | null;
  name: string;
  className?: string;
}) {
  return src ? (
    <img
      src={src}
      alt={`Avatar de ${name}`}
      className={`size-10 rounded-full object-cover ${className}`}
    />
  ) : (
    <span
      className={`grid size-10 place-items-center rounded-full bg-violet-100 text-xs font-bold text-violet-800 ${className}`}
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const nombre = useAuthStore((state) => state.usuarioNombre) ?? "Usuario";
  const correo = useAuthStore((state) => state.usuarioEmail);
  const rol = useAuthStore((state) => state.usuarioRol) ?? "cliente";
  const avatar = useAuthStore((state) => state.usuarioAvatar);
  const establecerUsuario = useAuthStore((state) => state.establecerUsuario);
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
  const menuUsuarioRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    perfilService
      .obtener()
      .then(establecerUsuario)
      .catch(() => undefined);
  }, [establecerUsuario]);
  useEffect(() => {
    const cerrarAlHacerClickFuera = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !menuUsuarioRef.current?.contains(event.target)
      )
        setMenuUsuarioAbierto(false);
    };
    window.addEventListener("mousedown", cerrarAlHacerClickFuera);
    return () =>
      window.removeEventListener("mousedown", cerrarAlHacerClickFuera);
  }, []);
  const cerrarSesion = () => {
    logout();
    navigate("/login", { replace: true });
  };
  const primerNombre = nombre.trim().split(/\s+/)[0];

  return (
    <main className="min-h-screen bg-[#faf9ff] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-violet-100 bg-white/90 shadow-sm shadow-violet-100/50 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <StoreMark />
            <span className="text-lg font-bold tracking-tight">
              Funval E-commerce
            </span>
          </div>
          <nav className="flex items-center gap-3 text-sm font-semibold sm:gap-5">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hidden rounded-xl bg-violet-50 px-4 py-2.5 text-violet-700 transition hover:bg-violet-100 sm:block"
            >
              Inicio
            </button>
            <div className="relative" ref={menuUsuarioRef}>
              <button
                onClick={() => setMenuUsuarioAbierto((abierto) => !abierto)}
                aria-expanded={menuUsuarioAbierto}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-violet-50"
              >
                <Avatar
                  src={avatar}
                  name={nombre}
                  className="ring-2 ring-violet-100"
                />
                <span className="hidden max-w-36 truncate text-slate-800 sm:block">
                  {nombre}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={`size-4 text-violet-700 transition-transform ${menuUsuarioAbierto ? "rotate-180" : ""}`}
                />
              </button>
              {menuUsuarioAbierto && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-40 mt-2 w-60 overflow-hidden rounded-2xl border border-violet-100 bg-white p-2 shadow-xl shadow-violet-950/10"
                >
                  <div className="border-b border-violet-100 px-3 py-3">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {nombre}
                    </p>
                    <p className="mt-0.5 text-xs capitalize text-violet-600">
                      {rol}
                    </p>
                  </div>
                  <button
                    role="menuitem"
                    onClick={() => {
                      setMenuUsuarioAbierto(false);
                      navigate("/perfil");
                    }}
                    className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-800"
                  >
                    Editar mi perfil
                  </button>
                  {rol.toLowerCase() === "admin" && (
                    <button
                      role="menuitem"
                      onClick={() => {
                        setMenuUsuarioAbierto(false);
                        navigate("/usuarios");
                      }}
                      className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-800"
                    >
                      <span className="inline-flex items-center gap-2">
                        <UsersRound className="size-4" />
                        Administrar usuarios
                      </span>
                    </button>
                  )}
                  <button
                    role="menuitem"
                    onClick={cerrarSesion}
                    className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-9">
        <section className="relative isolate min-h-[390px] overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-white via-violet-50 to-indigo-100/80 px-7 py-9 shadow-xl shadow-violet-100/70 sm:px-12 sm:py-12 lg:flex lg:items-center lg:px-14">
          <div
            aria-hidden="true"
            className="absolute -right-24 top-[-8rem] -z-10 size-[34rem] rounded-full bg-violet-200/40"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-[-15rem] right-[18%] -z-10 size-[34rem] rounded-full bg-fuchsia-100/50"
          />
          <div className="relative z-10 max-w-xl lg:w-1/2">
            <p className="mb-3 text-base font-semibold text-violet-600">
              ¡Hola, {primerNombre}!
            </p>
            <EncabezadoPagina
              titulo="Bienvenido a e-mercado"
              descripcion="Tu espacio para gestionar tu cuenta, actualizar tus datos y disfrutar una experiencia de compra sencilla."
              tituloClassName="text-4xl leading-[1.08] sm:text-5xl"
            />
          </div>

          <div
            aria-hidden="true"
            className="relative mx-auto mt-10 flex h-56 w-full max-w-md items-center justify-center lg:mt-0 lg:h-80 lg:w-1/2"
          >
            <div className="absolute size-56 rounded-full bg-gradient-to-br from-violet-200/70 to-fuchsia-100/70 blur-sm lg:size-72" />
            <div className="absolute right-8 top-2 grid size-14 rotate-6 place-items-center rounded-2xl bg-fuchsia-400 text-white shadow-lg shadow-fuchsia-200 lg:right-16 lg:top-5">
              <Heart className="size-7 fill-white" />
            </div>
            <div className="absolute left-8 top-10 grid size-12 -rotate-12 place-items-center rounded-2xl bg-white text-violet-600 shadow-lg shadow-violet-200/70 lg:left-14 lg:top-14">
              <Package className="size-6" />
            </div>
            <div className="relative mt-10 grid size-44 place-items-center rounded-[2.5rem] border border-white/80 bg-white/80 text-violet-600 shadow-2xl shadow-violet-300/60 backdrop-blur lg:size-56">
              <ShoppingCart className="size-24 stroke-[1.5] lg:size-32" />
              <span className="absolute -bottom-3 right-5 size-5 rounded-full border-4 border-white bg-indigo-500 lg:right-8" />
              <span className="absolute -bottom-3 left-8 size-5 rounded-full border-4 border-white bg-indigo-500" />
            </div>
            <div className="absolute bottom-5 right-5 rounded-2xl border border-white/80 bg-white/85 px-4 py-2 text-xs font-semibold text-violet-700 shadow-lg shadow-violet-200/50 backdrop-blur lg:bottom-7 lg:right-8">
              Tu cuenta, siempre al día
            </div>
          </div>
        </section>

        <section className="mt-6">
          <article className="relative overflow-hidden rounded-[1.75rem] border border-violet-100 bg-white p-6 shadow-lg shadow-violet-100/60 sm:p-8">
            <div
              aria-hidden="true"
              className="absolute -right-7 -top-10 size-32 rounded-full bg-violet-50"
            />
            <div className="relative flex items-center gap-4 border-b border-violet-100 pb-6">
              <Avatar
                src={avatar}
                name={nombre}
                className="size-16 text-base ring-4 ring-violet-50"
              />
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-slate-900">
                  {nombre}
                </h2>
                <p className="mt-1 text-sm text-violet-600">
                  Tu cuenta está activa
                </p>
              </div>
            </div>
            <div className="grid gap-4 pt-5 sm:grid-cols-2">
              <div className="flex min-w-0 items-center gap-3 text-sm text-slate-600">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700">
                  <Mail className="size-4" />
                </span>
                <span className="truncate">
                  {correo ?? "Correo de tu cuenta"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700">
                  <ShieldCheck className="size-4" />
                </span>
                <span className="capitalize">Rol {rol}</span>
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
