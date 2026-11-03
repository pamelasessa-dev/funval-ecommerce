import { createContext } from "react";

export type Modo = "claro" | "oscuro";

export interface ModoContextValue {
  modo: Modo;
  alternarModo: () => void;
}

export const ModoContext = createContext<ModoContextValue | null>(null);
