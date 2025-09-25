import { useParams } from 'react-router-dom';
import { usePost } from '../hooks/post';
import { Box, Flex, Heading, Text, Avatar, Spinner, Container, Separator } from '@radix-ui/themes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  // O segundo argumento `true` indica que a busca deve ser pelo slug
  const { post, loading, error } = usePost(slug, true);

  if (loading) {
    return (
      <Flex align="center" justify="center" style={{ height: '80vh' }}>
        <Spinner size="3" />
      </Flex>
    );
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

  return (
    <Container size="3" py="8">
      <Flex direction="column" gap="5">
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            style={{
              display: 'block',
              objectFit: 'cover',
              width: '100%',
              maxHeight: '400px',
              borderRadius: 'var(--radius-3)',
            }}
          />
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

        <Flex align="center" gap="3">
          <Avatar
            size="3"
            src={post.author?.avatarUrl || undefined}
            fallback={post.author?.name?.[0] || 'A'}
            radius="full"
          />
          <Box>
            <Text weight="bold">{post.author?.name || 'Autor Desconhecido'}</Text>
            <Text color="gray" as="p">
              Publicado em {format(new Date(post.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </Text>
          </Box>
        </Flex>
        
        <Separator size="4" my="3" />

        {/* O conteúdo do post é renderizado aqui. Cuidado com XSS se o conteúdo não for sanitizado. */}
        <Box className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

      </Flex>
    </Container>
  );
}
