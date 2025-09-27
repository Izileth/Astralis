import { create } from 'zustand';
import { commentService } from '../services';
import type { Comment, CreateComment, UpdateComment } from '../types';

interface CommentState {
  // Estado
  comments: Record<string, Comment[]>; // Comentários por postId
  loading: boolean;
  error: string | null;

  // Actions
  createComment: (data: CreateComment) => Promise<Comment | null>;
  getCommentsByPost: (postId: string) => Promise<Comment[] | null>;
  updateComment: (id: string, data: UpdateComment) => Promise<Comment | null>;
  deleteComment: (id: string, postId: string) => Promise<boolean>;
  clearError: () => void;
  resetComments: (postId?: string) => void;
}

export const useCommentStore = create<CommentState>((set, get) => ({
  // Estado inicial
  comments: {},
  loading: false,
  error: null,

  // Criar comentário
  createComment: async (data: CreateComment) => {
    set({ loading: true, error: null });
    
    try {
      const response = await commentService.create(data);
      
      if (response.success && response.data) {
        const newComment = response.data;
        const currentComments = get().comments;
        
        // Adiciona o novo comentário à lista do post
        set({
          comments: {
            ...currentComments,
            [data.postId]: [
              ...(currentComments[data.postId] || []),
              newComment
            ]
          },
          loading: false
        });
        
        return newComment;
      } else {
        set({ error: response.message || 'Erro ao criar comentário', loading: false });
        return null;
      }
    } catch (error: any) {
      set({ error: error.message || 'Erro ao criar comentário', loading: false });
      return null;
    }
  },

  // Buscar comentários por post
  getCommentsByPost: async (postId: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await commentService.findByPost(postId);
      
      if (response.success && response.data) {
        const comments = response.data;
        
        set(state => ({
          comments: {
            ...state.comments,
            [postId]: comments
          },
          loading: false
        }));
        
        return comments;
      } else {
        set({ error: response.message || 'Erro ao buscar comentários', loading: false });
        return null;
      }
    } catch (error: any) {
      set({ error: error.message || 'Erro ao buscar comentários', loading: false });
      return null;
    }
  },

  // Atualizar comentário
  updateComment: async (id: string, data: UpdateComment) => {
    set({ loading: true, error: null });
    
    try {
      const response = await commentService.update(id, data);
      
      if (response.success && response.data) {
        const updatedComment = response.data;
        const currentComments = get().comments;
        
        // Atualiza o comentário em todos os posts que o contém
        const updatedCommentsMap = { ...currentComments };
        
        Object.keys(updatedCommentsMap).forEach(postId => {
          updatedCommentsMap[postId] = updatedCommentsMap[postId].map(comment =>
            comment.id === id ? updatedComment : comment
          );
        });
        
        set({
          comments: updatedCommentsMap,
          loading: false
        });
        
        return updatedComment;
      } else {
        set({ error: response.message || 'Erro ao atualizar comentário', loading: false });
        return null;
      }
    } catch (error: any) {
      set({ error: error.message || 'Erro ao atualizar comentário', loading: false });
      return null;
    }
  },

  // Deletar comentário
  deleteComment: async (id: string, postId: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await commentService.delete(id);
      
      if (response.success) {
        const currentComments = get().comments;
        
        set({
          comments: {
            ...currentComments,
            [postId]: currentComments[postId]?.filter(comment => comment.id !== id) || []
          },
          loading: false
        });
        
        return true;
      } else {
        set({ error: response.message || 'Erro ao deletar comentário', loading: false });
        return false;
      }
    } catch (error: any) {
      set({ error: error.message || 'Erro ao deletar comentário', loading: false });
      return false;
    }
  },

  // Limpar erro
  clearError: () => {
    set({ error: null });
  },

  // Reset dos comentários
  resetComments: (postId?: string) => {
    if (postId) {
      set(state => ({
        comments: {
          ...state.comments,
          [postId]: []
        }
      }));
    } else {
      set({ comments: {} });
    }
  },
}));