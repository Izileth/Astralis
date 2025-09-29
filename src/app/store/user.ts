import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { userService } from '../services';
import useAuthStore from './auth';
import type { 
  User, 
  CreateUser, 
  UpdateUser, 
  Follow, 
  SocialLink, 
  CreateSocialLink,
  UsersParams 
} from '../types';

interface UserState {
  users: User[];
  currentViewedUser: User | null;
  followers: Follow[];
  following: Follow[];
  socialLinks: SocialLink[];
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
}

interface UserActions {
  // CRUD Operations
  createUser: (data: CreateUser) => Promise<User>;
  fetchAllUsers: (params?: UsersParams) => Promise<void>;
  fetchUserBySlug: (slug: string) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  updateUser: (id: string, data: UpdateUser) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  
  // Upload Operations
  uploadAvatar: (userId: string, file: File) => Promise<User>;
  uploadBanner: (userId: string, file: File) => Promise<User>;
  
  // Follow Operations
  followUser: (followingId: string) => Promise<void>;
  unfollowUser: (followingId: string) => Promise<void>;
  fetchFollowers: (userId: string) => Promise<void>;
  fetchFollowing: (userId: string) => Promise<void>;
  
  // Social Links Operations
  addSocialLink: (userId: string, data: CreateSocialLink) => Promise<void>;
  fetchSocialLinks: (userId: string) => Promise<void>;
  removeSocialLink: (userId: string, socialLinkId: string) => Promise<void>;
  
  // Utility Methods
  clearError: () => void;
  clearCurrentUser: () => void;
  setLoading: (loading: boolean) => void;
  setUploading: (uploading: boolean) => void;
}

type UserStore = UserState & UserActions;

const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
  // Initial State
  users: [],
  currentViewedUser: null,
  followers: [],
  following: [],
  socialLinks: [],
  isLoading: false,
  isUploading: false,
  error: null,

  // Utility Actions
  clearError: () => set({ error: null }),
  clearCurrentUser: () => set({ currentViewedUser: null }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setUploading: (uploading: boolean) => set({ isUploading: uploading }),

  // CRUD Operations
  createUser: async (data: CreateUser) => {
    set({ isLoading: true, error: null });
    try {
      const user = await userService.create(data);
      set((state) => ({
        users: [...state.users, user],
        isLoading: false
      }));
      return user;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao criar usuário';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  fetchAllUsers: async (params?: UsersParams) => {
    set({ isLoading: true, error: null });
    try {
      const users = await userService.findAll(params);
      set({ users, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao buscar usuários';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchUserBySlug: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await userService.findBySlug(slug);
      set({ currentViewedUser: user, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao buscar usuário';
      set({ error: errorMessage, isLoading: false, currentViewedUser: null });
    }
  },

  fetchUserById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await userService.findById(id);
      set({ currentViewedUser: user, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao buscar usuário';
      set({ error: errorMessage, isLoading: false, currentViewedUser: null });
    }
  },

  updateUser: async (id: string, data: UpdateUser) => {
    const { currentViewedUser } = get();
    const { setUser } = useAuthStore.getState();

    if (!currentViewedUser || currentViewedUser.id !== id) {
      const updatedUser = await userService.update(id, data);
      set((state) => ({ 
        users: state.users.map(u => u.id === id ? updatedUser : u)
      }));
      // Se o usuário atualizado for o usuário logado, atualize o authStore também
      if (useAuthStore.getState().user?.id === id) {
        setUser(updatedUser);
      }
      return updatedUser;
    }

    const originalUser = { ...currentViewedUser };
    const optimisticUser = { ...currentViewedUser, ...data };

    // Atualização otimista em ambos os stores
    set({ currentViewedUser: optimisticUser, isLoading: true });
    setUser(optimisticUser);

    try {
      const confirmedUser = await userService.update(id, data);
      
      // Sucesso: confirma dados em ambos os stores
      set({ currentViewedUser: confirmedUser, isLoading: false });
      setUser(confirmedUser);

      return confirmedUser;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao atualizar usuário';
      
      // Falha: reverte em ambos os stores
      set({ currentViewedUser: originalUser, error: errorMessage, isLoading: false });
      setUser(originalUser);

      throw new Error(errorMessage);
    }
  },

  deleteUser: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await userService.delete(id);
      set((state) => ({
        users: state.users.filter(user => user.id !== id),
        currentViewedUser: state.currentViewedUser?.id === id ? null : state.currentViewedUser,
        isLoading: false
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao deletar usuário';
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Upload Operations
  uploadAvatar: async (userId: string, file: File) => {
    set({ isUploading: true, error: null });
    try {
      const updatedUser = await userService.uploadAvatar(userId, file);
      set((state) => ({
        users: state.users.map(user => user.id === userId ? updatedUser : user),
        currentViewedUser: state.currentViewedUser?.id === userId ? updatedUser : state.currentViewedUser,
        isUploading: false
      }));
      return updatedUser;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao fazer upload do avatar';
      set({ error: errorMessage, isUploading: false });
      throw new Error(errorMessage);
    }
  },

  uploadBanner: async (userId: string, file: File) => {
    set({ isUploading: true, error: null });
    try {
      const updatedUser = await userService.uploadBanner(userId, file);
      set((state) => ({
        users: state.users.map(user => user.id === userId ? updatedUser : user),
        currentViewedUser: state.currentViewedUser?.id === userId ? updatedUser : state.currentViewedUser,
        isUploading: false
      }));
      return updatedUser;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao fazer upload do banner';
      set({ error: errorMessage, isUploading: false });
      throw new Error(errorMessage);
    }
  },

  // Follow Operations
  followUser: async (followingId: string) => {
    set({ isLoading: true, error: null });
    try {
      await userService.follow(followingId);
      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao seguir usuário';
      set({ error: errorMessage, isLoading: false });
    }
  },

  unfollowUser: async (followingId: string) => {
    set({ isLoading: true, error: null });
    try {
      await userService.unfollow(followingId);
      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao deixar de seguir usuário';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchFollowers: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const followers = await userService.getFollowers(userId);
      set({ followers, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao buscar seguidores';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchFollowing: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const following = await userService.getFollowing(userId);
      set({ following, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao buscar seguindo';
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Social Links Operations
  addSocialLink: async (userId: string, data: CreateSocialLink) => {
    set({ isLoading: true, error: null });
    try {
      const newSocialLink = await userService.addSocialLink(userId, data);
      set((state) => ({
        socialLinks: [...state.socialLinks, newSocialLink],
        isLoading: false
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao adicionar link social';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchSocialLinks: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const socialLinks = await userService.getSocialLinks(userId);
      set({ socialLinks, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao buscar links sociais';
      set({ error: errorMessage, isLoading: false });
    }
    
  },
  
  removeSocialLink: async (userId: string, socialLinkId: string) => {
    set({ isLoading: true, error: null });
    try {
      await userService.removeSocialLink(userId);
      set((state) => ({
        socialLinks: state.socialLinks.filter(link => link.id !== socialLinkId),
        isLoading: false
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao remover link social';
      set({ error: errorMessage, isLoading: false });
    }
  },

  }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ currentViewedUser: state.currentViewedUser })
    }
  )
);

export default useUserStore;