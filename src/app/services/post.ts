
import apiClient from './api';
import type { 
  Post, 
  CreatePost, 
  UpdatePost, 
  Category, 
  Tag, 
  PostRelation,
  ApiResponse,
  PaginatedResponse,
  PostsParams
} from '../types';

export interface PostStats {
  totalPosts: number;
  totalPublished: number;
  totalDrafts: number;
  totalCategories: number;
  totalTags: number;
}

class PostService {
  // === ROTAS BÁSICAS (CRUD) ===
  async create(data: CreatePost): Promise<ApiResponse<Post>> {
    const response = await apiClient.post('/api/posts', data);
    return response.data;
  }

  async findAll(params?: PostsParams): Promise<ApiResponse<PaginatedResponse<Post>>> {
    const response = await apiClient.get('/api/posts', { params });
    return response.data;
  }

  async findBySlug(slug: string): Promise<ApiResponse<Post>> {
    const response = await apiClient.get(`/api/posts/slug/${slug}`);
    return response.data;
  }

  async findById(id: string): Promise<ApiResponse<Post>> {
    const response = await apiClient.get(`/api/posts/${id}`);
    return response.data;
  }

  async update(id: string, data: UpdatePost): Promise<ApiResponse<Post>> {
    const response = await apiClient.put(`/api/posts/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/api/posts/${id}`);
    return response.data;
  }

  // === ROTAS DE CATEGORIAS E TAGS ===
  async getAllCategories(): Promise<ApiResponse<Category[]>> {
    const response = await apiClient.get('/api/posts/categories/all');
    return response.data;
  }

  async getAllTags(): Promise<ApiResponse<Tag[]>> {
    const response = await apiClient.get('/api/posts/tags/all');
    return response.data;
  }

  // === ROTAS DE FILTROS ===
  async findByCategory(categoryName: string, params?: PostsParams): Promise<ApiResponse<PaginatedResponse<Post>>> {
    const response = await apiClient.get(`/api/posts/category/${categoryName}`, { params });
    return response.data;
  }

  async findByTag(tagName: string, params?: PostsParams): Promise<ApiResponse<PaginatedResponse<Post>>> {
    const response = await apiClient.get(`/api/posts/tag/${tagName}`, { params });
    return response.data;
  }

  // === ROTAS DE DESCOBERTA ===
  async getMostLiked(params?: PostsParams): Promise<ApiResponse<PaginatedResponse<Post>>> {
    const response = await apiClient.get('/api/posts/discover/most-liked', { params });
    return response.data;
  }

  async getRecent(params?: PostsParams): Promise<ApiResponse<PaginatedResponse<Post>>> {
    const response = await apiClient.get('/api/posts/discover/recent', { params });
    return response.data;
  }

  // === ROTAS DE UTILIDADE ===
  async getStats(): Promise<ApiResponse<PostStats>> {
    const response = await apiClient.get('/api/posts/utils/stats');
    return response.data;
  }

  async search(query: string, params?: PostsParams): Promise<ApiResponse<PaginatedResponse<Post>>> {
    const response = await apiClient.get('/api/posts/utils/search', { 
      params: { ...params, q: query } 
    });
    return response.data;
  }

  // === ROTAS DE AUTOR ===
  async findByAuthor(authorId: string, params?: PostsParams): Promise<ApiResponse<PaginatedResponse<Post>>> {
    const response = await apiClient.get(`/api/posts/author/${authorId}`, { params });
    return response.data;
  }

  // === ROTAS ESPECÍFICAS DE POST ===
  async getSimilar(id: string): Promise<ApiResponse<Post[]>> {
    const response = await apiClient.get(`/api/posts/${id}/similar`);
    return response.data;
  }

  async getRelatedPosts(id: string): Promise<ApiResponse<Post[]>> {
    const response = await apiClient.get(`/api/posts/${id}/related`);
    return response.data;
  }

  async togglePublish(id: string): Promise<ApiResponse<Post>> {
    const response = await apiClient.patch(`/api/posts/${id}/toggle-publish`);
    return response.data;
  }

  // === ROTAS DE RELAÇÕES ENTRE POSTS ===
  async addRelation(data: { postId: string; relatedPostId: string }): Promise<ApiResponse<PostRelation>> {
    const response = await apiClient.post('/api/posts/relations', data);
    return response.data;
  }

  async removeRelation(data: { postId: string; relatedPostId: string }): Promise<ApiResponse<void>> {
    const response = await apiClient.delete('/api/posts/relations', { data });
    return response.data;
  }
}

export const postService = new PostService()