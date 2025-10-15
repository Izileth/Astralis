import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { MessageCircle, LogIn,  Filter } from 'lucide-react';
import { useComments } from '../../hooks/useComments';
import useAuthStore from '../../store/auth';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';

interface CommentSectionProps {
  postId: string;
}

type SortOption = 'newest' | 'oldest' | 'most-liked';

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

  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'most-liked':
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      default:
        return 0;
    }
  });

  const totalLikes = comments.reduce((sum, comment) => sum + (comment.likes?.length || 0), 0);

  return (
    <div className="mt-8 space-y-6">
      {/* Header com estatísticas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-muted-foreground" />
          <div>
            <h2 className="text-2xl font-light">Comentários</h2>
            <p className="text-sm text-muted-foreground">
              {comments.length} comentários • {totalLikes} curtidas
            </p>
          </div>
        </div>

        {comments.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm border-border rounded-md bg-background px-3 py-1 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="newest">Mais recentes</option>
              <option value="oldest">Mais antigos</option>
              <option value="most-liked">Mais curtidos</option>
            </select>
          </div>
        )}
      </div>

      {/* Formulário de comentário */}
      {user ? (
        <Card className="border-border/50">
          <CardContent className="p-6">
            <CommentForm onSubmit={createComment} />
          </CardContent>
        </Card>
      ) : (
        <Alert className="border-border/50 bg-muted/20">
          <LogIn className="h-4 w-4" />
          <AlertDescription>
            Faça login para deixar um comentário.
          </AlertDescription>
        </Alert>
      )}

      <Separator className="bg-border/50" />

      {/* Estados de loading e erro */}
      {loading && comments.length === 0 && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Lista de comentários */}
      {sortedComments.length > 0 ? (
        <div className="space-y-1">
          {sortedComments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              onUpdate={updateComment} 
              onDelete={deleteComment} 
            />
          ))}
        </div>
      ) : (
        !loading && (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}