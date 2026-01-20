interface FooterProps {
  onShowHome: () => void;
  onShowContribute: () => void;
  onNavigateToSection: (section: string) => void;
}

const Footer = ({ onShowHome, onShowContribute, onNavigateToSection }: FooterProps) => {
  return (
    <footer className="bg-footer-bg text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="text-lg font-serif font-medium mb-4">The Centre</h4>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Championing rigorous methods, transparency and collaboration across professional firms, business
              schools, professional bodies and independent researchers.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-serif font-medium mb-4">Contact</h4>
            <div className="space-y-2">
              <p className="text-slate-400 text-sm font-light">
                For inquiries and collaboration:
                <br />
                <a
                  href="mailto:richard.chaplin@pmint.co.uk"
                  className="text-white hover:text-gray-300 transition mt-1 inline-block"
                >
                  richard.chaplin@pmint.co.uk
                </a>
              </p>
              <p className="text-slate-400 text-sm font-light">
                General information:
                <br />
                <a
                  href="mailto:contact@cpsr.uk"
                  className="text-slate-400 hover:text-white transition mt-1 inline-block"
                >
                  contact@cpsr.uk
                </a>
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-serif font-medium mb-4">Links</h4>
            <ul className="text-sm space-y-2 font-light">
              <li>
                <button
                  onClick={onShowHome}
                  className="text-slate-400 hover:text-white transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onShowHome();
                    setTimeout(() => onNavigateToSection('about'), 100);
                  }}
                  className="text-slate-400 hover:text-white transition"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onShowHome();
                    setTimeout(() => onNavigateToSection('initiatives'), 100);
                  }}
                  className="text-slate-400 hover:text-white transition"
                >
                  Initiatives
                </button>
              </li>
              <li>
                <button
                  onClick={onShowContribute}
                  className="text-slate-400 hover:text-white transition"
                >
                  Contribute
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500 font-light">
          &copy; 2026 Centre for Professional Services Research. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
