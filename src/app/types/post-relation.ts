import type { Post } from "./post";

export interface PostRelation {
  id: string;
  postId: string;
  relatedPostId: string;
  
  // Relações
  post?: Post;
  relatedPost?: Post;
}
