// src/components/RequireAuth.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';

const RequireAuth: React.FC = () => {
  const currentUser = useUserStore(state => state.currentUser);
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
