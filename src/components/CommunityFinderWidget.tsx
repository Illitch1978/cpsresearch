import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faTimes, faPaperPlane, faSpinner, faBookmark, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Community {
  name: string;
  members: number;
  description: string;
  url: string;
  tags: string[];
  theme?: string;
}

const communities: Community[] = [
  { name: "Legal Tech Innovators", members: 2340, description: "Digital transformation in legal services", url: "#", tags: ["Technology", "Innovation"], theme: "Digital Transformation" },
  { name: "CEO Roundtable UK", members: 890, description: "Strategic discussions for chief executives", url: "#", tags: ["CEO", "Leadership"], theme: "Executive Leadership" },
  { name: "Future Leaders Network", members: 4120, description: "Emerging talent in professional services", url: "#", tags: ["Millennial", "Mentor"], theme: "Career Development" },
  { name: "Sustainability Champions", members: 1560, description: "ESG and CSR best practices forum", url: "#", tags: ["Sustainability", "DEI"], theme: "ESG & Sustainability" },
  { name: "High Net Worth Advisors", members: 720, description: "Wealth management and advisory network", url: "#", tags: ["High Net Worth", "Finance"], theme: "Wealth Management" },
  { name: "NED Connect", members: 1890, description: "Non-executive director community", url: "#", tags: ["NED", "Governance"], theme: "Corporate Governance" },
  { name: "Entrepreneurship Hub", members: 3450, description: "Founders and startup enthusiasts", url: "#", tags: ["Entrepreneur", "Innovation"], theme: "Entrepreneurship" },
  { name: "SME Growth Forum", members: 2100, description: "Scaling strategies for mid-market firms", url: "#", tags: ["SME", "Business development"], theme: "Business Growth" },
];

// All lists alphabetically sorted
const continents = [
  "Africa", "Antarctica", "Asia", "Australia", "Europe", "North America", "South America"
].sort();

const countries = [
  "Australia", "Canada", "France", "Germany", "Japan", "Netherlands",
  "Singapore", "UAE", "United Kingdom", "United States"
].sort();

// Sectors matching expert widget structure
const sectors = [
  "Accountancy",
  "Construction",
  "Consultancy",
  "Distribution",
  "Energy",
  "Financial services",
  "Health",
  "Hospitality",
  "Legal services",
  "Manufacturing",
  "Marketing",
  "Other services",
  "Property",
  "Recruitment",
  "Technology",
].sort();

const managementExpertise = [
  "Business development", "Communication", "Facilities", "Finance", 
  "Government liaison", "Human resources", "Innovation", "Learning & Development", 
  "Marketing", "Operations", "Performance management", "Planning", 
  "Procurement", "Product development", "Risk", "Sales", "Sustainability", "Technology"
].sort();

const leadershipExpertise = [
  "Board Member", "Chairman", "Chief of Staff", "Divisional Leadership", 
  "Firmwide Leadership", "Governance", "NED", "Project leadership", "Strategy"
].sort();

// PEST External Factors
const politicalFactors = [
  "Funding & Grants", "Government Policies & Stability", 
  "International Relations", "Regulatory Environment"
].sort();

const economicFactors = [
  "Consumer Behaviors", "Cost Factors", "Macroeconomic Trends", "Market Conditions"
].sort();

const socialFactors = [
  "Demographics", "Lifestyle & Trends", "Public Opinion", "Workforce Factors"
].sort();

const technologicalFactors = [
  "Innovation & R&D", "Obsolescence", "Operational Technology", "Technology Transfer"
].sort();

const orgTypes = [
  "B Corp",
  "Business school",
  "Charity",
  "Consortium",
  "Corporate organisation",
  "Educational establishment",
  "Joint venture",
  "Partnership",
  "Professional firm",
  "Professional body",
  "Public sector",
  "Virtual firm",
].sort();

type ChatStep = "topic" | "filters" | "searching" | "results";

interface CommunityFinderWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

