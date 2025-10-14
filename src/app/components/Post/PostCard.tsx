import { Link, useNavigate } from 'react-router-dom';
import type { Post, User } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pencil, MessageCircle, Trash2, Clock } from 'lucide-react';
import { Carousel } from '../Common/Carousel';
import { LikeButton } from '../Common/LikeButton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface PostCardProps {
  post: Post;
  author?: User;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
}

export function PostCard({ post, author, isOwner = false, onDelete }: PostCardProps) {
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
    if (onDelete) {
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

  return (
    <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white group">
      <Link to={`/post/${post.slug}`} className="no-underline text-current">
        <div className="relative">
          {mediaItems.length > 0 ? (
            <div className="relative w-full h-48 overflow-hidden">
              <Carousel items={mediaItems} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              {post.category && (
                <div className="absolute top-3 left-3">
                  <Badge variant="destructive" className="font-sans font-bold text-xs px-3 py-1 uppercase tracking-wider border-0 rounded-sm">
                    {post.category.name}
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="relative w-full h-48">
              <div className="flex items-center justify-center w-full h-full bg-gray-100 border-b-4 border-red-600">
                <p className="text-gray-400 font-serif text-sm">SEM MÍDIA</p>
              </div>
              {post.category && (
                <div className="absolute top-3 left-3">
                  <Badge variant="destructive" className="font-sans font-bold text-xs px-3 py-1 uppercase tracking-wider border-0 rounded-sm">
                    {post.category.name}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>

        <CardHeader>
          <CardTitle className="text-black font-serif leading-tight group-hover:text-red-700 transition-colors duration-200">
            {post.title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-gray-700 font-sans leading-relaxed mb-4 line-clamp-3">
            {post.description || ''}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 mt-2">
              {post.tags.slice(0, 3).map(({ tag }) => (
                <Badge 
                  variant="secondary"
                  key={tag?.id} 
                  className="font-sans text-xs px-2 py-1 hover:border-red-300 hover:text-red-700 transition-colors duration-200 rounded-full"
                >
                  #{tag?.name}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="secondary" className="font-sans text-xs px-2 py-1 rounded-full">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="border-b border-gray-200 mb-4"></div>

          <div className="flex items-center justify-between mb-4">
            <Link 
              to={`/author/${displayAuthor?.slug}`} 
              onClick={(e) => e.stopPropagation()}
              className="hover:no-underline"
            >
              <div className="flex items-center gap-3 group/author">
                <Avatar className="border-2 border-gray-200 group-hover/author:border-red-300 transition-colors duration-200">
                  <AvatarImage src={displayAuthor?.avatarUrl || undefined} />
                  <AvatarFallback>{displayAuthor?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-black font-sans group-hover/author:text-red-700 transition-colors duration-200">
                    {displayAuthor?.name || 'Autor Desconhecido'}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <p className="text-xs text-gray-500 font-sans">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex gap-6">
              <LikeButton postId={post.id} />
              
              <div className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors duration-200 cursor-pointer">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium font-sans">
                  {post._count?.comments || 0}
                </span>
                <span className="text-xs text-gray-400 font-sans">
                  comentários
                </span>
              </div>
            </div>
        </CardFooter>

        {isOwner && (
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Button 
              size="icon" 
              variant="outline"
              className="bg-white/90 hover:bg-white text-blue-600 hover:text-blue-700 shadow-md hover:shadow-lg backdrop-blur-sm border-0 transition-all duration-200"
              onClick={handleEditClick}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button 
              size="icon" 
              variant="outline"
              className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700 shadow-md hover:shadow-lg backdrop-blur-sm border-0 transition-all duration-200"
              onClick={handleDeleteClick}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div className="absolute bottom-0 right-0 p-3">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
            <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
          </div>
        </div>
      </Link>
    </Card>
  );
}