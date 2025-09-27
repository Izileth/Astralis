
import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Text, Button, Avatar, Badge, Tabs, Dialog, TextField, TextArea, AlertDialog, Select } from "@radix-ui/themes"
import {
  Pencil1Icon,
  PlusIcon,
  TrashIcon,
  ExternalLinkIcon,
  PersonIcon,
  HeartIcon,
  ChatBubbleIcon,
} from "@radix-ui/react-icons"
import { ProfilePageSkeleton } from "../components/Common/Skeleton";
import useAuthStore from "../store/auth"
import { useCurrentUser, useFollowers, useFollowing, useSocialLinks } from "../hooks/useUser"
import { useDeletePost } from "../hooks/usePost"
import { useDeleteComment } from "../hooks/useUserComments"
import type { User, UpdateUser, CreateSocialLink } from "../types"
import { FileUpload} from "../components/Common/FileUpload";
import { PostCard } from "../components/Post/PostCard";

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
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content className="max-w-lg bg-card border border-border shadow-refined-lg">
        <Dialog.Title className="text-2xl font-light text-foreground heading-refined">Edit Profile</Dialog.Title>
        <Dialog.Description className="text-muted-foreground text-refined mb-6">
          Update your personal information with refined elegance
        </Dialog.Description>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Text className="text-sm font-medium text-foreground">Name</Text>
            <TextField.Root
              value={formData.name || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Your elegant name"
              className="border-thin border-border focus:border-accent transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <Text className="text-sm font-medium text-foreground">Bio</Text>
            <TextArea
              value={formData.bio || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              placeholder="Share your story with the world..."
              rows={3}
              className="border-thin border-border focus:border-accent transition-colors text-refined"
            />
          </div>

          <div className="space-y-2">
            <Text className="text-sm font-medium text-foreground">Avatar</Text>
            <FileUpload onUploadComplete={(url) => setFormData(prev => ({ ...prev, avatarUrl: url }))} variant="avatar" />
          </div>

          <div className="space-y-2">
            <Text className="text-sm font-medium text-foreground">Banner</Text>
            <FileUpload onUploadComplete={(url) => setFormData(prev => ({ ...prev, bannerUrl: url }))} variant="banner" />
          </div>

          <div className="space-y-2">
            <Text className="text-sm font-medium text-foreground">Status</Text>
            <Select.Root
              value={formData.status || "active"}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
            >
              <Select.Trigger className="border-thin border-border focus:border-accent" />
              <Select.Content className="bg-card border border-border shadow-refined">
                <Select.Item value="active">Active</Select.Item>
                <Select.Item value="inactive">Inactive</Select.Item>
                <Select.Item value="busy">Busy</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>

          <div className="flex gap-3 pt-4 justify-end">
            <Dialog.Close>
              <Button
                variant="soft"
                className="bg-muted text-muted-foreground hover:bg-neutral-200 border-thin"
                type="button"
                color="red"
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Button
            color="red"
              type="submit"
              className="bg-accent text-white hover:bg-accent/90 shadow-refined"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
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
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content className="max-w-md bg-card border border-border shadow-refined-lg">
        <Dialog.Title className="text-2xl font-light text-foreground heading-refined">Add Social Link</Dialog.Title>
        <Dialog.Description className="text-muted-foreground text-refined mb-6">
          Connect your digital presence with style
        </Dialog.Description>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Text className="text-sm font-medium text-foreground">Platform</Text>
            <Select.Root
              value={formData.platform}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, platform: value }))}
            >
              <Select.Trigger className="border-thin border-border focus:border-accent" />
              <Select.Content className="bg-card border border-border shadow-refined">
                <Select.Item value="instagram">Instagram</Select.Item>
                <Select.Item value="twitter">Twitter/X</Select.Item>
                <Select.Item value="linkedin">LinkedIn</Select.Item>
                <Select.Item value="github">GitHub</Select.Item>
                <Select.Item value="youtube">YouTube</Select.Item>
                <Select.Item value="tiktok">TikTok</Select.Item>
                <Select.Item value="facebook">Facebook</Select.Item>
                <Select.Item value="website">Website</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>

          <div className="space-y-2">
            <Text className="text-sm font-medium text-foreground">URL</Text>
            <TextField.Root
              value={formData.url}
              onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
              placeholder="https://instagram.com/your_username"
              type="url"
              className="border-thin border-border focus:border-accent transition-colors"
              required
            />
          </div>

          <div className="flex gap-3 pt-4 justify-end">
            <Dialog.Close>
              <Button
                variant="soft"
                color="red"
        
                className="bg-muted text-muted-foreground hover:bg-neutral-200 border-thin"
                type="button"
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              type="submit"
              color="red"
              className="bg-accent text-white hover:bg-accent/90 shadow-refined"
              disabled={isLoading || !formData.platform || !formData.url}
            >
              {isLoading ? "Adding..." : "Add Link"}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
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
    return (
      <ProfilePageSkeleton/>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Banner Section */}
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

      {/* Main Profile Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`bg-card rounded-lg shadow-refined-lg border border-border p-8 md:p-12 ${
            user.bannerUrl ? "-mt-20 relative z-10" : "mt-8"
          }`}
        >
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center space-y-6 mb-12">
            {/* Avatar with Edit Button */}
            <div className="relative group">
              <Avatar
                size="9"
                radius="full"
                fallback={user.name?.[0] || "U"}
                src={user.avatarUrl ?? undefined}
                className="border-4 border-card shadow-refined-lg w-32 h-32"
              />
              <button
                onClick={() => setEditDialogOpen(true)}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent text-white rounded-full border-4 border-card shadow-refined hover:bg-accent/90 transition-all group-hover:scale-110 flex items-center justify-center"
              >
                <Pencil1Icon className="w-4 h-4" />
              </button>
            </div>

            {/* Name and Details */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-light text-foreground heading-refined">{user.name}</h1>
              <div className="space-y-1">
                <p className="text-lg text-muted-foreground accent-line inline-block">@{user.slug}</p>
                <p className="text-muted-foreground text-refined">{user.email}</p>
              </div>
            </div>

            {/* Enhanced Statistics */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <PersonIcon className="w-5 h-5 text-accent" />
                  <span className="text-2xl font-light text-foreground">{followers.length}</span>
                </div>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">Seguidores</span>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <HeartIcon className="w-5 h-5 text-accent" />
                  <span className="text-2xl font-light text-foreground">{following.length}</span>
                </div>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">Seguindo</span>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <ChatBubbleIcon className="w-5 h-5 text-accent" />
                  <span className="text-2xl font-light text-foreground">{user.posts?.length || 0}</span>
                </div>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">Publicações</span>
              </div>
            </div>

            {/* Enhanced Status Badges */}
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

          {/* Elegant Separator */}
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

          {/* Enhanced Tabs */}
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
                Postagens ({user.posts?.length || 0})
              </Tabs.Trigger>
              <Tabs.Trigger
                value="comments"
                className="px-6 py-3 rounded-md text-sm font-medium transition-all hover:bg-card data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-refined"
              >
                Commentários ({user.comments?.length || 0})
              </Tabs.Trigger>
              <Tabs.Trigger
                value="social"
                className="px-6 py-3 rounded-md text-sm font-medium transition-all hover:bg-card data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-refined"
              >
                Social ({socialLinks.length})
              </Tabs.Trigger>
              <Tabs.Trigger
                value="followers"
                className="px-6 py-3 rounded-md text-sm font-medium transition-all hover:bg-card data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-refined"
              >
                Seguidores ({followers.length})
              </Tabs.Trigger>
              <Tabs.Trigger
                value="following"
                className="px-6 py-3 rounded-md text-sm font-medium transition-all hover:bg-card data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-refined"
              >
                Seguindo ({following.length})
              </Tabs.Trigger>
            </Tabs.List>

            {/* About Tab */}
            <Tabs.Content value="about" className="mt-8">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-3xl font-light text-foreground heading-refined">Biografia</h2>
                <p className="text-lg text-muted-foreground text-refined leading-relaxed">
                  {user.bio || "No bio available yet. Add one to share your story with the world."}
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

            {/* Posts Tab */}
            <Tabs.Content value="posts" className="mt-8">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-light text-foreground heading-refined">Publicações</h2>
                  <Button
                  color="red"
                    onClick={() => navigate("/posts/new")}
                    className="bg-accent text-white hover:bg-accent/90 shadow-refined flex items-center gap-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Criar Publicação
                  </Button>
                </div>

                {user.posts && user.posts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user.posts.map((post) => (
                      <PostCard key={post.id} post={post} author={user} isOwner={true} onDelete={() => setDeletePostDialogOpen(post.id)} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-refined">
                      No publications yet. Create your first post to get started.
                    </p>
                  </div>
                )}
              </div>
            </Tabs.Content>

            {/* Comments Tab */}
            <Tabs.Content value="comments" className="mt-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-light text-foreground heading-refined">Commentários</h2>
                {user.comments && user.comments.length > 0 ? (
                  <div className="grid gap-4">
                    {user.comments.map((comment) => (
                      <div key={comment.id} className="bg-card border border-border rounded-lg p-4 shadow-refined">
                        <div className="flex justify-between items-start">
                          <p className="text-foreground text-refined mb-3">{comment.content}</p>
                          <button
                            onClick={() => setDeleteCommentDialogOpen(comment.id)}
                            className="w-8 h-8 rounded-full bg-transparent text-zinc-950 hover:bg-red-100 transition-colors flex items-center justify-center"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-refined">No comments yet.</p>
                  </div>
                )}
              </div>
            </Tabs.Content>

            {/* Social Links Tab */}
            <Tabs.Content value="social" className="mt-8">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-light text-foreground heading-refined">Conexões Sociais</h2>
                  <Button
                    color="red"
                    onClick={() => setSocialDialogOpen(true)}
                    className="bg-accent text-white hover:bg-accent/90 shadow-refined flex items-center gap-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Link
                  </Button>
                </div>

                {socialLinks.length > 0 ? (
                  <div className="grid gap-4">
                    {socialLinks.map((link) => (
                      <div
                        key={link.id}
                        className="bg-card border border-border rounded-lg p-4 shadow-refined hover:shadow-refined-lg transition-shadow"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <Badge color='red' className=" text-accent border-accent/20 px-3 py-1 rounded-full">
                              {link.platform.toUpperCase()}
                            </Badge>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-zinc-950 hover:text-accent/80 transition-colors group"
                            >
                              <span className="text-refined group-hover:underline">{link.url}</span>
                              <ExternalLinkIcon className="w-4 h-4" />
                            </a>
                          </div>
                          <button
                            onClick={() => setDeleteDialogOpen(link.id)}
                            className="w-8 h-8 rounded-full bg-transparent text-zinc-950 hover:bg-red-100 transition-colors flex items-center justify-center"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-refined">No social networks registered yet.</p>
                  </div>
                )}
              </div>
            </Tabs.Content>

            {/* Followers Tab */}
            <Tabs.Content value="followers" className="mt-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-light text-foreground heading-refined">Seguindores</h2>
                {followers.length > 0 ? (
                  <div className="grid gap-4">
                    {followers.map((follow) => (
                      <div
                        key={follow.id}
                        className="bg-card border border-border rounded-lg p-4 shadow-refined hover:shadow-refined-lg transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar
                            size="6"
                            radius="full"
                            fallback={follow.follower?.name?.[0] || "U"}
                            src={follow.follower?.avatarUrl ?? undefined}
                            className="border-2 border-border"
                          />
                          <div>
                            <h3 className="font-medium text-foreground">{follow.follower?.name}</h3>
                            <p className="text-muted-foreground text-sm">@{follow.follower?.slug}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-refined">No followers yet.</p>
                  </div>
                )}
              </div>
            </Tabs.Content>

            {/* Following Tab */}
            <Tabs.Content value="following" className="mt-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-light text-foreground heading-refined">Seguindo</h2>
                {following.length > 0 ? (
                  <div className="grid gap-4">
                    {following.map((follow) => (
                      <div
                        key={follow.id}
                        className="bg-card border border-border rounded-lg p-4 shadow-refined hover:shadow-refined-lg transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar
                            size="6"
                            radius="full"
                            fallback={follow.following?.name?.[0] || "U"}
                            src={follow.following?.avatarUrl ?? undefined}
                            className="border-2 border-border"
                          />
                          <div>
                            <h3 className="font-medium text-foreground">{follow.following?.name}</h3>
                            <p className="text-muted-foreground text-sm">@{follow.following?.slug}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-refined">Not following anyone yet.</p>
                  </div>
                )}
              </div>
            </Tabs.Content>
          </Tabs.Root>

          {/* Enhanced Logout Section */}
          <div className="mt-16 pt-8 border-t border-border text-center">
            <Button
              color="red"
              onClick={handleLogout}
              className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 shadow-refined"
            >
              Deslogar
            </Button>
          </div>
        </div>
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

      {/* Enhanced Delete Confirmation Dialog for Social Link */}
      <AlertDialog.Root open={!!deleteDialogOpen} onOpenChange={() => setDeleteDialogOpen(null)}>
        <AlertDialog.Content className="max-w-md bg-card border border-border shadow-refined-lg">
          <AlertDialog.Title className="text-xl font-light text-foreground heading-refined">
            Remover Conexão Social
          </AlertDialog.Title>
          <AlertDialog.Description className="text-muted-foreground text-refined">
            Deseja realmente deletar essa conexão? Essa ação não pode ser retornada
          </AlertDialog.Description>

          <div className="flex gap-3 mt-6 justify-end">
            <AlertDialog.Cancel>
              <Button className="bg-muted text-muted-foreground hover:bg-neutral-200 border-thin">Cancel</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                onClick={() => deleteDialogOpen && handleRemoveSocialLink(deleteDialogOpen)}
                className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
              >
                Remover
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {/* Delete Confirmation Dialog for Post */}
      <AlertDialog.Root open={!!deletePostDialogOpen} onOpenChange={() => setDeletePostDialogOpen(null)}>
        <AlertDialog.Content className="max-w-md bg-card border border-border shadow-refined-lg">
          <AlertDialog.Title className="text-xl font-light text-foreground heading-refined">
            Remover Postagem
          </AlertDialog.Title>
          <AlertDialog.Description className="text-muted-foreground text-refined">
            Deseja realmente deletar essa postagem? Essa ação não pode ser retornada.
          </AlertDialog.Description>

          <div className="flex gap-3 mt-6 justify-end">
            <AlertDialog.Cancel>
              <Button className="bg-muted text-muted-foreground hover:bg-neutral-200 border-thin">Cancelar</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                onClick={() => deletePostDialogOpen && handleRemovePost(deletePostDialogOpen)}
                className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
              >
                Remover
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {/* Delete Confirmation Dialog for Comment */}
      <AlertDialog.Root open={!!deleteCommentDialogOpen} onOpenChange={() => setDeleteCommentDialogOpen(null)}>
        <AlertDialog.Content className="max-w-md bg-card border border-border shadow-refined-lg">
          <AlertDialog.Title className="text-xl font-light text-foreground heading-refined">
            Remover Comentário
          </AlertDialog.Title>
          <AlertDialog.Description className="text-muted-foreground text-refined">
            Deseja realmente deletar esse comentário? Essa ação não pode ser retornada.
          </AlertDialog.Description>

          <div className="flex gap-3 mt-6 justify-end">
            <AlertDialog.Cancel>
              <Button className="bg-muted text-muted-foreground hover:bg-neutral-200 border-thin">Cancelar</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                onClick={() => deleteCommentDialogOpen && handleRemoveComment(deleteCommentDialogOpen)}
                className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
              >
                Remover
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  )
}
