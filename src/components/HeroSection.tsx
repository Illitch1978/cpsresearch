import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faUsers } from "@fortawesome/free-solid-svg-icons";
import heroImage from "@/assets/london-hero.png";
import cpsrLogoWhite from "@/assets/cpsr-logo-white.png";

const useCountUp = (target: number, duration = 1800) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
};

interface HeroSectionProps {
  onOpenExpertFinder: () => void;
  onOpenCommunityFinder: () => void;
}

const HeroSection = ({ onOpenExpertFinder, onOpenCommunityFinder }: HeroSectionProps) => {
  const experts = useCountUp(247);
  const firms = useCountUp(86);

  return (
    <header
      className="hero-section py-20 sm:py-32 flex items-center justify-center min-h-screen relative -mt-20 sm:-mt-24"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="hero-glow"></div>
      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 text-center relative z-10 pt-8 sm:pt-12">
        {/* White CPSR Logo */}
        <img 
          src={cpsrLogoWhite} 
          alt="Centre for Professional Services Research" 
          className="h-12 sm:h-16 md:h-20 w-auto mx-auto mb-48 sm:mb-52"
        />
        
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-medium tracking-tight mb-6 sm:mb-8 leading-tight font-serif text-white">
          Empowering <span className="italic text-slate-300">insight</span> <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>and collaboration
        </h1>
        <p className="text-base sm:text-xl md:text-2xl text-white/90 sm:text-white max-w-3xl mx-auto font-light leading-relaxed antialiased px-2 sm:px-0 mb-10 sm:mb-14">
          We make high quality research easier to find, easier to trust and easier to use, strengthening
          understanding of professional services in a changing economy.
        </p>
        
        {/* Finder Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenExpertFinder}
            className="bg-brand-red hover:bg-red-800 text-white py-3 px-6 sm:py-4 sm:px-8 rounded-full shadow-lg flex items-center gap-3 transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faCommentDots} className="text-lg sm:text-xl" />
            <span className="font-medium text-sm tracking-wide">Find an expert</span>
          </button>
          <button
            onClick={onOpenCommunityFinder}
            className="bg-slate-700 hover:bg-slate-800 text-white py-3 px-6 sm:py-4 sm:px-8 rounded-full shadow-lg flex items-center gap-3 transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faUsers} className="text-lg sm:text-xl" />
            <span className="font-medium text-sm tracking-wide">Find a community</span>
          </button>
        </div>

        {/* Ticker Metrics */}
        <p className="mt-8 text-sm text-white/60 font-light tracking-wide">
          Sourced from{" "}
          <span ref={experts.ref} className="text-white font-semibold tabular-nums">{experts.count.toLocaleString()}</span>
          {" "}experts at{" "}
          <span ref={firms.ref} className="text-white font-semibold tabular-nums">{firms.count.toLocaleString()}</span>
          {" "}firms
        </p>
      </div>
    </header>
  );
};

export default HeroSection;
