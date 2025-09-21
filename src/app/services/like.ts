

import apiClient from './api';
import type { ApiResponse } from '../types';

export interface LikeCount {
  count: number;
  isLikedByCurrentUser: boolean;
}

class LikeService {
  // === AÇÕES DE CURTIDA EM POSTS ===
  async likePost(data: { postId: string }): Promise<ApiResponse<void>> {
    const response = await apiClient.post('/api/likes/posts', data);
    return response.data;
  }

  async unlikePost(data: { postId: string }): Promise<ApiResponse<void>> {
    const response = await apiClient.delete('/api/likes/posts', { data });
    return response.data;
  }

  async countPostLikes(postId: string): Promise<ApiResponse<LikeCount>> {
    const response = await apiClient.get(`/api/likes/posts/count/${postId}`);
    return response.data;
  }

  // === AÇÕES DE CURTIDA EM COMENTÁRIOS ===
  async likeComment(commentId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post(`/api/likes/comments/${commentId}`);
    return response.data;
  }

  async unlikeComment(commentId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/api/likes/comments/${commentId}`);
    return response.data;
  }

  async countCommentLikes(commentId: string): Promise<ApiResponse<LikeCount>> {
    const response = await apiClient.get(`/api/likes/comments/count/${commentId}`);
    return response.data;
  }
}

export const likeService = new LikeService();