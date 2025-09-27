import { useState } from 'react';
import { Avatar, Box, Flex, Text, IconButton, DropdownMenu } from '@radix-ui/themes';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DotsHorizontalIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
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

  const isOwner = user?.id === comment.authorId;

  const handleUpdate = async (data: UpdateComment) => {
    await onUpdate(comment.id, data);
    setIsEditing(false);
  };

  return (
    <Box py="3">
      <Flex gap="3">
        <Avatar
          size="2"
          src={comment.author?.avatarUrl || undefined}
          fallback={comment.author?.name?.[0] || 'U'}
          radius="full"
        />
        <Box style={{ flexGrow: 1 }}>
          <Flex justify="between">
            <Flex align="center" gap="2">
              <Text weight="bold" size="2">{comment.author?.name || 'Usuário'}</Text>
              <Text size="1" color="gray">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ptBR })}
              </Text>
            </Flex>
            {isOwner && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <IconButton variant="ghost" size="1">
                    <DotsHorizontalIcon />
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item onClick={() => setIsEditing(true)}>
                    <Pencil1Icon /> Editar
                  </DropdownMenu.Item>
                  <DropdownMenu.Item color="red" onClick={() => onDelete(comment.id)}>
                    <TrashIcon /> Deletar
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            )}
          </Flex>

          {isEditing ? (
            <Box mt="2">
              <CommentForm
                onSubmit={handleUpdate}
                initialData={comment}
                submitButtonText="Salvar"
                onCancel={() => setIsEditing(false)}
              />
            </Box>
          ) : (
            <Text as="p" size="2" mt="1">
              {comment.content}
            </Text>
          )}

          <Flex mt="2">
            <CommentLikeButton commentId={comment.id} />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}