
import apiClient from './api';
import type { 
  SignIn, 
  SignUp, 
  User, 
  ApiResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../types';

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
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

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<ForgotPasswordResponse>> {
    const response = await apiClient.post('/api/auth/forgot-password', data);
    return response.data;
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<ResetPasswordResponse>> {
    const response = await apiClient.post('/api/auth/reset-password', data);
    return response.data;
  }

  async refreshToken(data: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> {
    const response = await apiClient.post('/api/auth/refresh-token', data);
    return response.data;
  }

  // Métodos para autenticação social
  initiateGoogleAuth(): void {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/auth/google`;
  }

  initiateDiscordAuth(): void {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/auth/discord`;
  }


  // Método para obter o usuário atual
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Método utilitário para verificar se o usuário está logado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Método para obter o token de acesso
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Método para obter o refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  // Método para salvar tokens após login/refresh
  setTokens(accessToken: string, refreshToken?: string) {
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  }
}

export const authService = new AuthService();
