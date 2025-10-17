

import type React from "react"

import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  Menu,
  Search,
  User,
  Settings,
  LogOut,
  Home,
  Tag,
  FolderOpen,
  Users,
  BookOpen,
  TrendingUp,
  Star,
  Plus,
  ChevronDown,
} from "lucide-react"

import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

import { postService } from "../../services/post"
import type { Category, Tag as TagType } from "../../types"

import useAuthStore from "../../store/auth"
import { MobileSidebar } from "./MobileSidebar"
import Logo from "../Common/BrandIcon"
import { cn } from "@/app/lib/utils"
import { SearchSidebar } from "./SearchSidebar"
import { Input } from "../ui/input"

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavSidebarOpen, setIsNavSidebarOpen] = useState(false)
  const [isSearchSidebarOpen, setIsSearchSidebarOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<TagType[]>([])
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const [categoriesResponse, tagsResponse] = await Promise.all([
        postService.getAllCategories(),
        postService.getAllTags(),
      ])
      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories((categoriesResponse.data as any).categories || [])
      }
      if (tagsResponse.success && tagsResponse.data) {
        setTags((tagsResponse.data as any).tags || [])
      }
    }
    fetchData()
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsSearchActive(false)
    }
  }

  const isActivePath = (path: string) => {
    if (path === "/") return location.pathname === "/"
    return location.pathname.startsWith(path)
  }

  const navigationItems = [
    { label: "Início", href: "/", icon: Home },
    { label: "Autores", href: "/authors", icon: Users },
    { label: "Populares", href: "/popular", icon: TrendingUp },
    { label: "Recomendados", href: "/featured", icon: Star },
  ]

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled ? "bg-white/95 backdrop-blur-sm border-b border-black/10" : "bg-white border-b border-black/5",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Logo href="/" size="lg" variant="minimal" />

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.label}
                    href={item.href}
                    isActive={isActivePath(item.href)}
                    onClick={() => navigate(item.href)}
                  >
                    {item.label}
                  </NavLink>
                ))}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "group relative flex items-center gap-1.5 px-3 py-2 text-sm font-light transition-all duration-200",
                        "text-black/60 hover:text-black",
                        "focus-visible:outline-none",
                      )}
                    >
                      Categorias
                      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-black transition-all duration-300 group-hover:w-full" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 border border-black/10 bg-white shadow-sm" align="start">
                    <DropdownMenuLabel className="flex items-center gap-2 font-light text-black/80">
                      <FolderOpen className="h-3.5 w-3.5" />
                      Categorias
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-black/5" />
                    <DropdownMenuGroup>
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <DropdownMenuItem
                            key={category.id}
                            onClick={() => navigate(`/search?query=${encodeURIComponent(category.name)}`)}
                            className="cursor-pointer font-light text-black/70 hover:text-black hover:bg-black/5 focus:bg-black/5 focus:text-black transition-colors"
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{category.name}</span>
                              {category._count?.posts !== undefined && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs ml-2 bg-black/5 text-black/60 border-black/10 font-light"
                                >
                                  {category._count.posts}
                                </Badge>
                              )}
                            </div>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem disabled className="font-light text-black/40">
                          Nenhuma categoria disponível
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "group relative flex items-center gap-1.5 px-3 py-2 text-sm font-light transition-all duration-200",
                        "text-black/60 hover:text-black",
                        "focus-visible:outline-none",
                      )}
                    >
                      Tags
                      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-black transition-all duration-300 group-hover:w-full" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 border border-black/10 bg-white shadow-sm" align="start">
                    <DropdownMenuLabel className="flex items-center gap-2 font-light text-black/80">
                      <Tag className="h-3.5 w-3.5" />
                      Tags
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-black/5" />
                    <DropdownMenuGroup>
                      {tags.length > 0 ? (
                        tags.map((tag) => (
                          <DropdownMenuItem
                            key={tag.id}
                            onClick={() => navigate(`/search?query=${encodeURIComponent(tag.name)}`)}
                            className="cursor-pointer font-light text-black/70 hover:text-black hover:bg-black/5 focus:bg-black/5 focus:text-black transition-colors"
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{tag.name}</span>
                              {tag._count?.posts !== undefined && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs ml-2 bg-black/5 text-black/60 border-black/10 font-light"
                                >
                                  {tag._count.posts}
                                </Badge>
                              )}
                            </div>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem disabled className="font-light text-black/40">
                          Nenhuma tag disponível
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1">
              <div className="hidden lg:flex items-center">
                {isSearchActive ? (
                  <form onSubmit={handleSearchSubmit}>
                    <Input
                      placeholder="Pesquisar..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      onBlur={() => {
                        if (!searchQuery) setIsSearchActive(false)
                      }}
                      className="h-9 w-56 border border-black/10 bg-white text-black placeholder:text-black/40 focus-visible:ring-1 focus-visible:ring-black/20 font-light"
                    />
                  </form>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchActive(true)}
                    className="hover:bg-black/5 text-black/60 hover:text-black transition-colors"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Mobile Search Button */}
              <Sheet open={isSearchSidebarOpen} onOpenChange={setIsSearchSidebarOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden hover:bg-black/5 text-black/60 hover:text-black"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[320px] p-0 border-r border-black/10 bg-white">
                  <SearchSidebar onClose={() => setIsSearchSidebarOpen(false)} />
                </SheetContent>
              </Sheet>

              {isAuthenticated && (
                <Button
                  onClick={() => navigate("/posts/new")}
                  size="sm"
                  className="hidden sm:flex gap-2 bg-black text-white hover:bg-black/90 border border-black font-light transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nova Publicação</span>
                </Button>
              )}

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-2 py-1 rounded-md transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/20">
                      <Avatar className="h-8 w-8 border border-black/10">
                        <AvatarImage
                          src={user?.avatarUrl || undefined}
                          alt={user?.name || "User"}
                          className="grayscale"
                        />
                        <AvatarFallback className="bg-black/5 text-black font-light text-xs border border-black/10">
                          {user?.name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:block max-w-[100px] truncate text-sm font-light text-black">
                        {user?.name}
                      </span>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-56 border border-black/10 bg-white shadow-sm" align="end">
                    {/* User Info Header */}
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-normal text-black">{user?.name}</p>
                        <p className="text-xs font-light text-black/60">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="bg-black/5" />

                    {/* Menu Items */}
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => navigate("/profile")}
                        className="cursor-pointer focus:bg-black/5 hover:bg-black/5 group transition-colors"
                      >
                        <div className="flex items-center w-full">
                          <User className="mr-2 h-3.5 w-3.5 text-black/50 group-hover:text-black transition-colors" />
                          <span className="text-black/70 group-hover:text-black transition-colors font-light">
                            Meu Perfil
                          </span>
                        </div>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => navigate("/my-posts")}
                        className="cursor-pointer focus:bg-black/5 hover:bg-black/5 group transition-colors"
                      >
                        <div className="flex items-center w-full">
                          <BookOpen className="mr-2 h-3.5 w-3.5 text-black/50 group-hover:text-black transition-colors" />
                          <span className="text-black/70 group-hover:text-black transition-colors font-light">
                            Minhas Publicações
                          </span>
                        </div>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => navigate("/settings")}
                        className="cursor-pointer focus:bg-black/5 hover:bg-black/5 group transition-colors"
                      >
                        <div className="flex items-center w-full">
                          <Settings className="mr-2 h-3.5 w-3.5 text-black/50 group-hover:text-black transition-colors" />
                          <span className="text-black/70 group-hover:text-black transition-colors font-light">
                            Configurações
                          </span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="bg-black/5" />

                    {/* Logout */}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer focus:bg-black/5 hover:bg-black/5 group transition-colors"
                    >
                      <div className="flex items-center w-full">
                        <LogOut className="mr-2 h-3.5 w-3.5 text-black/50 group-hover:text-black transition-colors" />
                        <span className="text-black/70 group-hover:text-black transition-colors font-light">Sair</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-black/5" />
                    <div className="px-2 py-1.5 text-[10px] text-black/40 text-center font-light">
                      © {new Date().getFullYear()} All rights reserved
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/login")}
                    size="sm"
                    className="hover:bg-black/5 text-black/70 hover:text-black font-light"
                  >
                    Entrar
                  </Button>
                  <Button
                    onClick={() => navigate("/register")}
                    className="bg-black text-white hover:bg-black/90 border border-black font-light"
                    size="sm"
                  >
                    Registrar
                  </Button>
                </div>
              )}

              {/* Mobile Nav Menu */}
              <Sheet open={isNavSidebarOpen} onOpenChange={setIsNavSidebarOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden hover:bg-black/5 text-black/60 hover:text-black"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] p-0 border-l border-black/10 bg-white">
                  <MobileSidebar
                    navigationItems={[
                      ...navigationItems,
                      { label: "Categorias", href: "/categories", icon: FolderOpen },
                      { label: "Tags", href: "/tags", icon: Tag },
                    ]}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-black/5 py-2">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs text-black/40 font-light">
            © {new Date().getFullYear()} All rights reserved. Designed with precision and care.
          </p>
        </div>
      </div>
    </>
  )
}

function NavLink({
  isActive,
  onClick,
  children,
}: {
  href: string
  isActive: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative px-3 py-2 text-sm font-light transition-colors duration-200",
        isActive ? "text-black" : "text-black/60 hover:text-black",
      )}
    >
      {children}
      <span
        className={cn(
          "absolute bottom-0 left-0 h-[1px] bg-black transition-all duration-300",
          isActive ? "w-full" : "w-0 group-hover:w-full",
        )}
      />
    </button>
  )
}
