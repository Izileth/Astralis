import { useCallback, useEffect } from 'react';
import { usePostStore } from '../store/post';
import type { PostsParams, CreatePost, UpdatePost } from '../types';


// === HOOK PRINCIPAL PARA POSTS ===
export const usePosts = (params?: PostsParams, autoFetch = true) => {
  const {
    posts,
    pagination,
    loading,
    errors,
    currentFilters,
    fetchPosts,
    nextPage,
    prevPage,
    goToPage,
    setFilters,
    clearFilters,
  } = usePostStore();

  const refetch = useCallback(() => {
    return fetchPosts({ ...currentFilters, ...params });
  }, [fetchPosts, currentFilters, params]);

  const updateFilters = useCallback((newFilters: Partial<PostsParams>) => {
    setFilters(newFilters);
    return fetchPosts({ ...currentFilters, ...newFilters, ...params });
  }, [setFilters, fetchPosts, currentFilters, params]);

  useEffect(() => {
    if (autoFetch) {
      fetchPosts(params);
    }
  }, [fetchPosts, params, autoFetch]);

  return {
    posts,
    pagination,
    loading: loading.posts,
    error: errors.posts,
    filters: currentFilters,
    refetch,
    updateFilters,
    clearFilters,
    nextPage,
    prevPage,
    goToPage,
  };
};

// === HOOK PARA POST ÚNICO ===
export const usePost = (identifier?: string, bySlug = false) => {
  const {
    currentPost,
    loading,
    errors,
    fetchPostBySlug,
    fetchPostById,
    setCurrentPost,
    clearCurrentPost,
  } = usePostStore();

  const fetchPost = useCallback(async (id: string, useSlug = bySlug) => {
    if (useSlug) {
      return await fetchPostBySlug(id);
    } else {
      return await fetchPostById(id);
    }
  }, [fetchPostBySlug, fetchPostById, bySlug]);

  const refetch = useCallback(() => {
    if (identifier) {
      return fetchPost(identifier, bySlug);
    }
    return Promise.resolve(null);
  }, [fetchPost, identifier, bySlug]);

  useEffect(() => {
    if (identifier) {
      fetchPost(identifier, bySlug);
    }
    
    return () => clearCurrentPost();
  }, [identifier, bySlug, fetchPost, clearCurrentPost]);

  return {
    post: currentPost,
    loading: loading.currentPost,
    error: errors.currentPost,
    fetchPost,
    refetch,
    setPost: setCurrentPost,
    clearPost: clearCurrentPost,
  };
};

// === HOOK PARA CRIAÇÃO DE POSTS ===
export const useCreatePost = () => {
  const { createPost, loading, errors } = usePostStore();

  const create = useCallback(async (data: CreatePost) => {
    const result = await createPost(data);
    return result;
  }, [createPost]);

  return {
    createPost: create,
    loading: loading.creating,
    error: errors.creating,
  };
};

// === HOOK PARA EDIÇÃO DE POSTS ===
export const useUpdatePost = () => {
  const { updatePost, togglePublish, loading, errors } = usePostStore();

  const update = useCallback(async (id: string, data: UpdatePost) => {
    const result = await updatePost(id, data);
    return result;
  }, [updatePost]);

  const toggleStatus = useCallback(async (id: string) => {
    const result = await togglePublish(id);
    return result;
  }, [togglePublish]);

  return {
    updatePost: update,
    togglePublish: toggleStatus,
    loading: loading.updating,
    error: errors.updating,
  };
};

// === HOOK PARA DELEÇÃO DE POSTS ===
export const useDeletePost = () => {
  const { deletePost, loading, errors } = usePostStore();

  const remove = useCallback(async (id: string) => {
    const result = await deletePost(id);
    return result;
  }, [deletePost]);

  return {
    deletePost: remove,
    loading: loading.deleting,
    error: errors.deleting,
  };
};

// === HOOK PARA CATEGORIAS ===
export const useCategories = (autoFetch = true) => {
  const {
    categories,
    loading,
    errors,
    fetchCategories,
    fetchPostsByCategory,
  } = usePostStore();

  const getPostsByCategory = useCallback((categoryName: string, params?: PostsParams) => {
    return fetchPostsByCategory(categoryName, params);
  }, [fetchPostsByCategory]);

  useEffect(() => {
    if (autoFetch && categories.length === 0) {
      fetchCategories();
    }
  }, [autoFetch, categories.length, fetchCategories]);

  return {
    categories,
    loading: loading.categories,
    error: errors.categories,
    refetch: fetchCategories,
    getPostsByCategory,
  };
};

