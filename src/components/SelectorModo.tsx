import { Moon, Sun } from "lucide-react";
import { useModo } from "../context/useModo";

export function SelectorModo() {
  const { modo, alternarModo } = useModo();

  return (
    <button
      type="button"
      onClick={alternarModo}
      aria-label={`Cambiar a modo ${modo === "claro" ? "oscuro" : "claro"}`}
      title={`Cambiar a modo ${modo === "claro" ? "oscuro" : "claro"}`}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-3 text-sm font-semibold text-violet-800 shadow-lg transition hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
    >
      {modo === "claro" ? (
        <Moon aria-hidden="true" className="size-4" />
      ) : (
        <Sun aria-hidden="true" className="size-4" />
      )}
      Modo {modo === "claro" ? "oscuro" : "claro"}
    </button>
  );
}
