import { Flex, Box } from '@radix-ui/themes';
import { Carousel } from '../components/Common/Carousel';
import { PostList } from '../components/Post/PostList';

export function IndexPage() {
  return (
    <Flex direction="column" align="center" gap="5" pb="9">
      <Box width="100%" maxWidth="1200px" px="4">
        <Carousel />
      </Box>
      <Box width="100%" maxWidth="1200px" px="4">
        <PostList />
      </Box>
    </Flex>
  );
}
