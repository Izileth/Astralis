import { Link, useNavigate } from 'react-router-dom';
import type { Post, User } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pencil, MessageCircle, Trash2, Clock, User as UserIcon, ArrowUpRight } from 'lucide-react';
import { Carousel } from '../Common/Carousel';
import { LikeButton } from '../Common/LikeButton';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface PostCardProps {
  post: Post;
  author?: User;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
  variant?: 'default' | 'compact';
}

export function PostCard({ 
  post, 
  author, 
  isOwner = false, 
  onDelete,
  variant = 'default'
}: PostCardProps) {
  const navigate = useNavigate();
  const displayAuthor = post.author || author;

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/posts/${post.id}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && window.confirm('Tem certeza que deseja excluir esta publicação?')) {
      onDelete(post.id);
    }
  };

  const mediaItems = [];
  if (post.imageUrl) {
    mediaItems.push({ type: 'image' as const, src: post.imageUrl });
  }
  if (post.videoUrl) {
    mediaItems.push({ type: 'video' as const, src: post.videoUrl });
  }

  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <Card className="group border-gray-100 hover:border-gray-300 bg-white hover:shadow-sm transition-all duration-300">
          <Link to={`/post/${post.slug}`} className="no-underline text-current">
            <CardContent className="p-5">
              <div className="flex gap-5">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-24 h-24 rounded-md bg-gray-50 overflow-hidden">
                  {post.imageUrl ? (
                    <img 
                      src={post.imageUrl} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <UserIcon className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-black transition-colors text-base">
                        {post.title}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                      {post.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-medium">{displayAuthor?.name}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(post.createdAt), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Card className="group border-gray-100 hover:border-gray-300 bg-white hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col">
        <Link to={`/post/${post.slug}`} className="no-underline text-current flex flex-col h-full">
          {/* Media Section */}
          <div className="relative aspect-[16/10] bg-gray-50 overflow-hidden flex-shrink-0">
            {mediaItems.length > 0 ? (
              <>
                <Carousel items={mediaItems} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-3">
                  <UserIcon className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-sm text-gray-400 font-medium">Sem imagem</p>
                </div>
              </div>
            )}

            {/* Category Badge */}
            {post.category && (
              <div className="absolute top-4 left-4">
                <Badge 
                  variant="secondary" 
                  className="font-medium text-xs backdrop-blur-md bg-white/90 border-0 shadow-sm px-3 py-1"
                >
                  {post.category.name}
                </Badge>
              </div>
            )}

            {/* Owner Actions */}
            {isOwner && (
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className="h-9 w-9 bg-white/90 backdrop-blur-md hover:bg-white shadow-sm border-0"
                      onClick={handleEditClick}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editar</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className="h-9 w-9 bg-white/90 backdrop-blur-md hover:bg-red-500 hover:text-white shadow-sm border-0"
                      onClick={handleDeleteClick}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Excluir</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col">
            <CardHeader className="pb-4 pt-5 px-5">
              <h3 className="font-bold  text-gray-900 leading-snug line-clamp-2 group-hover:text-black transition-colors duration-200 text-2xl">
                {post.title}
              </h3>
            </CardHeader>

            <CardContent className="pb-5 px-5 flex-1 flex flex-col">
              {/* Description */}
              {post.description && (
                <p className="text-gray-600 leading-relaxed line-clamp-3 mb-5 text-sm">
                  {post.description}
                </p>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {post.tags.slice(0, 3).map(({ tag }) => (
                    <Badge 
                      key={tag?.id}
                      variant="outline"
                      className="text-xs font-normal px-2.5 py-1 hover:bg-gray-50 transition-colors border-gray-200"
                    >
                      #{tag?.name}
                    </Badge>
                  ))}
                  {post.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2.5 py-1 border-gray-200">
                      +{post.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 mt-auto border-t border-gray-100">
                <Avatar className="h-10 w-10 border-2 border-gray-100">
                  <AvatarImage src={displayAuthor?.avatarUrl || undefined} />
                  <AvatarFallback className="text-sm bg-gray-100 text-gray-600 font-medium">
                    {displayAuthor?.name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {displayAuthor?.name || 'Autor Desconhecido'}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {formatDistanceToNow(new Date(post.createdAt), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-4 pb-5 px-5 border-t border-gray-100 bg-gray-50/50 mt-auto">
              <div className="flex items-center justify-between w-full">
                {/* Engagement Stats */}
                <div className="flex items-center gap-5 text-sm">
                  <LikeButton 
                    postId={post.id} 
                  />
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-default">
                        <MessageCircle className="w-4 h-4" />
                        <span className="font-semibold text-sm">
                          {post._count?.comments || 0}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Comentários</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Read More Indicator */}
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 group-hover:text-black transition-colors">
                  <span>Ler mais</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </CardFooter>
          </div>
        </Link>
      </Card>
    </TooltipProvider>
  );
}