import { useParams, Link } from 'react-router-dom';
import { usePost } from '../hooks/usePost';
import { Box, Flex, Heading, Text, Avatar, Container, Separator, Badge } from '@radix-ui/themes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChatBubbleIcon, ClockIcon, PersonIcon } from '@radix-ui/react-icons';
import { Carousel } from '../components/Common/Carousel';
import { PostPageSkeleton } from '../components/Common/Skeleton';
import { LikeButton } from '../components/Common/LikeButton';
import { CommentSection } from '../components/Comment/CommentSection';

export function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = usePost(slug, true);

  console.log('Post -', post)

  if (loading) {
    return <PostPageSkeleton />;
  }

  if (error) {
    return (
      <Container size="3" className="py-16">
        <Box className="text-center">
          <Heading size="6" className="font-serif text-red-600 mb-4">
            Erro ao Carregar Notícia
          </Heading>
          <Text size="3" className="font-sans text-gray-600">
            {error}
          </Text>
          <Box className="mt-6">
            <Link to="/" className="text-red-600 hover:text-red-700 font-sans font-medium">
              ← Voltar ao início
            </Link>
          </Box>
        </Box>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container size="3" className="py-16">
        <Box className="text-center">
          <Heading size="6" className="font-serif text-black mb-4">
            Notícia Não Encontrada
          </Heading>
          <Text size="3" className="font-sans text-gray-600 mb-6">
            A notícia que você procura não existe ou foi removida.
          </Text>
          <Link to="/" className="text-red-600 hover:text-red-700 font-sans font-medium">
            ← Voltar ao início
          </Link>
        </Box>
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
    <Container size="3" className="py-8">
      <article className="max-w-4xl mx-auto">
        
        {/* Categoria e Breadcrumb */}
        {post.category && (
          <Box className="mb-4">
            <Flex align="center" gap="2" className="text-sm">
              <Link to="/" className="text-gray-500 hover:text-red-600 font-sans">
                Início
              </Link>
              <Text className="text-gray-300">•</Text>
              <Badge color='tomato' variant='solid' className="bg-red-600 text-white font-sans font-bold text-xs px-3 py-1 uppercase tracking-wider">
                {post.category.name}
              </Badge>
            </Flex>
          </Box>
        )}

        {/* Título Principal */}
        <Heading 
          as="h1" 
          size="8" 
          className="font-serif text-black leading-tight mb-6"
        >
          {post.title}
        </Heading>

        {/* Subtítulo/Descrição */}
        {post.description && (
          <Text 
            size="4" 
            className="font-sans text-gray-700 leading-relaxed mb-8 border-l-4 border-red-600 pl-4"
          >
            {post.description}
          </Text>
        )}

        {/* Metadados do Autor */}
        <Box className="mb-8 p-6 mt-2 bg-transparent border-b  border-gray-200">
          <Flex align="center" justify="between" wrap="wrap" gap="4">
            <Link to={`/author/${post?.author?.slug}`} className="hover:no-underline">
              <Flex align="center" gap="4" className="group">
                <Avatar
                  size="4"
                  src={post.author?.avatarUrl || undefined}
                  fallback={post.author?.name?.[0] || 'A'}
                  radius="full"
                  className="border-2 border-gray-200 group-hover:border-red-300 transition-colors duration-200"
                />
                <Box>
                  <Flex align="center" gap="2" className="mb-1">
                    <PersonIcon width="14" height="14" className="text-gray-400" />
                    <Text 
                      weight="bold" 
                      size="3"
                      className="font-sans text-black group-hover:text-red-700 transition-colors duration-200"
                    >
                      {post.author?.name || 'Autor Desconhecido'}
                    </Text>
                  </Flex>
                  <Flex align="center" gap="2">
                    <ClockIcon width="14" height="14" className="text-gray-400" />
                    <Text size="2" className="font-sans text-gray-600">
                      Publicado em {format(new Date(post.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            </Link>

            {/* Estatísticas */}
            <Flex align="center" gap="6">
              <LikeButton postId={post.id} />
              <Flex align="center" gap="2" className="text-gray-500">
                <ChatBubbleIcon width="16" height="16" />
                <Text size="2" className="font-sans font-medium">
                  {post.comments?.length || 0}
                </Text>
                <Text size="1" className="font-sans text-gray-400">
                  comentários
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Box>

        {/* Mídia Principal */}
        {mediaItems.length > 0 && (
          <Box className="mb-8">
            <Box className="w-full h-96 overflow-hidden border border-gray-200 shadow-sm">
              <Carousel items={mediaItems} />
            </Box>
          </Box>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <Box className="mb-8 mt-4">
            <Text 
              size="2" 
              weight="bold" 
              className="block mb-3 text-gray-500 font-sans uppercase tracking-wider text-xs"
            >
              Assuntos Relacionados
            </Text>
            <Flex wrap="wrap" mt={'2'} gap="2">
              {post.tags.map(({ tag }) => (
                <Badge 
                  color='tomato'
              
                  key={tag?.id} 
                  className="bg-gray-100 text-gray-700 font-sans text-xs px-3 py-1 border border-gray-200 hover:border-red-300 hover:text-red-700 transition-colors duration-200 cursor-pointer"
                >
                  #{tag?.name}
                </Badge>
              ))}
            </Flex>
          </Box>
        )}
        
        <Separator size="4" className="my-8" />

        {/* Conteúdo Principal */}
        <Box 
          className="prose prose-lg max-w-none font-sans leading-relaxed text-gray-800 mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }} 
          style={{
            fontSize: '18px',
            lineHeight: '1.7',
          }}
        />

        {/* Divisor antes dos comentários */}
        <Box className="border-t-4 border-red-600 pt-8 mt-12">
          <Text 
            size="4" 
            weight="bold" 
            className="font-serif text-black mb-6"
          >
            Comentários
          </Text>
        </Box>

        {/* Seção de Comentários */}
        <CommentSection postId={post.id} />
      </article>
    </Container>
  );
}