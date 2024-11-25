import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/auth.service';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  checkAuthStatus: async () => false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        setUser(null);
        return false;
      }

      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        setUser(null);
        return false;
      }

      // Validate token with backend
      try {
        await authService.validateToken(token);
        setUser(currentUser);
        return true;
      } catch (error) {
        console.error('Token validation failed:', error);
        authService.logout(); // Clear invalid token
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      authService.logout(); // Clear any invalid state
      setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuthStatus();
      setLoading(false);
    };

    initializeAuth();
  }, [checkAuthStatus]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      toast.success('Successfully logged in!');

      // Get the redirect path from location state or default to /trains
      const redirectPath = location.state?.from || '/trains';
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
      toast.success('Successfully registered!');
      navigate('/trains');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      // First clear the auth state
      authService.logout();
      setUser(null);
      
      // Then navigate
      navigate('/trains', { replace: true });
      toast.success('Successfully logged out!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