const CommunityFinderWidget = ({ isOpen, onToggle }: CommunityFinderWidgetProps) => {
  const [step, setStep] = useState<ChatStep>("topic");
  const [topic, setTopic] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "bot" }>>([]);

  // Filter states
  const [locationFilter, setLocationFilter] = useState("any");
  const [selectedContinents, setSelectedContinents] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [sectorFilter, setSectorFilter] = useState("any");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [expertiseFilter, setExpertiseFilter] = useState("any");
  const [selectedManagement, setSelectedManagement] = useState<string[]>([]);
  const [selectedLeadership, setSelectedLeadership] = useState<string[]>([]);
  const [externalFactorsFilter, setExternalFactorsFilter] = useState("any");
  const [selectedPolitical, setSelectedPolitical] = useState<string[]>([]);
  const [selectedEconomic, setSelectedEconomic] = useState<string[]>([]);
  const [selectedSocial, setSelectedSocial] = useState<string[]>([]);
  const [selectedTechnological, setSelectedTechnological] = useState<string[]>([]);
  const [orgTypeFilter, setOrgTypeFilter] = useState("any");
  const [selectedOrgTypes, setSelectedOrgTypes] = useState<string[]>([]);
  const [bookmarkedCommunities, setBookmarkedCommunities] = useState<string[]>([]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setMessages([...messages, { text: inputValue, sender: "user" }]);
    setTopic(inputValue);
    setInputValue("");

    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "What are you looking for today?", sender: "bot" }]);
      setStep("filters");
    }, 600);
  };

  const handleContinentToggle = (continent: string) => {
    setSelectedContinents(prev => 
      prev.includes(continent) ? prev.filter(c => c !== continent) : [...prev, continent]
    );
  };

  const handleCountryToggle = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  const handleSectorToggle = (sector: string) => {
    setSelectedSectors(prev => 
      prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]
    );
  };

  const handleManagementToggle = (item: string) => {
    setSelectedManagement(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleLeadershipToggle = (item: string) => {
    setSelectedLeadership(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handlePoliticalToggle = (item: string) => {
    setSelectedPolitical(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleEconomicToggle = (item: string) => {
    setSelectedEconomic(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleSocialToggle = (item: string) => {
    setSelectedSocial(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleTechnologicalToggle = (item: string) => {
    setSelectedTechnological(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleOrgTypeToggle = (item: string) => {
    setSelectedOrgTypes(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleCommunityBookmark = (name: string) => {
    setBookmarkedCommunities(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const handleFindCommunities = () => {
    setStep("searching");
    setTimeout(() => {
      setStep("results");
    }, 1500);
  };

  const resetWidget = () => {
    setStep("topic");
    setTopic("");
    setInputValue("");
    setMessages([]);
    setLocationFilter("any");
    setSelectedContinents([]);
    setSelectedCountries([]);
    setSectorFilter("any");
    setSelectedSectors([]);
    setExpertiseFilter("any");
    setSelectedManagement([]);
    setSelectedLeadership([]);
    setExternalFactorsFilter("any");
    setSelectedPolitical([]);
    setSelectedEconomic([]);
    setSelectedSocial([]);
    setSelectedTechnological([]);
    setOrgTypeFilter("any");
    setSelectedOrgTypes([]);
  };

  // Build recap summary
  const buildRecapSummary = () => {
    const locationLabel = locationFilter === "any" 
      ? "any location" 
      : locationFilter === "continent" && selectedContinents.length > 0
        ? selectedContinents.join(", ")
        : locationFilter === "country" && selectedCountries.length > 0
          ? selectedCountries.join(", ")
          : "any location";

    const sectorLabel = sectorFilter === "any" || selectedSectors.length === 0
      ? "any sector"
      : selectedSectors.slice(0, 2).join(", ") + (selectedSectors.length > 2 ? ` +${selectedSectors.length - 2} more` : "");

    const expertiseLabel = expertiseFilter === "any" || (selectedManagement.length === 0 && selectedLeadership.length === 0)
      ? "any expertise"
      : [...selectedManagement, ...selectedLeadership].slice(0, 2).join(", ") + 
        ([...selectedManagement, ...selectedLeadership].length > 2 ? ` +${[...selectedManagement, ...selectedLeadership].length - 2} more` : "");

    const allExternalFactors = [...selectedPolitical, ...selectedEconomic, ...selectedSocial, ...selectedTechnological];
    const externalFactorsLabel = externalFactorsFilter === "any" || allExternalFactors.length === 0
      ? "any external factor"
      : allExternalFactors.slice(0, 2).join(", ") + (allExternalFactors.length > 2 ? ` +${allExternalFactors.length - 2} more` : "");

    const orgTypeLabel = orgTypeFilter === "any" || selectedOrgTypes.length === 0
      ? "any org type"
      : selectedOrgTypes.slice(0, 2).join(", ") + (selectedOrgTypes.length > 2 ? ` +${selectedOrgTypes.length - 2} more` : "");

    return `Communities on "${topic}"; ${locationLabel}; ${sectorLabel}; ${orgTypeLabel}; ${expertiseLabel}; ${externalFactorsLabel}`;
  };

  const FilterSection = ({ 
    title, 
    children 
  }: { 
    title: string; 
    children: React.ReactNode;
  }) => (
    <div className="border-b border-slate-100 pb-3">
      <p className="text-xs font-medium text-slate-700 py-2">{title}</p>
      <div className="pt-1">
        {children}
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
          onClick={onToggle}
        />
      )}

      {/* Widget Panel */}
      {isOpen && (
        <div 
          className="fixed bottom-20 left-1/2 sm:bottom-28 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-96 bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 origin-center"
          style={{ transform: 'translateX(-50%)' }}
        >
          {/* Header */}
          <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faUsers} className="text-sm" />
              <div>
                <h3 className="font-medium text-sm">Find a Community</h3>
                <p className="text-xs text-slate-400">Discover professional networks</p>
              </div>
            </div>
            <button onClick={onToggle} className="text-slate-400 hover:text-white transition-colors">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Content */}
          <div className="h-[400px] overflow-y-auto bg-slate-50 p-4 flex flex-col gap-4">
            {step === "topic" && (
              <>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
                    <FontAwesomeIcon icon={faUsers} className="text-xs" />
                  </div>
                  <div className="bg-white border border-gray-100 p-3 rounded-lg rounded-tl-none text-sm text-slate-700 shadow-sm">
                    <p>Hello! What topic are you interested in?</p>
                  </div>
                </div>
              </>
            )}

            {step === "filters" && (
              <div className="p-4 space-y-3">
                {/* Messages */}
                <div className="space-y-2 mb-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`text-sm p-2 rounded-lg ${msg.sender === "user" ? "bg-slate-100 text-slate-800 ml-8" : "bg-slate-50 text-slate-700 mr-8"}`}>
                      {msg.text}
                    </div>
                  ))}
                </div>

                {/* Location */}
                <FilterSection title="Location">
                  <RadioGroup value={locationFilter} onValueChange={setLocationFilter} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="any" id="loc-any" />
                      <Label htmlFor="loc-any" className="text-xs text-slate-700 cursor-pointer">Any location</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="continent" id="loc-continent" />
                      <Label htmlFor="loc-continent" className="text-xs text-slate-700 cursor-pointer">Specific continents</Label>
                    </div>
                    {locationFilter === "continent" && (
                      <div className="ml-5 grid grid-cols-2 gap-1.5 border-l-2 border-slate-100 pl-3">
                        {continents.map((continent) => (
                          <div key={continent} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`continent-${continent}`}
                              checked={selectedContinents.includes(continent)}
                              onCheckedChange={() => handleContinentToggle(continent)}
                            />
                            <Label htmlFor={`continent-${continent}`} className="text-xs text-slate-600 cursor-pointer">{continent}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="country" id="loc-country" />
                      <Label htmlFor="loc-country" className="text-xs text-slate-700 cursor-pointer">Specific countries</Label>
                    </div>
                    {locationFilter === "country" && (
                      <div className="ml-5 grid grid-cols-2 gap-1.5 border-l-2 border-slate-100 pl-3">
                        {countries.map((country) => (
                          <div key={country} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`country-${country}`}
                              checked={selectedCountries.includes(country)}
                              onCheckedChange={() => handleCountryToggle(country)}
                            />
                            <Label htmlFor={`country-${country}`} className="text-xs text-slate-600 cursor-pointer">{country}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </RadioGroup>
                </FilterSection>

                {/* Sectors */}
                <FilterSection title="Sectors">
                  <RadioGroup value={sectorFilter} onValueChange={setSectorFilter} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="any" id="sector-any" />
                      <Label htmlFor="sector-any" className="text-xs text-slate-700 cursor-pointer">Any sector</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="specific" id="sector-specific" />
                      <Label htmlFor="sector-specific" className="text-xs text-slate-700 cursor-pointer">Specific sectors</Label>
                    </div>
                    {sectorFilter === "specific" && (
                      <div className="ml-5 grid grid-cols-2 gap-1.5 border-l-2 border-slate-100 pl-3 max-h-48 overflow-y-auto">
                        {sectors.map((sector) => (
                          <div key={sector} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`sector-${sector}`}
                              checked={selectedSectors.includes(sector)}
                              onCheckedChange={() => handleSectorToggle(sector)}
                            />
                            <Label htmlFor={`sector-${sector}`} className="text-xs text-slate-600 cursor-pointer">{sector}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </RadioGroup>
                </FilterSection>

                {/* Org Type */}
                <FilterSection title="Org type">
                  <RadioGroup value={orgTypeFilter} onValueChange={setOrgTypeFilter} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="any" id="orgtype-any" />
                      <Label htmlFor="orgtype-any" className="text-xs text-slate-700 cursor-pointer">Any org type</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="specific" id="orgtype-specific" />
                      <Label htmlFor="orgtype-specific" className="text-xs text-slate-700 cursor-pointer">Specific org types</Label>
                    </div>
                    {orgTypeFilter === "specific" && (
                      <div className="ml-5 grid grid-cols-2 gap-1.5 border-l-2 border-slate-100 pl-3 max-h-36 overflow-y-auto">
                        {orgTypes.map((item) => (
                          <div key={item} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`orgtype-${item}`}
                              checked={selectedOrgTypes.includes(item)}
                              onCheckedChange={() => handleOrgTypeToggle(item)}
                            />
                            <Label htmlFor={`orgtype-${item}`} className="text-xs text-slate-600 cursor-pointer">{item}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </RadioGroup>
                </FilterSection>

                {/* Expertise */}
                <FilterSection title="Expertise">
                  <RadioGroup value={expertiseFilter} onValueChange={setExpertiseFilter} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="any" id="expertise-any" />
                      <Label htmlFor="expertise-any" className="text-xs text-slate-700 cursor-pointer">Any expertise</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="specific" id="expertise-specific" />
                      <Label htmlFor="expertise-specific" className="text-xs text-slate-700 cursor-pointer">Specific expertise</Label>
                    </div>
                    {expertiseFilter === "specific" && (
                      <div className="ml-5 space-y-3 border-l-2 border-slate-100 pl-3">
                        {/* Management Expertise Subset */}
                        <div>
                          <p className="text-[10px] uppercase font-medium text-slate-500 mb-1.5">Management</p>
                          <div className="grid grid-cols-2 gap-1.5 max-h-28 overflow-y-auto">
                            {managementExpertise.map((item) => (
                              <div key={item} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`mgmt-${item}`}
                                  checked={selectedManagement.includes(item)}
                                  onCheckedChange={() => handleManagementToggle(item)}
                                />
                                <Label htmlFor={`mgmt-${item}`} className="text-xs text-slate-600 cursor-pointer">{item}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Leadership Expertise Subset */}
                        <div>
                          <p className="text-[10px] uppercase font-medium text-slate-500 mb-1.5">Leadership & Governance</p>
                          <div className="grid grid-cols-2 gap-1.5">
                            {leadershipExpertise.map((item) => (
                              <div key={item} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`lead-${item}`}
                                  checked={selectedLeadership.includes(item)}
                                  onCheckedChange={() => handleLeadershipToggle(item)}
                                />
                                <Label htmlFor={`lead-${item}`} className="text-xs text-slate-600 cursor-pointer">{item}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </RadioGroup>
                </FilterSection>

                {/* External Factors (PEST) */}
                <FilterSection title="External factors">
                  <RadioGroup value={externalFactorsFilter} onValueChange={setExternalFactorsFilter} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="any" id="external-any" />
                      <Label htmlFor="external-any" className="text-xs text-slate-700 cursor-pointer">Any external factor</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="specific" id="external-specific" />
                      <Label htmlFor="external-specific" className="text-xs text-slate-700 cursor-pointer">Specific external factors</Label>
                    </div>
                    {externalFactorsFilter === "specific" && (
                      <div className="ml-5 space-y-3 border-l-2 border-slate-100 pl-3">
                        {/* Political */}
                        <div>
                          <p className="text-[10px] uppercase font-medium text-slate-500 mb-1.5">Political</p>
                          <div className="grid grid-cols-2 gap-1.5">
                            {politicalFactors.map((item) => (
                              <div key={item} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`political-${item}`}
                                  checked={selectedPolitical.includes(item)}
                                  onCheckedChange={() => handlePoliticalToggle(item)}
                                />
                                <Label htmlFor={`political-${item}`} className="text-xs text-slate-600 cursor-pointer">{item}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Economic */}
                        <div>
                          <p className="text-[10px] uppercase font-medium text-slate-500 mb-1.5">Economic</p>
                          <div className="grid grid-cols-2 gap-1.5">
                            {economicFactors.map((item) => (
                              <div key={item} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`economic-${item}`}
                                  checked={selectedEconomic.includes(item)}
                                  onCheckedChange={() => handleEconomicToggle(item)}
                                />
                                <Label htmlFor={`economic-${item}`} className="text-xs text-slate-600 cursor-pointer">{item}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Social */}
                        <div>
                          <p className="text-[10px] uppercase font-medium text-slate-500 mb-1.5">Social</p>
                          <div className="grid grid-cols-2 gap-1.5">
                            {socialFactors.map((item) => (
                              <div key={item} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`social-${item}`}
                                  checked={selectedSocial.includes(item)}
                                  onCheckedChange={() => handleSocialToggle(item)}
                                />
                                <Label htmlFor={`social-${item}`} className="text-xs text-slate-600 cursor-pointer">{item}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Technological */}
                        <div>
                          <p className="text-[10px] uppercase font-medium text-slate-500 mb-1.5">Technological</p>
                          <div className="grid grid-cols-2 gap-1.5">
                            {technologicalFactors.map((item) => (
                              <div key={item} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`tech-${item}`}
                                  checked={selectedTechnological.includes(item)}
                                  onCheckedChange={() => handleTechnologicalToggle(item)}
                                />
                                <Label htmlFor={`tech-${item}`} className="text-xs text-slate-600 cursor-pointer">{item}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </RadioGroup>
                </FilterSection>

                {/* Recap Summary */}
                {topic && (
                  <div className="bg-slate-100 border border-slate-200 rounded-md p-3 mt-4">
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {buildRecapSummary()}
                    </p>
                  </div>
                )}

                {/* Find Button */}
                <button
                  onClick={handleFindCommunities}
                  className="w-full bg-slate-700 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-slate-800 transition-colors mt-4"
                >
                  Find Communities
                </button>
              </div>
            )}

            {step === "searching" && (
              <div className="p-8 flex flex-col items-center justify-center h-full">
                <FontAwesomeIcon icon={faSpinner} className="text-3xl text-slate-600 animate-spin mb-4" />
                <p className="text-sm text-slate-600">Finding communities...</p>
              </div>
            )}

            {step === "results" && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-slate-700">
                    {communities.length} communities found
                  </p>
                  <button
                    onClick={resetWidget}
                    className="text-xs text-slate-600 hover:underline"
                  >
                    New search
                  </button>
                </div>

                <div className="space-y-3">
                  {communities.map((community, i) => (
                    <div 
                      key={i} 
                      className="bg-slate-50 rounded-lg p-3 border border-slate-100 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white flex-shrink-0">
                          <FontAwesomeIcon icon={faUsers} className="text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <a 
                              href={community.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-slate-900 text-sm hover:text-slate-600 transition-colors"
                            >
                              {community.name}
                            </a>
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px] text-slate-400" />
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{community.description}</p>
                          <div className="flex flex-col gap-1.5 mt-1.5">
                            {community.theme && (
                              <span className="inline-block w-fit px-2 py-0.5 bg-brand-red/10 text-brand-red text-[10px] font-medium rounded">
                                {community.theme}
                              </span>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-700 font-medium">
                                {community.members.toLocaleString()} members
                              </span>
                              <div className="flex gap-1">
                                {community.tags.slice(0, 2).map((tag, j) => (
                                  <span key={j} className="px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() => handleCommunityBookmark(community.name)}
                              className={`text-xs flex items-center gap-1 transition-colors ${
                                bookmarkedCommunities.includes(community.name) 
                                  ? "text-slate-700" 
                                  : "text-slate-400 hover:text-slate-700"
                              }`}
                            >
                              <FontAwesomeIcon icon={faBookmark} />
                              {bookmarkedCommunities.includes(community.name) ? "Bookmarked" : "Bookmark"}
                            </button>
                            <a 
                              href={community.url}
                              className="text-xs text-slate-700 hover:underline"
                            >
                              Join
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={step === "results" ? "Refine search..." : "Type a topic..."}
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
                disabled={step !== "topic" && step !== "results"}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-2"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CommunityFinderWidget;