// === HOOK PARA TAGS ===
export const useTags = (autoFetch = true) => {
  const {
    tags,
    loading,
    errors,
    fetchTags,
    fetchPostsByTag,
  } = usePostStore();

  const getPostsByTag = useCallback((tagName: string, params?: PostsParams) => {
    return fetchPostsByTag(tagName, params);
  }, [fetchPostsByTag]);

  useEffect(() => {
    if (autoFetch && tags.length === 0) {
      fetchTags();
    }
  }, [autoFetch, tags.length, fetchTags]);

  return {
    tags,
    loading: loading.tags,
    error: errors.tags,
    refetch: fetchTags,
    getPostsByTag,
  };
};

// === HOOK PARA POSTS DO AUTOR ===
export const useAuthorPosts = (authorId?: string, params?: PostsParams, autoFetch = true) => {
  const {
    posts,
    pagination,
    loading,
    errors,
    fetchPostsByAuthor,
  } = usePostStore();

  const refetch = useCallback(() => {
    if (authorId) {
      return fetchPostsByAuthor(authorId, params);
    }
    return Promise.resolve();
  }, [fetchPostsByAuthor, authorId, params]);

  useEffect(() => {
    if (autoFetch && authorId) {
      fetchPostsByAuthor(authorId, params);
    }
  }, [autoFetch, authorId, params, fetchPostsByAuthor]);

  return {
    posts,
    pagination,
    loading: loading.posts,
    error: errors.posts,
    refetch,
  };
};

// === HOOK PARA DESCOBERTA DE POSTS ===
export const useDiscoverPosts = () => {
  const {
    posts,
    pagination,
    loading,
    errors,
    fetchMostLikedPosts,
    fetchRecentPosts,
  } = usePostStore();

  const getMostLiked = useCallback((params?: PostsParams) => {
    return fetchMostLikedPosts(params);
  }, [fetchMostLikedPosts]);

  const getRecent = useCallback((params?: PostsParams) => {
    return fetchRecentPosts(params);
  }, [fetchRecentPosts]);

  return {
    posts,
    pagination,
    loading: loading.posts,
    error: errors.posts,
    getMostLiked,
    getRecent,
  };
};

// === HOOK PARA BUSCA ===
export const useSearchPosts = () => {
  const {
    posts,
    pagination,
    loading,
    errors,
    searchPosts,
  } = usePostStore();

  const search = useCallback((query: string, params?: PostsParams) => {
    return searchPosts(query, params);
  }, [searchPosts]);

  return {
    posts,
    pagination,
    loading: loading.posts,
    error: errors.posts,
    search,
  };
};

// === HOOK PARA POSTS RELACIONADOS E SIMILARES ===
export const useRelatedPosts = (postId?: string, autoFetch = true) => {
  const {
    relatedPosts,
    similarPosts,
    loading,
    errors,
    fetchRelatedPosts,
    fetchSimilarPosts,
    addPostRelation,
    removePostRelation,
  } = usePostStore();

  const fetchRelated = useCallback(() => {
    if (postId) {
      return fetchRelatedPosts(postId);
    }
    return Promise.resolve();
  }, [fetchRelatedPosts, postId]);

  const fetchSimilar = useCallback(() => {
    if (postId) {
      return fetchSimilarPosts(postId);
    }
    return Promise.resolve();
  }, [fetchSimilarPosts, postId]);

  const addRelation = useCallback((relatedPostId: string) => {
    if (postId) {
      return addPostRelation(postId, relatedPostId);
    }
    return Promise.resolve(false);
  }, [addPostRelation, postId]);

  const removeRelation = useCallback((relatedPostId: string) => {
    if (postId) {
      return removePostRelation(postId, relatedPostId);
    }
    return Promise.resolve(false);
  }, [removePostRelation, postId]);

  useEffect(() => {
    if (autoFetch && postId) {
      fetchRelated();
      fetchSimilar();
    }
  }, [autoFetch, postId, fetchRelated, fetchSimilar]);

  return {
    relatedPosts,
    similarPosts,
    loading: {
      related: loading.related,
      similar: loading.similar,
    },
    errors: {
      related: errors.related,
      similar: errors.similar,
    },
    fetchRelated,
    fetchSimilar,
    addRelation,
    removeRelation,
  };
};

// === HOOK PARA ESTATÍSTICAS ===
export const usePostStats = (autoFetch = true) => {
  const {
    stats,
    loading,
    errors,
    fetchStats,
  } = usePostStore();

  useEffect(() => {
    if (autoFetch && !stats) {
      fetchStats();
    }
  }, [autoFetch, stats, fetchStats]);

  return {
    stats,
    loading: loading.stats,
    error: errors.stats,
    refetch: fetchStats,
  };
};

