// src/components/RequireAuth.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';

const RequireAuth: React.FC = () => {
  const currentUser = useUserStore(state => state.currentUser);
  const loading = useUserStore(state => state.loading);
  if (loading) return null; // No renderiza nada mientras carga
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
