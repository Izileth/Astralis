import { Card, Box, Flex, Inset } from '@radix-ui/themes';

export function PostCardSkeleton() {
  return (
    <Card>
      <Inset clip="padding-box" side="top" pb="current">
        <div className="w-full h-[140px] bg-gray-300 animate-pulse"></div>
      </Inset>
      <Box p="3">
        <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse mb-2"></div>
        <div className="h-5 w-3/4 bg-gray-300 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-full bg-gray-300 rounded animate-pulse mb-3"></div>
        <Flex align="center" gap="2" mt="3">
          <div className="w-6 h-6 rounded-full bg-gray-300 animate-pulse"></div>
          <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse"></div>
        </Flex>
        <Flex wrap="wrap" gap="2" mt="3">
          <div className="h-5 w-1/4 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="h-5 w-1/4 bg-gray-300 rounded-full animate-pulse"></div>
        </Flex>
        <Flex gap="4" mt="4" pt="3" className="border-t">
          <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse"></div>
        </Flex>
      </Box>
    </Card>
  );
}