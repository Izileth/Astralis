import apiClient from './api';
import type { SignIn, SignUp, User, ApiResponse } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async register(data: SignUp): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  }

  async login(data: SignIn): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post('/api/auth/login', data);
    return response.data;
  }

  logout() {
    localStorage.removeItem('access_token');
  }
}

export const authService = new AuthService();
