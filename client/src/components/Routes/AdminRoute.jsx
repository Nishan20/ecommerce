import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const { authUser: user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (user.role !== "Admin") return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
