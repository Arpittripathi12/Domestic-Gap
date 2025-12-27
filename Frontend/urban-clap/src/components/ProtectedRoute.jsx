import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { CircularProgress } from "@mui/material";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  console.log("ProtectedRoute user:", user, "loading:", loading);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress size={80} color="inherit" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
