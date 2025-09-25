import { Card, Box, Heading, Text, Flex, Avatar, IconButton, Inset } from '@radix-ui/themes';
import { Link, useNavigate } from 'react-router-dom';
import type { Post } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pencil1Icon } from '@radix-ui/react-icons';

interface PostCardProps {
  post: Post;
  isOwner?: boolean;
}

export function PostCard({ post, isOwner = false }: PostCardProps) {
  const navigate = useNavigate();

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Impede a navegação do Link principal
    e.stopPropagation();
    navigate(`/posts/${post.id}/edit`);
  };

  return (
    <Card asChild style={{ position: 'relative' }}>
      <Link to={`/post/${post.slug}`}>
        <Inset clip="padding-box" side="top" pb="current">
          {post.imageUrl ? (
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
          ) : (
            <Flex 
              align="center" 
              justify="center" 
              style={{ 
                width: '100%', 
                height: 140, 
                backgroundColor: 'var(--gray-3)' 
              }}
            >
              <Text color="gray">Sem Imagem</Text>
            </Flex>
          )}
        </Inset>
        <Box p="3">
          <Heading size="3" mb="1" >
            {post.title}
          </Heading>
          <Text as="p" size="2" color="gray" >
            {post.description || ''}
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
        {isOwner && (
          <IconButton 
            size="1" 
            variant="ghost" 
            color="gray"
            onClick={handleEditClick}
            style={{ position: 'absolute', top: '8px', right: '8px' }}
          >
            <Pencil1Icon />
          </IconButton>
        )}
      </Link>
    </Card>
  );
}
