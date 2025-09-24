import { useEffect } from 'react';
import useUserStore from '../store/user';
import useAuthStore from '../store/auth';
import type { UpdateUser, CreateSocialLink, UsersParams } from '../types';

// Hook para gerenciar o perfil do usuário atual
export const useCurrentUser = () => {
  const { user } = useAuthStore();
  const { updateUser, isLoading, error } = useUserStore();

  const updateProfile = async (data: UpdateUser) => {
    if (!user?.id) throw new Error('Usuário não autenticado');
    return updateUser(user.id, data);
  };

  return {
    user,
    updateProfile,
    isLoading,
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
    // Atualizar a lista de seguidores se necessário
    if (userId) fetchFollowers(userId);
  };

  const unfollow = async (followingId: string) => {
    await unfollowUser(followingId);
    // Atualizar a lista de seguidores se necessário
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