import apiClient from './api';
import type { 
  Post, 
  CreatePost, 
  UpdatePost, 
  Category, 
  Tag, 
  PostRelation,
  ApiResponse,
  PostApiResponse,
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
  async findAll(params?: PostsParams): Promise<ApiResponse<PostApiResponse<Post>>> {
    try {
      const response = await apiClient.get('/api/posts', { params });
      
      console.log('API Response:', response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  async findBySlug(slug: string): Promise<ApiResponse<Post>> {
    try {
      const response = await apiClient.get(`/api/posts/slug/${slug}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Post não encontrado'
      };
    }
  }

  async findById(id: string): Promise<ApiResponse<Post>> {
    try {
      const response = await apiClient.get(`/api/posts/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Post não encontrado'
      };
    }
  }

  async create(data: CreatePost): Promise<ApiResponse<Post>> {
    try {
      const response = await apiClient.post('/api/posts', data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao criar post'
      };
    }
  }

  async update(id: string, data: UpdatePost): Promise<ApiResponse<Post>> {
    try {
      const response = await apiClient.put(`/api/posts/${id}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao atualizar post'
      };
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.delete(`/api/posts/${id}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao deletar post'
      };
    }
  }

  // === NOVO: UPLOAD DE MÍDIA ===
  async uploadMedia(postId: string, file: File): Promise<ApiResponse<Post>> {
    try {
      const formData = new FormData();
      formData.append('media', file);

      const response = await apiClient.post(`/api/posts/${postId}/media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao fazer upload da mídia'
      };
    }
  }

  // === ROTAS DE CATEGORIAS E TAGS ===
  async getAllCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const response = await apiClient.get('/api/posts/categories/all');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar categorias'
      };
    }
  }

  async getAllTags(): Promise<ApiResponse<Tag[]>> {
    try {
      const response = await apiClient.get('/api/posts/tags/all');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar tags'
      };
    }
  }

  // === ROTAS DE FILTROS ===
  async findByCategory(categoryName: string, params?: PostsParams): Promise<ApiResponse<PostApiResponse<Post>>> {
    try {
      const response = await apiClient.get(`/api/posts/category/${categoryName}`, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar posts por categoria'
      };
    }
  }

  async findByTag(tagName: string, params?: PostsParams): Promise<ApiResponse<PostApiResponse<Post>>> {
    try {
      const response = await apiClient.get(`/api/posts/tag/${tagName}`, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar posts por tag'
      };
    }
  }

  // === ROTAS DE DESCOBERTA ===
  async getMostLiked(params?: PostsParams): Promise<ApiResponse<PostApiResponse<Post>>> {
    try {
      const response = await apiClient.get('/api/posts/discover/most-liked', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar posts mais curtidos'
      };
    }
  }

  async getRecent(params?: PostsParams): Promise<ApiResponse<PostApiResponse<Post>>> {
    try {
      const response = await apiClient.get('/api/posts/discover/recent', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar posts recentes'
      };
    }
  }

  // === ROTAS DE UTILIDADE ===
  async getStats(): Promise<ApiResponse<PostStats>> {
    try {
      const response = await apiClient.get('/api/posts/utils/stats');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar estatísticas'
      };
    }
  }

  async search(query: string, params?: PostsParams): Promise<ApiResponse<PostApiResponse<Post>>> {
    try {
      const response = await apiClient.get('/api/posts/utils/search', { 
        params: { ...params, q: query } 
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro na busca'
      };
    }
  }

  // === ROTAS DE AUTOR ===
  async findByAuthor(authorId: string, params?: PostsParams): Promise<ApiResponse<PostApiResponse<Post>>> {
    try {
      const response = await apiClient.get(`/api/posts/author/${authorId}`, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar posts do autor'
      };
    }
  }

  // === ROTAS ESPECÍFICAS DE POST ===
  async getSimilar(id: string): Promise<ApiResponse<Post[]>> {
    try {
      const response = await apiClient.get(`/api/posts/${id}/similar`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar posts similares'
      };
    }
  }

  async getRelatedPosts(id: string): Promise<ApiResponse<Post[]>> {
    try {
      const response = await apiClient.get(`/api/posts/${id}/related`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar posts relacionados'
      };
    }
  }

  async togglePublish(id: string): Promise<ApiResponse<Post>> {
    try {
      const response = await apiClient.patch(`/api/posts/${id}/toggle-publish`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao alterar status de publicação'
      };
    }
  }

  // === ROTAS DE RELAÇÕES ENTRE POSTS ===
  async addRelation(data: { postId: string; relatedPostId: string }): Promise<ApiResponse<PostRelation>> {
    try {
      const response = await apiClient.post('/api/posts/relations', data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao adicionar relação'
      };
    }
  }

  async removeRelation(data: { postId: string; relatedPostId: string }): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete('/api/posts/relations', { data });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao remover relação'
      };
    }
  }

  // === MÉTODOS AUXILIARES ATUALIZADOS ===
  
  async checkSlugAvailability(slug: string): Promise<ApiResponse<{ available: boolean }>> {
    try {
      const response = await apiClient.get(`/api/posts/utils/check-slug/${slug}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao verificar slug'
      };
    }
  }

  // Método atualizado para usar o endpoint correto
  async uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await apiClient.post('/api/posts/utils/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro no upload da imagem'
      };
    }
  }

  async previewPost(content: string): Promise<ApiResponse<{ html: string }>> {
    try {
      const response = await apiClient.post('/api/posts/utils/preview', { content });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao gerar preview'
      };
    }
  }

  async duplicatePost(id: string): Promise<ApiResponse<Post>> {
    try {
      const response = await apiClient.post(`/api/posts/${id}/duplicate`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao duplicar post'
      };
    }
  }

  async exportPosts(params?: PostsParams & { format: 'json' | 'csv' | 'xml' }): Promise<ApiResponse<{ downloadUrl: string }>> {
    try {
      const response = await apiClient.get('/api/posts/utils/export', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao exportar posts'
      };
    }
  }

  async importPosts(file: File): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post('/api/posts/utils/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao importar posts'
      };
    }
  }

  async getPostHistory(id: string): Promise<ApiResponse<Array<{ version: number; createdAt: string; changes: string[] }>>> {
    try {
      const response = await apiClient.get(`/api/posts/${id}/history`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar histórico'
      };
    }
  }

  async restorePostVersion(id: string, version: number): Promise<ApiResponse<Post>> {
    try {
      const response = await apiClient.post(`/api/posts/${id}/restore/${version}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao restaurar versão'
      };
    }
  }
}

export const postService = new PostService();