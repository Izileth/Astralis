import type { Post } from "./post";
import type { Tag } from "./tags";

export interface PostTag {
  postId: string;
  tagId: string;
  
  // Relações
  post?: Post;
  tag?: Tag;
}
