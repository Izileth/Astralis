import type { PaginationParams } from "./api";

export interface PostsParams extends PaginationParams {
  categoryId?: string;
  tagId?: string;
  authorId?: string;
  published?: boolean;
}

export interface UsersParams extends PaginationParams {
  status?: string;
  verified?: boolean;
}
