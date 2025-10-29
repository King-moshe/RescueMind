import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AouthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // אם אין משתמש מחובר, הפניה לעמוד התחברות
    return <Navigate to="/login" replace />;
  }

  return children;
}
