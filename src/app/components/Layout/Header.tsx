import { Flex, Box, Button, Avatar, Text, DropdownMenu, IconButton } from '@radix-ui/themes';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../../store/auth';
import { MobileSidebar } from './MobileSidebar';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Flex
      asChild
      justify="between"
      align="center"
      p="4"
      style={{
        borderBottom: '1px solid var(--gray-a5)',
        backgroundColor: 'var(--color-background)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
      }}
    >
      <header>
        <Flex align="center" gap="3">
          {/* Hamburger icon for mobile */}
          <Box display={{ initial: 'block', sm: 'none' }}>
            <IconButton variant="ghost" onClick={() => setIsSidebarOpen(true)}>
              <HamburgerMenuIcon width="18" height="18" />
            </IconButton>
          </Box>

          <Link to="/">
            <Text size="5" weight="bold">Astralis</Text>
          </Link>
        </Flex>

        <Flex align="center" gap="3" display={{ initial: 'none', sm: 'flex' }}>
          {isAuthenticated ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>  
                <Button variant="ghost" radius="full">
                  <Avatar
                    size="2"
                    src={user?.avatarUrl || undefined}
                    fallback={user?.name?.[0] || 'U'}
                    color="indigo"
                  />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item onClick={() => navigate('/profile')}>Meu Perfil</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item color="red" onClick={handleLogout}>Sair</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          ) : (
            <>
              <Button color='red' variant="ghost" onClick={() => navigate('/login')}>Entrar</Button>
              <Button color='red'  onClick={() => navigate('/register')}>Registrar</Button>
            </>
          )}
        </Flex>

        {/* Mobile Sidebar */}
        <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </header>
    </Flex>
  );
}
