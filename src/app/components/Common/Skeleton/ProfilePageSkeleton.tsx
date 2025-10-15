import { Container } from '../Container';
import { Card, CardContent } from '../../ui/card';
import { Separator } from '../../ui/separator';
import { Skeleton } from '../../ui/skeleton';
import { PostListSkeleton } from './PostListSkeleton';

export function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Banner skeleton */}
      <Skeleton className="w-full h-48 md:h-64 rounded-none" />

      <Container className="-mt-16 relative z-10">
        <Card className="border-0 shadow-none">
          <CardContent className="p-6 md:p-8">
            {/* Profile header skeleton */}
            <div className="flex flex-col items-center text-center space-y-6 mb-8">
              <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full" />
              
              <div className="space-y-3 w-full max-w-md">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-5 w-1/2 mx-auto" />
              </div>

              {/* Stats skeleton */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-12 w-full max-w-2xl">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="text-center">
                    <Skeleton className="h-7 w-16 mx-auto mb-1" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </div>
                ))}
              </div>

              {/* Badges skeleton */}
              <div className="flex flex-wrap justify-center gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>

            {/* Separator */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-border/50" />
              </div>
              <div className="relative flex justify-center">
                <div className="bg-background px-4">
                  <Skeleton className="w-2 h-2 rounded-full" />
                </div>
              </div>
            </div>

            {/* Tabs skeleton */}
            <div className="flex justify-center mb-8">
              <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>

            {/* Content skeleton */}
            <div className="mt-8">
              <PostListSkeleton />
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}