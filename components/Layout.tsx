import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, CheckSquare, User, ChevronLeft, Bell, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const isRootPaths = ['/', '/regional-data', '/participate', '/test', '/new-politician', '/profile'];
  const showBackButton = !isRootPaths.includes(location.pathname);

  const getPageTitle = (path: string) => {
    if (path === '/') return '민심잇다';
    if (path === '/regional-data') return '민심 지도';
    if (path === '/participate') return '시민 참여';
    if (path === '/test') return '성향 분석';
    if (path === '/new-politician') return '우리 지역 후보';
    if (path === '/profile') return '마이페이지';
    if (path.includes('/participate/')) return '토론장';
    return '민심잇다';
  };

  return (
    <div className="min-h-screen flex justify-center bg-slate-100/50 w-full">
      <div className="w-full max-w-[600px] min-h-screen flex flex-col bg-white shadow-2xl relative mx-auto">
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 transition-all duration-300 safe-area-top">
          <div className="flex items-center min-w-[48px] sm:min-w-[52px]">
            {showBackButton ? (
              <button 
                onClick={() => navigate(-1)} 
                className="p-2.5 -ml-2 text-slate-600 active:text-secondary active:bg-slate-100 rounded-full transition-colors touch-target min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="뒤로가기"
              >
                <ChevronLeft size={24} className="sm:w-6 sm:h-6" />
              </button>
            ) : (
               <div className="w-9 h-9 sm:w-10 sm:h-10 bg-secondary text-white rounded-xl flex items-center justify-center font-extrabold text-sm sm:text-base shadow-md shadow-secondary/20">M</div>
            )}
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-800 truncate flex-1 text-center px-2">{getPageTitle(location.pathname)}</h1>
          <div className="flex items-center justify-end min-w-[48px] sm:min-w-[52px]">
            <button 
              className="p-2.5 -mr-2 text-slate-400 active:text-secondary active:bg-slate-100 rounded-full relative touch-target min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="알림"
            >
              <Bell size={22} className="sm:w-6 sm:h-6" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        <main className="flex-grow pb-24 sm:pb-28 overflow-y-auto scrollbar-hide w-full bg-slate-50">
          {children}
        </main>

        <nav className="fixed bottom-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 pb-safe pt-2 w-full max-w-[600px] safe-area-bottom">
          <div className="flex justify-around items-center h-16 sm:h-18 px-1 sm:px-2">
            <NavItem to="/" icon={<Home size={22} className="sm:w-6 sm:h-6" />} label="홈" />
            <NavItem to="/regional-data" icon={<Map size={22} className="sm:w-6 sm:h-6" />} label="지도" />
            <NavItem to="/participate" icon={<CheckSquare size={22} className="sm:w-6 sm:h-6" />} label="참여" />
            <NavItem to="/profile" icon={<UserCircle size={22} className="sm:w-6 sm:h-6" />} label="프로필" requireAuth />
          </div>
        </nav>
      </div>
    </div>
  );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; requireAuth?: boolean }> = ({ to, icon, label, requireAuth = false }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    if (requireAuth && !isAuthenticated) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <NavLink 
      to={to}
      onClick={handleClick}
      className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-0.5 sm:space-y-1 transition-all duration-200 active:scale-95 min-h-[48px] touch-target ${isActive ? 'text-primary' : 'text-slate-400 active:text-slate-600'}`}
    >
      {({ isActive }) => (
        <>
          <div className={`relative p-1.5 sm:p-2 rounded-xl transition-colors ${isActive ? 'bg-primary/10' : ''}`}>{icon}</div>
          <span className={`text-[10px] sm:text-xs font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
        </>
      )}
    </NavLink>
  );
};

export default Layout;