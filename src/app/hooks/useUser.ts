import { useEffect } from 'react';
import useUserStore from '../store/user';
import useAuthStore from '../store/auth';
import type { UpdateUser, CreateSocialLink, UsersParams } from '../types';

// Hook para gerenciar o perfil do usuário atual
export const useCurrentUser = () => {
  const { user } = useAuthStore();
  const { updateUser, uploadAvatar, uploadBanner, isLoading, isUploading, error } = useUserStore();

  const updateProfile = async (data: UpdateUser) => {
    if (!user?.id) throw new Error('Usuário não autenticado');
    return updateUser(user.id, data);
  };

  const updateAvatar = async (file: File) => {
    if (!user?.id) throw new Error('Usuário não autenticado');
    return uploadAvatar(user.id, file);
  };

  const updateBanner = async (file: File) => {
    if (!user?.id) throw new Error('Usuário não autenticado');
    return uploadBanner(user.id, file);
  };

  return {
    user,
    updateProfile,
    updateAvatar,
    updateBanner,
    isLoading,
    isUploading,
    error
  };
};

// Hook para visualizar perfil de outros usuários
export const useUserProfile = (slug?: string) => {
  const { 
    currentViewedUser, 
    fetchUserBySlug, 
    clearCurrentUser, 
    isLoading, 
    error 
  } = useUserStore();

  useEffect(() => {
    if (slug) {
      fetchUserBySlug(slug);
    }
    
    return () => {
      clearCurrentUser();
    };
  }, [slug, fetchUserBySlug, clearCurrentUser]);

  return {
    user: currentViewedUser,
    isLoading,
    error,
    refetch: () => slug && fetchUserBySlug(slug)
  };
};

// Hook para listar usuários
export const useUsers = (params?: UsersParams) => {
  const { 
    users, 
    fetchAllUsers, 
    isLoading, 
    error 
  } = useUserStore();

  useEffect(() => {
    fetchAllUsers(params);
  }, [params, fetchAllUsers]);

  const refetch = () => fetchAllUsers(params);

  return {
    users,
    isLoading,
    error,
    refetch
  };
};

// Hook para gerenciar seguidores
export const useFollowers = (userId?: string) => {
  const { 
    followers, 
    fetchFollowers, 
    followUser, 
    unfollowUser, 
    isLoading, 
    error 
  } = useUserStore();

  useEffect(() => {
    if (userId) {
      fetchFollowers(userId);
    }
  }, [userId, fetchFollowers]);

  const follow = async (followingId: string) => {
    await followUser(followingId);
    if (userId) fetchFollowers(userId);
  };

  const unfollow = async (followingId: string) => {
    await unfollowUser(followingId);
    if (userId) fetchFollowers(userId);
  };

  return {
    followers,
    follow,
    unfollow,
    isLoading,
    error,
    refetch: () => userId && fetchFollowers(userId)
  };
};

// Hook para gerenciar seguindo
export const useFollowing = (userId?: string) => {
  const { 
    following, 
    fetchFollowing, 
    followUser, 
    unfollowUser, 
    isLoading, 
    error 
  } = useUserStore();

  useEffect(() => {
    if (userId) {
      fetchFollowing(userId);
    }
  }, [userId, fetchFollowing]);

  const follow = async (followingId: string) => {
    await followUser(followingId);
    if (userId) fetchFollowing(userId);
  };

  const unfollow = async (followingId: string) => {
    await unfollowUser(followingId);
    if (userId) fetchFollowing(userId);
  };

  return {
    following,
    follow,
    unfollow,
    isLoading,
    error,
    refetch: () => userId && fetchFollowing(userId)
  };
};

// Hook para gerenciar links sociais
export const useSocialLinks = (userId?: string) => {
  const { 
    socialLinks, 
    fetchSocialLinks, 
    addSocialLink, 
    removeSocialLink, 
    isLoading, 
    error 
  } = useUserStore();

  useEffect(() => {
    if (userId) {
      fetchSocialLinks(userId);
    }
  }, [userId, fetchSocialLinks]);

  const addLink = async (data: CreateSocialLink) => {
    if (!userId) throw new Error('ID do usuário é necessário');
    await addSocialLink(userId, data);
  };

  const removeLink = async (socialLinkId: string) => {
    if (!userId) throw new Error('ID do usuário é necessário');
    await removeSocialLink(userId, socialLinkId);
  };

  return {
    socialLinks,
    addLink,
    removeLink,
    isLoading,
    error,
    refetch: () => userId && fetchSocialLinks(userId)
  };
};

// Hook para verificar se o usuário atual está seguindo outro usuário
export const useIsFollowing = (targetUserId?: string) => {
  const { user } = useAuthStore();
  const { following } = useUserStore();

  const isFollowing = following.some(
    follow => follow.followingId === targetUserId && follow.followerId === user?.id
  );

  return isFollowing;
};

// Hook específico para upload de imagens
export const useImageUpload = () => {
  const { uploadAvatar, uploadBanner, isUploading, error } = useUserStore();

  const uploadUserAvatar = async (userId: string, file: File) => {
    return uploadAvatar(userId, file);
  };

  const uploadUserBanner = async (userId: string, file: File) => {
    return uploadBanner(userId, file);
  };

  return {
    uploadUserAvatar,
    uploadUserBanner,
    isUploading,
    error
  };
};

// Hook para validar e processar arquivos de imagem
export const useImageValidation = () => {
  const validateImageFile = (file: File, options?: {
    maxSize?: number; // em MB
    acceptedTypes?: string[];
  }) => {
    const { 
      maxSize = 5, // 5MB por padrão
      acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
    } = options || {};

    const errors: string[] = [];

    // Validar tipo de arquivo
    if (!acceptedTypes.includes(file.type)) {
      errors.push('Tipo de arquivo não suportado. Use JPG, PNG ou WebP.');
    }

    // Validar tamanho do arquivo
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      errors.push(`Arquivo muito grande. Máximo permitido: ${maxSize}MB`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return {
    validateImageFile,
    createImagePreview
  };
};