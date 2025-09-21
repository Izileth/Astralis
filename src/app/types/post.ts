import type { User } from "./user";
import type { Comment } from "./comment";
import type { Category } from "./category";
import type { Like } from "./like";
import type { PostTag } from "./post-tags";
import type { PostRelation } from "./post-relation";
import type { SharedLink } from "./shared-link";

export interface Post {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  categoryId?: string;
  
  // Relações
  author?: User;
  category?: Category;
  comments?: Comment[];
  likes?: Like[];
  tags?: PostTag[];
  relatedFrom?: PostRelation[];
  relatedTo?: PostRelation[];
  sharedLinks?: SharedLink[];
  
  // Campos calculados úteis no frontend
  _count?: {
    comments: number;
    likes: number;
    tags: number;
  };
  isLikedByCurrentUser?: boolean; // Para indicar se o usuário atual curtiu
}
