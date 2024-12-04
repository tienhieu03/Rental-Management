import { useAppSelector } from "../redux/hook";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const roleName = useAppSelector((state) => state.auth.user.role.name);
  return (
    <>
      {isAuthenticated && roleName !== "NORMAL USER" ? (
        <>{children}</>
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
};
const ProtectedUserRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const roleName = useAppSelector((state) => state.auth.user.role.name);
  return (
    <>
      {isAuthenticated && roleName === "NORMAL USER" ? (
        <>{children}</>
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
};
export default {
  ProtectedAdminRoute,
  ProtectedUserRoute,
};
