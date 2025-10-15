import { Button } from '../ui/button';
import { Heart } from 'lucide-react';
import { useCommentLikes } from '../../hooks/useLikes';
import { cn } from '@/app/lib/utils';

interface CommentLikeButtonProps {
  commentId: string;
  compact?: boolean;
}

export function CommentLikeButton({ 
  commentId, 
  compact = false 
}: CommentLikeButtonProps) {
  const { isLiked, likeCount, toggle, loading } = useCommentLikes(commentId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  };

  if (compact) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={loading}
        className={cn(
          "h-7 px-2 gap-1 text-xs transition-all",
          isLiked 
            ? "text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600" 
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        )}
      >
        <Heart 
          className={cn(
            "h-3 w-3 transition-all",
            isLiked && "fill-current"
          )} 
        />
        {likeCount}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={loading}
        className={cn(
          "h-8 w-8 p-0 hover:bg-transparent transition-all",
          isLiked 
            ? "text-red-500 hover:text-red-600" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Heart 
          className={cn(
            "h-4 w-4 transition-all",
            isLiked && "fill-current"
          )} 
        />
      </Button>
      
      <span className={cn(
        "text-sm min-w-[20px] text-center transition-colors",
        isLiked ? "text-red-500 font-medium" : "text-muted-foreground"
      )}>
        {likeCount}
      </span>
    </div>
  );
}