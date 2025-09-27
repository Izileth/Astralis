import { useCallback } from 'react';
import { commentService } from '../services';

export const useDeleteComment = () => {
  const deleteComment = useCallback(async (id: string) => {
    try {
      const response = await commentService.delete(id);
      return response.success;
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      return false;
    }
  }, []);

  return { deleteComment };
};