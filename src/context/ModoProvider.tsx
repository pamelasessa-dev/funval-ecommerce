import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ModoContext, type Modo } from "./ModoContext";

interface ModoProviderProps {
  children: ReactNode;
}

function obtenerModoInicial(): Modo {
  return localStorage.getItem("modo") === "oscuro" ? "oscuro" : "claro";
}

export function ModoProvider({ children }: ModoProviderProps) {
  const [modo, setModo] = useState<Modo>(obtenerModoInicial);

  useEffect(() => {
    document.documentElement.dataset.theme = modo;
    localStorage.setItem("modo", modo);
  }, [modo]);

  const value = useMemo(
    () => ({
      modo,
      alternarModo: () =>
        setModo((actual) => (actual === "claro" ? "oscuro" : "claro")),
    }),
    [modo],
  );

  return <ModoContext.Provider value={value}>{children}</ModoContext.Provider>;
}
