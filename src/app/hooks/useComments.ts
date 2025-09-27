import { useCallback, useEffect } from 'react';
import { useCommentStore } from '../store/comment';
import type { CreateComment, UpdateComment, Comment } from '../types';

interface UseCommentsReturn {
  // Estado
  comments: Comment[];
  loading: boolean;
  error: string | null;
  
  // Actions
  createComment: (data: CreateComment) => Promise<Comment | null>;
  updateComment: (id: string, data: UpdateComment) => Promise<Comment | null>;
  deleteComment: (id: string) => Promise<boolean>;
  refreshComments: () => Promise<Comment[] | null>;
  clearError: () => void;
}

export const useComments = (postId: string): UseCommentsReturn => {
  const {
    comments: allComments,
    loading,
    error,
    createComment: storeCreateComment,
    getCommentsByPost,
    updateComment: storeUpdateComment,
    deleteComment: storeDeleteComment,
    clearError,
  } = useCommentStore();

  // Comentários do post específico
  const comments = allComments[postId] || [];

  // Criar comentário
  const createComment = useCallback(
    async (data: CreateComment) => {
      // Garantir que o postId esteja correto
      return await storeCreateComment({ ...data, postId });
    },
    [storeCreateComment, postId]
  );

  // Atualizar comentário
  const updateComment = useCallback(
    async (id: string, data: UpdateComment) => {
      return await storeUpdateComment(id, data);
    },
    [storeUpdateComment]
  );

  // Deletar comentário
  const deleteComment = useCallback(
    async (id: string) => {
      return await storeDeleteComment(id, postId);
    },
    [storeDeleteComment, postId]
  );

  // Recarregar comentários
  const refreshComments = useCallback(
    async () => {
      return await getCommentsByPost(postId);
    },
    [getCommentsByPost, postId]
  );

  // Carregar comentários automaticamente quando o postId mudar
  useEffect(() => {
    if (postId && comments.length === 0) {
      refreshComments();
    }
  }, [postId, comments.length, refreshComments]);

  return {
    comments,
    loading,
    error,
    createComment,
    updateComment,
    deleteComment,
    refreshComments,
    clearError,
  };
};

// Hook alternativo para gerenciar múltiplos posts
export const useCommentsManager = () => {
  const {
    comments,
    loading,
    error,
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment,
    clearError,
    resetComments,
  } = useCommentStore();

  const getCommentsForPost = useCallback(
    (postId: string) => comments[postId] || [],
    [comments]
  );

  const loadComments = useCallback(
    async (postId: string) => {
      return await getCommentsByPost(postId);
    },
    [getCommentsByPost]
  );

  return {
    // Estado
    allComments: comments,
    loading,
    error,
    
    // Funções
    getCommentsForPost,
    loadComments,
    createComment,
    updateComment,
    deleteComment,
    clearError,
    resetComments,
  };
};