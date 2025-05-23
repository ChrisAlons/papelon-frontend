import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';

const HomeRedirect: React.FC = () => {
  const currentUser = useUserStore(state => state.currentUser);
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to="/dashboard" replace />;
};

export default HomeRedirect;

