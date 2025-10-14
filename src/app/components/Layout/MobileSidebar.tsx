import { useNavigate } from 'react-router-dom';
import { X, Home, User, LogOut, LogIn, Plus } from 'lucide-react';

import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '../ui/sheet';

import useAuthStore from '../../store/auth';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavLink = ({ 
  children, 
  onClick, 
  icon, 
  variant = 'default' 
}: { 
  children: React.ReactNode; 
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'danger';
}) => {
  const baseClasses = "w-full flex items-center justify-start gap-3 px-6 py-4 text-left transition-all duration-200 font-sans font-medium text-base border-l-4 border-transparent hover:border-l-red-600 hover:bg-red-50";
  
  const variantClasses = {
    default: "text-black hover:text-red-700",
    primary: "text-red-600 bg-red-50 border-l-red-600 hover:bg-red-100",
    danger: "text-red-500 hover:text-red-700 hover:bg-red-50"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {icon && <span className="w-5 h-5 flex items-center justify-center">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="flex flex-row items-center justify-between p-6 border-b border-gray-200">
          <SheetTitle className="font-serif text-red-600 uppercase tracking-wide">Menu</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5 text-gray-600" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className="flex-1 py-8">
          <div className="mb-8">
            <p className="px-6 mb-4 text-gray-500 font-sans uppercase tracking-wider text-xs font-bold">Navegação</p>
            <div className="flex flex-col">
              <NavLink 
                onClick={() => handleNavigation('/')}
                icon={<Home className="h-5 w-5" />}
              >
                Início
              </NavLink>
            </div>
          </div>

          <Separator className="mx-6 my-6" />

          <div>
            <p className="px-6 mb-4 text-gray-500 font-sans uppercase tracking-wider text-xs font-bold">
              {isAuthenticated ? 'Conta' : 'Acesso'}
            </p>
            <div className="flex flex-col">
              {isAuthenticated ? (
                <>
                  <NavLink 
                    onClick={() => handleNavigation('/profile')}
                    icon={<User className="h-5 w-5" />}
                  >
                    Meu Perfil
                  </NavLink>
                  <NavLink 
                    onClick={handleLogout}
                    icon={<LogOut className="h-5 w-5" />}
                    variant="danger"
                  >
                    Sair
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink 
                    onClick={() => handleNavigation('/login')}
                    icon={<LogIn className="h-5 w-5" />}
                    variant="primary"
                  >
                    Entrar
                  </NavLink>
                  <NavLink 
                    onClick={() => handleNavigation('/register')}
                    icon={<Plus className="h-5 w-5" />}
                  >
                    Criar Conta
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}