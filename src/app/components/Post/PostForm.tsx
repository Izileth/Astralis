import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertTriangle } from 'lucide-react';

import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Alert, AlertDescription } from '../ui/alert';

import type { Post } from '../../types';
import { PostFileUpload } from '../Common/PostFileUpload';
import { TagInput } from '../Common/TagInput';
import { TiptapEditor } from '../Common/TiptapEditor';
import useAuthStore from '../../store/auth';
import { useCategories, useTags } from '../../hooks/usePost';

// Schema de validação com Zod
const postSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres.').max(200, 'O título deve ter no máximo 200 caracteres.'),
  content: z.string().min(10, 'O conteúdo deve ter pelo menos 10 caracteres.'),
  description: z.string().max(500, 'A descrição deve ter no máximo 500 caracteres.').optional(),
  imageUrl: z.string().url('URL da imagem inválida.').optional().or(z.literal('')),
  videoUrl: z.string().url('URL do vídeo inválida.').optional().or(z.literal('')),
  categoryName: z.string().optional(),
  tagNames: z.array(z.string()).optional(),
});

export type PostFormData = z.infer<typeof postSchema>;

interface PostFormProps {
  onSubmit: (data: PostFormData) => Promise<void>;
  initialData?: Post;
  isSubmitting?: boolean;
  submitButtonText?: string;
  postId?: string;
}

export function PostForm({ 
  onSubmit, 
  initialData,
  isSubmitting = false, 
  submitButtonText = 'Salvar',
  postId
}: PostFormProps) {
  const { user } = useAuthStore();
  const { categories } = useCategories();
  const { tags } = useTags();
  
  const form = useForm<PostFormData>({
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

  const watchedImageUrl = form.watch('imageUrl');

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        content: initialData.content,
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || '',
        videoUrl: initialData.videoUrl || '',
        categoryName: initialData.category?.name || '',
        tagNames: initialData.tags?.map(t => t.tag?.name) || [],
      });
    }
  }, [initialData, form.reset]);

  const anyError = Object.keys(form.formState.errors).length > 0;
  const author = initialData?.author || user;
  const displayDate = initialData?.createdAt ? new Date(initialData.createdAt) : new Date();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="container mx-auto py-8 space-y-5">
        {anyError && (
          <Alert variant="destructive" role="alert">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Por favor, corrija os erros no formulário.</AlertDescription>
          </Alert>
        )}

        <PostFileUpload
          postId={postId}
          onUploadComplete={(url) => form.setValue('imageUrl', url, { shouldValidate: true })}
          onStandaloneUpload={(url) => form.setValue('imageUrl', url, { shouldValidate: true })}
        />
        {watchedImageUrl && !form.formState.errors.imageUrl && (
           <img
              src={watchedImageUrl}
              alt="Banner Preview"
              className="block object-cover w-full max-h-[400px] rounded-md mt-4"
            />
        )}
        {form.formState.errors.imageUrl && <p className="text-sm text-red-500">{form.formState.errors.imageUrl.message}</p>}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Título do Post"
                  className="text-4xl font-bold leading-tight border-none shadow-none p-0 resize-none h-auto focus-visible:ring-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Descrição do post..."
                  className="text-lg text-gray-500 border-none shadow-none p-0 resize-none h-auto focus-visible:ring-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="my-3" />

        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={author?.avatarUrl || undefined} />
            <AvatarFallback>{author?.name?.[0] || 'A'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold">{author?.name || 'Autor Desconhecido'}</p>
            <p className="text-sm text-gray-500">
              Publicado em {format(displayDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>
        
        <Separator className="my-3" />

        <FormField
          control={form.control}
          name="categoryName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <FormControl>
                <div>
                  <Input
                    {...field}
                    list="categories-list"
                    placeholder="Selecione ou crie uma categoria"
                  />
                  <datalist id="categories-list">
                    {Array.isArray(categories) && categories.map(cat => <option key={cat.id} value={cat.name} />)}
                  </datalist>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tagNames"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagInput
                  {...field}
                  value={field.value || []}
                  existingTags={Array.isArray(tags) ? tags.map(t => t.name) : []}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TiptapEditor {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button variant={"destructive"} type="submit" size="lg" disabled={isSubmitting} className="mt-5">
          {isSubmitting ? 'Salvando...' : submitButtonText}
        </Button>
      </form>
    </Form>
  );
}
