import type { User } from "./user";

export interface SocialLink {
  id: string;
  platform: string; // facebook, twitter, instagram, linkedin, etc.
  url: string;
  userId: string;
  
  // Relação
  user?: User;
}
