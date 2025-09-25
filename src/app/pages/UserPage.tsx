import { useParams } from 'react-router-dom';
import { useUserProfile } from '../hooks/user';
import { useAuthorPosts } from '../hooks/post';
import { PostList } from '../components/Post/PostList';
import {
  Flex,
  Container,
  Heading,
  Text,
  Avatar,
  Spinner,
  Box,
  Badge,
  Separator
} from '@radix-ui/themes';

export function UserPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isLoading: isLoadingUser, error: userError } = useUserProfile(slug);
  const {  loading: isLoadingPosts, error: postsError } = useAuthorPosts(user?.id, { published: true }, !!user?.id);

  if (isLoadingUser) {
    return (
      <Flex align="center" justify="center" style={{ height: '80vh' }}>
        <Spinner size="3" />
      </Flex>
    );
  }

  if (userError || !user) {
    return (
      <Container py="8">
        <Heading color="red">Usuário não encontrado</Heading>
        <Text>{userError || 'O perfil que você procura não existe ou foi movido.'}</Text>
      </Container>
    );
  }

  return (
    <Container size="4" py="8">
      <Flex direction="column" gap="6">
        {/* Perfil do Usuário */}
        <Flex direction="column" align="center" gap="3">
          <Avatar
            size="9"
            radius="full"
            fallback={user.name?.[0] || 'U'}
            src={user.avatarUrl ?? undefined}
            style={{ border: '4px solid var(--gray-a5)' }}
          />
          <Heading size="7">{user.name}</Heading>
          <Text color="gray">@{user.slug}</Text>
          {user.verified && <Badge color="blue">Verificado</Badge>}
          {user.bio && <Text align="center" color="gray">{user.bio}</Text>}
        </Flex>

        <Separator size="4" />

        {/* Lista de Posts */}
        <Box>
          <Heading mb="4">Publicações de {user.name}</Heading>
          {isLoadingPosts && <Spinner />}
          {postsError && <Text color="red">Erro ao carregar posts: {postsError}</Text>}
          {!isLoadingPosts && !postsError && (
            <PostList />
          )}
        </Box>
      </Flex>
    </Container>
  );
}
