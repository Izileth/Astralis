import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, Search } from 'lucide-react';

import { Button } from '../ui/button';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';

import useAuthStore from '../../store/auth';
import { MobileSidebar } from './MobileSidebar';
import Logo from '../Common/BrandIcon';

export function Header({ onSearchIconClick, onDesktopSearchIconClick }: { onSearchIconClick: () => void, onDesktopSearchIconClick: () => void }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex justify-between items-center p-4 shadow-sm bg-white sticky top-0 z-50 w-full">
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="sm:hidden">
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex items-center gap-3">
        <Logo href='/' size='lg' variant='minimal'/>
      </div>

      <div className="hidden sm:flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onDesktopSearchIconClick}>
          <Search className="h-5 w-5" />
        </Button>
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatarUrl || undefined} alt={user?.name || 'User'} />
                  <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/profile')}>Meu Perfil</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button variant="ghost" onClick={() => navigate('/login')}>Entrar</Button>
            <Button variant="destructive" onClick={() => navigate('/register')}>Registrar</Button>
          </>
        )}
      </div>

      <div className="sm:hidden">
        <Button variant="ghost" size="icon" onClick={onSearchIconClick}>
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
