import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
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
    uploading: boolean; // NOVO: estado de upload
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
    uploading: string | null; // NOVO: erro de upload
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
  
  // === NOVO: AÇÕES DE UPLOAD ===
  uploadMedia: (postId: string, file: File) => Promise<Post | null>;
  uploadImage: (file: File) => Promise<string | null>; // Para upload standalone de imagem
  
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
    uploading: false, // NOVO
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
    uploading: null, // NOVO
  },
  
  currentFilters: {},
};

export const usePostStore = create<PostStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // === IMPLEMENTAÇÃO DAS AÇÕES ===
        
        fetchPosts: async (params) => {
          set(state => ({
            loading: { ...state.loading, posts: true },
            errors: { ...state.errors, posts: null }
          }));
          
          try {
            const response = await postService.findAll(params);
            if (response.success && response.data) {
              const { posts, total } = response.data;
              const page = params?.page ?? 1;
              const limit = params?.limit ?? 10;
              const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

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
          const originalPosts = get().posts;
          const originalCurrentPost = get().currentPost;
  
          // Optimistic update
          set(state => ({
            posts: state.posts.map(post => 
              post.id === id ? { ...post, ...data } as Post : post
            ),
            currentPost: state.currentPost?.id === id 
              ? { ...state.currentPost, ...data } as Post 
              : state.currentPost,
            loading: { ...state.loading, updating: true },
            errors: { ...state.errors, updating: null }
          }));
          
          try {
            const response = await postService.update(id, data);
            
            if (response.success && response.data) {
              // Confirm with server data
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
            // Revert on error
            set(state => ({
              posts: originalPosts,
              currentPost: originalCurrentPost,
              loading: { ...state.loading, updating: false },
              errors: { ...state.errors, updating: error instanceof Error ? error.message : 'Erro desconhecido' }
            }));
            return null;
          }
        },
        
        deletePost: async (id) => {
          const originalPosts = get().posts;
          const originalCurrentPost = get().currentPost;
  
          // Optimistic update
          set(state => ({
            posts: state.posts.filter(post => post.id !== id),
            currentPost: state.currentPost?.id === id ? null : state.currentPost,
            loading: { ...state.loading, deleting: true },
            errors: { ...state.errors, deleting: null }
          }));
          
          try {
            const response = await postService.delete(id);
            
            if (response.success) {
              set(state => ({
                loading: { ...state.loading, deleting: false }
              }));
              return true;
            } else {
              throw new Error(response.message || 'Erro ao deletar post');
            }
          } catch (error) {
            // Revert on error
            set(state => ({
              posts: originalPosts,
              currentPost: originalCurrentPost,
              loading: { ...state.loading, deleting: false },
              errors: { ...state.errors, deleting: error instanceof Error ? error.message : 'Erro desconhecido' }
            }));
            return false;
          }
        },
        
        togglePublish: async (id) => {
          const originalPosts = get().posts;
      
          const postToToggle = originalPosts.find(p => p.id === id);
  
          if (!postToToggle) return null;
  
          // Optimistic update
          const updatedPost = { ...postToToggle, published: !postToToggle.published };
          set(state => ({
            posts: state.posts.map(p => p.id === id ? updatedPost : p),
            currentPost: state.currentPost?.id === id ? updatedPost : state.currentPost,
          }));
  
          try {
            const response = await postService.togglePublish(id);
            
            if (response.success && response.data) {
              // Confirm with server data
              set(state => ({
                posts: state.posts.map(post => post.id === id ? response.data! : post),
                currentPost: state.currentPost?.id === id ? response.data! : state.currentPost
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

        // === NOVAS AÇÕES DE UPLOAD ===
        uploadMedia: async (postId, file) => {
          set(state => ({
            loading: { ...state.loading, uploading: true },
            errors: { ...state.errors, uploading: null }
          }));
          
          try {
            const response = await postService.uploadMedia(postId, file);
            
            if (response.success && response.data) {
              // Atualizar o post com a nova mídia
              set(state => ({
                posts: state.posts.map(post => post.id === postId ? response.data! : post),
                currentPost: state.currentPost?.id === postId ? response.data : state.currentPost,
                loading: { ...state.loading, uploading: false }
              }));
              return response.data;
            } else {
              throw new Error(response.message || 'Erro ao fazer upload da mídia');
            }
          } catch (error) {
            set(state => ({
              loading: { ...state.loading, uploading: false },
              errors: { ...state.errors, uploading: error instanceof Error ? error.message : 'Erro desconhecido' }
            }));
            return null;
          }
        },

        uploadImage: async (file) => {
          set(state => ({
            loading: { ...state.loading, uploading: true },
            errors: { ...state.errors, uploading: null }
          }));
          
          try {
            const response = await postService.uploadImage(file);
            
            if (response.success && response.data) {
              set(state => ({
                loading: { ...state.loading, uploading: false }
              }));
              return response.data.url;
            } else {
              throw new Error(response.message || 'Erro ao fazer upload da imagem');
            }
          } catch (error) {
            set(state => ({
              loading: { ...state.loading, uploading: false },
              errors: { ...state.errors, uploading: error instanceof Error ? error.message : 'Erro desconhecido' }
            }));
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
          set(state => ({
            loading: { ...state.loading, posts: true },
            errors: { ...state.errors, posts: null },
            currentFilters: { ...state.currentFilters, categoryName }
          }));

          try {
            const response = await postService.findByCategory(categoryName, params);
            if (response.success && response.data) {
              const { posts, total } = response.data;
              const page = params?.page ?? 1;
              const limit = params?.limit ?? 10;
              const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

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
            set(state => ({
              loading: { ...state.loading, posts: false },
              errors: { ...state.errors, posts: error instanceof Error ? error.message : 'Erro desconhecido' }
            }));
          }
        },
        
        fetchPostsByTag: async (tagName, params) => {
          set(state => ({
            loading: { ...state.loading, posts: true },
            errors: { ...state.errors, posts: null },
            currentFilters: { ...state.currentFilters, tagNames: [tagName] }
          }));

          try {
            const response = await postService.findByTag(tagName, params);
            if (response.success && response.data) {
              const { posts, total } = response.data;
              const page = params?.page ?? 1;
              const limit = params?.limit ?? 10;
              const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

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
            set(state => ({
              loading: { ...state.loading, posts: false },
              errors: { ...state.errors, posts: error instanceof Error ? error.message : 'Erro desconhecido' }
            }));
          }
        },
        
        fetchPostsByAuthor: async (authorId, params) => {
          set(state => ({
            loading: { ...state.loading, posts: true },
            errors: { ...state.errors, posts: null },
            currentFilters: { ...state.currentFilters, authorId }
          }));

          try {
            const response = await postService.findByAuthor(authorId, params);
            if (response.success && response.data) {
              const { posts, total } = response.data;
              const page = params?.page ?? 1;
              const limit = params?.limit ?? 10;
              const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

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
            set(state => ({
              loading: { ...state.loading, posts: false },
              errors: { ...state.errors, posts: error instanceof Error ? error.message : 'Erro desconhecido' }
            }));
          }
        },
        
        fetchMostLikedPosts: async (params) => {
          set(state => ({
            loading: { ...state.loading, posts: true },
            errors: { ...state.errors, posts: null }
          }));

          try {
            const response = await postService.getMostLiked(params);
            if (response.success && response.data) {
              const { posts, total } = response.data;
              const page = params?.page ?? 1;
              const limit = params?.limit ?? 10;
              const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

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
            set(state => ({
              loading: { ...state.loading, posts: false },
              errors: { ...state.errors, posts: error instanceof Error ? error.message : 'Erro desconhecido' }
            }));
          }
        },
        
        fetchRecentPosts: async (params) => {
          set(state => ({
            loading: { ...state.loading, posts: true },
            errors: { ...state.errors, posts: null }
          }));

          try {
            const response = await postService.getRecent(params);
            if (response.success && response.data) {
              const { posts, total } = response.data;
              const page = params?.page ?? 1;
              const limit = params?.limit ?? 10;
              const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

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
            set(state => ({
              loading: { ...state.loading, posts: false },
              errors: { ...state.errors, posts: error instanceof Error ? error.message : 'Erro desconhecido' }
            }));
          }
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
          set(state => ({
            loading: { ...state.loading, posts: true },
            errors: { ...state.errors, posts: null },
            currentFilters: { ...state.currentFilters, search: query }
          }));

          try {
            const response = await postService.search(query, params);
            if (response.success && response.data) {
              const { posts, total } = response.data;
              const page = params?.page ?? 1;
              const limit = params?.limit ?? 10;
              const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

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
            set(state => ({
              loading: { ...state.loading, posts: false },
              errors: { ...state.errors, posts: error instanceof Error ? error.message : 'Erro desconhecido' }
            }));
          }
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
            uploading: null,
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
        name: 'post-storage', // Chave no storage
        storage: createJSONStorage(() => sessionStorage), // Usa sessionStorage
        partialize: (state) => ({
          // Apenas o estado essencial é persistido para evitar inconsistências
          posts: state.posts,
          currentPost: state.currentPost,
          categories: state.categories,
          tags: state.tags,
          pagination: state.pagination,
          currentFilters: state.currentFilters,
        }),
      }
    ),
    {
              name: 'post-store',
          }
        )
      );
      
      
