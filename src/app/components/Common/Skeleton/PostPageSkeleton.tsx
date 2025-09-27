import { Container, Flex, Box, Separator } from '@radix-ui/themes';

export function PostPageSkeleton() {
  return (
    <Container size="3" py="8">
      <Flex direction="column" gap="5">
        <div className="w-full h-[400px] bg-gray-300 animate-pulse rounded-lg"></div>
        
        <div className="h-12 w-3/4 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-6 w-full bg-gray-300 rounded animate-pulse"></div>
        
        <Separator size="4" my="3" />

        <Flex align="center" justify="between">
          <Flex align="center" gap="3">
            <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse"></div>
            <Box>
              <div className="h-6 w-32 bg-gray-300 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-48 bg-gray-300 rounded animate-pulse"></div>
            </Box>
          </Flex>
          <Flex align="center" gap="4">
            <div className="h-6 w-16 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-6 w-16 bg-gray-300 rounded animate-pulse"></div>
          </Flex>
        </Flex>

        <Flex align="center" gap="4" my="4" wrap="wrap">
          <div className="h-8 w-24 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="h-8 w-20 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="h-8 w-20 bg-gray-300 rounded-full animate-pulse"></div>
        </Flex>
        
        <Separator size="4" my="3" />

        <Box className="post-content space-y-4">
          <div className="h-6 w-full bg-gray-300 rounded animate-pulse"></div>
          <div className="h-6 w-full bg-gray-300 rounded animate-pulse"></div>
          <div className="h-6 w-5/6 bg-gray-300 rounded animate-pulse"></div>
          <br />
          <div className="h-6 w-full bg-gray-300 rounded animate-pulse"></div>
          <div className="h-6 w-1/2 bg-gray-300 rounded animate-pulse"></div>
        </Box>

      </Flex>
    </Container>
  );
}