import type { Post } from "./post";

export interface SharedLink {
  id: string;
  platform: string; // facebook, twitter, etc.
  url: string;
  postId: string;
  
  // Relação
  post?: Post;
}
