import type { PostTag } from "./post-tags";

export interface Tag {
  id: string;
  name: string;
  
  // Relações
  posts?: PostTag[];
  
  // Campos calculados
  _count?: {
    posts: number;
  };
}