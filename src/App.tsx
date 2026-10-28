import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { UsersPage } from "./pages/UsersPage";
import { PerfilPage } from "./pages/PerfilPage";

function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const autenticado = useAuthStore((state) => state.autenticado);
  const esAdmin = useAuthStore((state) => state.esAdmin());
  if (!autenticado) return <Navigate to="/login" replace />;
  if (adminOnly && !esAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const autenticado = useAuthStore((state) => state.autenticado);
  return (
    <Routes>
      <Route
        path="/login"
        element={
          autenticado ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <PerfilPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/usuarios"
        element={
          <ProtectedRoute adminOnly>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <Navigate to={autenticado ? "/dashboard" : "/login"} replace />
        }
      />
    </Routes>
  );
}
