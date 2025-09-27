import { HeartIcon } from '@radix-ui/react-icons';
import { Flex, Text, IconButton } from '@radix-ui/themes';
import { useCommentLikes } from '../../hooks/useLikes';

interface CommentLikeButtonProps {
  commentId: string;
}

export function CommentLikeButton({ commentId }: CommentLikeButtonProps) {
  const { isLiked, likeCount, toggle, loading, error } = useCommentLikes(commentId);

  return (
    <Flex align="center" gap="2">
      <IconButton 
        size="1"
        variant="ghost" 
        onClick={(e) => { 
          e.preventDefault(); 
          e.stopPropagation(); 
          toggle(); 
        }}
        disabled={loading}
        color={isLiked ? 'red' : 'gray'}
      >
        <HeartIcon fill={isLiked ? 'currentColor' : 'none'} />
      </IconButton>
      <Text size="1">{likeCount}</Text>
      {error && <Text size="1" color="red">{error}</Text>}
    </Flex>
  );
}