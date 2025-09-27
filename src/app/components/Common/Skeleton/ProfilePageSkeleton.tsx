import { Box, Flex, Card } from '@radix-ui/themes';
import { PostListSkeleton } from './PostListSkeleton';

export function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="w-full h-64 md:h-80 bg-gray-300 animate-pulse"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8 md:p-12 -mt-20 relative z-10">
          <Flex direction="column" align="center" className="text-center space-y-6 mb-12">
            <div className="w-32 h-32 rounded-full bg-gray-300 animate-pulse"></div>
            <div className="space-y-3 w-full">
              <div className="h-12 w-1/2 bg-gray-300 rounded animate-pulse mx-auto"></div>
              <div className="h-6 w-1/3 bg-gray-300 rounded animate-pulse mx-auto"></div>
            </div>
            <Flex className="flex-wrap justify-center gap-8 md:gap-12 w-full">
              <div className="h-10 w-24 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-300 rounded animate-pulse"></div>
            </Flex>
            <Flex className="flex-wrap justify-center gap-3 w-full">
              <div className="h-8 w-20 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-300 rounded-full animate-pulse"></div>
            </Flex>
          </Flex>

          <div className="relative mb-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-card px-6">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Tabs Skeleton */}
          <Flex className="flex-wrap justify-center items-center text-center gap-2 mb-8">
            <div className="h-12 w-24 bg-gray-300 rounded-md animate-pulse"></div>
            <div className="h-12 w-24 bg-gray-300 rounded-md animate-pulse"></div>
          </Flex>

          {/* Content Skeleton */}
          <Box mt="8">
            <PostListSkeleton />
          </Box>
        </Card>
      </div>
    </div>
  );
}