import { useState } from 'react';
import { SearchSidebar } from './SearchSidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMobileSearchSidebarOpen, setIsMobileSearchSidebarOpen] = useState(false);
  const [isDesktopSearchSidebarOpen, setIsDesktopSearchSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        onSearchIconClick={() => setIsMobileSearchSidebarOpen(!isMobileSearchSidebarOpen)}
        onDesktopSearchIconClick={() => setIsDesktopSearchSidebarOpen(!isDesktopSearchSidebarOpen)}
      />
      <div className="flex flex-grow">
        <div className="flex-grow">
          {children}
        </div>
        {/* Desktop Sidebar */}
        {isDesktopSearchSidebarOpen && (
          <div className="hidden md:block w-80">
            <SearchSidebar />
          </div>
        )}
        {/* Mobile Sidebar (Drawer) */}
        {isMobileSearchSidebarOpen && (
          <div className="block md:hidden fixed top-0 right-0 bottom-0 w-full bg-white z-50">
            <SearchSidebar />
          </div>
        )}
      </div>
    </div>
  );
}
