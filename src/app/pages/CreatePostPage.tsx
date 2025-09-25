import { useNavigate } from 'react-router-dom';
import { Container, Heading, Card } from '@radix-ui/themes';
import { useCreatePost } from '../hooks/post';
import { PostForm } from '../components/Post/PostForm';
import type { PostFormData } from '../components/Post/PostForm';

export function CreatePostPage() {
  const navigate = useNavigate();
  const { createPost, loading, error } = useCreatePost();

  const handleSubmit = async (data: PostFormData) => {
    const newPost = await createPost(data);
    if (newPost) {
      // Redireciona para a página do novo post ou para o perfil
      navigate(`/post/${newPost.slug}`);
    }
  };

  return (
    <Container size="3" py="8">
      <Card>
        <Heading mb="5">Criar Nova Publicação</Heading>
        {error && <p style={{ color: 'red' }}>Erro ao criar post: {error}</p>}
        <PostForm 
          onSubmit={handleSubmit} 
          isSubmitting={loading} 
          submitButtonText="Publicar"
        />
      </Card>
    </Container>
  );
}
