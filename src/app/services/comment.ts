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
    return response.data;
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