import type { Post } from "./post";
import type { Like } from "./like";
import type { Comment } from "./comment";
import type { Follow } from "./follows";
import type { SocialLink } from "./social-links";

export interface User {
  id: string;
  name: string;
  slug: string;
  email: string;
  password?: string; // Não deve ser exposto no frontend
  avatarUrl?: string;
  bannerUrl?: string;
  bio?: string;
  status?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relações (opcionais para quando precisar popular)
  posts?: Post[];
  comments?: Comment[];
  likes?: Like[];
  following?: Follow[];
  followers?: Follow[];
  socialLinks?: SocialLink[];
  
  // Campos calculados úteis no frontend
  _count?: {
    posts: number;
    followers: number;
    following: number;
  };
}
