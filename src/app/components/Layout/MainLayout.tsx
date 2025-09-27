import { useState } from 'react';
import { Box, Flex, IconButton } from '@radix-ui/themes';
import { SearchSidebar } from './SearchSidebar';
import { Header } from './Header';
import { HamburgerMenuIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMobileSearchSidebarOpen, setIsMobileSearchSidebarOpen] = useState(false);
  const [isDesktopSearchSidebarOpen, setIsDesktopSearchSidebarOpen] = useState(false);

  return (
    <Flex direction="column" style={{ minHeight: "100vh" }}>
      <Header 
        onSearchIconClick={() => setIsMobileSearchSidebarOpen(!isMobileSearchSidebarOpen)}
        onDesktopSearchIconClick={() => setIsDesktopSearchSidebarOpen(!isDesktopSearchSidebarOpen)}
      />
      <Flex flexGrow="1">
        <Box flexGrow="1">
          {children}
        </Box>
        {/* Desktop Sidebar */}
        {isDesktopSearchSidebarOpen && (
          <Box display={{ initial: 'none', md: 'block' }} width="320px">
            <SearchSidebar />
          </Box>
        )}
        {/* Mobile Sidebar (Drawer) */}
        {isMobileSearchSidebarOpen && (
          <Box 
            display={{ initial: 'block', md: 'none' }} 
            style={{ 
              position: 'fixed', 
              top: 0, 
              right: 0, 
              bottom: 0, 
              width: '100%', 
              backgroundColor: 'white', 
              zIndex: 101 
            }}
          >
            <SearchSidebar />
          </Box>
        )}
      </Flex>
    </Flex>
  );
}
