import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  private tokenCheckInterval: number | null = null;

  constructor() {
    // Don't start token check in constructor
    // It will be started after successful login
  }

  private startTokenCheck() {
    // Clear any existing interval
    this.stopTokenCheck();
    
    // Start new interval - check token every 5 minutes
    this.tokenCheckInterval = window.setInterval(async () => {
      try {
        const token = this.getToken();
        if (token) {
          await this.validateToken(token);
        }
      } catch (error) {
        console.error('Token check failed:', error);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
  }

  private stopTokenCheck() {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
      this.tokenCheckInterval = null;
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      await axios.get(`${API_URL}/auth/validate-token`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        this.handleLogout('Session expired. Please login again.');
      }
      return false;
    }
  }

  private handleLogout(message?: string) {
    this.logout();
    if (message) {
      toast.error(message);
    }
    // Only redirect if we're not already on the login page
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        this.startTokenCheck(); // Start token check after successful login
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        this.startTokenCheck(); // Start token check after successful registration
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  logout(): void {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.stopTokenCheck();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  setupAxiosInterceptors(): void {
    // Remove any existing interceptors
    axios.interceptors.request.eject(0);
    axios.interceptors.response.eject(0);

    // Add request interceptor
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Only handle 401/403 errors for non-auth endpoints
        if (
          (error.response?.status === 401 || error.response?.status === 403) &&
          !error.config.url.includes('/auth/')
        ) {
          this.handleLogout('Session expired. Please login again.');
        }
        return Promise.reject(error);
      }
    );
  }
}

const authService = new AuthService();
authService.setupAxiosInterceptors();

export default authService;
