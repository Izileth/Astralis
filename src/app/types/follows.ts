import type { User } from "./user";

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
  
  // Relações
  follower?: User;
  following?: User;
}