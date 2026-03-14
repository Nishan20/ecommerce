import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Usage: wrap route element <ProtectedRoute />
// provide props: authRequired (default true), adminOnly (default false)

const ProtectedRoute = ({ authRequired = true, adminOnly = false, redirectTo = "/login" }) => {
  const { isAuthenticated, authUser } = useSelector((state) => state.auth);

  if (authRequired && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (adminOnly && authUser?.role !== "Admin") {
    // If user not admin, redirect to home or profile
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
