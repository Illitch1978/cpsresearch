import { useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import MissionSection from "@/components/MissionSection";
import InitiativesSection from "@/components/InitiativesSection";
import BenefitsSection from "@/components/BenefitsSection";
import ContactView from "@/components/ContactView";
import ContributeView from "@/components/ContributeView";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import CommunityFinderWidget from "@/components/CommunityFinderWidget";

type View = "home" | "contact" | "contribute";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("home");
  const [isExpertFinderOpen, setIsExpertFinderOpen] = useState(false);
  const [isCommunityFinderOpen, setIsCommunityFinderOpen] = useState(false);

  const showHome = () => {
    setCurrentView("home");
    window.scrollTo(0, 0);
  };

  const showContact = () => {
    setCurrentView("contact");
    window.scrollTo(0, 0);
  };

  const showContribute = () => {
    setCurrentView("contribute");
    window.scrollTo(0, 0);
  };

  const navigateToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation
        onShowHome={showHome}
        onShowContribute={showContribute}
        onShowContact={showContact}
        onNavigateToSection={navigateToSection}
      />

      {currentView === "home" && (
        <div className="fade-in">
          <HeroSection 
            onOpenExpertFinder={() => setIsExpertFinderOpen(true)}
            onOpenCommunityFinder={() => setIsCommunityFinderOpen(true)}
          />
          <MissionSection />
          <InitiativesSection />
          <BenefitsSection onShowContribute={showContribute} />
        </div>
      )}

      {currentView === "contact" && <ContactView />}

      {currentView === "contribute" && <ContributeView />}

      <Footer
        onShowHome={showHome}
        onShowContribute={showContribute}
        onNavigateToSection={navigateToSection}
      />

      <ChatWidget 
        isOpen={isExpertFinderOpen} 
        onToggle={() => setIsExpertFinderOpen(!isExpertFinderOpen)} 
      />
      <CommunityFinderWidget 
        isOpen={isCommunityFinderOpen} 
        onToggle={() => setIsCommunityFinderOpen(!isCommunityFinderOpen)} 
      />
    </div>
  );
};

export default Index;
