
import apiClient from './api';
import type { 
  User, 
  CreateUser, 
  UpdateUser, 
  Follow, 
  SocialLink, 
  CreateSocialLink,
  ApiResponse,
  PaginatedResponse,
  UsersParams 
} from '../types';

class UserService {
  // CRUD básico
  async create(data: CreateUser): Promise<ApiResponse<User>> {
    const response = await apiClient.post('/api/users', data);
    return response.data;
  }

  async findAll(params?: UsersParams): Promise<ApiResponse<PaginatedResponse<User>>> {
    const response = await apiClient.get('/api/users/profile', { params });
    return response.data;
  }

  async findBySlug(slug: string): Promise<ApiResponse<User>> {
    const response = await apiClient.get(`/api/users/profile/${slug}`);
    return response.data;
  }

  async findById(id: string): Promise<ApiResponse<User>> {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  }

  async update(id: string, data: UpdateUser): Promise<ApiResponse<User>> {
    const response = await apiClient.put(`/api/users/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data;
  }

  // Seguidores / Seguindo
  async follow(data: { followingId: string }): Promise<ApiResponse<Follow>> {
    const response = await apiClient.post('/api/users/follow', data);
    return response.data;
  }

  async unfollow(data: { followingId: string }): Promise<ApiResponse<void>> {
    const response = await apiClient.delete('/api/users/unfollow', { data });
    return response.data;
  }

  async getFollowers(id: string): Promise<ApiResponse<Follow[]>> {
    const response = await apiClient.get(`/api/users/${id}/followers`);
    return response.data;
  }

  async getFollowing(id: string): Promise<ApiResponse<Follow[]>> {
    const response = await apiClient.get(`/api/users/${id}/following`);
    return response.data;
  }

  // Links sociais
  async addSocialLink(id: string, data: CreateSocialLink): Promise<ApiResponse<SocialLink>> {
    const response = await apiClient.post(`/api/users/${id}/social-links`, data);
    return response.data;
  }

  async getSocialLinks(id: string): Promise<ApiResponse<SocialLink[]>> {
    const response = await apiClient.get(`/api/users/${id}/social`);
    return response.data;
  }

  async removeSocialLink(id: string, data: { socialLinkId: string }): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/api/users/${id}/social-links`, { data });
    return response.data;
  }
}

export const userService = new UserService();
