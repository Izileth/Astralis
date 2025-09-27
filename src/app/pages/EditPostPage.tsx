import { useParams, useNavigate } from 'react-router-dom';
import { Container, Heading, Card, Flex, Spinner, Text } from '@radix-ui/themes';
import { usePost, useUpdatePost } from '../hooks/post';
import { PostForm } from '../components/Post/PostForm';
import type { PostFormData } from '../components/Post/PostForm';

export function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Busca o post pelo ID
  const { post, loading: isLoadingPost, error: postError } = usePost(id);
  // Hook para atualizar o post
  const { updatePost, loading: isUpdating, error: updateError } = useUpdatePost();

  const handleSubmit = async (data: PostFormData) => {
    if (!id) return;
    const updatedPost = await updatePost(id, data);
    if (updatedPost) {
      // Redireciona para a página do post atualizado
      navigate(`/post/${updatedPost.slug}`);
    }
  };

  if (isLoadingPost) {
    return <Flex justify="center" py="8"><Spinner size="3" /></Flex>;
  }

  if (postError || !post) {
    return <Container py="8"><Text color="red">Post não encontrado.</Text></Container>;
  }

  return (
    <Container size="3" py="8">
      <Card>
        <Heading mb="5">Editar Publicação</Heading>
        {updateError && <p style={{ color: 'red' }}>Erro ao atualizar post: {updateError}</p>}
        <PostForm 
          onSubmit={handleSubmit} 
          initialData={post} 
          isSubmitting={isUpdating} 
          submitButtonText="Salvar Alterações"
          postId={id}
        />
      </Card>
    </Container>
  );
}
