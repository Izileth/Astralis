import type { PaginationParams } from "./api";

export interface PostsParams extends PaginationParams {
  // Filtros básicos
  categoryId?: string;
  categoryName?: string;
  tagId?: string;
  tagNames?: string[];
  authorId?: string;
  published?: boolean;
  
  // Filtros de data
  createdFrom?: string; // ISO date string
  createdTo?: string;   // ISO date string
  updatedFrom?: string;
  updatedTo?: string;
  
  // Filtros de conteúdo
  hasImage?: boolean;
  hasVideo?: boolean;
  minComments?: number;
  minLikes?: number;
  
  // Ordenação específica para posts
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'likes' | 'comments' | 'views';
  
  // Incluir relações
  includeAuthor?: boolean;
  includeCategory?: boolean;
  includeTags?: boolean;
  includeComments?: boolean;
  includeLikes?: boolean;
  includeStats?: boolean; // Para _count
}

// Tipos específicos para parâmetros de Users
export interface UsersParams extends PaginationParams {
  // Filtros básicos
  status?: 'active' | 'inactive' | 'suspended';
  verified?: boolean;
  
  // Filtros de data
  createdFrom?: string; // ISO date string
  createdTo?: string;   // ISO date string
  
  // Filtros de conteúdo
  hasAvatar?: boolean;
  hasBanner?: boolean;
  hasBio?: boolean;
  minPosts?: number;
  minFollowers?: number;
  minFollowing?: number;
  
  // Filtros de relacionamento
  followerId?: string;  // Usuários que seguem este ID
  followingId?: string; // Usuários seguidos por este ID
  
  // Ordenação específica para users
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'posts' | 'followers' | 'following';
  
  // Incluir relações
  includePosts?: boolean;
  includeFollowers?: boolean;
  includeFollowing?: boolean;
  includeSocialLinks?: boolean;
  includeStats?: boolean; // Para _count
}

// Tipos para parâmetros de Comments
export interface CommentsParams extends PaginationParams {
  // Filtros básicos
  postId?: string;
  authorId?: string;
  
  // Filtros de data
  createdFrom?: string;
  createdTo?: string;
  
  // Filtros de conteúdo
  minLikes?: number;
  
  // Ordenação
  sortBy?: 'createdAt' | 'likes';
  
  // Incluir relações
  includeAuthor?: boolean;
  includePost?: boolean;
  includeLikes?: boolean;
  includeStats?: boolean;
}

// Tipos para parâmetros de Likes
export interface LikesParams extends PaginationParams {
  // Filtros básicos
  userId?: string;
  postId?: string;
  commentId?: string;
  
  // Filtros de data
  createdFrom?: string;
  createdTo?: string;
  
  // Tipo de like
  type?: 'post' | 'comment';
  
  // Ordenação
  sortBy?: 'createdAt';
  
  // Incluir relações
  includeUser?: boolean;
  includePost?: boolean;
  includeComment?: boolean;
}

// Tipos para busca avançada
export interface SearchParams extends PaginationParams {
  q: string; // Query obrigatória
  type?: 'posts' | 'users' | 'comments' | 'all';
  
  // Filtros específicos de busca
  searchIn?: ('title' | 'content' | 'description' | 'name' | 'bio')[];
  exact?: boolean; // Busca exata ou parcial
  
  // Filtros combinados
  posts?: Omit<PostsParams, keyof PaginationParams>;
  users?: Omit<UsersParams, keyof PaginationParams>;
  comments?: Omit<CommentsParams, keyof PaginationParams>;
}