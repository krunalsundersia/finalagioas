import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if token exists
      if (!authAPI.isAuthenticated()) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Verify token is valid by fetching current user
      await authAPI.getCurrentUser();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      authAPI.removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#1c1410',
        color: '#E8E0D5',
        fontFamily: 'Inter, sans-serif',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid rgba(196, 168, 111, 0.2)',
          borderTopColor: '#ffd700',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{
          fontFamily: 'Cinzel, serif',
          letterSpacing: '0.2em',
          fontSize: '12px',
          textTransform: 'uppercase',
          color: '#ac8042'
        }}>
          Verifying Credentials
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated - render children
  return children;
};

export default ProtectedRoute;