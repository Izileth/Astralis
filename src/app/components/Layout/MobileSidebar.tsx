import { Flex, Box, Button, Text } from '@radix-ui/themes';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

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
    <Box
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
        display: isOpen ? 'block' : 'none',
      }}
      onClick={onClose} // Close when clicking outside
    >
      <Flex
        direction="column"
        p="4"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '250px',
          height: '100%',
          backgroundColor: 'var(--color-background)',
          boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside sidebar
      >
        <Flex justify="end" mb="4">
          <Button variant="ghost" onClick={onClose}>X</Button>
        </Flex>

        <Flex direction="column" gap="3">
          <Link to="/" onClick={() => handleNavigation('/')}><Text size="4">Home</Text></Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={() => handleNavigation('/profile')}><Text size="4">Meu Perfil</Text></Link>
              <Button variant="ghost" color="red" onClick={handleLogout}>Sair</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => handleNavigation('/login')}>Entrar</Button>
              <Button onClick={() => handleNavigation('/register')}>Registrar</Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
