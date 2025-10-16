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
} from 'lucide-react';

import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from '../ui/navigation-menu';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

import { postService } from '../../services/post';
import type { Category, Tag as TagType } from '../../types';

import useAuthStore from '../../store/auth';
import { MobileSidebar } from './MobileSidebar';
import Logo from '../Common/BrandIcon';
import { cn } from '@/app/lib/utils';
import { SearchSidebar } from './SearchSidebar';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavSidebarOpen, setIsNavSidebarOpen] = useState(false);
  const [isSearchSidebarOpen, setIsSearchSidebarOpen] = useState(false);
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

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navigationItems = [
    { label: 'Início', href: '/', icon: Home },
    { label: 'Categorias', href: '/categories', icon: FolderOpen, items: categories.map((c) => ({ label: c.name, href: `/search?category=${encodeURIComponent(c.name)}`, count: c._count?.posts ?? 0 })) },
    { label: 'Tags', href: '/tags', icon: Tag, items: tags.map((t) => ({ label: t.name, href: `/search?tags=${encodeURIComponent(t.name)}`, count: t._count?.posts ?? 0 })) },
    { label: 'Autores', href: '/authors', icon: Users },
    { label: 'Populares', href: '/popular', icon: TrendingUp },
    { label: 'Recomendados', href: '/featured', icon: Star }
  ];

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
                              <ListItem
                                key={subItem.href}
                                title={subItem.label}
                                href={subItem.href}
                                count={subItem.count}
                              />
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink
                        href={item.href}
                        onClick={(e) => { e.preventDefault(); navigate(item.href); }}
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
          <div className="flex items-center gap-1">
            {/* Desktop Search Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/search')}
              className="hidden lg:flex"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Mobile Search Button */}
            <Sheet open={isSearchSidebarOpen} onOpenChange={setIsSearchSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
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
                className="hidden sm:flex gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Nova Publicação</span>
              </Button>
            )}

            {/* User Menu / Auth Buttons */}
            {isAuthenticated ? (
               <NavigationMenu className="hidden lg:flex">
                <NavigationMenuList>
                  <NavigationMenuItem>
                      <NavigationMenuTrigger className="gap-2">
                        <Avatar className="h-7 w-7 border-2 border-primary/10">
                          <AvatarImage src={user?.avatarUrl || undefined} alt={user?.name || 'User'} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="max-w-[100px] truncate text-sm">{user?.name}</span>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-2 p-4">
                          <li className="row-span-3">
                            <div className="flex flex-col space-y-2 p-4 rounded-lg bg-muted/50">
                              <p className="text-sm font-medium leading-none">{user?.name}</p>
                              <p className="text-xs leading-none text-muted-foreground">
                                {user?.email}
                              </p>
                            </div>
                          </li>
                          <ListItem title="Meu Perfil" href="/profile" icon={<User className="h-4 w-4" />} />
                          <ListItem title="Minhas Publicações" href="/my-posts" icon={<BookOpen className="h-4 w-4" />} />
                          <ListItem title="Configurações" href="/settings" icon={<Settings className="h-4 w-4" />} />
                          <li>
                            <NavigationMenuLink asChild>
                              <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 rounded-md p-3 text-sm leading-none transition-colors text-red-600 hover:bg-destructive/10 hover:text-destructive"
                              >
                                <LogOut className="h-4 w-4" />
                                <span className="font-medium">Sair</span>
                              </button>
                            </NavigationMenuLink>
                          </li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate('/login')} size="sm">Entrar</Button>
                <Button onClick={() => navigate('/register')} className='bg-zinc-50 text-zinc-900 hover:bg-zinc-200 hover:text-zinc-900'>Registrar</Button>
              </div>
            )}

            {/* Mobile Nav Menu */}
            <Sheet open={isNavSidebarOpen} onOpenChange={setIsNavSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] p-0">
                <MobileSidebar 
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

function ListItem({
  title,
  href,
  count,
  icon,
}: {
  title: string;
  href: string;
  count?: number;
  icon?: React.ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          href={href}
          onClick={(e) => {
            e.preventDefault();
            navigate(href);
          }}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {icon && <span className="text-muted-foreground group-hover:text-accent-foreground flex-shrink-0">{icon}</span>}
              <div className="text-sm font-medium leading-none truncate">{title}</div>
            </div>
            {count !== undefined && (
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                {count}
              </Badge>
            )}
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
}
