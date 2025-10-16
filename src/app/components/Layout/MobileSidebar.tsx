import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  LogIn, 
  Plus, 
  BookOpen,
  Settings,
  Bell,

  ChevronRight,
  ChevronDown
} from 'lucide-react';

import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

import useAuthStore from '../../store/auth';
import { cn } from '@/app/lib/utils';

interface NavigationItem {
  label: string;
  href: string;
  icon?: any;
  badge?: string | number;
  items?: Array<{
    label: string;
    href: string;
    count?: number;
  }>;
}

interface MobileSidebarProps {
  navigationItems: NavigationItem[];
  onClose?: () => void;
}

export function MobileSidebar({ 
  navigationItems,
  onClose,
}: MobileSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleNavigation = (path: string) => {
    onClose?.();
    navigate(path);
  };

  const handleLogout = () => {
    onClose?.();
    logout();
    navigate('/login');
  };

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-full">
  
      <ScrollArea className="flex-1 mt-6">
        <div className="p-4 space-y-6">
          {/* User Info (if authenticated) */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Avatar className="h-10 w-10 border-2 border-background">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Main Navigation */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
              Navegação
            </h3>
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <div key={item.label}>
                  {item.items && item.items.length > 0 ? (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-between",
                            isActivePath(item.href) && "bg-accent"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon && <item.icon className="h-4 w-4" />}
                            <span>{item.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4 space-y-1 mt-1">
                        {item.items.slice(0, 5).map((subItem) => (
                          <Button
                            key={subItem.href}
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-between",
                              location.pathname === subItem.href && "bg-accent"
                            )}
                            onClick={() => handleNavigation(subItem.href)}
                          >
                            <span className="text-sm">{subItem.label}</span>
                            {subItem.count !== undefined && (
                              <Badge variant="secondary" className="text-xs">
                                {subItem.count}
                              </Badge>
                            )}
                          </Button>
                        ))}
                        {item.items.length > 5 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-between text-muted-foreground"
                            onClick={() => handleNavigation(item.href)}
                          >
                            <span className="text-sm">Ver todos</span>
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3",
                        isActivePath(item.href) && "bg-accent"
                      )}
                      onClick={() => handleNavigation(item.href)}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Quick Actions (if authenticated) */}
          {isAuthenticated && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                Ações Rápidas
              </h3>
              <nav className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 bg-primary/10 text-primary hover:bg-primary/20"
                  onClick={() => handleNavigation('/create-post')}
                >
                  <Plus className="h-4 w-4" />
                  <span>Nova Publicação</span>
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3",
                    isActivePath('/my-posts') && "bg-accent"
                  )}
                  onClick={() => handleNavigation('/my-posts')}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Minhas Publicações</span>
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-between",
                    isActivePath('/notifications') && "bg-accent"
                  )}
                  onClick={() => handleNavigation('/notifications')}
                >
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4" />
                    <span>Notificações</span>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    3
                  </Badge>
                </Button>
              </nav>
            </div>
          )}

          {/* Account Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
              Conta
            </h3>
            <nav className="space-y-1">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3",
                      isActivePath('/profile') && "bg-accent"
                    )}
                    onClick={() => handleNavigation('/profile')}
                  >
                    <User className="h-4 w-4" />
                    <span>Meu Perfil</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3",
                      isActivePath('/settings') && "bg-accent"
                    )}
                    onClick={() => handleNavigation('/settings')}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Configurações</span>
                  </Button>
                  <Separator className="my-2" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 bg-primary/10 text-primary hover:bg-primary/20"
                    onClick={() => handleNavigation('/login')}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Entrar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={() => handleNavigation('/register')}
                  >
                    <User className="h-4 w-4" />
                    <span>Criar Conta</span>
                  </Button>
                </>
              )}
            </nav>
          </div>

          {/* Tags Preview */}
          {navigationItems.find(item => item.label === 'Tags')?.items && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                Tags Populares
              </h3>
              <div className="flex flex-wrap gap-2 px-2">
                {navigationItems
                  .find(item => item.label === 'Tags')
                  ?.items?.slice(0, 6)
                  .map((tag) => (
                    <Badge
                      key={tag.href}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent text-xs"
                      onClick={() => handleNavigation(tag.href)}
                    >
                      #{tag.label}
                    </Badge>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="text-center text-xs text-muted-foreground space-y-2">
          <div className="flex justify-center gap-4">
            <button 
              className="hover:text-foreground transition-colors"
              onClick={() => handleNavigation('/terms')}
            >
              Termos
            </button>
            <button 
              className="hover:text-foreground transition-colors"
              onClick={() => handleNavigation('/privacy')}
            >
              Privacidade
            </button>
            <button 
              className="hover:text-foreground transition-colors"
              onClick={() => handleNavigation('/help')}
            >
              Ajuda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}