
import axios, { 
  AxiosError,
} from 'axios';


import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  withCredentials?: boolean;
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  enableRefresh?: boolean;
  refreshEndpoint?: string;
  onTokenExpired?: () => void;
  onError?: (error: AxiosError) => void;
  onRequest?: (config: InternalAxiosRequestConfig) => void;
  onResponse?: (response: AxiosResponse) => void;
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedRequestsQueue: QueuedRequest[] = [];
  private config: Required<ApiClientConfig>;

  constructor(config?: ApiClientConfig) {
    // Configurações padrão
    this.config = {
      baseURL: config?.baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5656',
      timeout: config?.timeout || 30000,
      withCredentials: config?.withCredentials ?? true,
      enableRetry: config?.enableRetry ?? true,
      maxRetries: config?.maxRetries || 3,
      retryDelay: config?.retryDelay || 1000,
      enableRefresh: config?.enableRefresh ?? true,
      refreshEndpoint: config?.refreshEndpoint || '/api/auth/refresh',
      onTokenExpired: config?.onTokenExpired || (() => this.handleTokenExpired()),
      onError: config?.onError || (() => {}),
      onRequest: config?.onRequest || (() => {}),
      onResponse: config?.onResponse || (() => {}),
    };

    // Criar instância do axios
    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      withCredentials: this.config.withCredentials,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Interceptor de requisição
    this.client.interceptors.request.use(
      (config) => {
        // Adicionar token se existir
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Callback personalizado
        this.config.onRequest(config);

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor de resposta
    this.client.interceptors.response.use(
      (response) => {
        // Callback personalizado
        this.config.onResponse(response);
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _retryCount?: number };

        // Callback de erro personalizado
        this.config.onError(error);

        // Tratamento de erro 401 (token expirado)
        if (error.response?.status === 401 && this.config.enableRefresh && !originalRequest._retry) {
          return this.handleUnauthorized(originalRequest, error);
        }

        // Retry para outros erros (5xx, timeout, network)
        if (this.shouldRetry(error) && this.config.enableRetry) {
          return this.handleRetry(originalRequest, error);
        }

        return Promise.reject(this.enhanceError(error));
      }
    );
  }

  private async handleUnauthorized(
    originalRequest: InternalAxiosRequestConfig & { _retry?: boolean },
    error: AxiosError
  ): Promise<AxiosResponse> {
    if (this.isRefreshing) {
      // Se já está refreshing, adicionar à fila
      return new Promise((resolve, reject) => {
        this.failedRequestsQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return this.client(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    this.isRefreshing = true;

    try {
      const newToken = await this.refreshToken();
      
      if (newToken) {
        // Processar fila de requisições falhadas
        this.processQueue(newToken);
        
        // Repetir requisição original
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return this.client(originalRequest);
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (refreshError) {
      this.processQueue(null, refreshError);
      this.config.onTokenExpired();
      return Promise.reject(error);
    } finally {
      this.isRefreshing = false;
    }
  }

  private async handleRetry(
    originalRequest: InternalAxiosRequestConfig & { _retryCount?: number },
    error: AxiosError
  ): Promise<AxiosResponse> {
    const retryCount = originalRequest._retryCount || 0;
    
    if (retryCount >= this.config.maxRetries) {
      return Promise.reject(error);
    }

    originalRequest._retryCount = retryCount + 1;

    // Delay exponencial: 1s, 2s, 4s...
    const delay = this.config.retryDelay * Math.pow(2, retryCount);
    await new Promise(resolve => setTimeout(resolve, delay));

    return this.client(originalRequest);
  }

  private shouldRetry(error: AxiosError): boolean {
    if (!error.response) {
      // Erro de rede, timeout, etc.
      return true;
    }

    const status = error.response.status;
    
    // Retry para erros do servidor (5xx) e alguns 4xx específicos
    return status >= 500 || status === 408 || status === 429;
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        return null;
      }

      const response = await axios.post(`${this.config.baseURL}${this.config.refreshEndpoint}`, {
        refreshToken
      });

      const { token, refreshToken: newRefreshToken } = response.data.data || response.data;

      if (token) {
        this.setToken(token);
        if (newRefreshToken) {
          this.setRefreshToken(newRefreshToken);
        }
        return token;
      }

      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  private processQueue(token: string | null, error?: unknown): void {
    this.failedRequestsQueue.forEach(({ resolve, reject }) => {
      if (token) {
        resolve(token);
      } else {
        reject(error || new Error('Token refresh failed'));
      }
    });

    this.failedRequestsQueue = [];
  }

  private enhanceError(error: AxiosError): AxiosError {
    // Adicionar informações úteis ao erro
    const enhancedError = error;
    
    if (error.response) {
      // Erro do servidor
      enhancedError.message = `API Error: ${error.response.status} - ${
        error.response.data || error.response.statusText
      }`;
    } else if (error.request) {
      // Erro de rede
      enhancedError.message = 'Network Error: Unable to reach the server';
    }

    return enhancedError;
  }

  private handleTokenExpired(): void {
    // Limpar tokens
    this.clearTokens();
    
    // Redirecionar para login (apenas no browser)
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Métodos de gerenciamento de token
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  }

  private setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', token);
    }
  }

  public clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  // Métodos públicos para fazer requisições
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  // Método para obter a instância axios (caso precise de funcionalidades específicas)
  public getInstance(): AxiosInstance {
    return this.client;
  }

  // Método para atualizar configurações
  public updateConfig(newConfig: Partial<ApiClientConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Recriar cliente se necessário
    if (newConfig.baseURL || newConfig.timeout) {
      this.client.defaults.baseURL = this.config.baseURL;
      this.client.defaults.timeout = this.config.timeout;
    }
  }

  // Método para verificar se o cliente está online
  public async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health');
      return true;
    } catch {
      return false;
    }
  }
}

// Instância padrão
const apiClient = new ApiClient();

export default apiClient;

// Export da classe para criar instâncias customizadas se necessário
export { ApiClient };
export type { ApiClientConfig };