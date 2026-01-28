import heroImage from "@/assets/london-hero.png";

const HeroSection = () => {
  return (
    <header
      className="hero-section py-20 sm:py-40 flex items-center justify-center min-h-[85vh] sm:min-h-screen"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="hero-glow"></div>
      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-medium tracking-tight mb-6 sm:mb-8 leading-tight font-serif text-white">
          Empowering <span className="italic text-slate-300">insight</span> <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>and collaboration
        </h1>
        <p className="text-base sm:text-xl md:text-2xl text-white/90 sm:text-white max-w-3xl mx-auto font-light leading-relaxed antialiased px-2 sm:px-0">
          We make high quality research easier to find, easier to trust and easier to use, strengthening
          understanding of professional services in a changing economy.
        </p>
      </div>
    </header>
  );
};

export default HeroSection;
