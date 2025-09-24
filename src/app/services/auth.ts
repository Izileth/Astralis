import apiClient from './api';
import type {
  SignIn,
  SignUp,
  User,
  ForgotPasswordRequest,  
  ResetPasswordRequest,
  RefreshTokenRequest,
} from '../types';

// Interface alinhada com a resposta do backend
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Interface para respostas de redefinição de senha (baseada no backend)
export interface PasswordResetResponse {
  message: string;
  resetToken?: string; // Apenas para desenvolvimento/teste
}

class AuthService {
  async register(data: SignUp): Promise<AuthResponse> {
    const response = await apiClient.post('/api/auth/register', data);
    console.log('Dados de Registro -', data);
    // Backend retorna diretamente { user, accessToken, refreshToken }
    return response.data;
  }

  async login(data: SignIn): Promise<AuthResponse> {
    const response = await apiClient.post('/api/auth/login', data);
    console.log('Dados de Login -', data);
    // Backend retorna diretamente { user, accessToken, refreshToken }
    return response.data;
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<PasswordResetResponse> {
    const response = await apiClient.post('/api/auth/forgot-password', data);
    // Backend retorna { message, resetToken? }
    return response.data;
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post('/api/auth/reset-password', data);
    // Backend retorna { message: "Senha redefinida com sucesso." }
    return response.data;
  }

  async refreshToken(data: RefreshTokenRequest): Promise<{ accessToken: string }> {
    const response = await apiClient.post('/api/auth/refresh-token', data);
    // Backend retorna { accessToken }
    return response.data;
  }

  // Métodos para autenticação social
  initiateGoogleAuth(): void {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/auth/google`;
  }

  initiateDiscordAuth(): void {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/auth/discord`;
  }

  async socialAuthCallback(params: URLSearchParams): Promise<AuthResponse> {
    const provider = params.get('provider');
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    if (error) {
      throw new Error(`Social login failed: ${error}`);
    }

    if (!provider || !code) {
      throw new Error('Missing provider or code for social login.');
    }

    const response = await apiClient.get(`/api/auth/social/callback`, {
      params: { provider, code, state },
    });

    return response.data;
  }

  // Método para obter o usuário atual
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/api/auth/me');
    // Assumindo que retorna diretamente o usuário
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

  // Método para fazer refresh do token automaticamente
  async tryRefreshToken(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return null;

      const response = await this.refreshToken({ refreshToken });
      const newAccessToken = response.accessToken;
      
      // Atualiza apenas o access token
      this.setTokens(newAccessToken, refreshToken);
      return newAccessToken;
    } catch (error) {
      // Se falhar, remove os tokens
      this.logout();
      return null;
    }
  }
}

export const authService = new AuthService();