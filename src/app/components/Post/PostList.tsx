import React, { useState, useEffect } from 'react';
import { usePosts, usePagination } from '../../hooks/usePost';
import { PostCard } from './PostCard';
import { Grid, Flex, Button, Text, Box, Heading, Card } from '@radix-ui/themes';
import { PostListSkeleton } from '../Common/Skeleton';
import { RefreshCcw, AlertCircle,  WifiOff, ChevronLeft, ChevronRight } from 'lucide-react';

interface PostListProps {
  isOwner?: boolean;
}

// Tipos de erro para melhor categorização
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
  icon: React.ComponentType;
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

  // Monitor status da conexão
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

  // Auto-retry quando voltar online
  useEffect(() => {
    if (isOnline && error && retryAttempts < 3) {
      handleRetry();
    }
  }, [isOnline]);

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

  // Loading inicial
  if (loading && posts.length === 0) {
    return <PostListSkeleton />;
  }

  // Estado de erro aprimorado
  if (error) {
    const errorInfo = getErrorInfo(error);
    const ErrorIcon = errorInfo.icon;

    return (
      <Box py="8" aria-brailleroledescription='none'>
        <Card size="3" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <Flex direction="column" align="center" gap="4" p="6">
            <Box
              style={{
                padding: '16px',
                borderRadius: '50%',
                backgroundColor: 'var(--red-3)',
                color: 'var(--red-11)'
              }}
            >
              <ErrorIcon  />
            </Box>
            
            <Flex direction="column" align="center" gap="2">
              <Heading size="5" color="red">
                {errorInfo.title}
              </Heading>
              <Text align="center" color="gray" size="3">
                {errorInfo.description}
              </Text>
              
              {!isOnline && (
                <Flex align="center" gap="2" mt="2">
                  <WifiOff size={16} color="var(--orange-11)" />
                  <Text size="2" color="orange">
                    Você está offline
                  </Text>
                </Flex>
              )}
            </Flex>

            <Flex direction="column" gap="3" width="100%">
              {errorInfo.canRetry && (
                <Button
                  onClick={handleRetry}
                  disabled={isRetrying || (!isOnline && errorInfo.type === ErrorType.NETWORK)}
                  size="3"
                  style={{ width: '100%', color:'white',    background: '#dc2626', }}
                >
                  <RefreshCcw size={16} />
                  {isRetrying ? 'Tentando...' : 'Tentar Novamente'}
                </Button>
              )}
              
              {retryAttempts > 0 && (
                <Text size="2" color="gray" align="center">
                  Tentativa {retryAttempts} de 3
                </Text>
              )}

              <Text size="2" color="gray" align="center">
                Se o problema persistir, entre em contato conosco
              </Text>
            </Flex>
          </Flex>
        </Card>
      </Box>
    );
  }

  // Empty state melhorado
  if (posts.length === 0) {
    return (
      <Box py="8">
        <Card size="3" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <Flex direction="column" align="center" gap="4" p="6">
            <Box
              style={{
                padding: '20px',
                borderRadius: '50%',
                backgroundColor: 'var(--gray-3)',
                color: 'var(--gray-11)'
              }}
            >
              📝
            </Box>
            
            <Flex direction="column" align="center" gap="2">
              <Heading size="5">
                {isOwner ? 'Você ainda não publicou nada' : 'Nenhum post encontrado'}
              </Heading>
              <Text align="center" color="gray" size="3">
                {isOwner 
                  ? 'Que tal criar seu primeiro post? Compartilhe suas ideias com o mundo!'
                  : 'Ainda não há nada para ver aqui. Volte mais tarde ou explore outras seções!'
                }
              </Text>
            </Flex>

            {isOwner && (
              <Button size="3" style={{ marginTop: '8px' }}>
                Criar Primeiro Post
              </Button>
            )}
          </Flex>
        </Card>
      </Box>
    );
  }

  return (
    <Flex direction="column" gap="6">
      {/* Indicador de loading durante paginação */}
      {loading && posts.length > 0 && (
        <Box 
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 1000,
            backgroundColor: 'var(--gray-1)',
            border: '1px solid var(--gray-6)',
            borderRadius: '8px',
            padding: '8px 12px'
          }}
        >
          <Flex align="center" gap="2">
            <RefreshCcw size={16} className="animate-spin" />
            <Text size="2">Sicronizando...</Text>
          </Flex>
        </Box>
      )}

      {/* Grid de posts */}
      <Grid 
        columns={{ initial: '1', sm: '2', md: '3' }} 
        gap="5"
        style={{
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 0.2s ease'
        }}
      >
        {posts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            isOwner={isOwner}

          />
        ))}
      </Grid>

      {/* Paginação melhorada */}
      {pagination.totalPages > 1 && (
        <Card>
          <Flex align="center" justify="between" p="4">
            <Button
              onClick={goToPrev}
              disabled={!hasPrev || loading}
              variant="soft"
              size="3"
            >
              <ChevronLeft size={16} />
              Anterior
            </Button>

            <Flex direction="column" align="center" gap="1">
              <Text size="3" weight="medium">
                Página {pagination.page} de {pagination.totalPages}
              </Text>
              <Text size="2" color="gray">
                {posts.length} posts exibidos
              </Text>
            </Flex>

            <Button
              onClick={goToNext}
              disabled={!hasNext || loading}
              variant="soft"
              size="3"
            >
              Próxima
              <ChevronRight size={16} />
            </Button>
          </Flex>
        </Card>
      )}

      {/* Indicador de status da conexão */}
      {!isOnline && (
        <Box
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--orange-9)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            zIndex: 1000
          }}
        >
          <Flex align="center" gap="2">
            <WifiOff size={16} />
            <Text size="2" weight="medium">
              Você está offline
            </Text>
          </Flex>
        </Box>
      )}
    </Flex>
  );
};