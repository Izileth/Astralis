import type { Post } from "./post";
import type { User } from "./user";
import type { Like } from "./like";

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  postId: string;
  authorId: string;
  
  // Relações
  post?: Post;
  author?: User;
  likes?: Like[];
  
  // Campos calculados
  _count?: {
    likes: number;
  };
  isLikedByCurrentUser?: boolean;
}