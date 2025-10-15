import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Home, 
  User, 
  LogOut, 
  LogIn, 
  Plus, 
  BookOpen,
  FolderOpen,
  Tag,
  Users,
  TrendingUp,
  Star,
  Settings,
  Bell,
  Search,
  ChevronRight
} from 'lucide-react';

import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '../ui/sheet';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';

import useAuthStore from '../../store/auth';
import { cn } from '@/app/lib/utils';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems?: any[];
  isAuthenticated?: boolean;
  user?: any;
  onSearchClick?: () => void;
  onLogout?: () => void;
}

const NavLink = ({ 
  children, 
  onClick, 
  icon, 
  variant = 'default',
  badge,
  withChevron = false
}: { 
  children: React.ReactNode; 
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'danger' | 'accent';
  badge?: string | number;
  withChevron?: boolean;
}) => {
  return (
    <button 
      onClick={onClick} 
      className={cn(
        "w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-all duration-200 font-medium text-sm rounded-lg group",
        "hover:bg-accent hover:text-accent-foreground",
        variant === 'primary' && "bg-primary/10 text-primary hover:bg-primary/20",
        variant === 'danger' && "text-destructive hover:bg-destructive/10",
        variant === 'accent' && "bg-accent text-accent-foreground"
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className={cn(
            "w-5 h-5 flex items-center justify-center transition-colors",
            variant === 'primary' && "text-primary",
            variant === 'danger' && "text-destructive"
          )}>
            {icon}
          </span>
        )}
        <span className="flex-1">{children}</span>
      </div>
      
      <div className="flex items-center gap-2">
        {badge && (
          <Badge variant="secondary" className="text-xs px-1.5 py-0 min-w-[20px]">
            {badge}
          </Badge>
        )}
        {withChevron && (
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        )}
      </div>
    </button>
  );
};

const NavigationSection = ({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
      {title}
    </h3>
    {children}
  </div>
);

export function MobileSidebar({ 
  isOpen, 
  onClose, 
  navigationItems = [],
  isAuthenticated,
  user,
  onSearchClick,
  onLogout 
}: MobileSidebarProps) {
  const navigate = useNavigate();
  const auth = useAuthStore();
  
  // Fallback para props opcionais
  const authenticated = isAuthenticated ?? auth.isAuthenticated;
  const currentUser = user ?? auth.user;
  const logout = onLogout ?? auth.logout;

  const defaultNavigationItems = [
    {
      label: 'Início',
      href: '/',
      icon: Home,
    },
    {
      label: 'Categorias',
      href: '/categories',
      icon: FolderOpen,
      items: [
        { label: 'Tecnologia', href: '/category/technology', count: 124 },
        { label: 'Design', href: '/category/design', count: 89 },
        { label: 'Negócios', href: '/category/business', count: 67 },
      ]
    },
    {
      label: 'Tags',
      href: '/tags',
      icon: Tag,
      items: [
        { label: 'React', href: '/tag/react', count: 56 },
        { label: 'JavaScript', href: '/tag/javascript', count: 89 },
        { label: 'TypeScript', href: '/tag/typescript', count: 34 },
      ]
    },
    {
      label: 'Autores',
      href: '/authors',
      icon: Users,
      badge: '12'
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

  const navItems = navigationItems.length > 0 ? navigationItems : defaultNavigationItems;

  const handleNavigation = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  const handleSearchClick = () => {
    onClose();
    onSearchClick?.();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0 w-[320px] sm:w-[380px] flex flex-col">
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between p-6 border-b">
          <SheetTitle className="text-lg font-semibold">Navegação</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Search */}
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-11"
              onClick={handleSearchClick}
            >
              <Search className="h-4 w-4" />
              <span>Buscar publicações...</span>
            </Button>

            {/* User Info (if authenticated) */}
            {authenticated && currentUser && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="h-10 w-10 border-2 border-background">
                  <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {currentUser.name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  Pro
                </Badge>
              </div>
            )}

            {/* Main Navigation */}
            <NavigationSection title="Navegação">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.label}
                    onClick={() => handleNavigation(item.href)}
                    icon={item.icon && <item.icon className="h-4 w-4" />}
                    badge={item.badge}
                    withChevron={!!item.items}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </NavigationSection>

            {/* Quick Actions */}
            {authenticated && (
              <NavigationSection title="Ações Rápidas">
                <div className="space-y-1">
                  <NavLink
                    onClick={() => handleNavigation('/create-post')}
                    icon={<Plus className="h-4 w-4" />}
                    variant="primary"
                  >
                    Nova Publicação
                  </NavLink>
                  <NavLink
                    onClick={() => handleNavigation('/my-posts')}
                    icon={<BookOpen className="h-4 w-4" />}
                    badge="3"
                  >
                    Minhas Publicações
                  </NavLink>
                  <NavLink
                    onClick={() => handleNavigation('/notifications')}
                    icon={<Bell className="h-4 w-4" />}
                    badge="5"
                  >
                    Notificações
                  </NavLink>
                </div>
              </NavigationSection>
            )}

            {/* Account Section */}
            <NavigationSection title="Conta">
              <div className="space-y-1">
                {authenticated ? (
                  <>
                    <NavLink
                      onClick={() => handleNavigation('/profile')}
                      icon={<User className="h-4 w-4" />}
                    >
                      Meu Perfil
                    </NavLink>
                    <NavLink
                      onClick={() => handleNavigation('/settings')}
                      icon={<Settings className="h-4 w-4" />}
                    >
                      Configurações
                    </NavLink>
                    <Separator className="my-2" />
                    <NavLink
                      onClick={handleLogout}
                      icon={<LogOut className="h-4 w-4" />}
                      variant="danger"
                    >
                      Sair
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      onClick={() => handleNavigation('/login')}
                      icon={<LogIn className="h-4 w-4" />}
                      variant="primary"
                    >
                      Entrar
                    </NavLink>
                    <NavLink
                      onClick={() => handleNavigation('/register')}
                      icon={<User className="h-4 w-4" />}
                    >
                      Criar Conta
                    </NavLink>
                  </>
                )}
              </div>
            </NavigationSection>

            {/* Categories Preview */}
            <NavigationSection title="Categorias Populares">
              <div className="space-y-1">
                {navItems
                  .find(item => item.label === 'Categorias')
                  ?.items?.slice(0, 3)
                  .map((category: any) => (
                    <NavLink
                      key={category.href}
                      onClick={() => handleNavigation(category.href)}
                      badge={category.count}
                    >
                      {category.label}
                    </NavLink>
                  ))
                }
                <NavLink
                  onClick={() => handleNavigation('/categories')}
                  withChevron
                >
                  Ver todas categorias
                </NavLink>
              </div>
            </NavigationSection>

            {/* Tags Preview */}
            <NavigationSection title="Tags Populares">
              <div className="flex flex-wrap gap-2 px-4 py-2">
                {navItems
                  .find(item => item.label === 'Tags')
                  ?.items?.slice(0, 6)
                  .map((tag: any) => (
                    <Badge
                      key={tag.href}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent text-xs px-2 py-1"
                      onClick={() => {
                        handleNavigation(tag.href);
                      }}
                    >
                      #{tag.label}
                    </Badge>
                  ))
                }
              </div>
            </NavigationSection>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>© 2024 Sua Plataforma</p>
            <div className="flex justify-center gap-4">
              <button className="hover:text-foreground transition-colors">
                Termos
              </button>
              <button className="hover:text-foreground transition-colors">
                Privacidade
              </button>
              <button className="hover:text-foreground transition-colors">
                Ajuda
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}