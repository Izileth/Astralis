import { Card, Box, Heading, Text, Flex, Avatar, IconButton, Inset, Badge } from '@radix-ui/themes';
import { Link, useNavigate } from 'react-router-dom';
import type { Post } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pencil1Icon, HeartIcon, ChatBubbleIcon, TrashIcon } from '@radix-ui/react-icons';
import { Carousel } from '../Common/Carousel';

interface PostCardProps {
  post: Post;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
}

export function PostCard({ post, isOwner = false, onDelete }: PostCardProps) {
  const navigate = useNavigate();

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Impede a navegação do Link principal
    e.stopPropagation();
    navigate(`/posts/${post.id}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Impede a navegação do Link principal
    e.stopPropagation();
    if (onDelete) {
      onDelete(post.id);
    }
  };

  const mediaItems = [];
  if (post.imageUrl) {
    mediaItems.push({ type: 'image' as const, src: post.imageUrl });
  }
  if (post.videoUrl) {
    mediaItems.push({ type: 'video' as const, src: post.videoUrl });
  }

  return (
    <Card asChild style={{ position: 'relative' }}>
      <Link to={`/post/${post.slug}`}>
        <Inset clip="padding-box" side="top" pb="current">
          {mediaItems.length > 0 ? (
            <div style={{ width: '100%', height: 140 }}>
              <Carousel items={mediaItems} />
            </div>
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
              <Text color="gray">Sem Mídia</Text>
            </Flex>
          )}
        </Inset>
        <Box p="3">
          {post.category && (
            <Badge color="gray" mb="2">{post.category.name}</Badge>
          )}
          <Heading size="3" mb="1" >
            {post.title}
          </Heading>
          <Text as="p" size="2" color="gray" >
            {post.description || ''}
          </Text>
          <Flex align="center" gap="2" mt="3">
            <Link to={`/author/${post.author?.slug}`} onClick={(e) => e.stopPropagation()}>
              <Flex align="center" gap="2">
                <Avatar
                  size="1"
                  src={post.author?.avatarUrl || undefined}
                  fallback={post.author?.name?.[0] || 'U'}
                  radius="full"
                />
                <Text size="1" color="gray">
                  {post.author?.name || 'Autor Desconhecido'}
                </Text>
              </Flex>
            </Link>
            <Text size="1" color="gray">
              • {
                formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })
              }
            </Text>
          </Flex>
          {post.tags && post.tags.length > 0 && (
            <Flex wrap="wrap" gap="2" mt="3">
              {post.tags.map(({ tag }) => (
                <Badge key={tag?.id} color="red" variant="soft">
                  {tag?.name}
                </Badge>
              ))}
            </Flex>
          )}
          <Flex gap="4" mt="4" pt="3" className="border-t">
            <Flex align="center" gap="1" className="text-gray-500">
              <HeartIcon width="14" height="14" />
              <Text size="1">{post.likes?.length || 0}</Text>
            </Flex>
            <Flex align="center" gap="1" className="text-gray-500">
              <ChatBubbleIcon width="14" height="14" />
              <Text size="1">{post.comments?.length || 0}</Text>
            </Flex>
          </Flex>
        </Box>
        {isOwner && (
          <Flex direction="column" gap="2" style={{ position: 'absolute', top: '8px', right: '8px' }}>
            <IconButton 
              size="1" 
              variant="ghost" 
              color="gray"
              onClick={handleEditClick}
            >
              <Pencil1Icon />
            </IconButton>
            <IconButton 
              size="1" 
              variant="ghost" 
              color="red"
              onClick={handleDeleteClick}
            >
              <TrashIcon />
            </IconButton>
          </Flex>
        )}
      </Link>
    </Card>
  );
}
