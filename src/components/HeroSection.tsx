import heroImage from "@/assets/london-hero.png";

interface HeroSectionProps {
  onShowContribute: () => void;
}

const HeroSection = ({ onShowContribute }: HeroSectionProps) => {
  return (
    <header
      className="hero-section py-40 flex items-center justify-center"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="hero-glow"></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-8 leading-tight font-serif text-white">
          Empowering <span className="italic text-slate-300">insight</span> <br />and collaboration
        </h1>
        <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto font-light leading-relaxed mb-14 antialiased">
          We make high quality research easier to find, easier to trust and easier to use, strengthening
          understanding of professional services in a changing economy.
        </p>
        <div>
          <button
            onClick={onShowContribute}
            className="group relative inline-flex items-center justify-center px-10 py-4 font-medium text-white transition-all duration-300 bg-brand-red rounded-sm hover:bg-red-800 shadow-lg hover:shadow-red-900/30"
          >
            <span className="tracking-wide text-sm uppercase">Contribute to the Centre</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
