import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
} from 'lucide-react';

import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import { postService } from '../../services/post';
import type { Category, Tag as TagType } from '../../types';

import useAuthStore from '../../store/auth';
import { MobileSidebar } from './MobileSidebar';
import Logo from '../Common/BrandIcon';
import { cn } from '@/app/lib/utils';
import { SearchSidebar } from './SearchSidebar';
import { Input } from '../ui/input';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavSidebarOpen, setIsNavSidebarOpen] = useState(false);
  const [isSearchSidebarOpen, setIsSearchSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [categoriesResponse, tagsResponse] = await Promise.all([
        postService.getAllCategories(),
        postService.getAllTags(),
      ]);
      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories((categoriesResponse.data as any).categories || []);
      }
      if (tagsResponse.success && tagsResponse.data) {
        setTags((tagsResponse.data as any).tags || []);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchActive(false);
    }
  };

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navigationItems = [
    { label: 'Início', href: '/', icon: Home },
    { label: 'Autores', href: '/authors', icon: Users },
    { label: 'Populares', href: '/popular', icon: TrendingUp },
    { label: 'Recomendados', href: '/featured', icon: Star }
  ];

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled 
        ? "bg-background/80 backdrop-blur-lg border-b border-border/40" 
        : "bg-background/50 border-b border-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Logo href='/' size='lg' variant='minimal'/>
            
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

              {/* Categories Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "group relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors",
                    "text-foreground/60 hover:text-foreground",
                    "focus-visible:outline-none"
                  )}>
                    Categorias
                    <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]:rotate-180" />
                    <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    Categorias
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <DropdownMenuItem
                          key={category.id}
                          onClick={() => navigate(`/search?query=${encodeURIComponent(category.name)}`)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{category.name}</span>
                            {category._count?.posts !== undefined && (
                              <Badge variant="secondary" className="text-xs ml-2">
                                {category._count.posts}
                              </Badge>
                            )}
                          </div>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem disabled>
                        Nenhuma categoria disponível
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Tags Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "group relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors",
                    "text-foreground/60 hover:text-foreground",
                    "focus-visible:outline-none"
                  )}>
                    Tags
                    <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]:rotate-180" />
                    <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {tags.length > 0 ? (
                      tags.map((tag) => (
                        <DropdownMenuItem
                          key={tag.id}
                          onClick={() => navigate(`/search?query=${encodeURIComponent(tag.name)}`)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{tag.name}</span>
                            {tag._count?.posts !== undefined && (
                              <Badge variant="secondary" className="text-xs ml-2">
                                {tag._count.posts}
                              </Badge>
                            )}
                          </div>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem disabled>
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
            {/* Desktop Search */}
            <div className="hidden lg:flex items-center">
              {isSearchActive ? (
                <form onSubmit={handleSearchSubmit}>
                  <Input
                    placeholder="Pesquisar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    onBlur={() => {
                      if (!searchQuery) setIsSearchActive(false);
                    }}
                    className="h-9 w-56 border-border/40"
                  />
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchActive(true)}
                  className="hover:bg-transparent hover:text-foreground"
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Mobile Search Button */}
            <Sheet open={isSearchSidebarOpen} onOpenChange={setIsSearchSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden hover:bg-transparent">
                  <Search className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] p-0">
                <SearchSidebar onClose={() => setIsSearchSidebarOpen(false)} />
              </SheetContent>
            </Sheet>

            {/* Create Post Button */}
            {isAuthenticated && (
              <Button 
                onClick={() => navigate('/posts/new')}
                size="sm"
                className="hidden sm:flex gap-2 bg-foreground text-background hover:bg-foreground/90"
              >
                <Plus className="h-4 w-4" />
                <span>Nova Publicação</span>
              </Button>
            )}

            {/* User Menu / Auth Buttons */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-2 py-1 rounded-md transition-colors hover:bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <Avatar className="h-8 w-8 border border-border/40">
                      <AvatarImage src={user?.avatarUrl || undefined} alt={user?.name || 'User'} />
                      <AvatarFallback className="bg-muted text-foreground font-medium text-xs">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:block max-w-[100px] truncate text-sm font-medium">
                      {user?.name}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Meu Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-posts')} className="cursor-pointer">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Minhas Publicações</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')} 
                  size="sm"
                  className="hover:bg-transparent"
                >
                  Entrar
                </Button>
                <Button 
                  onClick={() => navigate('/register')} 
                  className="bg-foreground text-background hover:bg-foreground/90"
                  size="sm"
                >
                  Registrar
                </Button>
              </div>
            )}

            {/* Mobile Nav Menu */}
            <Sheet open={isNavSidebarOpen} onOpenChange={setIsNavSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden hover:bg-transparent">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] p-0">
                <MobileSidebar 
                  navigationItems={[
                    ...navigationItems,
                    { label: 'Categorias', href: '/categories', icon: FolderOpen },
                    { label: 'Tags', href: '/tags', icon: Tag }
                  ]}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

// Componente de Link de Navegação com animação de barra
function NavLink({  
  isActive, 
  onClick, 
  children 
}: { 
  href: string; 
  isActive: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative px-3 py-2 text-sm font-medium transition-colors",
        isActive 
          ? "text-foreground" 
          : "text-foreground/60 hover:text-foreground"
      )}
    >
      {children}
      <span 
        className={cn(
          "absolute bottom-0 left-0 h-[2px] bg-foreground transition-all duration-300",
          isActive ? "w-full" : "w-0 group-hover:w-full"
        )} 
      />
    </button>
  );
}