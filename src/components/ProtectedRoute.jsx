import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated()) {
    // User is not authenticated, redirect to login but save their intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    // User is authenticated but lacks required role (e.g. USER trying to hit /admin), redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
