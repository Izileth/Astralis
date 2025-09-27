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
}) => (
  <button onClick={onClick} className={`nav-link nav-link--${variant}`}>
    {icon && <span className="nav-link__icon">{icon}</span>}
    <span className="nav-link__text">{children}</span>
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
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      z-index: 998;
      opacity: ${isOpen ? 1 : 0};
      visibility: ${isOpen ? 'visible' : 'hidden'};
      transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
    }

    .brand {
      position: absolute;
      top: 2rem;
      left: 2rem;
      font-family: serif;
      font-size: 1.5rem;
      font-weight: bold;
      color: #dc2626;
      letter-spacing: -0.5px;
      opacity: ${isOpen ? 1 : 0};
      transform: ${isOpen ? 'translateY(0)' : 'translateY(-20px)'};
      transition: opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s;
    }

    .close-button {
      position: absolute;
      top: 2rem;
      right: 2rem;
      color: #374151;
      background: rgba(255, 255, 255, 0.9);
      border: 2px solid #e5e7eb;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);
      opacity: ${isOpen ? 1 : 0};
      transform: ${isOpen ? 'rotate(0deg)' : 'rotate(90deg)'};
      transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s, background-color 0.2s ease, border-color 0.2s ease;
    }

    .close-button:hover {
      background: #dc2626;
      border-color: #dc2626;
      color: white;
      transform: rotate(90deg) scale(1.1);
    }

    .nav-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      max-width: 300px;
      width: 100%;
      padding: 0 2rem;
    }

    .nav-section {
      width: 100%;
      text-align: center;
      margin-bottom: 2rem;
    }

    .nav-section__title {
      font-family: serif;
      font-size: 0.875rem;
      font-weight: bold;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 1.5rem;
      opacity: ${isOpen ? 1 : 0};
      transform: ${isOpen ? 'translateY(0)' : 'translateY(20px)'};
      transition: opacity 0.4s ease 0.3s, transform 0.4s ease 0.3s;
    }

    .nav-link {
      background: none;
      border: 2px solid transparent;
      color: #1f2937;
      font-family: sans-serif;
      font-size: 1.125rem;
      font-weight: 500;
      padding: 1rem 2rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      width: 100%;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      position: relative;
      opacity: ${isOpen ? 1 : 0};
      transform: ${isOpen ? 'translateY(0)' : 'translateY(30px)'};
      transition-property: opacity, transform, background-color, border-color, color, box-shadow;
      transition-duration: 0.4s, 0.4s, 0.2s, 0.2s, 0.2s, 0.2s;
      transition-timing-function: ease;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .nav-link:nth-child(1) { transition-delay: 0.1s; }
    .nav-link:nth-child(2) { transition-delay: 0.15s; }
    .nav-link:nth-child(3) { transition-delay: 0.2s; }
    .nav-link:nth-child(4) { transition-delay: 0.25s; }

    .nav-link--default:hover {
      background: rgba(220, 38, 38, 0.05);
      border-color: #dc2626;
      color: #dc2626;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(220, 38, 38, 0.15);
    }

    .nav-link--primary {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      color: white;
      border-color: #dc2626;
    }

    .nav-link--primary:hover {
      background: linear-gradient(135deg, #b91c1c, #991b1b);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
    }

    .nav-link--danger {
      background: rgba(239, 68, 68, 0.1);
      border-color: #ef4444;
      color: #ef4444;
    }

    .nav-link--danger:hover {
      background: #ef4444;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
    }

    .nav-link__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
    }

    .nav-link__text {
      font-weight: 600;
      letter-spacing: 0.025em;
    }

    .separator {
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #dc2626, transparent);
      margin: 1rem 0;
      opacity: ${isOpen ? 1 : 0};
      transform: ${isOpen ? 'scaleX(1)' : 'scaleX(0)'};
      transition: opacity 0.4s ease 0.4s, transform 0.4s ease 0.4s;
    }

    .footer-text {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      font-family: serif;
      font-size: 0.75rem;
      color: #9ca3af;
      text-align: center;
      opacity: ${isOpen ? 1 : 0};
      transition: opacity 0.4s ease 0.5s;
    }
  `;

  return (
    <div className="overlay">
      <style>{styles}</style>
      
      {/* Brand */}
      <div className="brand">
        PORTAL
      </div>
      
      {/* Close Button */}
      <IconButton variant="ghost" size="4" className="close-button" onClick={onClose}>
        <Cross1Icon />
      </IconButton>

      <div className="nav-container">
        {/* Navigation Section */}
        <div className="nav-section">
          <div className="nav-section__title">Navegação</div>
          <Flex direction="column" gap="3" align="center" style={{ width: '100%' }}>
            <NavLink 
              onClick={() => handleNavigation('/')}
              icon={<HomeIcon />}
            >
              Início
            </NavLink>
            
            <div className="separator"></div>
            
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
                  Registrar
                </NavLink>
              </>
            )}
          </Flex>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-text">
        Portal de Notícias
      </div>
    </div>
  );
}