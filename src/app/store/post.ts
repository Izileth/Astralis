import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { postService } from '../services';
import type { 
  Post, 
  CreatePost, 
  UpdatePost, 
  Category, 
  Tag, 
  PostsParams
} from '../types';

// Interfaces do Store
export interface PostStats {
  totalPosts: number;
  totalPublished: number;
  totalDrafts: number;
  totalCategories: number;
  totalTags: number;
}

interface PostFilters {
  published?: boolean;
  categoryName?: string;
  tagNames?: string[];
  authorId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface PostState {
  // Estados dos dados
  posts: Post[];
  currentPost: Post | null;
  categories: Category[];
  tags: Tag[];
  stats: PostStats | null;
  relatedPosts: Post[];
  similarPosts: Post[];
  
  // Estados de paginação
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  
  // Estados de loading
  loading: {
    posts: boolean;
    currentPost: boolean;
    categories: boolean;
    tags: boolean;
    stats: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    related: boolean;
    similar: boolean;
  };
  
  // Estados de erro
  errors: {
    posts: string | null;
    currentPost: string | null;
    categories: string | null;
    tags: string | null;
    stats: string | null;
    creating: string | null;
    updating: string | null;
    deleting: string | null;
    related: string | null;
    similar: string | null;
  };
  
  // Filtros atuais
  currentFilters: PostFilters;
}

interface PostActions {
  // === AÇÕES DE POSTS ===
  fetchPosts: (params?: PostsParams) => Promise<void>;
  fetchPostBySlug: (slug: string) => Promise<Post | null>;
  fetchPostById: (id: string) => Promise<Post | null>;
  createPost: (data: CreatePost) => Promise<Post | null>;
  updatePost: (id: string, data: UpdatePost) => Promise<Post | null>;
  deletePost: (id: string) => Promise<boolean>;
  togglePublish: (id: string) => Promise<Post | null>;
  
  // === AÇÕES DE CATEGORIAS E TAGS ===
  fetchCategories: () => Promise<void>;
  fetchTags: () => Promise<void>;
  
  // === AÇÕES DE FILTROS ===
  fetchPostsByCategory: (categoryName: string, params?: PostsParams) => Promise<void>;
  fetchPostsByTag: (tagName: string, params?: PostsParams) => Promise<void>;
  fetchPostsByAuthor: (authorId: string, params?: PostsParams) => Promise<void>;
  
  // === AÇÕES DE DESCOBERTA ===
  fetchMostLikedPosts: (params?: PostsParams) => Promise<void>;
  fetchRecentPosts: (params?: PostsParams) => Promise<void>;
  
  // === AÇÕES DE UTILIDADE ===
  fetchStats: () => Promise<void>;
  searchPosts: (query: string, params?: PostsParams) => Promise<void>;
  
  // === AÇÕES DE RELAÇÕES ===
  fetchSimilarPosts: (id: string) => Promise<void>;
  fetchRelatedPosts: (id: string) => Promise<void>;
  addPostRelation: (postId: string, relatedPostId: string) => Promise<boolean>;
  removePostRelation: (postId: string, relatedPostId: string) => Promise<boolean>;
  
  // === AÇÕES DE ESTADO ===
  setCurrentPost: (post: Post | null) => void;
  clearCurrentPost: () => void;
  setFilters: (filters: PostFilters) => void;
  clearFilters: () => void;
  clearErrors: () => void;
  
