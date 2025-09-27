import { create } from 'zustand';
import { likeService } from '../services/like';
import type { LikeCount } from '../services/like';
interface LikeState {
  // Estados para posts
  postLikes: Record<string, LikeCount>;
  postLikeLoading: Record<string, boolean>;
  postLikeErrors: Record<string, string | null>;

  // Estados para comentários
  commentLikes: Record<string, LikeCount>;
  commentLikeLoading: Record<string, boolean>;
  commentLikeErrors: Record<string, string | null>;

  // Ações para posts
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  fetchPostLikes: (postId: string) => Promise<void>;
  togglePostLike: (postId: string) => Promise<void>;

  // Ações para comentários
  likeComment: (commentId: string) => Promise<void>;
  unlikeComment: (commentId: string) => Promise<void>;
  fetchCommentLikes: (commentId: string) => Promise<void>;
  toggleCommentLike: (commentId: string) => Promise<void>;

  // Utilitários
  clearErrors: () => void;
  resetStore: () => void;
}

const initialState = {
  postLikes: {},
  postLikeLoading: {},
  postLikeErrors: {},
  commentLikes: {},
  commentLikeLoading: {},
  commentLikeErrors: {},
};

export const useLikeStore = create<LikeState>((set, get) => ({
  ...initialState,

  // === AÇÕES PARA POSTS ===
  likePost: async (postId: string) => {
    set((state) => ({
      postLikeLoading: { ...state.postLikeLoading, [postId]: true },
      postLikeErrors: { ...state.postLikeErrors, [postId]: null }
    }));

    try {
      await likeService.likePost({ postId });
      await get().fetchPostLikes(postId);
    } catch (error: any) {
      set((state) => ({
        postLikeLoading: { ...state.postLikeLoading, [postId]: false },
        postLikeErrors: { ...state.postLikeErrors, [postId]: error.message || 'Erro ao curtir post' }
      }));
    }
  },

  unlikePost: async (postId: string) => {
    set((state) => ({
      postLikeLoading: { ...state.postLikeLoading, [postId]: true },
      postLikeErrors: { ...state.postLikeErrors, [postId]: null }
    }));

    try {
      await likeService.unlikePost({ postId });
      await get().fetchPostLikes(postId);
    } catch (error: any) {
      set((state) => ({
        postLikeLoading: { ...state.postLikeLoading, [postId]: false },
        postLikeErrors: { ...state.postLikeErrors, [postId]: error.message || 'Erro ao descurtir post' }
      }));
    }
  },

  fetchPostLikes: async (postId: string) => {
    set((state) => ({
      postLikeLoading: { ...state.postLikeLoading, [postId]: true },
      postLikeErrors: { ...state.postLikeErrors, [postId]: null }
    }));

    try {
      const response = await likeService.countPostLikes(postId);
      
      if (response.success && response.data) {
        set((state) => ({
          postLikes: { ...state.postLikes, [postId]: response.data! },
          postLikeLoading: { ...state.postLikeLoading, [postId]: false }
        }));
      }
    } catch (error: any) {
      set((state) => ({
        postLikeLoading: { ...state.postLikeLoading, [postId]: false },
        postLikeErrors: { ...state.postLikeErrors, [postId]: error.message || 'Erro ao buscar curtidas' }
      }));
    }
  },

  togglePostLike: async (postId: string) => {
    const state = get();
    const currentLike = state.postLikes[postId];
    
    if (currentLike?.isLikedByCurrentUser) {
      await state.unlikePost(postId);
    } else {
      await state.likePost(postId);
    }
  },

  // === AÇÕES PARA COMENTÁRIOS ===
  likeComment: async (commentId: string) => {
    set((state) => ({
      commentLikeLoading: { ...state.commentLikeLoading, [commentId]: true },
      commentLikeErrors: { ...state.commentLikeErrors, [commentId]: null }
    }));

    try {
      await likeService.likeComment(commentId);
      await get().fetchCommentLikes(commentId);
    } catch (error: any) {
      set((state) => ({
        commentLikeLoading: { ...state.commentLikeLoading, [commentId]: false },
        commentLikeErrors: { ...state.commentLikeErrors, [commentId]: error.message || 'Erro ao curtir comentário' }
      }));
    }
  },

  unlikeComment: async (commentId: string) => {
    set((state) => ({
      commentLikeLoading: { ...state.commentLikeLoading, [commentId]: true },
      commentLikeErrors: { ...state.commentLikeErrors, [commentId]: null }
    }));

    try {
      await likeService.unlikeComment(commentId);
      await get().fetchCommentLikes(commentId);
    } catch (error: any) {
      set((state) => ({
        commentLikeLoading: { ...state.commentLikeLoading, [commentId]: false },
        commentLikeErrors: { ...state.commentLikeErrors, [commentId]: error.message || 'Erro ao descurtir comentário' }
      }));
    }
  },

  fetchCommentLikes: async (commentId: string) => {
    set((state) => ({
      commentLikeLoading: { ...state.commentLikeLoading, [commentId]: true },
      commentLikeErrors: { ...state.commentLikeErrors, [commentId]: null }
    }));

    try {
      const response = await likeService.countCommentLikes(commentId);
      
      if (response.success && response.data) {
        set((state) => ({
          commentLikes: { ...state.commentLikes, [commentId]: response.data! },
          commentLikeLoading: { ...state.commentLikeLoading, [commentId]: false }
        }));
      }
    } catch (error: any) {
      set((state) => ({
        commentLikeLoading: { ...state.commentLikeLoading, [commentId]: false },
        commentLikeErrors: { ...state.commentLikeErrors, [commentId]: error.message || 'Erro ao buscar curtidas' }
      }));
    }
  },

  toggleCommentLike: async (commentId: string) => {
    const state = get();
    const currentLike = state.commentLikes[commentId];
    
    if (currentLike?.isLikedByCurrentUser) {
      await state.unlikeComment(commentId);
    } else {
      await state.likeComment(commentId);
    }
  },

  // === UTILITÁRIOS ===
  clearErrors: () => {
    set({
      postLikeErrors: {},
      commentLikeErrors: {}
    });
  },

  resetStore: () => {
    set(initialState);
  }
}));