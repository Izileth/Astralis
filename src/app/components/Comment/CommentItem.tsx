import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '..//ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { MoreHorizontal, Edit, Trash2} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import useAuthStore from '../../store/auth';
import type { Comment, UpdateComment } from '../../types';
import { CommentLikeButton } from './CommentLikeButton';
import { CommentForm } from './CommentForm';

interface CommentItemProps {
  comment: Comment;
  onUpdate: (id: string, data: UpdateComment) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
}

export function CommentItem({ comment, onUpdate, onDelete }: CommentItemProps) {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.id === comment.authorId;
  const isEdited = comment.createdAt !== comment.createdAt;

  const handleUpdate = async (data: UpdateComment) => {
    await onUpdate(comment.id, data);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este comentário?')) {
      setIsDeleting(true);
      try {
        await onDelete(comment.id);
      } catch (error) {
        setIsDeleting(false);
      }
    }
  };

  if (isDeleting) {
    return (
      <div className="flex gap-3 py-4 border-b border-border/50 last:border-b-0 opacity-50">
        <Avatar className="h-8 w-8 md:h-10 md:w-10">
          <AvatarFallback className="text-xs">
            <Trash2 className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 flex items-center">
          <span className="text-sm text-muted-foreground">
            Excluindo comentário...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 py-4 border-b border-border/50 last:border-b-0 group">
      <Avatar className="h-8 w-8 md:h-10 md:w-10">
        <AvatarImage src={comment.author?.avatarUrl || undefined} />
        <AvatarFallback className="text-xs">
          {comment.author?.name?.[0]?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm text-foreground">
              {comment.author?.name || 'Usuário'}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { 
                addSuffix: true, 
                locale: ptBR 
              })}
            </span>
            {isEdited && (
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                editado
              </Badge>
            )}
          </div>

          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isEditing ? (
          <div className="mt-3">
            <CommentForm
              onSubmit={handleUpdate}
              initialData={comment}
              submitButtonText="Salvar"
              onCancel={() => setIsEditing(false)}
              maxLength={500}
            />
          </div>
        ) : (
          <p className="text-sm text-foreground mt-1 leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>
        )}

        {!isEditing && (
          <div className="mt-2">
            <CommentLikeButton commentId={comment.id} />
          </div>
        )}
      </div>
    </div>
  );
}