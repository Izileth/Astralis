import { useParams } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent } from "../components/ui/card"
import { Container } from "../components/Common/Container"
import { 
  User, 
  MessageCircle,
  Users,
  Calendar
} from "lucide-react"

import { useUserProfile } from "../hooks/useUser"
import { useAuthorPosts } from "../hooks/usePost"
import { PostCard } from "../components/Post/PostCard"
import { ProfilePageSkeleton, PostListSkeleton } from "../components/Common/Skeleton"

export function AuthorProfilePage() {
  const { slug } = useParams<{ slug: string }>()
  const { user, isLoading: userLoading, error: userError } = useUserProfile(slug)
  const { posts, loading: postsLoading, error: postsError } = useAuthorPosts(user?.id, undefined, !!user)

  if (userLoading) {
    return <ProfilePageSkeleton />
  }

  if (userError) {
    return (
      <Container className="py-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-light text-destructive">Erro ao carregar o perfil</h1>
          <p className="text-muted-foreground">{userError}</p>
        </div>
      </Container>
    )
  }

  if (!user) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-light">Usuário não encontrado</h1>
        </div>
      </Container>
    )
  }

  const stats = [
    {
      icon: Users,
      value: user.followers?.length || 0,
      label: "Seguidores"
    },
    {
      icon: User,
      value: user.following?.length || 0,
      label: "Seguindo"
    },
    {
      icon: MessageCircle,
      value: posts?.length || 0,
      label: "Publicações"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      {user.bannerUrl && (
        <div className="w-full h-48 md:h-64 bg-muted relative overflow-hidden">
          <img
            src={user.bannerUrl}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      )}

      <Container className={`${user.bannerUrl ? "-mt-16 relative z-10" : "mt-8"}`}>
        <Card className="border-0 shadow-none">
          <CardContent className="p-6 md:p-8">
            {/* Header do perfil */}
            <div className="flex flex-col items-center text-center space-y-6 mb-8">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-lg">
                  <AvatarImage src={user.avatarUrl ?? undefined} />
                  <AvatarFallback className="text-lg">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Nome e informações */}
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-light tracking-tight">
                  {user.name}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {user.email}
                </p>
              </div>

              {/* Estatísticas */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <stat.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-2xl font-light">{stat.value}</span>
                    </div>
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap justify-center gap-2">
                <Badge 
                  variant={user.status === "active" ? "default" : "secondary"}
                  className={`px-3 py-1 ${
                    user.status === "active" 
                      ? "bg-green-100 text-green-800 hover:bg-green-100" 
                      : user.status === "busy"
                        ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                  }`}
                >
                  {user.status === "active" ? "Ativo" : user.status === "busy" ? "Ocupado" : "Inativo"}
                </Badge>
                <Badge 
                  variant={user.verified ? "default" : "outline"}
                  className="px-3 py-1"
                >
                  {user.verified ? "Verificado" : "Não verificado"}
                </Badge>
              </div>
            </div>

            {/* Separador */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <div className="bg-background px-4">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="about" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Biografia
                </TabsTrigger>
                <TabsTrigger value="posts" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Postagens ({posts?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                  <h2 className="text-2xl font-light">Biografia</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {user.bio || "Nenhuma biografia disponível."}
                  </p>
                  
                  {user.createdAt && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="posts" className="space-y-6">
                <div className="space-y-6">
                  <h2 className="text-2xl font-light">Publicações</h2>
                  {postsLoading ? (
                    <PostListSkeleton />
                  ) : postsError ? (
                    <div className="text-center text-destructive">
                      Erro ao carregar as publicações.
                    </div>
                  ) : posts && posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed">
                      <CardContent className="py-12 text-center">
                        <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">
                          Este autor ainda não tem publicações.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
}