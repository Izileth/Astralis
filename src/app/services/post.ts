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
      
      // Log para debug
      console.log('API Response:', response.data);
      
      // ✅ A API já retorna na estrutura correta: { posts: [], total: number, filters: {} }
      return {
        success: true,
        data: response.data // response.data já contém { posts: [], total: number, filters: {} }
      };
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  // ✅ Outros métodos permanecem iguais
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
  async findByCategory(categoryName: string, params?: PostsParams): Promise<ApiResponse<PostApiResponse<Post>>> {
    const response = await apiClient.get(`/api/posts/category/${categoryName}`, { params });
    return response.data;
  }

  async findByTag(tagName: string, params?: PostsParams): Promise<ApiResponse<PostApiResponse<Post>>> {
    const response = await apiClient.get(`/api/posts/tag/${tagName}`, { params });
    return response.data;
  }

  // === ROTAS DE DESCOBERTA ===
  async getMostLiked(params?: PostsParams): Promise<ApiResponse<PostApiResponse<Post>>> {
    const response = await apiClient.get('/api/posts/discover/most-liked', { params });
    return response.data;
  }

  async getRecent(params?: PostsParams): Promise<ApiResponse<PostApiResponse<Post>>> {
    const response = await apiClient.get('/api/posts/discover/recent', { params });
    return response.data;
  }

  // === ROTAS DE UTILIDADE ===
  async getStats(): Promise<ApiResponse<PostStats>> {
    const response = await apiClient.get('/api/posts/utils/stats');
    return response.data;
  }

  async search(query: string, params?: PostsParams): Promise<ApiResponse<PostApiResponse<Post>>> {
    const response = await apiClient.get('/api/posts/utils/search', { 
      params: { ...params, q: query } 
    });
    return response.data;
  }

  // === ROTAS DE AUTOR ===
  async findByAuthor(authorId: string, params?: PostsParams): Promise<ApiResponse<PostApiResponse<Post>>> {
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

  // === MÉTODOS AUXILIARES (NOVOS) ===
  
  // Método para verificar se slug está disponível
  async checkSlugAvailability(slug: string): Promise<ApiResponse<{ available: boolean }>> {
    const response = await apiClient.get(`/api/posts/utils/check-slug/${slug}`);
    return response.data;
  }

  // Método para upload de imagem (se necessário)
  async uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await apiClient.post('/api/posts/utils/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Método para preview de post (markdown para HTML)
  async previewPost(content: string): Promise<ApiResponse<{ html: string }>> {
    const response = await apiClient.post('/api/posts/utils/preview', { content });
    return response.data;
  }

  // Método para duplicar post
  async duplicatePost(id: string): Promise<ApiResponse<Post>> {
    const response = await apiClient.post(`/api/posts/${id}/duplicate`);
    return response.data;
  }

  // Método para exportar posts
  async exportPosts(params?: PostsParams & { format: 'json' | 'csv' | 'xml' }): Promise<ApiResponse<{ downloadUrl: string }>> {
    const response = await apiClient.get('/api/posts/utils/export', { params });
    return response.data;
  }

  // Método para importar posts
  async importPosts(file: File): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/api/posts/utils/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Método para obter histórico de versões (se implementado)
  async getPostHistory(id: string): Promise<ApiResponse<Array<{ version: number; createdAt: string; changes: string[] }>>> {
    const response = await apiClient.get(`/api/posts/${id}/history`);
    return response.data;
  }

  // Método para restaurar versão específica
  async restorePostVersion(id: string, version: number): Promise<ApiResponse<Post>> {
    const response = await apiClient.post(`/api/posts/${id}/restore/${version}`);
    return response.data;
  }
}

export const postService = new PostService();
