import { Flex, Box, Button, Avatar, Text, DropdownMenu, IconButton } from '@radix-ui/themes';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../../store/auth';
import { MobileSidebar } from './MobileSidebar';
import { HamburgerMenuIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';

export function Header({ onSearchIconClick, onDesktopSearchIconClick }: { onSearchIconClick: () => void, onDesktopSearchIconClick: () => void }) {
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
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        backgroundColor: '#FFFFFF',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
      }}
    >
      <header>
        <Flex align="center" gap="3">
          {/* Hamburger icon for mobile */}

          <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
            <Text size="5" weight="bold">Astralis</Text>
          </Link>
        </Flex>

        <Flex align="center" gap="3" display={{ initial: 'none', sm: 'flex' }}>
          <IconButton variant="ghost" color="gray" onClick={onDesktopSearchIconClick}>
            <MagnifyingGlassIcon width="18" height="18" />
          </IconButton>
          {isAuthenticated ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>  
                <Button variant="ghost" radius="full">
                  <Avatar
                    size="2"
                    src={user?.avatarUrl || undefined}
                    fallback={user?.name?.[0] || 'U'}
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
              <Button variant="ghost" color="gray" onClick={() => navigate('/login')}>Entrar</Button>
              <Button color='red' onClick={() => navigate('/register')}>Registrar</Button>
            </>
          )}
        </Flex>
          <Box display={{ initial: 'block', sm: 'none' }}>
            <IconButton variant="ghost" color="gray" onClick={() => setIsSidebarOpen(true)}>
              <HamburgerMenuIcon width="18" height="18" />
            </IconButton>
            <IconButton variant="ghost" color="gray" onClick={onSearchIconClick}>
              <MagnifyingGlassIcon width="18" height="18" />
            </IconButton>
          </Box>

        {/* Mobile Sidebar */}
        <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </header>
    </Flex>
  );
}
