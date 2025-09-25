import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services';
import type { User, SignIn, SignUp, ForgotPasswordRequest, ForgotPasswordResponse, ResetPasswordRequest, ResetPasswordResponse } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: SignIn) => Promise<void>;
  register: (data: SignUp) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  refreshToken: () => Promise<boolean>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<ForgotPasswordResponse>;
  resetPassword: (data: ResetPasswordRequest) => Promise<ResetPasswordResponse>;
  socialLogin: (params: URLSearchParams) => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      // Actions
      clearError: () => set({ error: null }),

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const token = authService.getAccessToken();
          if (token) {
            // Tenta buscar o usuário atual
            const user = await authService.getCurrentUser();
            set({
              isAuthenticated: true,
              user,
              token,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error: any) {
          // Se falhar, tenta fazer refresh do token
          const newToken = await authService.tryRefreshToken();
          if (newToken) {
            // Se conseguiu fazer refresh, tenta novamente buscar o usuário
            try {
              const user = await authService.getCurrentUser();
              set({
                isAuthenticated: true,
                user,
                token: newToken,
                isLoading: false,
                error: null,
              });
            } catch (err) {
              // Se ainda falhar, faz logout
              authService.logout();
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
              });
            }
          } else {
            // Se não conseguiu fazer refresh, faz logout
            authService.logout();
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        }
      },

      login: async (credentials: SignIn) => {
        set({ isLoading: true, error: null });
        try {
          // Backend retorna diretamente { user, accessToken, refreshToken }
          const responseData = await authService.login(credentials);
          
          if (responseData?.user && responseData?.accessToken) {
            authService.setTokens(responseData.accessToken, responseData.refreshToken);
            set({
              isAuthenticated: true,
              user: responseData.user,
              token: responseData.accessToken,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error('Dados de login inválidos recebidos do servidor');
          }
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 
                              err.message || 
                              'Erro desconhecido durante o login';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          throw new Error(errorMessage);
        }
      },

      register: async (userData: SignUp) => {
        set({ isLoading: true, error: null });
        try {
          // Backend retorna diretamente { user, accessToken, refreshToken }
          const responseData = await authService.register(userData);
          
          if (responseData?.user && responseData?.accessToken) {
            authService.setTokens(responseData.accessToken, responseData.refreshToken);
            set({
              isAuthenticated: true,
              user: responseData.user,
              token: responseData.accessToken,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error('Dados de registro inválidos recebidos do servidor');
          }
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 
                              err.message || 
                              'Erro desconhecido durante o registro';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          throw new Error(errorMessage);
        }
      },

      forgotPassword: async (data: ForgotPasswordRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.forgotPassword(data);
          set({ isLoading: false, error: null });
          return response;
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || err.message || 'Erro desconhecido ao solicitar redefinição de senha.';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw new Error(errorMessage);
        }
      },

      resetPassword: async (data: ResetPasswordRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.resetPassword(data);
          set({ isLoading: false, error: null });
          return response;
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || err.message || 'Erro desconhecido ao redefinir senha.';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw new Error(errorMessage);
        }
      },

      refreshToken: async (): Promise<boolean> => {
        try {
          const newToken = await authService.tryRefreshToken();
          if (newToken) {
            set({ token: newToken });
            return true;
          }
          return false;
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: 'Sessão expirada. Faça login novamente.',
          });
          return false;
        }
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      socialLogin: async (params: URLSearchParams) => {
        set({ isLoading: true, error: null });
        try {
          const responseData = await authService.socialAuthCallback(params);
          if (responseData?.user && responseData?.accessToken) {
            authService.setTokens(responseData.accessToken, responseData.refreshToken);
            set({
              isAuthenticated: true,
              user: responseData.user,
              token: responseData.accessToken,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error('Dados de login social inválidos recebidos do servidor');
          }
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || err.message || 'Erro desconhecido durante o login social';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          throw new Error(errorMessage);
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
