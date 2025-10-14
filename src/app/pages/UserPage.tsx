
import { useParams } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUser';
import { useAuthorPosts } from '../hooks/usePost';
import { PostList } from '../components/Post/PostList';
import { ProfilePageSkeleton, PostListSkeleton } from '../components/Common/Skeleton';
import { PersonIcon, CheckCircledIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';

import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

export function UserPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isLoading: isLoadingUser, error: userError } = useUserProfile(slug);
  const { loading: isLoadingPosts, error: postsError } = useAuthorPosts(
    user?.id,
    { published: true },
    !!user?.id
  );

  if (isLoadingUser) {
    return <ProfilePageSkeleton />;
  }

  if (userError || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full shadow-2xl border-none">
          <CardContent className="pt-12 pb-12">
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <ExclamationTriangleIcon className="h-5 w-5" />
              <AlertTitle className="text-lg font-semibold">Usuário não encontrado</AlertTitle>
              <AlertDescription className="mt-2">
                {userError || 'O perfil que você procura não existe ou foi movido.'}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50">
      {/* Banner Section - Similar ao ProfilePage */}
      <div className="relative">
        {user.bannerUrl ? (
          <div
            className="w-full h-48 md:h-64 bg-cover bg-center relative overflow-hidden"
            style={{
              backgroundImage: `url(${user.bannerUrl})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20" />
          </div>
        ) : (
          <div className="w-full h-48 md:h-64 bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.1),transparent_50%)]" />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-16">
        <Card className="shadow-2xl border-none backdrop-blur-sm bg-white/95 mb-8">
          <CardContent className="p-8 md:p-12">
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Avatar com Efeito Gradiente */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur opacity-75 transition duration-300" />
                <Avatar className="relative w-32 h-32 border-4 border-white shadow-xl">
                  <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-red-500 to-pink-500 text-white">
                    {user.name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Nome e Informações */}
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  {user.name}
                </h1>
                <p className="text-lg text-muted-foreground font-medium">@{user.slug}</p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap justify-center gap-3">
                {user.verified && (
                  <Badge
                    variant="outline"
                    className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 border-blue-300 flex items-center gap-2"
                  >
                    <CheckCircledIcon className="h-4 w-4" />
                    Verificado
                  </Badge>
                )}
                {user.status && (
                  <Badge
                    variant="outline"
                    className={`px-4 py-2 text-sm font-medium ${
                      user.status === 'active'
                        ? 'bg-green-50 text-green-700 border-green-300'
                        : user.status === 'busy'
                          ? 'bg-orange-50 text-orange-700 border-orange-300'
                          : 'bg-red-50 text-red-700 border-red-300'
                    }`}
                  >
                    {user.status === 'active'
                      ? '✅ Ativo'
                      : user.status === 'busy'
                        ? '⏰ Ocupado'
                        : '⭕ Inativo'}
                  </Badge>
                )}
              </div>

              {/* Bio */}
              {user.bio && (
                <div className="max-w-2xl mt-6">
                  <Card className="border-none shadow-lg bg-gradient-to-br from-slate-50 to-red-50/30">
                    <CardContent className="p-6">
                      <p className="text-lg text-muted-foreground leading-relaxed text-center">
                        {user.bio}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Estatísticas Rápidas */}
              <div className="grid grid-cols-3 gap-6 w-full max-w-2xl mt-8">
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-red-50 to-pink-50">
                  <CardContent className="p-6 text-center">
                    <PersonIcon className="h-6 w-6 mx-auto mb-2 text-red-500" />
                    <p className="text-2xl font-bold text-red-600">{user.followers?.length || 0}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                      Seguidores
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-pink-50 to-purple-50">
                  <CardContent className="p-6 text-center">
                    <PersonIcon className="h-6 w-6 mx-auto mb-2 text-pink-500" />
                    <p className="text-2xl font-bold text-pink-600">{user.following?.length || 0}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                      Seguindo
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-blue-50">
                  <CardContent className="p-6 text-center">
                    <PersonIcon className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                    <p className="text-2xl font-bold text-purple-600">{user.posts?.length || 0}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                      Publicações
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Section */}
        <Card className="shadow-xl border-none backdrop-blur-sm bg-white/95">
          <CardHeader className="border-b bg-gradient-to-r from-red-50 to-pink-50">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Publicações de {user.name}
            </CardTitle>
            <CardDescription className="text-base">
              Explore todo o conteúdo publicado por este usuário
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {isLoadingPosts && (
              <div className="space-y-4">
                <PostListSkeleton />
              </div>
            )}
            
            {postsError && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <ExclamationTriangleIcon className="h-5 w-5" />
                <AlertTitle>Erro ao carregar publicações</AlertTitle>
                <AlertDescription>{postsError}</AlertDescription>
              </Alert>
            )}
            
            {!isLoadingPosts && !postsError && (
              <div className="space-y-6">
                <PostList />
              </div>
            )}

            {!isLoadingPosts && !postsError && (!user.posts || user.posts.length === 0) && (
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="rounded-full bg-gradient-to-br from-red-100 to-pink-100 p-6 mb-4">
                    <PersonIcon className="h-12 w-12 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                    Nenhuma publicação ainda
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    {user.name} ainda não publicou nenhum conteúdo. Volte mais tarde para ver as
                    novidades!
                  </p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Membro Desde */}
        <div className="mt-8 text-center">
          <Card className="inline-block border-none shadow-lg bg-gradient-to-r from-slate-50 to-red-50">
            <CardContent className="px-8 py-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Membro desde</span>{' '}
                <Badge variant="secondary" className="ml-2">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Badge>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}