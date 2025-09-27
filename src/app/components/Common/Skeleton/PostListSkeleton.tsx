import { PostCardSkeleton } from './PostCardSkeleton';

interface PostListSkeletonProps {
  count?: number;
}

export function PostListSkeleton({ count = 3 }: PostListSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </div>
  );
}