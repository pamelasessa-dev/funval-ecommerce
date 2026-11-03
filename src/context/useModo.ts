import { useContext } from "react";
import { ModoContext } from "./ModoContext";

export function useModo() {
  const context = useContext(ModoContext);
  if (!context) {
    throw new Error("useModo debe usarse dentro de un ModoProvider");
  }
  return context;
}
