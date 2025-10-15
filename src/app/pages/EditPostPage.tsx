import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '../components/Common/Container';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { usePost, useUpdatePost } from '../hooks/usePost';
import { PostForm } from '../components/Post/PostForm';
import type { PostFormData } from '../components/Post/PostForm';
import { EditPostPageSkeleton } from '../components/Common/Skeleton';
import { useToast } from '../hooks/useToast';

export function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { post, loading: isLoadingPost, error: postError } = usePost(id);
  const { updatePost, loading: isUpdating } = useUpdatePost();

  const handleSubmit = async (data: PostFormData) => {
    if (!id) return;
    
    try {
      const updatedPost = await updatePost(id, data);
      if (updatedPost) {
        toast({
          title: "Publicação atualizada",
          description: "Suas alterações foram salvas com sucesso.",
        });
        navigate(`/post/${updatedPost.slug}`);
      }
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao salvar as alterações.",
        
      });
    }
  };

  if (isLoadingPost) {
    return <EditPostPageSkeleton />;
  }

  if (postError || !post) {
    return (
      <Container className="py-8">
        <div className="text-center text-destructive">
          Post não encontrado.
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 max-w-4xl">
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-light">Editar publicação</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <PostForm 
            onSubmit={handleSubmit} 
            initialData={post} 
            isSubmitting={isUpdating} 
            submitButtonText="Salvar alterações"
            postId={id}
          />
        </CardContent>
      </Card>
    </Container>
  );
}