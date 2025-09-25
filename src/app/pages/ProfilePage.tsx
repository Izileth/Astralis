import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Avatar,
  Separator,
  Badge,
  Tabs,
  Dialog,
  TextField,
  TextArea,
  IconButton,
  AlertDialog,
  Select,
  Spinner
} from "@radix-ui/themes";
import { 
  Pencil1Icon, 
  PlusIcon, 
  TrashIcon, 
  ExternalLinkIcon,
  PersonIcon,
  HeartIcon,
  ChatBubbleIcon
} from "@radix-ui/react-icons";

import useAuthStore from "../store/auth";
import { useCurrentUser, useFollowers, useFollowing, useSocialLinks } from "../hooks/user";
import { useAuthorPosts } from "../hooks/post";
import { PostList } from "../components/Post/PostList";
import type { User, UpdateUser, CreateSocialLink } from "../types";

// Componente para editar perfil
function EditProfileDialog({ 
  open, 
  onClose, 
  user, 
  onUpdate 
}: { 
  open: boolean; 
  onClose: () => void; 
  user: User; 
  onUpdate: (data: UpdateUser) => Promise<void>;
}) {
  const [formData, setFormData] = useState<UpdateUser>({
    name: user.name,
    bio: user.bio || "",
    avatarUrl: user.avatarUrl || "",
    bannerUrl: user.bannerUrl || "",
    status: user.status || "active",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onUpdate(formData);
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: 500 }}>
        <Dialog.Title>Editar Perfil</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Atualize suas informações pessoais
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4">
            <Box>
              <Text as="label" size="2" weight="bold">Nome</Text>
              <TextField.Root
                value={formData.name || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Seu nome"
                required
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="bold">Bio</Text>
              <TextArea
                value={formData.bio || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Conte um pouco sobre você..."
                rows={3}
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="bold">URL do Avatar</Text>
              <TextField.Root
                value={formData.avatarUrl || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                placeholder="https://exemplo.com/avatar.jpg"
                type="url"
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="bold">URL do Banner</Text>
              <TextField.Root
                value={formData.bannerUrl || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, bannerUrl: e.target.value }))}
                placeholder="https://exemplo.com/banner.jpg"
                type="url"
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="bold">Status</Text>
              <Select.Root
                value={formData.status || "active"}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <Select.Trigger placeholder="Selecione o status" />
                <Select.Content>
                  <Select.Item value="active">Ativo</Select.Item>
                  <Select.Item value="inactive">Inativo</Select.Item>
                  <Select.Item value="busy">Ocupado</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray" type="button">
                  Cancelar
                </Button>
              </Dialog.Close>
              <Button type="submit" loading={isLoading}>
                Salvar Alterações
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}

