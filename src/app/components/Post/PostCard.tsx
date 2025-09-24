import { Card, Box, Heading, Text, Flex, Avatar } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import type { Post } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card asChild style={{ maxWidth: 300 }}>
      <Link to={`/post/${post.slug}`}>
        <Flex direction="column" gap="3">
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              style={{
                display: 'block',
                objectFit: 'cover',
                width: '100%',
                height: 140,
                backgroundColor: 'var(--gray-5)',
              }}
            />
          )}
          <Box p="3">
            <Heading size="3" mb="1">
              {post.title}
            </Heading>
            <Text size="2" color="gray" mb="2" style={{ display: 'block' }}>
              {post.description || 'Sem descrição.'}
            </Text>
            <Flex align="center" gap="2" mt="3">
              <Avatar
                size="1"
                src={post.author?.avatarUrl || undefined}
                fallback={post.author?.name?.[0] || 'U'}
                radius="full"
              />
              <Text size="1" color="gray">
                {post.author?.name || 'Autor Desconhecido'} • {
                  formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })
                }
              </Text>
            </Flex>
          </Box>
        </Flex>
      </Link>
    </Card>
  );
}
