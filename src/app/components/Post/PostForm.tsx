import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Flex, Text, Callout, TextArea, Container, Separator,  Box, Avatar } from '@radix-ui/themes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Post } from '../../types';
import { PostFileUpload } from '../Common/PostFileUpload';
import useAuthStore from '../../store/auth';

// Schema de validação com Zod
const postSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres.').max(200, 'O título deve ter no máximo 200 caracteres.'),
  content: z.string().min(10, 'O conteúdo deve ter pelo menos 10 caracteres.'),
  description: z.string().max(500, 'A descrição deve ter no máximo 500 caracteres.').optional(),
  imageUrl: z.string().url('URL da imagem inválida.').optional().or(z.literal('')),
  videoUrl: z.string().url('URL do vídeo inválida.').optional().or(z.literal('')),
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
  const { user } = useAuthStore();
  const { 
    control, 
    handleSubmit, 
    reset, 
    setValue,
    watch,
    formState: { errors } 
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      description: '',
      imageUrl: '',
      videoUrl: '',
      categoryName: '',
      tagNames: [],
    },
  });

  const watchedImageUrl = watch('imageUrl');

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        content: initialData.content,
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || '',
        videoUrl: initialData.videoUrl || '',
        categoryName: initialData.category?.name || '',
        tagNames: initialData.tags?.map(t => t.tag?.name) || [],
      });
    }
  }, [initialData, reset]);

  const anyError = Object.values(errors).length > 0;
  const author = initialData?.author || user;
  const displayDate = initialData?.createdAt ? new Date(initialData.createdAt) : new Date();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container size="3" py="8">
        <Flex direction="column" gap="5">
          {anyError && (
            <Callout.Root color="red" role="alert" mb="4">
              <Callout.Icon>!</Callout.Icon>
              <Callout.Text>Por favor, corrija os erros no formulário.</Callout.Text>
            </Callout.Root>
          )}

          <PostFileUpload
            onUploadComplete={(url) => setValue('imageUrl', url, { shouldValidate: true })}
          />
          {watchedImageUrl && !errors.imageUrl && (
             <img
                src={watchedImageUrl}
                alt="Banner Preview"
                style={{
                  display: 'block',
                  objectFit: 'cover',
                  width: '100%',
                  maxHeight: '400px',
                  borderRadius: 'var(--radius-3)',
                  marginTop: '1rem'
                }}
              />
          )}
          {errors.imageUrl && <Text size="1" color="red">{errors.imageUrl.message}</Text>}

          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                placeholder="Título do Post"
                className="wysiwyg-title"
                size="3"
                style={{
                  fontSize: 'var(--font-size-8)',
                  fontWeight: 'bold',
                  lineHeight: '1.2',
                  border: 'none', 
                  boxShadow: 'none',
                  padding: 0,
                  resize: 'none',
                  height: 'auto'
                }}
              />
            )}
          />
          {errors.title && <Text size="1" color="red">{errors.title.message}</Text>}

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                placeholder="Descrição do post..."
                className="wysiwyg-description"
                size="2"
                style={{
                  fontSize: 'var(--font-size-4)',
                  color: 'var(--gray-11)',
                  border: 'none', 
                  boxShadow: 'none',
                  padding: 0,
                  resize: 'none',
                  height: 'auto'
                }}
              />
            )}
          />
          {errors.description && <Text size="1" color="red">{errors.description.message}</Text>}

          <Separator size="4" my="3" />

          <Flex align="center" gap="3">
            <Avatar
              size="3"
              src={author?.avatarUrl || undefined}
              fallback={author?.name?.[0] || 'A'}
              radius="full"
            />
            <Box>
              <Text weight="bold">{author?.name || 'Autor Desconhecido'}</Text>
              <Text color="gray" as="p">
                Publicado em {format(displayDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </Text>
            </Box>
          </Flex>
          
          <Separator size="4" my="3" />

          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                placeholder="Comece a escrever sua história..."
                className="wysiwyg-content"
                rows={15}
                size="3"
                style={{
                  border: 'none', 
                  boxShadow: 'none',
                  padding: 0,
                  resize: 'vertical'
                }}
              />
            )}
          />
          {errors.content && <Text size="1" color="red">{errors.content.message}</Text>}
          
          {/* TODO: Video and other media uploads */}

          <Button color='red' type="submit" size="3" loading={isSubmitting} disabled={isSubmitting} mt="5">
            {submitButtonText}
          </Button>
        </Flex>
      </Container>
    </form>
  );
}
