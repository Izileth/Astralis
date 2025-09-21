import type { Post } from "./post";
import type { Comment } from "./comment";
import type { User } from "./user";

export interface Like {
  id: string;
  createdAt: Date;
  postId?: string;
  commentId?: string;
  userId: string;
  
  // Relações
  post?: Post;
  comment?: Comment;
  user?: User;
}