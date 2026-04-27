import React from 'react';
import { Tab } from '../App';
import { PawPrint, FileText, List, Users } from 'lucide-react';

interface NavbarProps {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const getTabClass = (tab: Tab) => {
    const base = "flex items-center gap-2 px-3 lg:px-4 py-2 rounded-md transition-all font-medium text-sm md:text-base cursor-pointer ";
    return currentTab === tab 
      ? base + "bg-white text-hc-pink shadow-sm" 
      : base + "text-white/90 hover:bg-white/10 hover:text-white";
  };

  return (
    <nav className="bg-hc-pink text-white shadow-md sticky top-0 z-50 print:hidden">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo and Brand */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setCurrentTab('home')}
        >
          <div className="bg-white p-1.5 rounded-full text-hc-pink group-hover:bg-hc-blue group-hover:text-white transition-colors">
            <PawPrint size={24} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">Huellas al Corazón</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button 
            className={getTabClass('directory')} 
            onClick={() => setCurrentTab('directory')}
          >
            <Users size={18} />
            <span className="hidden md:inline">Directorio</span>
          </button>
          <button 
            className={getTabClass('generator')} 
            onClick={() => setCurrentTab('generator')}
          >
            <FileText size={18} />
            <span className="hidden md:inline">Facturación</span>
          </button>
          <button 
            className={getTabClass('saved')} 
            onClick={() => setCurrentTab('saved')}
          >
            <List size={18} />
            <span className="hidden lg:inline">Facturas Guardadas</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
