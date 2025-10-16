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
  Bell
} from 'lucide-react';

import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuSubTrigger, 
  DropdownMenuLabel,
  DropdownMenuGroup
} from '../ui/dropdown-menu';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '../ui/navigation-menu';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

import { postService } from '../../services/post';
import  type { Category, Tag as TagType } from '../../types';

import useAuthStore from '../../store/auth';
import { MobileSidebar } from './MobileSidebar';
import Logo from '../Common/BrandIcon';
import { cn } from '@/app/lib/utils';

export function Header({ onDesktopSearchIconClick }: { onSearchIconClick: () => void, onDesktopSearchIconClick: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);

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

  const navigationItems = [
    {
      label: 'Início',
      href: '/',
      icon: Home,
    },
    {
      label: 'Categorias',
      href: '/categories',
      icon: FolderOpen,
      items: categories.map((category) => ({
        label: category.name,
        href: `/search?category=${encodeURIComponent(category.name)}`,
        count: category._count?.posts ?? 0,
      })),
    },
    {
      label: 'Tags',
      href: '/tags',
      icon: Tag,
      items: tags.map((tag) => ({
        label: tag.name,
        href: `/search?tags=${encodeURIComponent(tag.name)}`,
        count: tag._count?.posts ?? 0,
      })),
    },
    {
      label: 'Autores',
      href: '/authors',
      icon: Users,
    },
    {
      label: 'Populares',
      href: '/popular',
      icon: TrendingUp,
    },
    {
      label: 'Recomendados',
      href: '/featured',
      icon: Star,
    }
  ];

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-200 border-b",
      isScrolled 
        ? "bg-background/95 backdrop-blur-md border-border/50 shadow-sm" 
        : "bg-background border-border/30"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Logo href='/' size='lg' variant='minimal'/>
            
            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.label}>
                    {item.items ? (
                      <>
                        <NavigationMenuTrigger 
                          className={cn(
                            "text-sm font-medium transition-colors hover:text-primary data-[active]:text-primary data-[state=open]:text-primary",
                            isActivePath(item.href) && "text-primary"
                          )}
                        >
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {item.items.map((subItem) => (
                              <NavigationMenuLink
                                key={subItem.href}
                                href={subItem.href}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors group"
                              >
                                <div className="space-y-1">
                                  <div className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                                    {subItem.label}
                                  </div>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {subItem.count}
                                </Badge>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink
                        href={item.href}
                        className={cn(
                          "text-sm font-medium transition-colors hover:text-primary px-4 py-2 rounded-md",
                          isActivePath(item.href) 
                            ? "text-primary bg-primary/10" 
                            : "text-foreground/60"
                        )}
                      >
                        {item.label}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onDesktopSearchIconClick}
              className="hidden sm:flex"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Create Post Button */}
            {isAuthenticated && (
              <Button 
                onClick={() => navigate('/create-post')}
                size="sm"
                className="hidden sm:flex gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Nova Publicação</span>
              </Button>
            )}

            {/* Notifications */}
            {isAuthenticated && (
              <Button variant="ghost" size="icon" className="hidden sm:flex relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 border-2 border-primary/10">
                      <AvatarImage src={user?.avatarUrl || undefined} alt={user?.name || 'User'} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="h-4 w-4 mr-2" />
                      <span>Meu Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-posts')}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>Minhas Publicações</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="h-4 w-4 mr-2" />
                      <span>Configurações</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  size="sm"
                >
                  Entrar
                </Button>
                <Button 
                  onClick={() => navigate('/register')}
                  className='bg-zinc-50 text-zinc-900 hover:bg-zinc-200 hover:text-zinc-900'
                >
                  Registrar
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <MobileSidebar 
                    isOpen={isSidebarOpen} 
                    onClose={() => setIsSidebarOpen(false)} 
                    navigationItems={navigationItems} 
                  />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}