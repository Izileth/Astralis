import {  useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Flex, TextField, Text, Callout, TextArea } from '@radix-ui/themes';
import type { Post } from '../../types';

// Schema de validação com Zod
const postSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres.').max(200, 'O título deve ter no máximo 200 caracteres.'),
  content: z.string().min(10, 'O conteúdo deve ter pelo menos 10 caracteres.'),
  description: z.string().max(500, 'A descrição deve ter no máximo 500 caracteres.').optional(),
  imageUrl: z.string().url('URL da imagem inválida.').optional().or(z.literal('')),
  categoryName: z.string().optional(), // Simplificado por enquanto
  tagNames: z.array(z.string()).optional(), // Simplificado por enquanto
});

export type PostFormData = z.infer<typeof postSchema>;

interface PostFormProps {
  onSubmit: (data: PostFormData) => Promise<void>;
  initialData?: Post;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

export function PostForm({ 
  onSubmit, 
  initialData, 
  isSubmitting = false, 
  submitButtonText = 'Salvar' 
}: PostFormProps) {
  const { 
    control, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      description: '',
      imageUrl: '',
      categoryName: '',
      tagNames: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        content: initialData.content,
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || '',
        categoryName: initialData.category?.name || '',
        tagNames: initialData.tags?.map(t => t.tag?.name) || [],
      });
    }
  }, [initialData, reset]);

  const anyError = Object.values(errors).length > 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap="4">
        {anyError && (
          <Callout.Root color="red" role="alert">
            <Callout.Icon>!</Callout.Icon>
            <Callout.Text>
              Por favor, corrija os erros no formulário.
            </Callout.Text>
          </Callout.Root>
        )}

        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <label>
              <Text as="div" size="2" weight="bold" mb="1">Título</Text>
              <TextField.Root {...field} placeholder="Título do seu post" />
              {errors.title && <Text size="1" color="red">{errors.title.message}</Text>}
            </label>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <label>
              <Text as="div" size="2" weight="bold" mb="1">Descrição (Opcional)</Text>
              <TextArea {...field} placeholder="Uma breve descrição do seu post" />
              {errors.description && <Text size="1" color="red">{errors.description.message}</Text>}
            </label>
          )}
        />

        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <label>
              <Text as="div" size="2" weight="bold" mb="1">Conteúdo</Text>
              <TextArea {...field} placeholder="Escreva seu post aqui..." rows={10} />
              {errors.content && <Text size="1" color="red">{errors.content.message}</Text>}
            </label>
          )}
        />

        <Controller
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <label>
              <Text as="div" size="2" weight="bold" mb="1">URL da Imagem (Opcional)</Text>
              <TextField.Root {...field} type="url" placeholder="https://exemplo.com/imagem.png" />
              {errors.imageUrl && <Text size="1" color="red">{errors.imageUrl.message}</Text>}
            </label>
          )}
        />

        {/* TODO: Implementar inputs para Categoria e Tags */}

        <Button type="submit" size="3" loading={isSubmitting} disabled={isSubmitting}>
          {submitButtonText}
        </Button>
      </Flex>
    </form>
  );
}
