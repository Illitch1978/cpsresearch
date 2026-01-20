import cpsrLogo from "@/assets/cpsr-logo.jpg";

interface NavigationProps {
  onShowHome: () => void;
  onShowContribute: () => void;
  onShowContact: () => void;
  onNavigateToSection: (section: string) => void;
}

const Navigation = ({ onShowHome, onShowContribute, onShowContact, onNavigateToSection }: NavigationProps) => {
  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center cursor-pointer" onClick={onShowHome}>
            <div className="flex-shrink-0 flex items-center gap-5">
              <img
                src={cpsrLogo}
                alt="CPSR Logo"
                className="h-10 w-auto object-contain"
              />
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex flex-col justify-center">
                <span className="font-serif font-semibold text-slate-900 text-lg leading-none tracking-tight">
                  Centre for
                </span>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1.5">
                  Professional Services Research
                </span>
              </div>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-10">
            <button
              onClick={() => { onShowHome(); setTimeout(() => onNavigateToSection('about'), 100); }}
              className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors duration-200 font-sans cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => { onShowHome(); setTimeout(() => onNavigateToSection('initiatives'), 100); }}
              className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors duration-200 font-sans cursor-pointer"
            >
              Initiatives
            </button>
            <button
              onClick={onShowContribute}
              className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors duration-200 font-sans"
            >
              Contribute
            </button>
            <button
              onClick={onShowContact}
              className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors duration-200 font-sans cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
