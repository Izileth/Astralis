import React, { useState, useEffect } from 'react';
import { usePosts, usePagination } from '../../hooks/usePost';
import { PostCard } from './PostCard';
import { PostListSkeleton } from '../Common/Skeleton';
import { RefreshCcw, AlertCircle, WifiOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface PostListProps {
  isOwner?: boolean;
}

const ErrorType = {
  NETWORK: 'network',
  SERVER: 'server', 
  TIMEOUT: 'timeout',
  UNKNOWN: 'unknown'
} as const;

type ErrorType = typeof ErrorType[keyof typeof ErrorType];

interface ErrorInfo {
  type: ErrorType;
  title: string;
  description: string;
  canRetry: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

const getErrorInfo = (error: string): ErrorInfo => {
  const errorLower = error.toLowerCase();
  
  if (errorLower.includes('network') || errorLower.includes('fetch')) {
    return {
      type: ErrorType.NETWORK,
      title: 'Erro de Conexão',
      description: 'Verifique sua conexão com a internet e tente novamente.',
      canRetry: true,
      icon: WifiOff
    };
  }
  
  if (errorLower.includes('timeout')) {
    return {
      type: ErrorType.TIMEOUT,
      title: 'Tempo Esgotado',
      description: 'A solicitação demorou muito para responder. Tente novamente.',
      canRetry: true,
      icon: RefreshCcw
    };
  }
  
  if (errorLower.includes('500') || errorLower.includes('server')) {
    return {
      type: ErrorType.SERVER,
      title: 'Erro do Servidor',
      description: 'Nossos servidores estão com problemas. Tente novamente em alguns minutos.',
      canRetry: true,
      icon: AlertCircle
    };
  }
  
  return {
    type: ErrorType.UNKNOWN,
    title: 'Algo deu errado',
    description: 'Ocorreu um erro inesperado. Nossa equipe foi notificada.',
    canRetry: true,
    icon: AlertCircle
  };
};

export const PostList: React.FC<PostListProps> = ({ isOwner = false }) => {
  const { posts, loading, error, refetch } = usePosts();
  const { goToNext, goToPrev, hasNext, hasPrev, pagination } = usePagination();
  
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline && error && retryAttempts < 3) {
      handleRetry();
    }
  }, [isOnline, error, retryAttempts]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryAttempts(prev => prev + 1);
    
    try {
      await refetch();
      setRetryAttempts(0); // Reset counter on success
    } catch (err) {
      // Error será capturado pelo hook
    } finally {
      setIsRetrying(false);
    }
  };

  if (loading && posts.length === 0) {
    return <PostListSkeleton />;
  }

  if (error) {
    const errorInfo = getErrorInfo(error);
    const ErrorIcon = errorInfo.icon;

    return (
      <div className="py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <div className="p-4 rounded-full bg-red-100 text-red-700">
              <ErrorIcon className="h-8 w-8" />
            </div>
            
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-xl font-semibold text-red-700">{errorInfo.title}</h3>
              <p className="text-gray-600">{errorInfo.description}</p>
              
              {!isOnline && (
                <div className="flex items-center gap-2 mt-2">
                  <WifiOff className="h-4 w-4 text-orange-600" />
                  <p className="text-sm text-orange-600">Você está offline</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 w-full">
              {errorInfo.canRetry && (
                <Button
                  onClick={handleRetry}
                  disabled={isRetrying || (!isOnline && errorInfo.type === ErrorType.NETWORK)}
                  className="w-full"
                  variant="destructive"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  {isRetrying ? 'Tentando...' : 'Tentar Novamente'}
                </Button>
              )}
              
              {retryAttempts > 0 && (
                <p className="text-sm text-gray-500 text-center">Tentativa {retryAttempts} de 3</p>
              )}

              <p className="text-sm text-gray-500 text-center">Se o problema persistir, entre em contato conosco</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-8">
        <Card className="max-w-sm mx-auto">
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
            <div className="p-5 rounded-full bg-gray-100 text-gray-600">
              📝
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">
                {isOwner ? 'Você ainda não publicou nada' : 'Nenhum post encontrado'}
              </h3>
              <p className="text-gray-600 mt-2">
                {isOwner 
                  ? 'Que tal criar seu primeiro post? Compartilhe suas ideias com o mundo!'
                  : 'Ainda não há nada para ver aqui. Volte mais tarde ou explore outras seções!'
                }
              </p>
            </div>

            {isOwner && (
              <Button className="mt-2">Criar Primeiro Post</Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {loading && posts.length > 0 && (
        <div className="fixed top-20 right-5 z-50 bg-background border rounded-lg py-2 px-3">
          <div className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4 animate-spin" />
            <p className="text-sm">Sincronizando...</p>
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 transition-opacity duration-200 ${loading ? 'opacity-70' : 'opacity-100'}`}>
        {posts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            isOwner={isOwner}
          />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <Button
              onClick={goToPrev}
              disabled={!hasPrev || loading}
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <div className="text-center">
              <p className="text-sm font-medium">Página {pagination.page} de {pagination.totalPages}</p>
              <p className="text-sm text-gray-500">{posts.length} posts exibidos</p>
            </div>

            <Button
              onClick={goToNext}
              disabled={!hasNext || loading}
              variant="outline"
            >
              Próxima
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {!isOnline && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-orange-600 text-white py-2 px-4 rounded-full z-50">
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4" />
            <p className="text-sm font-medium">Você está offline</p>
          </div>
        </div>
      )}
    </div>
  );
};