  // === AÇÕES DE PAGINAÇÃO ===
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
}

type PostStore = PostState & PostActions;

// Estado inicial
const initialState: PostState = {
  posts: [],
  currentPost: null,
  categories: [],
  tags: [],
  stats: null,
  relatedPosts: [],
  similarPosts: [],
  
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  
  loading: {
    posts: false,
    currentPost: false,
    categories: false,
    tags: false,
    stats: false,
    creating: false,
    updating: false,
    deleting: false,
    related: false,
    similar: false,
  },
  
  errors: {
    posts: null,
    currentPost: null,
    categories: null,
    tags: null,
    stats: null,
    creating: null,
    updating: null,
    deleting: null,
    related: null,
    similar: null,
  },
  
  currentFilters: {},
};

export const usePostStore = create<PostStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // === IMPLEMENTAÇÃO DAS AÇÕES ===
      
      
      fetchPosts: async (params) => {
        set(state => ({
          loading: { ...state.loading, posts: true },
          errors: { ...state.errors, posts: null }
        }));
        
        try {
          console.log('Chamando API com params:', params);
          const response = await postService.findAll(params);
          
          console.log('Resposta da API:', response);
          
          if (response.success && response.data) {
            // ✅ Agora desestrutura corretamente
            const { posts, total } = response.data;
            const page = params?.page ?? 1;
            const limit = params?.limit ?? 10;

            const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

            console.log('Posts processados:', { posts, total, totalPages });

            set({
              posts,
              pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
              },
              loading: { ...get().loading, posts: false }
            });
          } else {
            throw new Error(response.message || 'Erro ao buscar posts');
          }
        } catch (error) {
          console.error('Erro no fetchPosts:', error);
          set(state => ({
            loading: { ...state.loading, posts: false },
            errors: { ...state.errors, posts: error instanceof Error ? error.message : 'Erro desconhecido' }
          }));
        }
      },
      fetchPostBySlug: async (slug) => {
        set(state => ({
          loading: { ...state.loading, currentPost: true },
          errors: { ...state.errors, currentPost: null }
        }));
        
        try {
          const response = await postService.findBySlug(slug);
          
          if (response.success && response.data) {
            set({
              currentPost: response.data,
              loading: { ...get().loading, currentPost: false }
            });
            return response.data;
          } else {
            throw new Error(response.message || 'Post não encontrado');
          }
        } catch (error) {
          set(state => ({
            loading: { ...state.loading, currentPost: false },
            errors: { ...state.errors, currentPost: error instanceof Error ? error.message : 'Erro desconhecido' }
          }));
          return null;
        }
      },
      
      fetchPostById: async (id) => {
        set(state => ({
          loading: { ...state.loading, currentPost: true },
          errors: { ...state.errors, currentPost: null }
        }));
        
        try {
          const response = await postService.findById(id);
          
          if (response.success && response.data) {
            set({
              currentPost: response.data,
              loading: { ...get().loading, currentPost: false }
            });
            return response.data;
          } else {
            throw new Error(response.message || 'Post não encontrado');
          }
        } catch (error) {
          set(state => ({
            loading: { ...state.loading, currentPost: false },
            errors: { ...state.errors, currentPost: error instanceof Error ? error.message : 'Erro desconhecido' }
          }));
          return null;
        }
      },
      
      createPost: async (data) => {
        set(state => ({
          loading: { ...state.loading, creating: true },
          errors: { ...state.errors, creating: null }
        }));
        
        try {
          const response = await postService.create(data);
          
          if (response.success && response.data) {
            set(state => ({
              posts: [response.data!, ...state.posts],
              loading: { ...state.loading, creating: false }
            }));
            return response.data;
          } else {
            throw new Error(response.message || 'Erro ao criar post');
          }
        } catch (error) {
          set(state => ({
            loading: { ...state.loading, creating: false },
            errors: { ...state.errors, creating: error instanceof Error ? error.message : 'Erro desconhecido' }
          }));
          return null;
        }
      },
      
      updatePost: async (id, data) => {
        set(state => ({
          loading: { ...state.loading, updating: true },
          errors: { ...state.errors, updating: null }
        }));
        
        try {
          const response = await postService.update(id, data);
          
          if (response.success && response.data) {
            set(state => ({
              posts: state.posts.map(post => post.id === id ? response.data! : post),
              currentPost: state.currentPost?.id === id ? response.data : state.currentPost,
              loading: { ...state.loading, updating: false }
            }));
            return response.data;
          } else {
            throw new Error(response.message || 'Erro ao atualizar post');
          }
        } catch (error) {
          set(state => ({
            loading: { ...state.loading, updating: false },
            errors: { ...state.errors, updating: error instanceof Error ? error.message : 'Erro desconhecido' }
          }));
          return null;
        }
      },
      
      deletePost: async (id) => {
        set(state => ({
          loading: { ...state.loading, deleting: true },
          errors: { ...state.errors, deleting: null }
        }));
        
        try {
          const response = await postService.delete(id);
          
          if (response.success) {
            set(state => ({
              posts: state.posts.filter(post => post.id !== id),
              currentPost: state.currentPost?.id === id ? null : state.currentPost,
              loading: { ...state.loading, deleting: false }
            }));
            return true;
          } else {
            throw new Error(response.message || 'Erro ao deletar post');
          }
        } catch (error) {
          set(state => ({
            loading: { ...state.loading, deleting: false },
            errors: { ...state.errors, deleting: error instanceof Error ? error.message : 'Erro desconhecido' }
          }));
          return false;
        }
      },
      
      togglePublish: async (id) => {
        try {
          const response = await postService.togglePublish(id);
          
          if (response.success && response.data) {
            set(state => ({
              posts: state.posts.map(post => post.id === id ? response.data! : post),
              currentPost: state.currentPost?.id === id ? response.data : state.currentPost
            }));
            return response.data;
          } else {
            throw new Error(response.message || 'Erro ao alterar status de publicação');
          }
        } catch (error) {
          console.error('Erro ao alterar status:', error);
          return null;
        }
      },
      
      fetchCategories: async () => {
        set(state => ({
          loading: { ...state.loading, categories: true },
          errors: { ...state.errors, categories: null }
        }));
        
        try {
          const response = await postService.getAllCategories();
          
          if (response.success && response.data) {
            set({
              categories: response.data,
              loading: { ...get().loading, categories: false }
            });
          } else {
            throw new Error(response.message || 'Erro ao buscar categorias');
          }
        } catch (error) {
          set(state => ({
            loading: { ...state.loading, categories: false },
            errors: { ...state.errors, categories: error instanceof Error ? error.message : 'Erro desconhecido' }
          }));
        }
      },
      
      fetchTags: async () => {
        set(state => ({
          loading: { ...state.loading, tags: true },
          errors: { ...state.errors, tags: null }
        }));
        
        try {
          const response = await postService.getAllTags();
          
          if (response.success && response.data) {
            set({
              tags: response.data,
              loading: { ...get().loading, tags: false }
            });
          } else {
            throw new Error(response.message || 'Erro ao buscar tags');
          }
        } catch (error) {
          set(state => ({
            loading: { ...state.loading, tags: false },
            errors: { ...state.errors, tags: error instanceof Error ? error.message : 'Erro desconhecido' }
          }));
        }
      },
      
      fetchPostsByCategory: async (categoryName, params) => {
        set(state => ({ currentFilters: { ...state.currentFilters, categoryName } }));
        await get().fetchPosts({ ...params, categoryName });
      },
      
      fetchPostsByTag: async (tagName, params) => {
        set(state => ({ currentFilters: { ...state.currentFilters, tagNames: [tagName] } }));
        await get().fetchPosts({ ...params, tagNames: [tagName] });
      },
      
      fetchPostsByAuthor: async (authorId, params) => {
        set(state => ({ currentFilters: { ...state.currentFilters, authorId } }));
        await get().fetchPosts({ ...params, authorId });
      },
      
      fetchMostLikedPosts: async (params) => {
        await get().fetchPosts(params); // Backend retorna já ordenado por likes
      },
      
      fetchRecentPosts: async (params) => {
        await get().fetchPosts(params); // Backend retorna já ordenado por data
      },
      
      fetchStats: async () => {
        set(state => ({
          loading: { ...state.loading, stats: true },
          errors: { ...state.errors, stats: null }
        }));
        
        try {
          const response = await postService.getStats();
          
          if (response.success && response.data) {
            set({
              stats: response.data,
              loading: { ...get().loading, stats: false }
            });
          } else {
            throw new Error(response.message || 'Erro ao buscar estatísticas');
          }
        } catch (error) {
          set(state => ({
            loading: { ...state.loading, stats: false },
            errors: { ...state.errors, stats: error instanceof Error ? error.message : 'Erro desconhecido' }
          }));
        }
      },
      
      searchPosts: async (query, params) => {
        set(state => ({ currentFilters: { ...state.currentFilters, search: query } }));
        await get().fetchPosts({ ...params, search: query });
      },
      
      fetchSimilarPosts: async (id) => {
        set(state => ({
          loading: { ...state.loading, similar: true },
          errors: { ...state.errors, similar: null }
        }));
        
        try {
          const response = await postService.getSimilar(id);
          
          if (response.success && response.data) {
            set({
              similarPosts: response.data,
              loading: { ...get().loading, similar: false }
            });
          } else {
            throw new Error(response.message || 'Erro ao buscar posts similares');
          }
        } catch (error) {
          set(state => ({
            loading: { ...state.loading, similar: false },
            errors: { ...state.errors, similar: error instanceof Error ? error.message : 'Erro desconhecido' }
          }));
        }
      },
      
      fetchRelatedPosts: async (id) => {
        set(state => ({
          loading: { ...state.loading, related: true },
          errors: { ...state.errors, related: null }
        }));
        
        try {
          const response = await postService.getRelatedPosts(id);
          
          if (response.success && response.data) {
            set({
              relatedPosts: response.data,
              loading: { ...get().loading, related: false }
            });
          } else {
            throw new Error(response.message || 'Erro ao buscar posts relacionados');
          }
        } catch (error) {
          set(state => ({
            loading: { ...state.loading, related: false },
            errors: { ...state.errors, related: error instanceof Error ? error.message : 'Erro desconhecido' }
          }));
        }
      },
      
      addPostRelation: async (postId, relatedPostId) => {
        try {
          const response = await postService.addRelation({ postId, relatedPostId });
          return response.success;
        } catch (error) {
          console.error('Erro ao adicionar relação:', error);
          return false;
        }
      },
      
      removePostRelation: async (postId, relatedPostId) => {
        try {
          const response = await postService.removeRelation({ postId, relatedPostId });
          return response.success;
        } catch (error) {
          console.error('Erro ao remover relação:', error);
          return false;
        }
      },
      
      // === AÇÕES DE ESTADO ===
      setCurrentPost: (post) => set({ currentPost: post }),
      clearCurrentPost: () => set({ currentPost: null }),
      
      setFilters: (filters) => set(state => ({ 
        currentFilters: { ...state.currentFilters, ...filters } 
      })),
      
      clearFilters: () => set({ currentFilters: {} }),
      
      clearErrors: () => set({
        errors: {
          posts: null,
          currentPost: null,
          categories: null,
          tags: null,
          stats: null,
          creating: null,
          updating: null,
          deleting: null,
          related: null,
          similar: null,
        }
      }),
      
      // === AÇÕES DE PAGINAÇÃO ===
      nextPage: async () => {
        const { pagination, currentFilters } = get();
        if (pagination.hasNext) {
          await get().fetchPosts({ 
            ...currentFilters, 
            page: pagination.page + 1 
          });
        }
      },
      
      prevPage: async () => {
        const { pagination, currentFilters } = get();
        if (pagination.hasPrev) {
          await get().fetchPosts({ 
            ...currentFilters, 
            page: pagination.page - 1 
          });
        }
      },
      
      goToPage: async (page) => {
        const { currentFilters } = get();
        await get().fetchPosts({ ...currentFilters, page });
      },
    }),
    {
      name: 'post-store',
    }
  )
);