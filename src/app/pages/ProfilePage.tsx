
import type React from "react"
import { useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Separator } from "../components/ui/separator"

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
      <DialogContent className="sm:max-w-[600px] border border-neutral-200 bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light tracking-tight text-black">Atualizar Perfil</DialogTitle>
          <DialogDescription className="text-neutral-600 font-light">
            Personalize seu perfil com estilo e deixe sua marca única
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="avatar" className="text-sm font-normal text-neutral-700">
                Foto de Perfil
              </Label>
              <FileUpload
                onUploadComplete={(url) => setFormData((prev) => ({ ...prev, avatarUrl: url }))}
                variant="avatar"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner" className="text-sm font-normal text-neutral-700">
                Banner
              </Label>
              <FileUpload
                onUploadComplete={(url) => setFormData((prev) => ({ ...prev, bannerUrl: url }))}
                variant="banner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-normal text-neutral-700">
                Nome
              </Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Seu nome elegante"
                required
                className="border-neutral-300 focus:border-black focus:ring-black"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-normal text-neutral-700">
                Biografia
              </Label>
              <Textarea
                id="bio"
                value={formData.bio || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Compartilhe sua história com o mundo..."
                rows={4}
                className="resize-none border-neutral-300 focus:border-black focus:ring-black"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-normal text-neutral-700">
                Status
              </Label>
              <Select
                value={formData.status || "active"}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger id="status" className="border-neutral-300 focus:border-black focus:ring-black">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">● Ativo</SelectItem>
                  <SelectItem value="busy">● Ocupado</SelectItem>
                  <SelectItem value="inactive">● Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4 border-t border-neutral-200">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="border-neutral-300 hover:bg-neutral-50 bg-transparent"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-black text-white hover:bg-neutral-800">
              {isLoading ? "Salvando..." : "Salvar Mudanças"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

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
      <DialogContent className="sm:max-w-[500px] border border-neutral-200 bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light tracking-tight text-black">Adicionar Rede Social</DialogTitle>
          <DialogDescription className="text-neutral-600 font-light">
            Conecte sua presença digital com estilo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="platform" className="text-sm font-normal text-neutral-700">
              Plataforma
            </Label>
            <Select
              value={formData.platform}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, platform: value }))}
            >
              <SelectTrigger id="platform" className="border-neutral-300 focus:border-black focus:ring-black">
                <SelectValue placeholder="Selecione uma plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="github">GitHub</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="website">Website</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-normal text-neutral-700">
              URL
            </Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
              placeholder="https://instagram.com/seu_usuario"
              type="url"
              required
              className="border-neutral-300 focus:border-black focus:ring-black"
            />
          </div>

          <DialogFooter className="gap-2 pt-4 border-t border-neutral-200">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="border-neutral-300 hover:bg-neutral-50 bg-transparent"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.platform || !formData.url}
              className="bg-black text-white hover:bg-neutral-800"
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
    <div className="min-h-screen bg-white">
      <div className="relative border-b border-neutral-200">
        {user.bannerUrl ? (
          <div
            className="w-full h-64 md:h-80 bg-cover bg-center relative overflow-hidden grayscale"
            style={{
              backgroundImage: `url(${user.bannerUrl})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/40" />
          </div>
        ) : (
          <div className="w-full h-64 md:h-80 bg-neutral-100 relative overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 1px,
                rgba(0,0,0,0.03) 1px,
                rgba(0,0,0,0.03) 2px
              )`,
              }}
            />
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-16">
        <Card className="border border-neutral-200 bg-white shadow-sm">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col items-center text-center space-y-6 mb-12">
              {/* Avatar with thin border */}
              <div className="relative group">
                <Avatar className="w-32 h-32 border-2 border-black shadow-lg">
                  <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} className="grayscale" />
                  <AvatarFallback className="text-4xl bg-black text-white font-light">
                    {user.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  onClick={() => setEditDialogOpen(true)}
                  className="absolute -bottom-2 -right-2 rounded-full h-10 w-10 bg-black hover:bg-neutral-800 text-white border-2 border-white shadow-lg"
                >
                  <Pencil1Icon className="h-4 w-4" />
                </Button>
              </div>

              {/* Name and Info */}
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-light tracking-tight text-black">{user.name}</h1>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-lg text-neutral-600 font-light">@{user.slug}</p>
                  <p className="text-sm text-neutral-500 font-light">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 w-full max-w-2xl">
                <Card className="border border-neutral-200 hover:border-black transition-colors bg-white">
                  <CardContent className="p-6 text-center">
                    <PersonIcon className="h-6 w-6 mx-auto mb-2 text-black" />
                    <p className="text-3xl font-light text-black">{followers.length}</p>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mt-1 font-light">Seguidores</p>
                  </CardContent>
                </Card>

                <Card className="border border-neutral-200 hover:border-black transition-colors bg-white">
                  <CardContent className="p-6 text-center">
                    <HeartIcon className="h-6 w-6 mx-auto mb-2 text-black" />
                    <p className="text-3xl font-light text-black">{following.length}</p>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mt-1 font-light">Seguindo</p>
                  </CardContent>
                </Card>

                <Card className="border border-neutral-200 hover:border-black transition-colors bg-white">
                  <CardContent className="p-6 text-center">
                    <ChatBubbleIcon className="h-6 w-6 mx-auto mb-2 text-black" />
                    <p className="text-3xl font-light text-black">{user.posts?.length || 0}</p>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mt-1 font-light">Publicações</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Badge
                  variant="outline"
                  className={`px-4 py-2 text-sm font-light border ${
                    user.status === "active"
                      ? "bg-white text-black border-black"
                      : user.status === "busy"
                        ? "bg-neutral-100 text-neutral-700 border-neutral-400"
                        : "bg-neutral-50 text-neutral-500 border-neutral-300"
                  }`}
                >
                  {user.status === "active" ? "● Ativo" : user.status === "busy" ? "● Ocupado" : "● Inativo"}
                </Badge>
                <Badge
                  variant="outline"
                  className={`px-4 py-2 text-sm font-light border ${
                    user.verified ? "bg-black text-white border-black" : "bg-white text-neutral-600 border-neutral-300"
                  }`}
                >
                  {user.verified ? "✓ Verificado" : "○ Não Verificado"}
                </Badge>
              </div>
            </div>

            <Separator className="my-8 bg-neutral-200" />

            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto gap-2 bg-neutral-50 p-2 border border-neutral-200">
                <TabsTrigger
                  value="about"
                  className="data-[state=active]:bg-black data-[state=active]:text-white font-light border border-transparent data-[state=active]:border-black"
                >
                  Biografia
                </TabsTrigger>
                <TabsTrigger
                  value="posts"
                  className="data-[state=active]:bg-black data-[state=active]:text-white font-light border border-transparent data-[state=active]:border-black"
                >
                  Posts ({user.posts?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="comments"
                  className="data-[state=active]:bg-black data-[state=active]:text-white font-light border border-transparent data-[state=active]:border-black"
                >
                  Comentários ({user.comments?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="social"
                  className="data-[state=active]:bg-black data-[state=active]:text-white font-light border border-transparent data-[state=active]:border-black"
                >
                  Social ({socialLinks.length})
                </TabsTrigger>
                <TabsTrigger
                  value="followers"
                  className="data-[state=active]:bg-black data-[state=active]:text-white font-light border border-transparent data-[state=active]:border-black"
                >
                  Seguidores ({followers.length})
                </TabsTrigger>
                <TabsTrigger
                  value="following"
                  className="data-[state=active]:bg-black data-[state=active]:text-white font-light border border-transparent data-[state=active]:border-black"
                >
                  Seguindo ({following.length})
                </TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="mt-8">
                <Card className="border border-neutral-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-3xl font-light tracking-tight text-black">Biografia</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-lg text-neutral-700 leading-relaxed font-light">
                      {user.bio ||
                        "Nenhuma biografia disponível ainda. Adicione uma para compartilhar sua história com o mundo."}
                    </p>
                    <Separator className="bg-neutral-200" />
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <span className="font-normal">Membro desde</span>
                      <Badge
                        variant="secondary"
                        className="bg-neutral-100 text-neutral-700 border border-neutral-200 font-light"
                      >
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
                    <h2 className="text-2xl font-light text-black">Publicações</h2>
                    <Button
                      onClick={() => navigate("/posts/new")}
                      className="bg-black text-white hover:bg-neutral-800 font-light"
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
                    <Card className="border border-dashed border-neutral-300 bg-neutral-50">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <ChatBubbleIcon className="h-16 w-16 text-neutral-400 mb-4" />
                        <p className="text-neutral-600 text-center font-light">
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
                  <h2 className="text-2xl font-light text-black">Comentários</h2>
                  {user.comments && user.comments.length > 0 ? (
                    <div className="space-y-4">
                      {user.comments.map((comment) => (
                        <Card
                          key={comment.id}
                          className="border border-neutral-200 hover:border-black transition-colors bg-white"
                        >
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start gap-4">
                              <p className="text-neutral-700 flex-1 font-light">{comment.content}</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteCommentDialogOpen(comment.id)}
                                className="text-neutral-600 hover:text-black hover:bg-neutral-100"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-neutral-500 mt-4 font-light">
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
                    <Card className="border border-dashed border-neutral-300 bg-neutral-50">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <ChatBubbleIcon className="h-16 w-16 text-neutral-400 mb-4" />
                        <p className="text-neutral-600 font-light">Nenhum comentário ainda.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Social Links Tab */}
              <TabsContent value="social" className="mt-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-light text-black">Conexões Sociais</h2>
                    <Button
                      onClick={() => setSocialDialogOpen(true)}
                      className="bg-black text-white hover:bg-neutral-800 font-light"
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Adicionar Link
                    </Button>
                  </div>

                  {socialLinks.length > 0 ? (
                    <div className="grid gap-4">
                      {socialLinks.map((link) => (
                        <Card
                          key={link.id}
                          className="border border-neutral-200 hover:border-black transition-colors bg-white"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <Badge className="bg-black text-white font-light border-black">
                                  {link.platform.toUpperCase()}
                                </Badge>
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-neutral-700 hover:text-black transition-colors group flex-1 min-w-0 font-light"
                                >
                                  <span className="group-hover:underline truncate">{link.url}</span>
                                  <ExternalLinkIcon className="h-4 w-4 flex-shrink-0" />
                                </a>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteDialogOpen(link.id)}
                                className="text-neutral-600 hover:text-black hover:bg-neutral-100 flex-shrink-0"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border border-dashed border-neutral-300 bg-neutral-50">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <ExternalLinkIcon className="h-16 w-16 text-neutral-400 mb-4" />
                        <p className="text-neutral-600 font-light">Nenhuma rede social cadastrada ainda.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Followers Tab */}
              <TabsContent value="followers" className="mt-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-light text-black">Seguidores</h2>
                  {followers.length > 0 ? (
                    <div className="grid gap-4">
                      {followers.map((follow) => (
                        <Card
                          key={follow.id}
                          className="border border-neutral-200 hover:border-black transition-colors bg-white"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12 border border-neutral-200">
                                <AvatarImage src={follow.follower?.avatarUrl ?? undefined} className="grayscale" />
                                <AvatarFallback className="bg-black text-white font-light">
                                  {follow.follower?.name?.[0] || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-normal text-black">{follow.follower?.name}</h3>
                                <p className="text-sm text-neutral-500 font-light">@{follow.follower?.slug}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border border-dashed border-neutral-300 bg-neutral-50">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <PersonIcon className="h-16 w-16 text-neutral-400 mb-4" />
                        <p className="text-neutral-600 font-light">Nenhum seguidor ainda.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Following Tab */}
              <TabsContent value="following" className="mt-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-light text-black">Seguindo</h2>
                  {following.length > 0 ? (
                    <div className="grid gap-4">
                      {following.map((follow) => (
                        <Card
                          key={follow.id}
                          className="border border-neutral-200 hover:border-black transition-colors bg-white"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12 border border-neutral-200">
                                <AvatarImage src={follow.following?.avatarUrl ?? undefined} className="grayscale" />
                                <AvatarFallback className="bg-black text-white font-light">
                                  {follow.following?.name?.[0] || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-normal text-black">{follow.following?.name}</h3>
                                <p className="text-sm text-neutral-500 font-light">@{follow.following?.slug}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border border-dashed border-neutral-300 bg-neutral-50">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <PersonIcon className="h-16 w-16 text-neutral-400 mb-4" />
                        <p className="text-neutral-600 font-light">Não está seguindo ninguém ainda.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-12 pt-8">
              <Separator className="mb-8 bg-neutral-200" />
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:text-black hover:border-black font-light bg-transparent"
                >
                  Deslogar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <footer className="mt-12 text-center">
          <Separator className="mb-6 bg-neutral-200" />
          <p className="text-sm text-neutral-500 font-light tracking-wide">
            © {new Date().getFullYear()} Todos os direitos reservados
          </p>
        </footer>
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

      <AlertDialog open={!!deleteDialogOpen} onOpenChange={() => setDeleteDialogOpen(null)}>
        <AlertDialogContent className="border border-neutral-200 bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-light text-black">Remover Conexão Social</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-600 font-light">
              Deseja realmente deletar essa conexão? Essa ação não pode ser revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-t border-neutral-200 pt-4">
            <AlertDialogCancel className="border-neutral-300 hover:bg-neutral-50 font-light">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialogOpen && handleRemoveSocialLink(deleteDialogOpen)}
              className="bg-black text-white hover:bg-neutral-800 font-light"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deletePostDialogOpen} onOpenChange={() => setDeletePostDialogOpen(null)}>
        <AlertDialogContent className="border border-neutral-200 bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-light text-black">Remover Postagem</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-600 font-light">
              Deseja realmente deletar essa postagem? Essa ação não pode ser revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-t border-neutral-200 pt-4">
            <AlertDialogCancel className="border-neutral-300 hover:bg-neutral-50 font-light">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePostDialogOpen && handleRemovePost(deletePostDialogOpen)}
              className="bg-black text-white hover:bg-neutral-800 font-light"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteCommentDialogOpen} onOpenChange={() => setDeleteCommentDialogOpen(null)}>
        <AlertDialogContent className="border border-neutral-200 bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-light text-black">Remover Comentário</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-600 font-light">
              Deseja realmente deletar esse comentário? Essa ação não pode ser revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-t border-neutral-200 pt-4">
            <AlertDialogCancel className="border-neutral-300 hover:bg-neutral-50 font-light">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCommentDialogOpen && handleRemoveComment(deleteCommentDialogOpen)}
              className="bg-black text-white hover:bg-neutral-800 font-light"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
