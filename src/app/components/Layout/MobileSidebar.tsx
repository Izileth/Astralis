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
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1 mt-6">
        <div className="p-4 space-y-8">
          {/* User Info (if authenticated) */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-muted/30">
              <Avatar className="h-10 w-10 border border-border/40">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="bg-muted text-foreground font-medium">
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
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
              Navegação
            </h3>
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <div key={item.label}>
                  {item.items && item.items.length > 0 ? (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <button
                          className={cn(
                            "group relative w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors rounded-md",
                            "text-foreground/60 hover:text-foreground hover:bg-transparent",
                            isActivePath(item.href) && "text-foreground"
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
                            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                          </div>
                          <span 
                            className={cn(
                              "absolute left-0 top-0 h-full w-[2px] bg-foreground transition-all duration-300",
                              isActivePath(item.href) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            )} 
                          />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4 space-y-1 mt-1">
                        {item.items.slice(0, 5).map((subItem) => (
                          <button
                            key={subItem.href}
                            className={cn(
                              "group relative w-full flex items-center justify-between px-3 py-2 text-sm transition-colors rounded-md",
                              "text-foreground/60 hover:text-foreground hover:bg-transparent",
                              location.pathname === subItem.href && "text-foreground"
                            )}
                            onClick={() => handleNavigation(subItem.href)}
                          >
                            <span>{subItem.label}</span>
                            {subItem.count !== undefined && (
                              <Badge variant="secondary" className="text-xs">
                                {subItem.count}
                              </Badge>
                            )}
                            <span 
                              className={cn(
                                "absolute left-0 top-0 h-full w-[2px] bg-foreground transition-all duration-300",
                                location.pathname === subItem.href ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                              )} 
                            />
                          </button>
                        ))}
                        {item.items.length > 5 && (
                          <button
                            className="group relative w-full flex items-center justify-between px-3 py-2 text-sm transition-colors rounded-md text-muted-foreground hover:text-foreground hover:bg-transparent"
                            onClick={() => handleNavigation(item.href)}
                          >
                            <span>Ver todos</span>
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <button
                      className={cn(
                        "group relative w-full flex items-center justify-start gap-3 px-3 py-2.5 text-sm font-medium transition-colors rounded-md",
                        "text-foreground/60 hover:text-foreground hover:bg-transparent",
                        isActivePath(item.href) && "text-foreground"
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
                      <span 
                        className={cn(
                          "absolute left-0 top-0 h-full w-[2px] bg-foreground transition-all duration-300",
                          isActivePath(item.href) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        )} 
                      />
                    </button>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Quick Actions (if authenticated) */}
          {isAuthenticated && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                Ações Rápidas
              </h3>
              <nav className="space-y-1">
                <button
                  className="group relative w-full flex items-center justify-start gap-3 px-3 py-2.5 text-sm font-medium transition-colors rounded-md text-foreground hover:text-foreground hover:bg-transparent border border-border/40"
                  onClick={() => handleNavigation('/create-post')}
                >
                  <Plus className="h-4 w-4" />
                  <span>Nova Publicação</span>
                </button>
                <button
                  className={cn(
                    "group relative w-full flex items-center justify-start gap-3 px-3 py-2.5 text-sm font-medium transition-colors rounded-md",
                    "text-foreground/60 hover:text-foreground hover:bg-transparent",
                    isActivePath('/my-posts') && "text-foreground"
                  )}
                  onClick={() => handleNavigation('/my-posts')}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Minhas Publicações</span>
                  <span 
                    className={cn(
                      "absolute left-0 top-0 h-full w-[2px] bg-foreground transition-all duration-300",
                      isActivePath('/my-posts') ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )} 
                  />
                </button>
                <button
                  className={cn(
                    "group relative w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors rounded-md",
                    "text-foreground/60 hover:text-foreground hover:bg-transparent",
                    isActivePath('/notifications') && "text-foreground"
                  )}
                  onClick={() => handleNavigation('/notifications')}
                >
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4" />
                    <span>Notificações</span>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-red-100 text-red-600 hover:bg-red-100">
                    3
                  </Badge>
                  <span 
                    className={cn(
                      "absolute left-0 top-0 h-full w-[2px] bg-foreground transition-all duration-300",
                      isActivePath('/notifications') ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )} 
                  />
                </button>
              </nav>
            </div>
          )}

          {/* Account Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
              Conta
            </h3>
            <nav className="space-y-1">
              {isAuthenticated ? (
                <>
                  <button
                    className={cn(
                      "group relative w-full flex items-center justify-start gap-3 px-3 py-2.5 text-sm font-medium transition-colors rounded-md",
                      "text-foreground/60 hover:text-foreground hover:bg-transparent",
                      isActivePath('/profile') && "text-foreground"
                    )}
                    onClick={() => handleNavigation('/profile')}
                  >
                    <User className="h-4 w-4" />
                    <span>Meu Perfil</span>
                    <span 
                      className={cn(
                        "absolute left-0 top-0 h-full w-[2px] bg-foreground transition-all duration-300",
                        isActivePath('/profile') ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )} 
                    />
                  </button>
                  <button
                    className={cn(
                      "group relative w-full flex items-center justify-start gap-3 px-3 py-2.5 text-sm font-medium transition-colors rounded-md",
                      "text-foreground/60 hover:text-foreground hover:bg-transparent",
                      isActivePath('/settings') && "text-foreground"
                    )}
                    onClick={() => handleNavigation('/settings')}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Configurações</span>
                    <span 
                      className={cn(
                        "absolute left-0 top-0 h-full w-[2px] bg-foreground transition-all duration-300",
                        isActivePath('/settings') ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )} 
                    />
                  </button>
                  <Separator className="my-3 bg-border/40" />
                  <button
                    className="group relative w-full flex items-center justify-start gap-3 px-3 py-2.5 text-sm font-medium transition-colors rounded-md text-red-600 hover:text-red-600 hover:bg-transparent"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="group relative w-full flex items-center justify-start gap-3 px-3 py-2.5 text-sm font-medium transition-colors rounded-md text-foreground hover:text-foreground hover:bg-transparent border border-border/40"
                    onClick={() => handleNavigation('/login')}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Entrar</span>
                  </button>
                  <button
                    className="group relative w-full flex items-center justify-start gap-3 px-3 py-2.5 text-sm font-medium transition-colors rounded-md text-foreground/60 hover:text-foreground hover:bg-transparent"
                    onClick={() => handleNavigation('/register')}
                  >
                    <User className="h-4 w-4" />
                    <span>Criar Conta</span>
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Tags Preview */}
          {navigationItems.find(item => item.label === 'Tags')?.items && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                Tags Populares
              </h3>
              <div className="flex flex-wrap gap-2 px-1">
                {navigationItems
                  .find(item => item.label === 'Tags')
                  ?.items?.slice(0, 6)
                  .map((tag) => (
                    <Badge
                      key={tag.href}
                      variant="outline"
                      className="cursor-pointer hover:bg-muted/50 hover:border-foreground/20 text-xs transition-colors border-border/40"
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
      <div className="border-t border-border/40 p-4 bg-muted/30">
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