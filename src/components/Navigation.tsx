import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import cpsrLogo from "@/assets/cpsr-logo.jpg";
import UserAvatar from "./UserAvatar";

interface NavigationProps {
  onShowHome: () => void;
  onShowContribute: () => void;
  onShowContact: () => void;
  onNavigateToSection: (section: string) => void;
  isTransparent?: boolean;
}

const Navigation = ({ onShowHome, onShowContribute, onShowContact, onNavigateToSection, isTransparent = false }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isTransparent 
        ? 'bg-transparent border-b border-transparent' 
        : 'bg-white border-b border-gray-100 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 sm:h-24">
          <div 
            className={`flex items-center cursor-pointer transition-opacity duration-300 ${isTransparent ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} 
            onClick={() => handleNavClick(onShowHome)}
          >
            <div className="flex-shrink-0 flex items-center gap-3 sm:gap-4">
              <img
                src={cpsrLogo}
                alt="CPSR Logo"
                className="h-8 sm:h-10 w-auto object-contain"
              />
              <div className="h-6 sm:h-8 w-px bg-gray-200"></div>
              <div className="flex flex-col justify-center leading-tight">
                <span className="font-serif font-medium text-slate-900 text-sm sm:text-base tracking-tight">
                  Centre for
                </span>
                <span className="font-serif font-medium text-slate-900 text-sm sm:text-base tracking-tight">
                  Professional Services Research
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:ml-auto sm:flex sm:items-center space-x-6 pr-4">
            <button
              onClick={() => { onShowHome(); setTimeout(() => onNavigateToSection('about'), 100); }}
              className={`text-sm font-medium transition-colors duration-200 font-sans cursor-pointer ${
                isTransparent ? 'text-white/90 hover:text-white' : 'text-slate-600 hover:text-brand-red'
              }`}
            >
              About
            </button>
            <button
              onClick={() => { onShowHome(); setTimeout(() => onNavigateToSection('initiatives'), 100); }}
              className={`text-sm font-medium transition-colors duration-200 font-sans cursor-pointer ${
                isTransparent ? 'text-white/90 hover:text-white' : 'text-slate-600 hover:text-brand-red'
              }`}
            >
              Initiatives
            </button>
            <button
              onClick={onShowContribute}
              className={`text-sm font-medium transition-colors duration-200 font-sans ${
                isTransparent ? 'text-white/90 hover:text-white' : 'text-slate-600 hover:text-brand-red'
              }`}
            >
              Contribute
            </button>
            <button
              onClick={onShowContact}
              className={`text-sm font-medium transition-colors duration-200 font-sans cursor-pointer ${
                isTransparent ? 'text-white/90 hover:text-white' : 'text-slate-600 hover:text-brand-red'
              }`}
            >
              Contact
            </button>
            <UserAvatar />
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 transition-colors ${
                isTransparent ? 'text-white hover:text-white/80' : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 sm:hidden ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out sm:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <span className="font-serif font-semibold text-slate-900 text-lg">Menu</span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
            aria-label="Close menu"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        <div className="flex flex-col py-4">
          <button
            onClick={() => handleNavClick(() => { onShowHome(); setTimeout(() => onNavigateToSection('about'), 100); })}
            className="px-6 py-4 text-left text-slate-700 hover:bg-slate-50 hover:text-brand-red text-base font-medium transition-colors border-b border-gray-50"
          >
            About
          </button>
          <button
            onClick={() => handleNavClick(() => { onShowHome(); setTimeout(() => onNavigateToSection('initiatives'), 100); })}
            className="px-6 py-4 text-left text-slate-700 hover:bg-slate-50 hover:text-brand-red text-base font-medium transition-colors border-b border-gray-50"
          >
            Initiatives
          </button>
          <button
            onClick={() => handleNavClick(onShowContribute)}
            className="px-6 py-4 text-left text-slate-700 hover:bg-slate-50 hover:text-brand-red text-base font-medium transition-colors border-b border-gray-50"
          >
            Contribute
          </button>
          <button
            onClick={() => handleNavClick(onShowContact)}
            className="px-6 py-4 text-left text-slate-700 hover:bg-slate-50 hover:text-brand-red text-base font-medium transition-colors"
          >
            Contact
          </button>
        </div>

        {/* Mobile CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
          <button
            onClick={() => handleNavClick(onShowContribute)}
            className="w-full bg-brand-red text-white font-medium py-3 rounded-sm hover:bg-red-800 transition-colors text-sm uppercase tracking-wide"
          >
            Contribute to the Centre
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
