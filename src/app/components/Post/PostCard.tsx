import { Card, Box, Heading, Text, Flex, Avatar, IconButton, Inset, Badge } from '@radix-ui/themes';
import { Link, useNavigate } from 'react-router-dom';
import type { Post, User } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pencil1Icon, ChatBubbleIcon, TrashIcon, ClockIcon } from '@radix-ui/react-icons';
import { Carousel } from '../Common/Carousel';
import { LikeButton } from '../Common/LikeButton';

interface PostCardProps {
  post: Post;
  author?: User;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
}

export function PostCard({ post, author, isOwner = false, onDelete }: PostCardProps) {
  const navigate = useNavigate();
  const displayAuthor = post.author || author;

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/posts/${post.id}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
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
    <Card 
      asChild 
      className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white group"
    >
      <Link to={`/post/${post.slug}`}>
        <Inset clip="padding-box" side="top" pb="current">
          {mediaItems.length > 0 ? (
            <div className="relative w-full h-48 overflow-hidden">
              <Carousel items={mediaItems} />
              {/* Overlay gradiente para melhor legibilidade da categoria */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
              {/* Categoria posicionada sobre a imagem */}
              {post.category && (
                <Box className="absolute top-3 left-3">
                  <Badge color='tomato' variant='solid'   className="bg-red-600 text-white font-sans font-bold text-xs px-3 py-1 uppercase tracking-wider border-0 rounded-sm">
                    {post.category.name}
                  </Badge>
                </Box>
              )}
            </div>
          ) : (
            <div className="relative w-full h-48">
              <Flex 
                align="center" 
                justify="center" 
                className="w-full h-full bg-gray-100 border-b-4 border-red-600"
              >
                <Text className="text-gray-400 font-serif text-sm">SEM MÍDIA</Text>
              </Flex>
              
              {post.category && (
                <Box className="absolute top-3 left-3">
                  <Badge className="bg-red-600 text-white font-sans font-bold text-xs px-3 py-1 uppercase tracking-wider border-0 rounded-sm">
                    {post.category.name}
                  </Badge>
                </Box>
              )}
            </div>
          )}
        </Inset>

        <Box className="p-5">
          {/* Título */}
          <Heading 
            size="4" 
            mb="3"
            className="text-black font-serif leading-tight group-hover:text-red-700 transition-colors duration-200"
          >
            {post.title}
          </Heading>

          {/* Descrição */}
          <Text 
            as="p" 
            size="2" 
            className="text-gray-700 font-sans leading-relaxed mb-4 line-clamp-3"
          >
            {post.description || ''}
          </Text>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <Flex wrap="wrap" gap="2" className="mb-4 mt-2">
              {post.tags.slice(0, 3).map(({ tag }) => (
                <Badge 
                  color='tomato'
                  key={tag?.id} 
                  className="bg-gray-100 text-gray-700 font-sans text-xs px-2 py-1 border border-gray-200 hover:border-red-300 hover:text-red-700 transition-colors duration-200 rounded-full"
                >
                  #{tag?.name}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge  color='red' className="bg-gray-100 text-gray-500 font-sans text-xs px-2 py-1 border border-gray-200 rounded-full">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </Flex>
          )}

          {/* Divisor */}
          <div className="border-b border-gray-200 mb-4"></div>

          {/* Autor e Data */}
          <Flex align="center" justify="between" className="mb-4">
            <Link 
              to={`/author/${displayAuthor?.slug}`} 
              onClick={(e) => e.stopPropagation()}
              className="hover:no-underline"
            >
              <Flex align="center" gap="3" className="group/author">
                <Avatar
                  size="2"
                  src={displayAuthor?.avatarUrl || undefined}
                  fallback={displayAuthor?.name?.[0] || 'U'}
                  radius="full"
                  className="border-2 border-gray-200 group-hover/author:border-red-300 transition-colors duration-200"
                />
                <Box>
                  <Text 
                    size="2" 
                    weight="bold"
                    className="text-black font-sans group-hover/author:text-red-700 transition-colors duration-200"
                  >
                    {displayAuthor?.name || 'Autor Desconhecido'}
                  </Text>
                  <Flex align="center" gap="1" className="mt-1">
                    <ClockIcon width="12" height="12" className="text-gray-400" />
                    <Text size="1" className="text-gray-500 font-sans">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            </Link>
          </Flex>

          {/* Estatísticas */}
          <Flex align="center" justify="between" className="pt-3 border-t border-gray-100">
            <Flex gap="6">
              <LikeButton postId={post.id} />
              
              <Flex align="center" gap="2" className="text-gray-500 hover:text-red-600 transition-colors duration-200 cursor-pointer">
                <ChatBubbleIcon width="16" height="16" />
                <Text size="2" weight="medium" className="font-sans">
                  {post._count?.comments || 0}
                </Text>
                <Text size="1" className="text-gray-400 font-sans">
                  comentários
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Box>

        {/* Botões de Ação (Owner) */}
        {isOwner && (
          <Box className="absolute top-3 right-3">
            <Flex direction="column" gap="2">
              <IconButton 
                size="2" 
                variant="solid"
                color='tomato'
                className="bg-white/90 hover:bg-white text-blue-600 hover:text-blue-700 shadow-md hover:shadow-lg backdrop-blur-sm border-0 transition-all duration-200"
                onClick={handleEditClick}
              >
                <Pencil1Icon width="14" height="14" />
              </IconButton>
              <IconButton 
                size="2" 
                variant="solid"
                color='tomato'
                className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700 shadow-md hover:shadow-lg backdrop-blur-sm border-0 transition-all duration-200"
                onClick={handleDeleteClick}
              >
                <TrashIcon width="14" height="14" />
              </IconButton>
            </Flex>
          </Box>
        )}

        {/* Indicador de "leia mais" */}
        <Box className="absolute bottom-0 right-0 p-3">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
            <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
          </div>
        </Box>
      </Link>
    </Card>
  );
}