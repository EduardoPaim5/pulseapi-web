import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Monitors from "./pages/Monitors";
import MonitorDetail from "./pages/MonitorDetail";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import { useAuth } from "./auth/useAuth";

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/80">
        Carregando...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <Register />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitors"
        element={
          <ProtectedRoute>
            <Monitors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitors/:id"
        element={
          <ProtectedRoute>
            <MonitorDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alerts"
        element={
          <ProtectedRoute>
            <Alerts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