// Componente para adicionar link social
function AddSocialLinkDialog({ 
  open, 
  onClose, 
  onAdd 
}: { 
  open: boolean; 
  onClose: () => void; 
  onAdd: (data: CreateSocialLink) => Promise<void>;
}) {
  const [formData, setFormData] = useState<CreateSocialLink>({
    platform: "",
    url: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onAdd(formData);
      setFormData({ platform: "", url: "" });
      onClose();
    } catch (error) {
      console.error("Erro ao adicionar link social:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: 400 }}>
        <Dialog.Title>Adicionar Rede Social</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Adicione um novo link para suas redes sociais
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4">
            <Box>
              <Text as="label" size="2" weight="bold">Plataforma</Text>
              <Select.Root
                value={formData.platform}
                onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
              >
                <Select.Trigger placeholder="Selecione a plataforma" />
                <Select.Content>
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
            </Box>

            <Box>
              <Text as="label" size="2" weight="bold">URL</Text>
              <TextField.Root
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://instagram.com/seu_usuario"
                type="url"
                required
              />
            </Box>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray" type="button">
                  Cancelar
                </Button>
              </Dialog.Close>
              <Button type="submit" loading={isLoading} disabled={!formData.platform || !formData.url}>
                Adicionar
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore() as { user: User | null; logout: () => void };
  const { updateProfile } = useCurrentUser();
  const { followers } = useFollowers(user?.id);
  const { following } = useFollowing(user?.id);
  const { socialLinks, addLink, removeLink } = useSocialLinks(user?.id);
  const {  loading: isLoadingPosts, error: postsError } = useAuthorPosts(user?.id, undefined, !!user?.id);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);

  console.log("Dados do usuário que chegaram ao componente",user)
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUpdateProfile = async (data: UpdateUser) => {
    try {
      await updateProfile(data);
      // O store será atualizado automaticamente
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  const handleAddSocialLink = async (data: CreateSocialLink) => {
    try {
      await addLink(data);
    } catch (error) {
      console.error("Erro ao adicionar link social:", error);
    }
  };

  const handleRemoveSocialLink = async (linkId: string) => {
    try {
      await removeLink(linkId);
      setDeleteDialogOpen(null);
    } catch (error) {
      console.error("Erro ao remover link social:", error);
    }
  };

  if (!user) {
    console.log("Dados do usuário que chegaram ao componente",user)
    return (
      <Flex align="center" justify="center" style={{ height: "100vh" }}>
        <Text size="5" weight="bold">
          Carregando perfil...
        </Text>
      </Flex>
    );
  }
  

  return (
    <Flex
      direction="column"
      align="center"
      style={{ minHeight: "100vh", background: "#f8f9fa" }}
    >
      {/* Banner */}
      {user.bannerUrl && (
        <Box
          style={{
            width: "100%",
            height: 220,
            backgroundImage: `url(${user.bannerUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderBottom: "2px solid #eaeaea",
          }}
        />
      )}

      {/* Card Principal */}
      <Card
        style={{
          width: "90%",
          maxWidth: 900,
          marginTop: user.bannerUrl ? "-70px" : "2rem",
          padding: "2rem",
          boxShadow: "0px 6px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Flex direction="column" align="center" gap="4">
          {/* Avatar + Botão de Editar */}
          <Box style={{ position: "relative" }}>
            <Avatar
              size="9"
              radius="full"
              fallback={user.name?.[0] || "U"}
              src={user.avatarUrl ?? undefined}
              style={{ border: "4px solid white" }}
            />
            <IconButton
              size="2"
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                borderRadius: "50%",
              }}
              onClick={() => setEditDialogOpen(true)}
            >
              <Pencil1Icon />
            </IconButton>
          </Box>

          {/* Nome + Email */}
          <Heading size="6" weight="bold">
            {user.name}
          </Heading>
          <Text color="gray" size="3">
            @{user.slug}
          </Text>
          <Text color="gray" size="2">
            {user.email}
          </Text>

          {/* Estatísticas */}
          <Flex gap="6" mt="3">
            <Flex align="center" gap="2">
              <PersonIcon />
              <Text size="2" weight="bold">{followers.length}</Text>
              <Text size="2" color="gray">Seguidores</Text>
            </Flex>
            <Flex align="center" gap="2">
              <HeartIcon />
              <Text size="2" weight="bold">{following.length}</Text>
              <Text size="2" color="gray">Seguindo</Text>
            </Flex>
            <Flex align="center" gap="2">
              <ChatBubbleIcon />
              <Text size="2" weight="bold">{user.posts?.length || 0}</Text>
              <Text size="2" color="gray">Posts</Text>
            </Flex>
          </Flex>

          {/* Status + Verificado */}
          <Flex gap="3" mt="3">
            <Badge color={user.status === "active" ? "green" : user.status === "busy" ? "orange" : "red"}>
              {user.status === "active" ? "Ativo" : user.status === "busy" ? "Ocupado" : "Inativo"}
            </Badge>
            <Badge color={user.verified ? "blue" : "gray"}>
              {user.verified ? "Verificado" : "Não verificado"}
            </Badge>
          </Flex>

          <Separator my="4" size="4" />

          {/* Tabs */}
          <Tabs.Root defaultValue="about" style={{ width: "100%" }}>
            <Tabs.List>
              <Tabs.Trigger value="about">Sobre</Tabs.Trigger>
              <Tabs.Trigger value="posts">Posts ({user.posts?.length || 0})</Tabs.Trigger>
              <Tabs.Trigger value="comments">Comentários ({user.comments?.length || 0})</Tabs.Trigger>
              <Tabs.Trigger value="social">Redes Sociais ({socialLinks.length})</Tabs.Trigger>
              <Tabs.Trigger value="followers">Seguidores ({followers.length})</Tabs.Trigger>
              <Tabs.Trigger value="following">Seguindo ({following.length})</Tabs.Trigger>
            </Tabs.List>

            {/* Sobre */}
            <Tabs.Content value="about">
              <Box mt="4" style={{ textAlign: "center" }}>
                <Heading size="4" mb="2">
                  Sobre Mim
                </Heading>
                <Text size="3">{user.bio || "Nenhuma bio disponível."}</Text>
                <Text size="2" color="gray" mt="3">
                  Membro desde: {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                </Text>
              </Box>
            </Tabs.Content>

            {/* Posts */}
            <Tabs.Content value="posts">
              <Box mt="4">
                <Flex justify="between" align="center" mb="3">
                  <Heading size="4">
                    Minhas Publicações
                  </Heading>
                  <Button size="2" onClick={() => navigate('/posts/new')}>
                    <PlusIcon /> Criar Novo Post
                  </Button>
                </Flex>
                {isLoadingPosts && <Spinner />}
                {postsError && <Text color="red">{postsError}</Text>}
                {!isLoadingPosts && !postsError && <PostList />}
              </Box>
            </Tabs.Content>

            {/* Comentários */}
            <Tabs.Content value="comments">
              <Box mt="4">
                <Heading size="4" mb="2">
                  Comentários
                </Heading>
                {user.comments && user.comments.length > 0 ? (
                  <Flex direction="column" gap="3">
                    {user.comments.map((comment) => (
                      <Card key={comment.id} style={{ padding: "1rem" }}>
                        <Text size="3">{comment.content}</Text>
                        <Text size="2" color="gray" mt="2">
                          {new Date(comment.createdAt).toLocaleString("pt-BR")}
                        </Text>
                      </Card>
                    ))}
                  </Flex>
                ) : (
                  <Text color="gray">Nenhum comentário ainda.</Text>
                )}
              </Box>
            </Tabs.Content>

            {/* Redes Sociais */}
            <Tabs.Content value="social">
              <Box mt="4">
                <Flex justify="between" align="center" mb="3">
                  <Heading size="4">
                    Redes Sociais
                  </Heading>
                  <Button size="2" onClick={() => setSocialDialogOpen(true)}>
                    <PlusIcon /> Adicionar
                  </Button>
                </Flex>
                
                {socialLinks.length > 0 ? (
                  <Flex direction="column" gap="3">
                    {socialLinks.map((link) => (
                      <Card key={link.id} style={{ padding: "1rem" }}>
                        <Flex justify="between" align="center">
                          <Flex align="center" gap="3">
                            <Badge color="blue">{link.platform.toUpperCase()}</Badge>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: "none" }}
                            >
                              <Flex align="center" gap="2">
                                <Text size="3" color="blue">
                                  {link.url}
                                </Text>
                                <ExternalLinkIcon />
                              </Flex>
                            </a>
                          </Flex>
                          <IconButton
                            size="1"
                            color="red"
                            variant="soft"
                            onClick={() => setDeleteDialogOpen(link.id)}
                          >
                            <TrashIcon />
                          </IconButton>
                        </Flex>
                      </Card>
                    ))}
                  </Flex>
                ) : (
                  <Text color="gray">Nenhuma rede social cadastrada.</Text>
                )}
              </Box>
            </Tabs.Content>

            {/* Seguidores */}
            <Tabs.Content value="followers">
              <Box mt="4">
                <Heading size="4" mb="3">
                  Seguidores
                </Heading>
                {followers.length > 0 ? (
                  <Flex direction="column" gap="3">
                    {followers.map((follow) => (
                      <Card key={follow.id} style={{ padding: "1rem" }}>
                        <Flex align="center" gap="3">
                          <Avatar
                            size="3"
                            radius="full"
                            fallback={follow.follower?.name?.[0] || "U"}
                            src={follow.follower?.avatarUrl ?? undefined}
                          />
                          <Box>
                            <Text size="3" weight="bold">
                              {follow.follower?.name}
                            </Text>
                            <Text size="2" color="gray">
                              @{follow.follower?.slug}
                            </Text>
                          </Box>
                        </Flex>
                      </Card>
                    ))}
                  </Flex>
                ) : (
                  <Text color="gray">Nenhum seguidor ainda.</Text>
                )}
              </Box>
            </Tabs.Content>

            {/* Seguindo */}
            <Tabs.Content value="following">
              <Box mt="4">
                <Heading size="4" mb="3">
                  Seguindo
                </Heading>
                {following.length > 0 ? (
                  <Flex direction="column" gap="3">
                    {following.map((follow) => (
                      <Card key={follow.id} style={{ padding: "1rem" }}>
                        <Flex align="center" gap="3">
                          <Avatar
                            size="3"
                            radius="full"
                            fallback={follow.following?.name?.[0] || "U"}
                            src={follow.following?.avatarUrl ?? undefined}
                          />
                          <Box>
                            <Text size="3" weight="bold">
                              {follow.following?.name}
                            </Text>
                            <Text size="2" color="gray">
                              @{follow.following?.slug}
                            </Text>
                          </Box>
                        </Flex>
                      </Card>
                    ))}
                  </Flex>
                ) : (
                  <Text color="gray">Não está seguindo ninguém ainda.</Text>
                )}
              </Box>
            </Tabs.Content>
          </Tabs.Root>

          <Separator my="4" />

          {/* Botão de logout */}
          <Button color="red" variant="solid" onClick={handleLogout}>
            Sair
          </Button>
        </Flex>
      </Card>

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

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog.Root open={!!deleteDialogOpen} onOpenChange={() => setDeleteDialogOpen(null)}>
        <AlertDialog.Content style={{ maxWidth: 450 }}>
          <AlertDialog.Title>Remover Rede Social</AlertDialog.Title>
          <AlertDialog.Description>
            Tem certeza que deseja remover este link? Esta ação não pode ser desfeita.
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancelar
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                variant="solid"
                color="red"
                onClick={() => deleteDialogOpen && handleRemoveSocialLink(deleteDialogOpen)}
              >
                Remover
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Flex>
  );
}