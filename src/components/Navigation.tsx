import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faBell, faClock, faComments, faUsers, faFolderOpen, faCalendarDays, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import cpsrLogo from "@/assets/cpsr-logo.jpg";
import UserAvatar from "./UserAvatar";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface NavigationProps {
  onShowHome: () => void;
  onShowContribute: () => void;
  onShowContact: () => void;
  onNavigateToSection: (section: string) => void;
  isTransparent?: boolean;
  isLoggedIn?: boolean;
}

const Navigation = ({ onShowHome, onShowContribute, onShowContact, onNavigateToSection, isTransparent = false, isLoggedIn = true }: NavigationProps) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const siteNotifications = [
    { id: "s1", icon: faComments, text: "New discussion in Professional Services Research", time: "2 hours ago", read: false },
    { id: "s2", icon: faUsers, text: "Robert Kimani joined the community", time: "Yesterday", read: false },
    { id: "s3", icon: faFolderOpen, text: "New resource: AI Adoption in Audit", time: "Yesterday", read: false },
    { id: "s4", icon: faCalendarDays, text: "Upcoming: Mixed-Methods Workshop (28 Mar)", time: "2 days ago", read: true },
    { id: "s5", icon: faComments, text: "Emma Richardson replied to your bookmark", time: "3 days ago", read: true },
  ];
  const unreadCount = siteNotifications.filter(n => !n.read).length;

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
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${isTransparent ? 'max-w-full' : 'max-w-7xl'}`}>
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
          <div className="hidden sm:ml-auto sm:flex sm:items-center space-x-6 mr-2">
            <button
              onClick={() => { onShowHome(); setTimeout(() => onNavigateToSection('about'), 100); }}
              className={`text-sm font-medium transition-colors duration-200 font-sans cursor-pointer ${
                isTransparent ? 'text-white/90 hover:text-white' : 'text-slate-600 hover:text-brand-red'
              }`}
            >
              About
            </button>
            <button
              onClick={() => navigate("/my-communities")}
              className={`text-sm font-medium transition-colors duration-200 font-sans cursor-pointer ${
                isTransparent ? 'text-white/90 hover:text-white' : 'text-slate-600 hover:text-brand-red'
              }`}
            >
              Communities
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
            {isLoggedIn ? (
              <>
                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className={`relative p-1.5 rounded-md transition-colors ${
                      notificationsOpen
                        ? "bg-primary/10 text-primary"
                        : isTransparent
                          ? "text-white/80 hover:text-white"
                          : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <FontAwesomeIcon icon={faBell} className="text-lg" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-background rounded-lg shadow-xl border border-border z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-card-foreground">Notifications</h3>
                        <button className="text-xs text-primary hover:underline">Mark all read</button>
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-border">
                        {siteNotifications.map(item => (
                          <div
                            key={item.id}
                            className={`px-4 py-3 hover:bg-muted/50 transition-colors flex items-start gap-3 cursor-pointer ${!item.read ? "bg-primary/[0.02]" : ""}`}
                          >
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                              <FontAwesomeIcon icon={item.icon} className="text-xs" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-card-foreground leading-relaxed">{item.text}</p>
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                                <FontAwesomeIcon icon={faClock} className="text-[9px]" /> {item.time}
                              </span>
                            </div>
                            {!item.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2.5 border-t border-border text-center">
                        <button className="text-xs text-primary font-medium hover:underline">View all notifications</button>
                      </div>
                    </div>
                  )}
                </div>
                <UserAvatar />
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isTransparent
                    ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                <FontAwesomeIcon icon={faSignInAlt} className="text-xs" /> Sign in
              </button>
            )}
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
