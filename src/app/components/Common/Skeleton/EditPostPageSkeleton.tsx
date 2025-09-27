import { Container, Card, Flex, Box } from '@radix-ui/themes';

export function EditPostPageSkeleton() {
  return (
    <Container size="3" py="8">
      <Card>
        <div className="h-8 w-1/3 bg-gray-300 rounded animate-pulse mb-5"></div>
        <Flex direction="column" gap="4">
          <div className="h-6 w-1/4 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-300 rounded animate-pulse"></div>
          
          <div className="h-6 w-1/4 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-24 w-full bg-gray-300 rounded animate-pulse"></div>

          <div className="h-6 w-1/4 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-300 rounded animate-pulse"></div>

          <div className="h-6 w-1/4 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-300 rounded animate-pulse"></div>

          <Flex justify="end">
            <div className="h-10 w-32 bg-gray-300 rounded animate-pulse"></div>
          </Flex>
        </Flex>
      </Card>
    </Container>
  );
}