import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles: string[];  // ✅ Define required prop
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const authContext = useContext(AuthContext);

  if (!authContext || !authContext.user || !authContext.role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(authContext.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
