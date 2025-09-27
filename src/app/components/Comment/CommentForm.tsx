import { useState, useEffect } from 'react';
import { TextArea, Button, Flex } from '@radix-ui/themes';
import type { CreateComment, UpdateComment } from '../../types';

interface CommentFormProps {
  onSubmit: (data: Partial<CreateComment | UpdateComment>) => Promise<any>;
  initialData?: { content: string };
  isSubmitting?: boolean;
  submitButtonText?: string;
  onCancel?: () => void;
}

export function CommentForm({
  onSubmit,
  initialData,
  isSubmitting = false,
  submitButtonText = 'Comentar',
  onCancel,
}: CommentFormProps) {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (initialData) {
      setContent(initialData.content);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await onSubmit({ content });
    if (!initialData) {
      setContent(''); // Limpa o campo apenas para novos comentários
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" gap="3">
        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreva seu comentário..."
          required
          rows={3}
        />
        <Flex justify="end" gap="3">
          {onCancel && (
            <Button type="button" variant="soft" color="gray" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? 'Enviando...' : submitButtonText}
          </Button>
        </Flex>
      </Flex>
    </form>
  );
}