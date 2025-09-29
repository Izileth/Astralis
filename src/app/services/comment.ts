import apiClient from './api';
import type {
  Comment,
  CreateComment,
  UpdateComment,
  ApiResponse,
} from '../types';

class CommentService {
  async create(data: CreateComment): Promise<ApiResponse<Comment>> {
    const response = await apiClient.post('/api/comments', data);
    return response.data;
  }

  async findByPost(postId: string): Promise<ApiResponse<Comment[]>> {
    const response = await apiClient.get(`/api/comments/post/${postId}`);

    // A API retorna um array bruto. Envolvemos ele na estrutura ApiResponse esperada.
    if (Array.isArray(response.data)) {
      return { success: true, data: response.data };
    }

    // Fallback para casos de erro ou formatos inesperados
    return {
      success: false,
      message: 'Formato de resposta inesperado da API de comentários.',
      data: [],
    };
  }

  async update(id: string, data: UpdateComment): Promise<ApiResponse<Comment>> {
    const response = await apiClient.put(`/api/comments/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/api/comments/${id}`);
    return response.data;
  }
}

export const commentService = new CommentService();