// === HOOK PARA FILTROS AVANÇADOS ===
export const usePostFilters = () => {
  const {
    currentFilters,
    fetchPosts,
    fetchPostsByCategory,
    fetchPostsByTag,
    fetchPostsByAuthor,
    setFilters,
    clearFilters,
  } = usePostStore();

  const applyFilters = useCallback(async (filters: PostsParams) => {
    setFilters(filters);
    
    // Aplicar filtro específico se necessário
    if (filters.categoryName) {
      return fetchPostsByCategory(filters.categoryName, filters);
    }
    
    if (filters.tagNames && filters.tagNames.length > 0) {
      return fetchPostsByTag(filters.tagNames[0], filters);
    }
    
    if (filters.authorId) {
      return fetchPostsByAuthor(filters.authorId, filters);
    }
    
    return fetchPosts(filters);
  }, [setFilters, fetchPosts, fetchPostsByCategory, fetchPostsByTag, fetchPostsByAuthor]);

  const resetFilters = useCallback(() => {
    clearFilters();
    return fetchPosts();
  }, [clearFilters, fetchPosts]);

  const addFilter = useCallback((key: keyof PostsParams, value: any) => {
    const newFilters = { ...currentFilters, [key]: value };
    return applyFilters(newFilters);
  }, [currentFilters, applyFilters]);

  const removeFilter = useCallback((key: keyof PostsParams) => {
    const newFilters = { ...currentFilters };
    delete newFilters[key];
    return applyFilters(newFilters);
  }, [currentFilters, applyFilters]);

  return {
    currentFilters,
    applyFilters,
    resetFilters,
    addFilter,
    removeFilter,
  };
};

// === HOOK PARA PAGINAÇÃO ===
export const usePagination = () => {
  const {
    pagination,
    nextPage,
    prevPage,
    goToPage,
    loading,
  } = usePostStore();

  const hasNext = pagination.hasNext;
  const hasPrev = pagination.hasPrev;
  const currentPage = pagination.page;
  const totalPages = pagination.totalPages;
  const total = pagination.total;

  const goToNext = useCallback(() => {
    if (hasNext && !loading.posts) {
      return nextPage();
    }
    return Promise.resolve();
  }, [hasNext, nextPage, loading.posts]);

  const goToPrev = useCallback(() => {
    if (hasPrev && !loading.posts) {
      return prevPage();
    }
    return Promise.resolve();
  }, [hasPrev, prevPage, loading.posts]);

  const goToSpecificPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && !loading.posts) {
      return goToPage(page);
    }
    return Promise.resolve();
  }, [goToPage, totalPages, loading.posts]);

  return {
    pagination,
    hasNext,
    hasPrev,
    currentPage,
    totalPages,
    total,
    goToNext,
    goToPrev,
    goToPage: goToSpecificPage,
    isLoading: loading.posts,
  };
};

// === HOOK PARA OPERAÇÕES EM LOTE ===
export const useBulkOperations = () => {
  const {  updatePost, deletePost } = usePostStore();

  const bulkUpdate = useCallback(async (
    postIds: string[], 
    data: UpdatePost,
    onProgress?: (completed: number, total: number) => void
  ) => {
    const results = [];
    for (let i = 0; i < postIds.length; i++) {
      try {
        const result = await updatePost(postIds[i], data);
        results.push({ id: postIds[i], success: true, data: result });
        onProgress?.(i + 1, postIds.length);
      } catch (error) {
        results.push({ 
          id: postIds[i], 
          success: false, 
          error: error instanceof Error ? error.message : 'Erro desconhecido' 
        });
      }
    }
    return results;
  }, [updatePost]);

  const bulkDelete = useCallback(async (
    postIds: string[],
    onProgress?: (completed: number, total: number) => void
  ) => {
    const results = [];
    for (let i = 0; i < postIds.length; i++) {
      try {
        const success = await deletePost(postIds[i]);
        results.push({ id: postIds[i], success });
        onProgress?.(i + 1, postIds.length);
      } catch (error) {
        results.push({ 
          id: postIds[i], 
          success: false, 
          error: error instanceof Error ? error.message : 'Erro desconhecido' 
        });
      }
    }
    return results;
  }, [deletePost]);

  const bulkPublish = useCallback(async (
    postIds: string[], 
    published: boolean = true,
    onProgress?: (completed: number, total: number) => void
  ) => {
    return bulkUpdate(postIds, { published }, onProgress);
  }, [bulkUpdate]);

  return {
    bulkUpdate,
    bulkDelete,
    bulkPublish,
  };
};

