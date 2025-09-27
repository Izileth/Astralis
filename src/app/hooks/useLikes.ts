
import { useEffect, useCallback } from 'react';
import { useLikeStore } from '../store/likes';

// Hook para gerenciar likes de posts
export const usePostLikes = (postId: string) => {
  const {
    postLikes,
    postLikeLoading,
    postLikeErrors,
    likePost,
    unlikePost,
    fetchPostLikes,
    togglePostLike
  } = useLikeStore();

  const likes = postLikes[postId] || { count: 0, isLikedByCurrentUser: false };
  const loading = postLikeLoading[postId] || false;
  const error = postLikeErrors[postId] || null;

  // Carrega os likes ao montar o componente
  useEffect(() => {
    if (postId && !postLikes[postId]) {
      fetchPostLikes(postId);
    }
  }, [postId, fetchPostLikes, postLikes]);

  const handleLike = useCallback(() => {
    if (postId && !loading) {
      likePost(postId);
    }
  }, [postId, loading, likePost]);

  const handleUnlike = useCallback(() => {
    if (postId && !loading) {
      unlikePost(postId);
    }
  }, [postId, loading, unlikePost]);

  const handleToggle = useCallback(() => {
    if (postId && !loading) {
      togglePostLike(postId);
    }
  }, [postId, loading, togglePostLike]);

  const refresh = useCallback(() => {
    if (postId) {
      fetchPostLikes(postId);
    }
  }, [postId, fetchPostLikes]);

  return {
    likes,
    loading,
    error,
    isLiked: likes.isLikedByCurrentUser,
    likeCount: likes.count,
    like: handleLike,
    unlike: handleUnlike,
    toggle: handleToggle,
    refresh
  };
};

// Hook para gerenciar likes de comentários
export const useCommentLikes = (commentId: string) => {
  const {
    commentLikes,
    commentLikeLoading,
    commentLikeErrors,
    likeComment,
    unlikeComment,
    fetchCommentLikes,
    toggleCommentLike
  } = useLikeStore();

  const likes = commentLikes[commentId] || { count: 0, isLikedByCurrentUser: false };
  const loading = commentLikeLoading[commentId] || false;
  const error = commentLikeErrors[commentId] || null;

  // Carrega os likes ao montar o componente
  useEffect(() => {
    if (commentId && !commentLikes[commentId]) {
      fetchCommentLikes(commentId);
    }
  }, [commentId, fetchCommentLikes, commentLikes]);

  const handleLike = useCallback(() => {
    if (commentId && !loading) {
      likeComment(commentId);
    }
  }, [commentId, loading, likeComment]);

  const handleUnlike = useCallback(() => {
    if (commentId && !loading) {
      unlikeComment(commentId);
    }
  }, [commentId, loading, unlikeComment]);

  const handleToggle = useCallback(() => {
    if (commentId && !loading) {
      toggleCommentLike(commentId);
    }
  }, [commentId, loading, toggleCommentLike]);

  const refresh = useCallback(() => {
    if (commentId) {
      fetchCommentLikes(commentId);
    }
  }, [commentId, fetchCommentLikes]);

  return {
    likes,
    loading,
    error,
    isLiked: likes.isLikedByCurrentUser,
    likeCount: likes.count,
    like: handleLike,
    unlike: handleUnlike,
    toggle: handleToggle,
    refresh
  };
};

// Hook para múltiplos posts (útil para listas)
export const useMultiplePostLikes = (postIds: string[]) => {
  const {
    postLikes,
    postLikeLoading,
    postLikeErrors,
    fetchPostLikes,
    togglePostLike
  } = useLikeStore();

  // Carrega likes para posts que ainda não foram carregados
  useEffect(() => {
    postIds.forEach(postId => {
      if (postId && !postLikes[postId]) {
        fetchPostLikes(postId);
      }
    });
  }, [postIds, fetchPostLikes, postLikes]);

  const getPostLikes = useCallback((postId: string) => {
    return postLikes[postId] || { count: 0, isLikedByCurrentUser: false };
  }, [postLikes]);

  const isPostLoading = useCallback((postId: string) => {
    return postLikeLoading[postId] || false;
  }, [postLikeLoading]);

  const getPostError = useCallback((postId: string) => {
    return postLikeErrors[postId] || null;
  }, [postLikeErrors]);

  const togglePost = useCallback((postId: string) => {
    if (!isPostLoading(postId)) {
      togglePostLike(postId);
    }
  }, [togglePostLike, isPostLoading]);

  return {
    getPostLikes,
    isPostLoading,
    getPostError,
    togglePost,
    allPostsLikes: postLikes,
    allPostsLoading: postLikeLoading,
    allPostsErrors: postLikeErrors
  };
};

// Hook para múltiplos comentários (útil para listas)
export const useMultipleCommentLikes = (commentIds: string[]) => {
  const {
    commentLikes,
    commentLikeLoading,
    commentLikeErrors,
    fetchCommentLikes,
    toggleCommentLike
  } = useLikeStore();

  // Carrega likes para comentários que ainda não foram carregados
  useEffect(() => {
    commentIds.forEach(commentId => {
      if (commentId && !commentLikes[commentId]) {
        fetchCommentLikes(commentId);
      }
    });
  }, [commentIds, fetchCommentLikes, commentLikes]);

  const getCommentLikes = useCallback((commentId: string) => {
    return commentLikes[commentId] || { count: 0, isLikedByCurrentUser: false };
  }, [commentLikes]);

  const isCommentLoading = useCallback((commentId: string) => {
    return commentLikeLoading[commentId] || false;
  }, [commentLikeLoading]);

  const getCommentError = useCallback((commentId: string) => {
    return commentLikeErrors[commentId] || null;
  }, [commentLikeErrors]);

  const toggleComment = useCallback((commentId: string) => {
    if (!isCommentLoading(commentId)) {
      toggleCommentLike(commentId);
    }
  }, [toggleCommentLike, isCommentLoading]);

  return {
    getCommentLikes,
    isCommentLoading,
    getCommentError,
    toggleComment,
    allCommentsLikes: commentLikes,
    allCommentsLoading: commentLikeLoading,
    allCommentsErrors: commentLikeErrors
  };
};

// Hook para limpar erros
export const useLikeErrors = () => {
  const { clearErrors } = useLikeStore();
  
  return {
    clearErrors
  };
};

// Hook para reset completo do store
export const useLikeReset = () => {
  const { resetStore } = useLikeStore();
  
  return {
    resetStore
  };
};