import type { Post } from "./post";

export interface Category {
  id: string;
  name: string;
  
  // Relações
  posts?: Post[];
  
  // Campos calculados
  _count?: {
    posts: number;
  };
}