// === HOOK PARA CACHE E OTIMIZAÇÃO ===
export const usePostCache = () => {
  const { posts, currentPost, relatedPosts, similarPosts } = usePostStore();

  const getPostFromCache = useCallback((id: string) => {
    // Procurar primeiro no post atual
    if (currentPost?.id === id) {
      return currentPost;
    }
    
    // Procurar na lista de posts
    const foundInPosts = posts.find(post => post.id === id);
    if (foundInPosts) return foundInPosts;
    
    // Procurar nos posts relacionados
    const foundInRelated = relatedPosts.find(post => post.id === id);
    if (foundInRelated) return foundInRelated;
    
    // Procurar nos posts similares
    const foundInSimilar = similarPosts.find(post => post.id === id);
    if (foundInSimilar) return foundInSimilar;
    
    return null;
  }, [posts, currentPost, relatedPosts, similarPosts]);

  const getPostBySlugFromCache = useCallback((slug: string) => {
    // Procurar primeiro no post atual
    if (currentPost?.slug === slug) {
      return currentPost;
    }
    
    // Procurar na lista de posts
    const foundInPosts = posts.find(post => post.slug === slug);
    if (foundInPosts) return foundInPosts;
    
    // Procurar nos posts relacionados
    const foundInRelated = relatedPosts.find(post => post.slug === slug);
    if (foundInRelated) return foundInRelated;
    
    // Procurar nos posts similares
    const foundInSimilar = similarPosts.find(post => post.slug === slug);
    if (foundInSimilar) return foundInSimilar;
    
    return null;
  }, [posts, currentPost, relatedPosts, similarPosts]);

  const isPostInCache = useCallback((id: string) => {
    return getPostFromCache(id) !== null;
  }, [getPostFromCache]);

  const isPostSlugInCache = useCallback((slug: string) => {
    return getPostBySlugFromCache(slug) !== null;
  }, [getPostBySlugFromCache]);

  return {
    getPostFromCache,
    getPostBySlugFromCache,
    isPostInCache,
    isPostSlugInCache,
  };
};

// === HOOK PARA VALIDAÇÃO E FORMULÁRIOS ===
export const usePostValidation = () => {
  const { categories} = usePostStore();

  const validatePost = useCallback((post: Partial<CreatePost | UpdatePost>) => {
    const errors: Record<string, string> = {};

    // Validação do título
    if (!post.title?.trim()) {
      errors.title = 'Título é obrigatório';
    } else if (post.title.length < 3) {
      errors.title = 'Título deve ter pelo menos 3 caracteres';
    } else if (post.title.length > 200) {
      errors.title = 'Título deve ter no máximo 200 caracteres';
    }

    // Validação do conteúdo
    if (!post.content?.trim()) {
      errors.content = 'Conteúdo é obrigatório';
    } else if (post.content.length < 10) {
      errors.content = 'Conteúdo deve ter pelo menos 10 caracteres';
    }

    // Validação da descrição
    if (post.description && post.description.length > 500) {
      errors.description = 'Descrição deve ter no máximo 500 caracteres';
    }

    // Validação de URLs
    if (post.imageUrl && !isValidUrl(post.imageUrl)) {
      errors.imageUrl = 'URL da imagem inválida';
    }

    if (post.videoUrl && !isValidUrl(post.videoUrl)) {
      errors.videoUrl = 'URL do vídeo inválida';
    }

    // Validação de categoria
    if (post.categoryName && !categories.some(cat => cat.name === post.categoryName)) {
      // Não é erro, mas aviso que uma nova categoria será criada
    }

    // Validação de tags
    if (post.tagNames && post.tagNames.length > 10) {
      errors.tagNames = 'Máximo de 10 tags permitido';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, [categories]);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return {
    validatePost,
  };
};

// === HOOK PARA ESTADOS DE UI ===
export const usePostUI = () => {
  const { loading, errors, clearErrors } = usePostStore();

  const isAnyLoading = Object.values(loading).some(Boolean);
  const hasAnyError = Object.values(errors).some(Boolean);

  const getLoadingState = useCallback((operation: keyof typeof loading) => {
    return loading[operation];
  }, [loading]);

  const getErrorState = useCallback((operation: keyof typeof errors) => {
    return errors[operation];
  }, [errors]);

  return {
    loading,
    errors,
    isAnyLoading,
    hasAnyError,
    getLoadingState,
    getErrorState,
    clearErrors,
  };
};

// === HOOK MESTRE PARA GERENCIAMENTO COMPLETO ===
export const usePostManager = () => {
  const store = usePostStore();
  const cache = usePostCache();
  const validation = usePostValidation();
  const ui = usePostUI();
  const filters = usePostFilters();
  const pagination = usePagination();
  const bulkOps = useBulkOperations();

  return {
    // Store completo
    ...store,
    
    // Funcionalidades específicas
    cache,
    validation,
    ui,
    filters,
    pagination,
    bulkOperations: bulkOps,
    
    // Métodos de conveniência
    isLoading: ui.isAnyLoading,
    hasError: ui.hasAnyError,
  };
};