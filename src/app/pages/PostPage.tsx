import { useParams, Link } from 'react-router-dom';
import { usePost } from '../hooks/usePost';
import { Box, Flex, Heading, Text, Avatar, Container, Separator, Badge } from '@radix-ui/themes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { HeartIcon, ChatBubbleIcon } from '@radix-ui/react-icons';
import { Carousel } from '../components/Common/Carousel';
import { PostPageSkeleton } from '../components/Common/Skeleton';

export function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  // O segundo argumento `true` indica que a busca deve ser pelo slug
  const { post, loading, error } = usePost(slug, true);

  if (loading) {
    return <PostPageSkeleton />;
  }

  if (error) {
    return (
      <Container py="8">
        <Heading color="red">Erro ao carregar o post</Heading>
        <Text>{error}</Text>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container py="8">
        <Heading>Post não encontrado</Heading>
      </Container>
    );
  }

  const mediaItems = [];
  if (post.imageUrl) {
    mediaItems.push({ type: 'image' as const, src: post.imageUrl });
  }
  if (post.videoUrl) {
    mediaItems.push({ type: 'video' as const, src: post.videoUrl });
  }

  return (
    <Container size="3" py="8">
      <Flex direction="column" gap="5">
        {mediaItems.length > 0 && (
          <Box 
            style={{
              width: '100%',
              maxHeight: '400px',
              borderRadius: 'var(--radius-3)',
              overflow: 'hidden',
            }}
          >
            <Carousel items={mediaItems} />
          </Box>
        )}
        <Heading as="h1" size="8">
          {post.title}
        </Heading>
        {post.description && (
          <Text size="4" color="gray">
            {post.description}
          </Text>
        )}
        
        <Separator size="4" my="3" />

        <Flex align="center" justify="between">
          <Flex align="center" gap="3">
            <Avatar
              size="3"
              src={post.author?.avatarUrl || undefined}
              fallback={post.author?.name?.[0] || 'A'}
              radius="full"
            />
            <Box>
              <Link to={`/author/${post?.author?.slug}`}>
                <Text weight="bold">{post.author?.name || 'Autor Desconhecido'}</Text>
              </Link>
              <Text color="gray" as="p">
                Publicado em {format(new Date(post.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </Text>
            </Box>
          </Flex>
          <Flex align="center" gap="4">
            <Flex align="center" gap="1" className="text-gray-500">
              <HeartIcon />
              <Text size="2">{post.likes?.length || 0}</Text>
            </Flex>
            <Flex align="center" gap="1" className="text-gray-500">
              <ChatBubbleIcon />
              <Text size="2">{post.comments?.length || 0}</Text>
            </Flex>
          </Flex>
        </Flex>

        {(post.category || (post.tags && post.tags.length > 0)) && (
          <Flex align="center" gap="4" my="4" wrap="wrap">
            {post.category && (
              <Badge color="gray" size="2">{post.category.name}</Badge>
            )}
            {post.tags && post.tags.length > 0 && (
              <Flex align="center" gap="2" wrap="wrap">
                {post.tags.map(({ tag }) => (
                  <Badge key={tag?.id} color="red" variant="soft">
                    {tag?.name}
                  </Badge>
                ))}
              </Flex>
            )}
          </Flex>
        )}
        
        <Separator size="4" my="3" />

        {/* O conteúdo do post é renderizado aqui. Cuidado com XSS se o conteúdo não for sanitizado. */}
        <Box className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

      </Flex>
    </Container>
  );
}
