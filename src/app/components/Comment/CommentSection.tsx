import { Box, Heading, Text, Separator, Flex } from '@radix-ui/themes';
import { useComments } from '../../hooks/useComments';
import useAuthStore from '../../store/auth';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuthStore();
  const { 
    comments, 
    loading, 
    error, 
    createComment, 
    updateComment, 
    deleteComment 
  } = useComments(postId);

  return (
    <Box mt="6">
      <Heading mb="4">Comentários - {comments.length}</Heading>
      
      {user ? (
        <Box mb="5">
          <CommentForm onSubmit={createComment} />
        </Box>
      ) : (
        <Text size="2" color="gray">Faça login para deixar um comentário.</Text>
      )}

      <Separator size="4" my="5" />

      {loading && comments.length === 0 && <Text>Carregando comentários...</Text>}
      {error && <Text color="red">{error}</Text>}

      <Flex direction="column" gap="4">
        {comments.map((comment) => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            onUpdate={updateComment} 
            onDelete={deleteComment} 
          />
        ))}
      </Flex>
    </Box>
  );
}