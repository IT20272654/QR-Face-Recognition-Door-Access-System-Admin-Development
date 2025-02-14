import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem('role'); // Assuming you store the role in localStorage

  if (!allowedRoles.includes(userRole)) {
    // Redirect to the dashboard if the user does not have the required role
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;