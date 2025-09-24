import { useEffect, useState } from 'react';
import { Flex, Text, Spinner } from '@radix-ui/themes';
import { postService } from '../../services';
import { PostCard } from './PostCard';
import type { Post } from '../../types';

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await postService.findAll();
        // Assuming response.data is an object with a 'data' array for posts
        if (response && response.data && Array.isArray(response.data.data)) {
          setPosts(response.data.data);
        } else {
          setError('Formato de resposta inesperado.');
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar postagens.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ height: '200px' }}>
        <Spinner size="3" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" style={{ height: '200px' }}>
        <Text color="red">{error}</Text>
      </Flex>
    );
  }

  if (posts.length === 0) {
    return (
      <Flex justify="center" align="center" style={{ height: '200px' }}>
        <Text>Nenhuma postagem encontrada.</Text>
      </Flex>
    );
  }

  return (
    <Flex wrap="wrap" gap="4" justify="center">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Flex>
  );
}
