import { Flex, IconButton, Text, Box, Separator } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth';
import { Cross1Icon, HomeIcon, PersonIcon, ExitIcon, EnterIcon, PlusIcon } from '@radix-ui/react-icons';

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <Box className="flex items-center justify-between p-6 border-b border-gray-200">
        <Text size="5" weight="bold" className="font-serif text-red-600 uppercase tracking-wide">
          Menu
        </Text>
        <IconButton 
          variant="ghost" 
          size="3"
          onClick={onClose}
          className="text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <Cross1Icon />
        </IconButton>
      </Box>

      {/* Navigation Content */}
      <Box className="flex-1 py-8">
        {/* Main Navigation */}
        <Box className="mb-8">
          <Text 
            size="2" 
            weight="bold" 
            className="px-6 mb-4 text-gray-500 font-sans uppercase tracking-wider text-xs"
          >
            Navegação
          </Text>
          
          <Flex direction="column">
            <NavLink 
              onClick={() => handleNavigation('/')}
              icon={<HomeIcon />}
            >
              Início
            </NavLink>
          </Flex>
        </Box>

        <Separator size="4" className="mx-6 my-6" />

        {/* User Section */}
        <Box>
          <Text 
            size="2" 
            weight="bold" 
            className="px-6 mb-4 text-gray-500 font-sans uppercase tracking-wider text-xs"
          >
            {isAuthenticated ? 'Conta' : 'Acesso'}
          </Text>
          
          <Flex direction="column">
            {isAuthenticated ? (
              <>
                <NavLink 
                  onClick={() => handleNavigation('/profile')}
                  icon={<PersonIcon />}
                >
                  Meu Perfil
                </NavLink>
                <NavLink 
                  onClick={handleLogout}
                  icon={<ExitIcon />}
                  variant="danger"
                >
                  Sair
                </NavLink>
              </>
            ) : (
              <>
                <NavLink 
                  onClick={() => handleNavigation('/login')}
                  icon={<EnterIcon />}
                  variant="primary"
                >
                  Entrar
                </NavLink>
                <NavLink 
                  onClick={() => handleNavigation('/register')}
                  icon={<PlusIcon />}
                >
                  Criar Conta
                </NavLink>
              </>
            )}
          </Flex>
        </Box>
      </Box>

    </div>
  );
}