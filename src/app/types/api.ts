import type { User } from "./user";

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PostApiResponse<T> {
  posts: T[];
  total: number;
  filters?: Record<string, any>;
}


export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}


export interface AuthResponse {
  success: boolean;
  data?: User;
  message?: string;
  errors?: string[];
}
export interface SocialAuthCallbackResponse {
  user: User;
  token: string;
  refreshToken?: string;
  isNewUser: boolean; // Indica se é um novo usuário ou login existente
}
