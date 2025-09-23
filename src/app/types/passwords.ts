import type { User } from "./user";

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  resetTokenExpires?: string; 
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword?: string; 
}

export interface ResetPasswordResponse {
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string; 
  user?: User;
}
