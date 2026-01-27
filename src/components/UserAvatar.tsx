import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMessage, faCamera, faAddressBook, faBookmark, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const UserAvatar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { label: "Welcome message", icon: faMessage, action: () => {} },
    { label: "Profile photo", icon: faCamera, action: () => {} },
    { label: "Contact details", icon: faAddressBook, action: () => {} },
    { label: "Bookmarks", icon: faBookmark, action: () => navigate("/bookmarks") },
    { label: "Log out", icon: faRightFromBracket, action: () => {}, divider: true },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-500 hover:from-slate-300 hover:to-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
        aria-label="User menu"
      >
        <FontAwesomeIcon icon={faUser} className="text-sm" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-100 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-900">John Smith</p>
            <p className="text-xs text-slate-500">john.smith@company.com</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item, index) => (
              <div key={item.label}>
                {item.divider && <div className="my-1 border-t border-slate-100" />}
                <button
                  onClick={() => {
                    item.action();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-3 transition-colors"
                >
                  <FontAwesomeIcon icon={item.icon} className="text-slate-400 w-4" />
                  {item.label}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
