import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { CircularProgress } from "@mui/material";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  console.log("ProtectedRoute user:", user, "loading:", loading);

  if (loading) {
    return (
    <div>LOADING....</div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
