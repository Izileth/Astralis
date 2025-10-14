import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Pencil1Icon,
  PlusIcon,
  TrashIcon,
  ExternalLinkIcon,
  PersonIcon,
  HeartIcon,
  ChatBubbleIcon,
} from "@radix-ui/react-icons"
import { ProfilePageSkeleton } from "../components/Common/Skeleton"
import useAuthStore from "../store/auth"
import { useCurrentUser, useFollowers, useFollowing, useSocialLinks } from "../hooks/useUser"
import { useDeletePost } from "../hooks/usePost"
import { useDeleteComment } from "../hooks/useUserComments"
import type { User, UpdateUser, CreateSocialLink } from "../types"
import { FileUpload } from "../components/Common/FileUpload"
import { PostCard } from "../components/Post/PostCard"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Separator } from "../components/ui/separator"

// Enhanced Edit Profile Dialog
function EditProfileDialog({
  open,
  onClose,
  user,
  onUpdate,
}: {
  open: boolean
  onClose: () => void
  user: User
  onUpdate: (data: UpdateUser) => Promise<void>
}) {
  const [formData, setFormData] = useState<UpdateUser>({
    name: user.name,
    bio: user.bio || "",
    avatarUrl: user.avatarUrl || "",
    bannerUrl: user.bannerUrl || "",
    status: user.status || "active",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onUpdate(formData)
      onClose()
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Atualizar Perfil</DialogTitle>
          <DialogDescription>
            Personalize seu perfil com estilo e deixe sua marca única
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="avatar" className="text-sm font-medium">
                Foto de Perfil
              </Label>
              <FileUpload
                onUploadComplete={(url) => setFormData((prev) => ({ ...prev, avatarUrl: url }))}
                variant="avatar"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner" className="text-sm font-medium">
                Banner
              </Label>
              <FileUpload
                onUploadComplete={(url) => setFormData((prev) => ({ ...prev, bannerUrl: url }))}
                variant="banner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome
              </Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Seu nome elegante"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium">
                Biografia
              </Label>
              <Textarea
                id="bio"
                value={formData.bio || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Compartilhe sua história com o mundo..."
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={formData.status || "active"}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">✅ Ativo</SelectItem>
                  <SelectItem value="busy">⏰ Ocupado</SelectItem>
                  <SelectItem value="inactive">⭕ Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
              {isLoading ? "Salvando..." : "Salvar Mudanças"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Enhanced Add Social Link Dialog
function AddSocialLinkDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  onAdd: (data: CreateSocialLink) => Promise<void>
}) {
  const [formData, setFormData] = useState<CreateSocialLink>({
    platform: "",
    url: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onAdd(formData)
      setFormData({ platform: "", url: "" })
      onClose()
    } catch (error) {
      console.error("Erro ao adicionar link social:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Adicionar Rede Social</DialogTitle>
          <DialogDescription>
            Conecte sua presença digital com estilo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="platform" className="text-sm font-medium">
              Plataforma
            </Label>
            <Select
              value={formData.platform}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, platform: value }))}
            >
              <SelectTrigger id="platform">
                <SelectValue placeholder="Selecione uma plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">📷 Instagram</SelectItem>
                <SelectItem value="twitter">🐦 Twitter/X</SelectItem>
                <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
                <SelectItem value="github">🐙 GitHub</SelectItem>
                <SelectItem value="youtube">📺 YouTube</SelectItem>
                <SelectItem value="tiktok">🎵 TikTok</SelectItem>
                <SelectItem value="facebook">👥 Facebook</SelectItem>
                <SelectItem value="website">🌐 Website</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-medium">
              URL
            </Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
              placeholder="https://instagram.com/seu_usuario"
              type="url"
              required
            />
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.platform || !formData.url}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
            >
              {isLoading ? "Adicionando..." : "Adicionar Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore() as { user: User | null; logout: () => void }
  const { updateProfile } = useCurrentUser()
  const { followers } = useFollowers(user?.id)
  const { following } = useFollowing(user?.id)
  const { socialLinks, addLink, removeLink } = useSocialLinks(user?.id)
  const { deletePost } = useDeletePost()
  const { deleteComment } = useDeleteComment()

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [socialDialogOpen, setSocialDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null)
  const [deletePostDialogOpen, setDeletePostDialogOpen] = useState<string | null>(null)
  const [deleteCommentDialogOpen, setDeleteCommentDialogOpen] = useState<string | null>(null)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleUpdateProfile = async (data: UpdateUser) => {
    try {
      await updateProfile(data)
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
    }
  }

  const handleAddSocialLink = async (data: CreateSocialLink) => {
    try {
      await addLink(data)
    } catch (error) {
      console.error("Erro ao adicionar link social:", error)
    }
  }

  const handleRemoveSocialLink = async (linkId: string) => {
    try {
      await removeLink(linkId)
      setDeleteDialogOpen(null)
    } catch (error) {
      console.error("Erro ao remover link social:", error)
    }
  }

  const handleRemovePost = async (postId: string) => {
    try {
      await deletePost(postId)
      setDeletePostDialogOpen(null)
    } catch (error) {
      console.error("Erro ao remover post:", error)
    }
  }

  const handleRemoveComment = async (commentId: string) => {
    try {
      await deleteComment(commentId)
      setDeleteCommentDialogOpen(null)
    } catch (error) {
      console.error("Erro ao remover comentário:", error)
    }
  }

  if (!user) {
    return <ProfilePageSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50">
      {/* Banner Section com Gradiente Moderno */}
      <div className="relative">
        {user.bannerUrl ? (
          <div
            className="w-full h-64 md:h-80 bg-cover bg-center relative overflow-hidden"
            style={{
              backgroundImage: `url(${user.bannerUrl})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20" />
          </div>
        ) : (
          <div className="w-full h-64 md:h-80 bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.1),transparent_50%)]" />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-16">
        <Card className="shadow-2xl border-none backdrop-blur-sm bg-white/95">
          <CardContent className="p-8 md:p-12">
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center space-y-6 mb-12">
              {/* Avatar com Animação */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300" />
                <Avatar className="relative w-32 h-32 border-4 border-white shadow-xl">
                  <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-red-500 to-pink-500 text-white">
                    {user.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  onClick={() => setEditDialogOpen(true)}
                  className="absolute -bottom-2 -right-2 rounded-full h-10 w-10 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg"
                >
                  <Pencil1Icon className="h-4 w-4" />
                </Button>
              </div>

              {/* Nome e Info */}
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  {user.name}
                </h1>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-lg text-muted-foreground font-medium">@{user.slug}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              {/* Estatísticas com Cards Modernos */}
              <div className="grid grid-cols-3 gap-6 w-full max-w-2xl">
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-red-50 to-pink-50">
                  <CardContent className="p-6 text-center">
                    <PersonIcon className="h-6 w-6 mx-auto mb-2 text-red-500" />
                    <p className="text-3xl font-bold text-red-600">{followers.length}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Seguidores</p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-pink-50 to-purple-50">
                  <CardContent className="p-6 text-center">
                    <HeartIcon className="h-6 w-6 mx-auto mb-2 text-pink-500" />
                    <p className="text-3xl font-bold text-pink-600">{following.length}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Seguindo</p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-blue-50">
                  <CardContent className="p-6 text-center">
                    <ChatBubbleIcon className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                    <p className="text-3xl font-bold text-purple-600">{user.posts?.length || 0}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Publicações</p>
                  </CardContent>
                </Card>
              </div>

              {/* Badges Modernos */}
              <div className="flex flex-wrap justify-center gap-3">
                <Badge
                  variant="outline"
                  className={`px-4 py-2 text-sm font-medium ${
                    user.status === "active"
                      ? "bg-green-50 text-green-700 border-green-300"
                      : user.status === "busy"
                        ? "bg-orange-50 text-orange-700 border-orange-300"
                        : "bg-red-50 text-red-700 border-red-300"
                  }`}
                >
                  {user.status === "active" ? "✅ Ativo" : user.status === "busy" ? "⏰ Ocupado" : "⭕ Inativo"}
                </Badge>
                <Badge
                  variant="outline"
                  className={`px-4 py-2 text-sm font-medium ${
                    user.verified
                      ? "bg-blue-50 text-blue-700 border-blue-300"
                      : "bg-gray-50 text-gray-700 border-gray-300"
                  }`}
                >
                  {user.verified ? "✓ Verificado" : "○ Não Verificado"}
                </Badge>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Tabs Modernizadas */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto gap-2 bg-muted/50 p-2">
                <TabsTrigger value="about" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                  Biografia
                </TabsTrigger>
                <TabsTrigger value="posts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                  Posts ({user.posts?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="comments" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                  Comentários ({user.comments?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="social" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                  Social ({socialLinks.length})
                </TabsTrigger>
                <TabsTrigger value="followers" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                  Seguidores ({followers.length})
                </TabsTrigger>
                <TabsTrigger value="following" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                  Seguindo ({following.length})
                </TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="mt-8">
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                      Biografia
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {user.bio || "Nenhuma biografia disponível ainda. Adicione uma para compartilhar sua história com o mundo."}
                    </p>
                    <Separator />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium">Membro desde</span>
                      <Badge variant="secondary">
                        {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Posts Tab */}
              <TabsContent value="posts" className="mt-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Publicações</h2>
                    <Button
                      onClick={() => navigate("/posts/new")}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Criar Publicação
                    </Button>
                  </div>

                  {user.posts && user.posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {user.posts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          author={user}
                          isOwner={true}
                          onDelete={() => setDeletePostDialogOpen(post.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <ChatBubbleIcon className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground text-center">
                          Nenhuma publicação ainda. Crie sua primeira publicação para começar!
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Comments Tab */}
              <TabsContent value="comments" className="mt-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Comentários</h2>
                  {user.comments && user.comments.length > 0 ? (
                    <div className="space-y-4">
                      {user.comments.map((comment) => (
                        <Card key={comment.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start gap-4">
                              <p className="text-foreground flex-1">{comment.content}</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteCommentDialogOpen(comment.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mt-4">
                              {new Date(comment.createdAt).toLocaleDateString("pt-BR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <ChatBubbleIcon className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Nenhum comentário ainda.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Social Links Tab */}
              <TabsContent value="social" className="mt-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Conexões Sociais</h2>
                    <Button
                      onClick={() => setSocialDialogOpen(true)}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Adicionar Link
                    </Button>
                  </div>

                  {socialLinks.length > 0 ? (
                    <div className="grid gap-4">
                      {socialLinks.map((link) => (
                        <Card key={link.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                                  {link.platform.toUpperCase()}
                                </Badge>
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-foreground hover:text-red-500 transition-colors group flex-1 min-w-0"
                                >
                                  <span className="group-hover:underline truncate">{link.url}</span>
                                  <ExternalLinkIcon className="h-4 w-4 flex-shrink-0" />
                                </a>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteDialogOpen(link.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <ExternalLinkIcon className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Nenhuma rede social cadastrada ainda.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Followers Tab */}
              <TabsContent value="followers" className="mt-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Seguidores</h2>
                  {followers.length > 0 ? (
                    <div className="grid gap-4">
                      {followers.map((follow) => (
                        <Card key={follow.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={follow.follower?.avatarUrl ?? undefined} />
                                <AvatarFallback className="bg-gradient-to-br from-red-500 to-pink-500 text-white">
                                  {follow.follower?.name?.[0] || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{follow.follower?.name}</h3>
                                <p className="text-sm text-muted-foreground">@{follow.follower?.slug}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <PersonIcon className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Nenhum seguidor ainda.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Following Tab */}
              <TabsContent value="following" className="mt-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Seguindo</h2>
                  {following.length > 0 ? (
                    <div className="grid gap-4">
                      {following.map((follow) => (
                        <Card key={follow.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={follow.following?.avatarUrl ?? undefined} />
                                <AvatarFallback className="bg-gradient-to-br from-red-500 to-pink-500 text-white">
                                  {follow.following?.name?.[0] || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{follow.following?.name}</h3>
                                <p className="text-sm text-muted-foreground">@{follow.following?.slug}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <PersonIcon className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Não está seguindo ninguém ainda.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Logout Section com Design Moderno */}
            <div className="mt-12 pt-8">
              <Separator className="mb-8" />
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                >
                  Deslogar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <EditProfileDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        user={user}
        onUpdate={handleUpdateProfile}
      />

      <AddSocialLinkDialog
        open={socialDialogOpen}
        onClose={() => setSocialDialogOpen(false)}
        onAdd={handleAddSocialLink}
      />

      {/* Delete Confirmation Dialog for Social Link */}
      <AlertDialog open={!!deleteDialogOpen} onOpenChange={() => setDeleteDialogOpen(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Conexão Social</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente deletar essa conexão? Essa ação não pode ser revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialogOpen && handleRemoveSocialLink(deleteDialogOpen)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog for Post */}
      <AlertDialog open={!!deletePostDialogOpen} onOpenChange={() => setDeletePostDialogOpen(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Postagem</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente deletar essa postagem? Essa ação não pode ser revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePostDialogOpen && handleRemovePost(deletePostDialogOpen)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog for Comment */}
      <AlertDialog open={!!deleteCommentDialogOpen} onOpenChange={() => setDeleteCommentDialogOpen(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Comentário</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente deletar esse comentário? Essa ação não pode ser revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCommentDialogOpen && handleRemoveComment(deleteCommentDialogOpen)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}