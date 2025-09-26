import apiClient from './api';
import type {
  User,
  CreateUser,
  UpdateUser,
  Follow,
  SocialLink,
  CreateSocialLink,
  UsersParams
} from '../types';

class UserService {
  // CRUD básico
  async create(data: CreateUser): Promise<User> {
    const response = await apiClient.post('/api/users', data);
    return response.data;
  }

  async findAll(params?: UsersParams): Promise<User[]> {
    const response = await apiClient.get('/api/users/profile', { params });
    return response.data;
  }

  async findBySlug(slug: string): Promise<User | null> {
    const response = await apiClient.get(`/api/users/profile/${slug}`);
    return response.data;
  }

  async findById(id: string): Promise<User | null> {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  }

  async update(id: string, data: UpdateUser): Promise<User> {
    const response = await apiClient.put(`/api/users/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data;
  }

  // Upload de imagens
  async uploadAvatar(userId: string, file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post(`/api/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async uploadBanner(userId: string, file: File): Promise<User> {
    const formData = new FormData();
    formData.append('banner', file);

    const response = await apiClient.post(`/api/users/${userId}/banner`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Seguidores / Seguindo
  async follow(followingId: string): Promise<Follow> {
    const response = await apiClient.post('/api/users/follow', {
      followerId: this.getCurrentUserId(),
      followingId
    });
    return response.data;
  }

  async unfollow(followingId: string): Promise<void> {
    const response = await apiClient.delete('/api/users/unfollow', {
      data: {
        followerId: this.getCurrentUserId(),
        followingId
      }
    });
    return response.data;
  }

  async getFollowers(id: string): Promise<Follow[]> {
    const response = await apiClient.get(`/api/users/${id}/followers`);
    return response.data;
  }

  async getFollowing(id: string): Promise<Follow[]> {
    const response = await apiClient.get(`/api/users/${id}/following`);
    return response.data;
  }

  // Links sociais
  async addSocialLink(userId: string, data: CreateSocialLink): Promise<SocialLink> {
    const response = await apiClient.post(`/api/users/${userId}/social-links`, data);
    return response.data;
  }

  async getSocialLinks(id: string): Promise<SocialLink[]> {
    const response = await apiClient.get(`/api/users/${id}/social`);
    return response.data;
  }

  async removeSocialLink(userId: string, socialLinkId: string): Promise<void> {
    const response = await apiClient.delete(`/api/users/${userId}/social-links`, {
      data: { id: socialLinkId }
    });
    return response.data;
  }

  // Método utilitário para obter o ID do usuário atual
  private getCurrentUserId(): string {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Usuário não autenticado');
        
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  // Método para buscar o perfil do usuário atual
  async getCurrentUser(): Promise<User> {
    const userId = this.getCurrentUserId();
    const user = await this.findById(userId);
    if (!user) throw new Error('Usuário atual não encontrado');
    return user;
  }

  // Método para atualizar o perfil do usuário atual
  async updateCurrentUser(data: UpdateUser): Promise<User> {
    const userId = this.getCurrentUserId();
    return this.update(userId, data);
  }

  // Método para upload de avatar do usuário atual
  async uploadCurrentUserAvatar(file: File): Promise<User> {
    const userId = this.getCurrentUserId();
    return this.uploadAvatar(userId, file);
  }

  // Método para upload de banner do usuário atual
  async uploadCurrentUserBanner(file: File): Promise<User> {
    const userId = this.getCurrentUserId();
    return this.uploadBanner(userId, file);
  }
}

export const userService = new UserService();
