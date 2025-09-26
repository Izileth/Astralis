import { Flex, IconButton } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth';
import { Cross1Icon } from '@radix-ui/react-icons';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavLink = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button onClick={onClick} className="nav-link">
    {children}
  </button>
);

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

  const styles = `
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: #fff;
      z-index: 998;
      opacity: ${isOpen ? 1 : 0};
      visibility: ${isOpen ? 'visible' : 'hidden'};
      transition: opacity 0.3s ease, visibility 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .nav-link {
      background: none;
      border: none;
      color: black;
      font-size: 2rem;
      font-weight: 400;
      padding: 1rem 2rem;
      cursor: pointer;
      transition: color 0.2s ease, transform 0.2s ease;
      opacity: ${isOpen ? 1 : 0};
      transform: ${isOpen ? 'translateY(0)' : 'translateY(20px)'};
      transition-property: opacity, transform;
      transition-duration: 0.3s;
      transition-timing-function: ease-out;
    }
    .nav-link:hover {
      color: var(--red-9);
      transform: scale(1.05);
    }
    .close-button {
      position: absolute;
      top: 2rem;
      right: 2rem;
      color: black;
    }
  `;

  return (
    <div className="overlay">
      <style>{styles}</style>
      <IconButton variant="ghost" size="4" className="close-button" onClick={onClose}>
        <Cross1Icon />
      </IconButton>

      <Flex direction="column" gap="4" align="center">
        <NavLink onClick={() => handleNavigation('/')}>Inicio</NavLink>
        {isAuthenticated ? (
          <>
            <NavLink onClick={() => handleNavigation('/profile')}>Meu Perfil</NavLink>
            <NavLink onClick={handleLogout}>Sair</NavLink>
          </>
        ) : (
          <>
            <NavLink onClick={() => handleNavigation('/login')}>Entrar</NavLink>
            <NavLink onClick={() => handleNavigation('/register')}>Registrar</NavLink>
          </>
        )}
      </Flex>
    </div>
  );
}

