
import { useParams } from "react-router-dom"
import { Text, Avatar, Badge, Tabs, Spinner,  Heading, Flex, Container } from "@radix-ui/themes"
import { PersonIcon, HeartIcon, ChatBubbleIcon } from "@radix-ui/react-icons"

import { useUserProfile } from "../hooks/user"
import { useAuthorPosts } from "../hooks/post"
import { PostCard } from "../components/Post/PostCard"

export function AuthorProfilePage() {
  const { slug } = useParams<{ slug: string }>()
  const { user, isLoading: userLoading, error: userError } = useUserProfile(slug)
  const { posts, loading: postsLoading, error: postsError } = useAuthorPosts(user?.id, undefined, !!user)

  if (userLoading) {
    return (
      <Flex align="center" justify="center" style={{ height: '80vh' }}>
        <Spinner size="3" />
      </Flex>
    )
  }

  if (userError) {
    return (
      <Container py="8">
        <Heading color="red">Erro ao carregar o perfil</Heading>
        <Text>{userError}</Text>
      </Container>
    )
  }

  if (!user) {
    return (
      <Container py="8">
        <Heading>Usuário não encontrado</Heading>
      </Container>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {user.bannerUrl && (
        <div
          className="w-full h-64 md:h-80 bg-cover bg-center relative"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(26, 35, 50, 0.3), rgba(255, 107, 107, 0.1)), url(${user.bannerUrl})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`bg-card rounded-lg shadow-refined-lg border border-border p-8 md:p-12 ${
            user.bannerUrl ? "-mt-20 relative z-10" : "mt-8"
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-6 mb-12">
            <div className="relative group">
              <Avatar
                size="9"
                radius="full"
                fallback={user.name?.[0] || "U"}
                src={user.avatarUrl ?? undefined}
                className="border-4 border-card shadow-refined-lg w-32 h-32"
              />
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-light text-foreground heading-refined">{user.name}</h1>
              <div className="space-y-1">
      
                <p className="text-muted-foreground text-refined">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <PersonIcon className="w-5 h-5 text-accent" />
                  <span className="text-2xl font-light text-foreground">{user.followers?.length || 0}</span>
                </div>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">Seguidores</span>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <HeartIcon className="w-5 h-5 text-accent" />
                  <span className="text-2xl font-light text-foreground">{user.following?.length || 0}</span>
                </div>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">Seguindo</span>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <ChatBubbleIcon className="w-5 h-5 text-accent" />
                  <span className="text-2xl font-light text-foreground">{posts?.length || 0}</span>
                </div>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">Publicações</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Badge
              color="gray"
                className={`px-4 py-2 rounded-full border-thin ${
                  user.status === "active"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : user.status === "busy"
                      ? "bg-orange-50 text-orange-700 border-orange-200"
                      : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {user.status === "active" ? "Active" : user.status === "busy" ? "Busy" : "Inactive"}
              </Badge>
              <Badge
              color="gray"
                className={`px-4 py-2 rounded-full border-thin ${
                  user.verified
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                {user.verified ? "Verified" : "Unverified"}
              </Badge>
            </div>
          </div>

          <div className="relative mb-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-card px-6">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
              </div>
            </div>
          </div>

          <Tabs.Root defaultValue="about" className="w-full ">
            <Tabs.List color="red" className="flex  flex-wrap justify-center items-center text-center gap-2 mb-8 bg-transparent p-1 rounded-lg border-none">
              <Tabs.Trigger
                value="about"
                className="px-6 py-3 rounded-md text-sm font-medium transition-all hover:bg-card data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-refined"
              >
                Biografia
              </Tabs.Trigger>
              <Tabs.Trigger
                value="posts"
                className="px-6 py-3 rounded-md text-sm font-medium transition-all hover:bg-card data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-refined"
              >
                Postagens ({posts?.length || 0})
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="about" className="mt-8">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-3xl font-light text-foreground heading-refined">Biografia</h2>
                <p className="text-lg text-muted-foreground text-refined leading-relaxed">
                  {user.bio || "Nenhuma biografia disponível."}
                </p>
                <div className="pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Membro Desde{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="posts" className="mt-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-light text-foreground heading-refined">Publicações</h2>
                {postsLoading ? (
                  <Flex align="center" justify="center" style={{ minHeight: '200px' }}>
                    <Spinner size="3" />
                  </Flex>
                ) : postsError ? (
                  <Text color="red">Erro ao carregar as publicações.</Text>
                ) : posts && posts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-refined">
                      Este autor ainda não tem publicações.
                    </p>
                  </div>
                )}
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </div>
  )
}
