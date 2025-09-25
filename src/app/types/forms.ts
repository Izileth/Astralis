
export interface CreateUser {
  name: string;
  slug: string;
  email: string;
  password: string;
  avatarUrl?: string;
  bannerUrl?: string;
  bio?: string;
}

export interface UpdateUser {
  name?: string;
  email?: string;
  password?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  bio?: string;
  status?: string;
  verified?: boolean;
}

export interface CreatePost {
  title: string;
  slug?: string; // Pode ser gerado automaticamente
  description?: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  published?: boolean;
  categoryId?: string;
  categoryName?: string;
  tagIds?: string[]; // Para associar tags existentes
  tagNames?: string[];
  newTags?: string[]; // Para criar novas tags
}

export interface UpdatePost {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  published?: boolean;
  categoryId?: string;
  categoryName?: string;
  tagIds?: string[];
  tagNames?: string[];
  newTags?: string[];
}


export interface CreateCategory {
  name: string;
}

export interface UpdateCategory {
  name?: string;
}

export interface CreateTag {
  name: string;
}

export interface CreateComment {
  content: string;
  postId: string;
}

export interface UpdateComment {
  content?: string;
}

export interface CreateSocialLink {
  platform: string;
  url: string;
}

export interface UpdateSocialLink {
  platform?: string;
  url?: string;
}