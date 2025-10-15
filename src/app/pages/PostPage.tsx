import { useParams, Link } from 'react-router-dom';
import { usePost } from '../hooks/usePost';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageCircle, Clock, User, ArrowLeft, Tag } from 'lucide-react';
import { Carousel } from '../components/Common/Carousel';
import { PostPageSkeleton } from '../components/Common/Skeleton';
import { LikeButton } from '../components/Common/LikeButton';
import { CommentSection } from '../components/Comment/CommentSection';
import FormattedContent from '../components/Common/FormattedContent';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';


export function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = usePost(slug, true);

  if (loading) {
    return <PostPageSkeleton />;
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-16 px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-serif text-red-600">
            Erro ao Carregar Notícia
          </h1>
          <p className="text-muted-foreground">
            {error}
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container max-w-4xl mx-auto py-16 px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-serif">
            Notícia Não Encontrada
          </h1>
          <p className="text-muted-foreground">
            A notícia que você procura não existe ou foi removida.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const mediaItems = [];
  if (post.imageUrl) {
    mediaItems.push({ type: 'image' as const, src: post.imageUrl });
  }
  if (post.videoUrl) {
    mediaItems.push({ type: 'video' as const, src: post.videoUrl });
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <article>
        
        {/* Breadcrumb e Categoria */}
        {post.category && (
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Link 
                to="/" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Início
              </Link>
              <span className="text-muted-foreground/30">•</span>
              <Badge 
                variant="default" 
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-[10px] uppercase tracking-wider"
              >
                {post.category.name}
              </Badge>
            </div>
          </div>
        )}

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-6 text-balance">
          {post.title}
        </h1>

        {/* Descrição */}
        {post.description && (
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 pl-4 border-l-2 border-red-600">
            {post.description}
          </p>
        )}

        {/* Meta Informações do Autor */}
        <div className="mb-8 pb-6 border-b">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link 
              to={`/author/${post?.author?.slug}`}
              className="group"
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 border-2 border-transparent group-hover:border-red-200 transition-colors">
                  <AvatarImage src={post.author?.avatarUrl || undefined} />
                  <AvatarFallback className="bg-muted">
                    {post.author?.name?.[0] || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-semibold group-hover:text-red-700 transition-colors">
                      {post.author?.name || 'Autor Desconhecido'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <time>
                      {format(new Date(post.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </time>
                  </div>
                </div>
              </div>
            </Link>

            {/* Estatísticas */}
            <div className="flex items-center gap-5">
              <LikeButton postId={post.id} />
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {post.comments?.length || 0}
                </span>
                <span className="text-xs">
                  comentários
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mídia */}
        {mediaItems.length > 0 && (
          <div className="mb-10">
            <div className="relative w-full aspect-video overflow-hidden rounded-lg border bg-muted">
              <Carousel items={mediaItems} />
            </div>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Assuntos
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(({ tag }) => (
                <Badge 
                  key={tag?.id}
                  variant="outline"
                  className="text-xs font-normal hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors cursor-pointer"
                >
                  #{tag?.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <Separator className="my-10" />

        {/* Conteúdo */}
        <FormattedContent content={post.content} className="mb-12" />

        {/* Divisor antes dos comentários */}
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-sm text-muted-foreground font-medium">
              Comentários
            </span>
          </div>
        </div>

        {/* Comentários */}
        <CommentSection postId={post.id} />
      </article>
    </div>
  );
}