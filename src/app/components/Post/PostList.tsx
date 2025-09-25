import React from 'react';
import { usePosts, usePagination } from '../../hooks/post';
import { PostCard } from './PostCard';
import { Grid, Flex, Button, Text, Spinner, Box, Heading } from '@radix-ui/themes';

interface PostListProps {
  isOwner?: boolean;
}

export const PostList: React.FC<PostListProps> = ({ isOwner = false }) => {

  // Busca os posts publicados, ordenados pelos mais recentes
  const { posts, loading, error, refetch } = usePosts();

  console.log(posts, error)

  const { goToNext, goToPrev, hasNext, hasPrev, pagination } = usePagination();

  if (loading && posts.length === 0) {
    return (
      <Flex align="center" justify="center" py="8">
        <Spinner size="3" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box py="8">
        <Heading color="red" size="4">Erro ao carregar posts</Heading>
        <Text>{error}</Text>
        <Button onClick={() => refetch()} mt="3">Tentar Novamente</Button>
      </Box>
    );
  }

  if (posts.length === 0) {
    return (
      <Box py="8">
        <Heading size="4">Nenhum post encontrado</Heading>
        <Text>Ainda não há nada para ver aqui. Volte mais tarde!</Text>
      </Box>
    );
  }

  return (
    <Flex direction="column" gap="6">
      <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="5">
        {posts.map(post => (
          <PostCard key={post.id} post={post} isOwner={isOwner} />
        ))}
      </Grid>

      {pagination.totalPages > 1 && (
        <Flex align="center" justify="between" pt="4">
          <Button onClick={goToPrev} disabled={!hasPrev || loading}>
            Anterior
          </Button>
          <Text>
            Página {pagination.page} de {pagination.totalPages}
          </Text>
          <Button onClick={goToNext} disabled={!hasNext || loading}>
            Próxima
          </Button>
        </Flex>
      )}
    </Flex>
  );
};