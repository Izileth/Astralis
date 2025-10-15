import { useNavigate } from 'react-router-dom';
import { Container } from '../components/Common/Container';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useCreatePost } from '../hooks/usePost';
import { PostForm } from '../components/Post/PostForm';
import type { PostFormData } from '../components/Post/PostForm';
import { useToast } from '../hooks/useToast';

export function CreatePostPage() {
  const navigate = useNavigate();
  const { createPost, loading } = useCreatePost();
  const { toast } = useToast();

  const handleSubmit = async (data: PostFormData) => {
    try {
      const newPost = await createPost(data);
      if (newPost) {
        toast(
          {
            title: "Publicação criada",
            description: "Sua publicação foi criada com sucesso.",
          }
        );
        navigate(`/post/${newPost.slug}`);
      }
    } catch (error) {
      toast(
        {
          title: "Erro ao criar",
          description: "Ocorreu um erro ao criar a publicação.",
        }
      );
    }
  };

  return (
    <Container className="py-8 max-w-4xl">
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-light">Nova publicação</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <PostForm 
            onSubmit={handleSubmit} 
            isSubmitting={loading} 
            submitButtonText="Publicar"
          />
        </CardContent>
      </Card>
    </Container>
  );
}
