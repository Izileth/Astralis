import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface CommentFormProps {
  onSubmit: (data: { content: string }) => Promise<any>;
  initialData?: { content: string };
  isSubmitting?: boolean;
  submitButtonText?: string;
  onCancel?: () => void;
  maxLength?: number;
  showLabel?: boolean;
}

export function CommentForm({
  onSubmit,
  initialData,
  isSubmitting = false,
  submitButtonText = 'Comentar',
  onCancel,
  maxLength = 1000,
  showLabel = false,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setContent(initialData.content);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('O comentário não pode estar vazio');
      return;
    }
    
    if (content.length > maxLength) {
      setError(`O comentário deve ter no máximo ${maxLength} caracteres`);
      return;
    }
    
    setError('');
    await onSubmit({ content });
    
    // Limpa o campo apenas para novos comentários (não para edição)
    if (!initialData) {
      setContent('');
    }
  };

  const handleChange = (value: string) => {
    setContent(value);
    // Limpa erro quando o usuário começa a digitar
    if (error && value.trim()) {
      setError('');
    }
  };

  const isNearLimit = content.length > maxLength * 0.8;
  const isOverLimit = content.length > maxLength;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        {showLabel && (
          <Label htmlFor="comment-content" className="text-sm font-medium">
            Seu comentário
          </Label>
        )}
        
        <div className="space-y-2">
          <Textarea
            id="comment-content"
            value={content}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Compartilhe seus pensamentos..."
            required
            rows={3}
            className={cn(
              "resize-none border-border/50 focus:border-border min-h-[80px] transition-colors",
              error && "border-destructive focus:border-destructive",
              isOverLimit && "border-destructive"
            )}
          />
          
          <div className="flex justify-between items-center">
            <div className="flex-1">
              {error && (
                <div className="flex items-center gap-1 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
            
            {maxLength && (
              <div className={cn(
                "text-xs transition-colors",
                isOverLimit 
                  ? "text-destructive font-medium" 
                  : isNearLimit 
                    ? "text-amber-600" 
                    : "text-muted-foreground"
              )}>
                {content.length}/{maxLength}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4"
            >
              Cancelar
            </Button>
          )}
          
          <Button 
            type="submit" 
            disabled={isSubmitting || !content.trim() || isOverLimit}
            className="px-4 bg-zinc-950 text-zinc-50 hover:bg-zinc-50 hover:text-zinc-950"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}