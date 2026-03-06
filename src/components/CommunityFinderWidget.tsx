import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faTimes, faPaperPlane, faSpinner, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
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

// All lists alphabetically sorted - excluding Antarctica
const continents = [
  "Africa", "Asia", "Australia", "Europe", "North America", "South America"
].sort();

// Countries grouped by continent for hierarchical display
const countriesByContinent: Record<string, string[]> = {
  "Africa": ["Egypt", "Kenya", "Nigeria", "South Africa"].sort(),
  "Asia": ["China", "India", "Japan", "Singapore", "UAE"].sort(),
  "Australia": ["Australia", "New Zealand"].sort(),
  "Europe": ["France", "Germany", "Netherlands", "United Kingdom"].sort(),
  "North America": ["Canada", "United States"].sort(),
  "South America": ["Argentina", "Brazil", "Chile"].sort(),
};

// Sectors with sub-sectors matching expert widget structure
const sectorsByCategory: Record<string, string[]> = {
  "Accountancy": ["Audit", "Tax", "Advisory", "Forensic", "Insolvency"].sort(),
  "Construction": ["Commercial", "Residential", "Infrastructure", "Civil Engineering"].sort(),
  "Consultancy": ["Strategy", "Operations", "HR", "IT", "Management"].sort(),
  "Distribution": ["Logistics", "Warehousing", "Supply Chain", "Retail Distribution"].sort(),
  "Energy": ["Oil & Gas", "Renewables", "Utilities", "Nuclear"].sort(),
  "Financial services": ["Banking", "Insurance", "Asset Management", "Private Equity"].sort(),
  "Health": ["Hospitals", "Pharma", "Biotech", "Medical Devices", "Care Services"].sort(),
  "Hospitality": ["Hotels", "Restaurants", "Events", "Travel"].sort(),
  "Legal services": ["Corporate", "Litigation", "IP", "Employment", "Real Estate"].sort(),
  "Manufacturing": ["Automotive", "Aerospace", "Consumer Goods", "Industrial"].sort(),
  "Marketing": ["Digital", "Brand", "PR", "Advertising", "Research"].sort(),
  "Other services": ["Facilities", "Security", "Cleaning", "Outsourcing"].sort(),
  "Property": ["Commercial", "Residential", "Development", "Investment"].sort(),
  "Recruitment": ["Executive Search", "Temp", "RPO", "Specialist"].sort(),
  "Technology": ["Software", "Hardware", "SaaS", "AI/ML", "Cybersecurity"].sort(),
};

const sectors = Object.keys(sectorsByCategory).sort();

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

// Expertise areas for communities - split into two categories
const managementExpertiseList = [
  "Business development",
  "Communication",
  "Facilities",
  "Finance",
  "Government liaison",
  "Human resources",
  "Innovation",
  "Learning & Development",
  "Marketing",
  "Operations",
  "Performance management",
  "Planning",
  "Procurement",
  "Product development",
  "Risk",
  "Sales",
  "Sustainability (DEI, CSR)",
  "Technology"
];

const leadershipExpertiseList = [
  "Board/ExCo (Chairman, NED, Member)",
  "Chief of Staff",
  "Divisional Leadership",
  "Firmwide Leadership",
  "Governance",
  "Project leadership",
  "Strategy"
];

// Contribution areas for communities (singular for display, plural for recap)
const contributionsList = [
  { singular: "Add/comment on posts", plural: "posts" },
  { singular: "Case studies", plural: "case studies" },
  { singular: "Community management", plural: "community management" },
  { singular: "Education", plural: "education" },
  { singular: "Events", plural: "events" },
  { singular: "Mentorship", plural: "mentorship" },
  { singular: "Publications", plural: "publications" },
  { singular: "Research", plural: "research" },
  { singular: "Thought leadership", plural: "thought leadership" }
];
const externalFactorsList = {
  "Political": [
    "Government Policies & Stability",
    "Regulatory Environment",
    "International Relations",
    "Funding & Grants"
  ],
  "Economic": [
    "Macroeconomic Trends",
    "Market Conditions",
    "Consumer Behaviors",
    "Cost Factors"
  ],
  "Social": [
    "Demographics",
    "Lifestyle & Trends",
    "Workforce Factors",
    "Public Opinion"
  ],
  "Technological": [
    "Innovation & R&D",
    "Operational Technology",
    "Technology Transfer",
    "Obsolescence"
  ]
};

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

  // Filter states - aligned with ChatWidget
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [expandedSectors, setExpandedSectors] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState("any");
  const [selectedContinents, setSelectedContinents] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [expertiseFilter, setExpertiseFilter] = useState("any");
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [orgTypeFilter, setOrgTypeFilter] = useState("any");
  const [selectedOrgTypes, setSelectedOrgTypes] = useState<string[]>([]);
  const [externalFactorFilter, setExternalFactorFilter] = useState("any");
  const [selectedExternalFactors, setSelectedExternalFactors] = useState<string[]>([]);
  const [selectedContributions, setSelectedContributions] = useState<string[]>([]);
  const [bookmarkedCommunities, setBookmarkedCommunities] = useState<string[]>([]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setMessages([...messages, { text: inputValue, sender: "user" }]);
    setTopic(inputValue);
    setInputValue("");

    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "What type of communities are you looking for today?", sender: "bot" }]);
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

  const handleSectorExpand = (sector: string) => {
    setExpandedSectors(prev => 
      prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]
    );
  };

  const handleExpertiseToggle = (expertise: string) => {
    setSelectedExpertise(prev => 
      prev.includes(expertise) ? prev.filter(e => e !== expertise) : [...prev, expertise]
    );
  };

  const handleExternalFactorToggle = (factor: string) => {
    setSelectedExternalFactors(prev => 
      prev.includes(factor) ? prev.filter(f => f !== factor) : [...prev, factor]
    );
  };

  const handleOrgTypeToggle = (item: string) => {
    setSelectedOrgTypes(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleContributionToggle = (contribution: string) => {
    setSelectedContributions(prev => 
      prev.includes(contribution) ? prev.filter(c => c !== contribution) : [...prev, contribution]
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
    setSourceFilter("all");
    setSelectedSectors([]);
    setLocationFilter("any");
    setSelectedContinents([]);
    setSelectedCountries([]);
    setExpertiseFilter("any");
    setSelectedExpertise([]);
    setOrgTypeFilter("any");
    setSelectedOrgTypes([]);
    setExternalFactorFilter("any");
    setSelectedExternalFactors([]);
    setSelectedContributions([]);
  };

  // Build recap summary - aligned with ChatWidget style
  const buildRecapSummary = () => {
    // Contributions come first - what they will do in the community (use plural forms)
    const contributionsText = selectedContributions.length > 0 
      ? selectedContributions.map(c => contributionsList.find(item => item.singular === c)?.plural || c.toLowerCase()).join(", ")
      : "";

    const expertiseText = selectedExpertise.length > 0 
      ? selectedExpertise.slice(0, 2).join(", ") + (selectedExpertise.length > 2 ? ` +${selectedExpertise.length - 2} more` : "")
      : "any expertise";

    let sourceText = "";
    if (sourceFilter === "all") sourceText = "any sector";
    else if (sourceFilter === "specific-sectors") sourceText = selectedSectors.length > 0 ? selectedSectors.slice(0, 2).join(", ") + (selectedSectors.length > 2 ? ` +${selectedSectors.length - 2} more` : "") : "specific sectors";

    let locationText = "";
    if (locationFilter === "any") locationText = "any location";
    else if (locationFilter === "specific-continents") locationText = selectedContinents.length > 0 ? selectedContinents.slice(0, 2).join(", ") + (selectedContinents.length > 2 ? ` +${selectedContinents.length - 2} more` : "") : "specific continents";
    else if (locationFilter === "specific-countries") locationText = selectedCountries.length > 0 ? selectedCountries.slice(0, 2).join(", ") + (selectedCountries.length > 2 ? ` +${selectedCountries.length - 2} more` : "") : "specific countries";

    const orgTypeLabel = orgTypeFilter === "any" || selectedOrgTypes.length === 0
      ? "any org type"
      : selectedOrgTypes.slice(0, 2).join(", ") + (selectedOrgTypes.length > 2 ? ` +${selectedOrgTypes.length - 2} more` : "");

    const externalFactorsLabel = selectedExternalFactors.length > 0
      ? selectedExternalFactors.slice(0, 2).join(", ") + (selectedExternalFactors.length > 2 ? ` +${selectedExternalFactors.length - 2} more` : "")
      : "any external factor";

    // New format: Contributor of posts, case studies to "Leadership" communities for any location; any sector; any org type; any expertise; any external factor
    if (contributionsText) {
      return `Contributor of ${contributionsText} to "${topic}" communities for ${locationText}; ${sourceText}; ${orgTypeLabel}; ${expertiseText}; ${externalFactorsLabel}`;
    }
    return `Contributor to "${topic}" communities for ${locationText}; ${sourceText}; ${orgTypeLabel}; ${expertiseText}; ${externalFactorsLabel}`;
  };

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
                <h3 className="font-medium text-sm">Credible Voices Marketplace<sup className="text-[8px] align-super ml-0.5">SM</sup></h3>
                <p className="text-xs text-slate-400">Discover professional networks</p>
              </div>
            </div>
            <button onClick={onToggle} className="text-slate-400 hover:text-white transition-colors">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Content */}
          <div className="h-[400px] overflow-y-auto bg-slate-50 p-4 flex flex-col gap-4">
            {/* Bot Greeting */}
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
                <FontAwesomeIcon icon={faUsers} className="text-xs" />
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-lg rounded-tl-none text-sm text-slate-700 shadow-sm">
                <p>Hello. I can help you identify free-to-join online communities where you can collaborate with peers on topics of mutual interest.</p>
              </div>
            </div>

            {/* Bot Question */}
            <div className="flex gap-3 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
                <FontAwesomeIcon icon={faUsers} className="text-xs" />
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-lg rounded-tl-none text-sm text-slate-700 shadow-sm">
                <p>What topic are you researching?</p>
              </div>
            </div>

            {/* Dynamic Messages */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "gap-3"} animate-fade-in`}
              >
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
                    <FontAwesomeIcon icon={faUsers} className="text-xs" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-lg text-sm shadow-sm max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-brand-red text-white rounded-tr-none"
                      : "bg-white border border-gray-100 rounded-tl-none text-slate-700"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}

            {/* Filter Options */}
            {step === "filters" && (
              <div className="pl-11 flex flex-col gap-4 animate-fade-in">
                <div className="bg-white border border-slate-200 rounded-md p-4 space-y-5">
                  
                  {/* 1. Location Filter */}
                  <div>
                    <p className="text-xs font-medium text-slate-700 mb-2">Communities based on location</p>
                    <RadioGroup value={locationFilter} onValueChange={setLocationFilter} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="any" id="loc-any" />
                        <Label htmlFor="loc-any" className="text-xs text-slate-700 cursor-pointer">Any location</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="specific-continents" id="loc-specific-continents" />
                        <Label htmlFor="loc-specific-continents" className="text-xs text-slate-700 cursor-pointer">Specific continents</Label>
                      </div>
                      {locationFilter === "specific-continents" && (
                        <div className="ml-5 grid grid-cols-2 gap-1.5 border-l-2 border-slate-100 pl-3">
                          {continents.map((continent) => (
                            <div key={continent} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`continent-${continent}`}
                                checked={selectedContinents.includes(continent)}
                                onCheckedChange={() => handleContinentToggle(continent)}
                              />
                              <Label htmlFor={`continent-${continent}`} className="text-[11px] text-slate-600 cursor-pointer">{continent}</Label>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="specific-countries" id="loc-specific-countries" />
                        <Label htmlFor="loc-specific-countries" className="text-xs text-slate-700 cursor-pointer">Specific countries</Label>
                      </div>
                      {locationFilter === "specific-countries" && (
                        <div className="ml-5 max-h-48 overflow-y-auto space-y-2 border-l-2 border-slate-100 pl-3">
                          {continents.map((continent) => (
                            <div key={continent}>
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">{continent}</p>
                              <div className="grid grid-cols-2 gap-1.5 mb-2">
                                {countriesByContinent[continent]?.map((country) => (
                                  <div key={country} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`country-${country}`}
                                      checked={selectedCountries.includes(country)}
                                      onCheckedChange={() => handleCountryToggle(country)}
                                    />
                                    <Label htmlFor={`country-${country}`} className="text-[11px] text-slate-600 cursor-pointer">{country}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </RadioGroup>
                  </div>

                  {/* 2. Sectors Filter */}
                  <div>
                    <p className="text-xs font-medium text-slate-700 mb-2">Communities based on sectors</p>
                    <RadioGroup value={sourceFilter} onValueChange={setSourceFilter} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="source-all" />
                        <Label htmlFor="source-all" className="text-xs text-slate-700 cursor-pointer">Any sector</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="specific-sectors" id="source-specific-sectors" />
                        <Label htmlFor="source-specific-sectors" className="text-xs text-slate-700 cursor-pointer">Specific sectors</Label>
                      </div>

                      {sourceFilter === "specific-sectors" && (
                        <div className="ml-5 max-h-48 overflow-y-auto space-y-2 border-l-2 border-slate-100 pl-3">
                          {sectors.map((sector) => (
                            <div key={sector}>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`sector-${sector}`}
                                  checked={selectedSectors.includes(sector)}
                                  onCheckedChange={() => handleSectorToggle(sector)}
                                />
                                <Label 
                                  htmlFor={`sector-${sector}`} 
                                  className="text-[11px] text-slate-600 cursor-pointer flex-1"
                                >
                                  {sector}
                                </Label>
                                <button
                                  type="button"
                                  onClick={() => handleSectorExpand(sector)}
                                  className="text-[10px] text-slate-400 hover:text-slate-600"
                                >
                                  {expandedSectors.includes(sector) ? "−" : "+"}
                                </button>
                              </div>
                              {expandedSectors.includes(sector) && sectorsByCategory[sector] && (
                                <div className="ml-5 mt-1.5 grid grid-cols-2 gap-1 pl-2 border-l border-slate-100">
                                  {sectorsByCategory[sector].map((subSector) => (
                                    <span key={subSector} className="text-[10px] text-slate-500">{subSector}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </RadioGroup>
                  </div>

                  {/* 3. Org Types Filter */}
                  <div>
                    <p className="text-xs font-medium text-slate-700 mb-2">Communities based on org type</p>
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
                        <div className="ml-5 flex flex-col flex-wrap gap-1.5 border-l-2 border-slate-100 pl-3 max-h-44">
                          {orgTypes.map((item) => (
                            <div key={item} className="flex items-center space-x-2 w-[45%]">
                              <Checkbox 
                                id={`orgtype-${item}`}
                                checked={selectedOrgTypes.includes(item)}
                                onCheckedChange={() => handleOrgTypeToggle(item)}
                              />
                              <Label htmlFor={`orgtype-${item}`} className="text-[11px] text-slate-600 cursor-pointer">{item}</Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </RadioGroup>
                  </div>

                  {/* 4. Expertise Filter (Management + Leadership & Governance) */}
                  <div>
                    <p className="text-xs font-medium text-slate-700 mb-2">Communities based on specific expertise</p>
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
                        <div className="ml-5 space-y-3 border-l-2 border-slate-100 pl-3 max-h-48 overflow-y-auto">
                          {/* Management sub-section */}
                          <div>
                            <p className="text-[11px] font-semibold text-slate-700 mb-1.5">Management</p>
                            <div className="space-y-1.5 ml-2">
                              {managementExpertiseList.map((expertise) => (
                                <div key={expertise} className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`mgmt-expertise-${expertise.toLowerCase().replace(/\s+/g, '-')}`}
                                    checked={selectedExpertise.includes(expertise)}
                                    onCheckedChange={() => handleExpertiseToggle(expertise)}
                                  />
                                  <Label htmlFor={`mgmt-expertise-${expertise.toLowerCase().replace(/\s+/g, '-')}`} className="text-[11px] text-slate-600 cursor-pointer">{expertise}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Leadership & Governance sub-section */}
                          <div>
                            <p className="text-[11px] font-semibold text-slate-700 mb-1.5">Leadership & Governance</p>
                            <div className="space-y-1.5 ml-2">
                              {leadershipExpertiseList.map((expertise) => (
                                <div key={expertise} className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`lead-expertise-${expertise.toLowerCase().replace(/\s+/g, '-')}`}
                                    checked={selectedExpertise.includes(expertise)}
                                    onCheckedChange={() => handleExpertiseToggle(expertise)}
                                  />
                                  <Label htmlFor={`lead-expertise-${expertise.toLowerCase().replace(/\s+/g, '-')}`} className="text-[11px] text-slate-600 cursor-pointer">{expertise}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </RadioGroup>
                  </div>

                  {/* 5. External Factors Filter */}
                  <div>
                    <p className="text-xs font-medium text-slate-700 mb-2">Communities based on external factors</p>
                    <RadioGroup value={externalFactorFilter} onValueChange={setExternalFactorFilter} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="any" id="external-any" />
                        <Label htmlFor="external-any" className="text-xs text-slate-700 cursor-pointer">Any external factor</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="specific" id="external-specific" />
                        <Label htmlFor="external-specific" className="text-xs text-slate-700 cursor-pointer">Specific factors</Label>
                      </div>
                      {externalFactorFilter === "specific" && (
                        <div className="ml-5 space-y-3 border-l-2 border-slate-100 pl-3">
                          {Object.entries(externalFactorsList).map(([category, factors]) => (
                            <div key={category}>
                              <p className="text-[11px] font-semibold text-slate-700 mb-1.5">{category}</p>
                              <div className="space-y-1 ml-2">
                                {factors.map((factor) => (
                                  <div key={factor} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`external-${factor.toLowerCase().replace(/\s+/g, '-')}`}
                                      checked={selectedExternalFactors.includes(factor)}
                                      onCheckedChange={() => handleExternalFactorToggle(factor)}
                                    />
                                    <Label htmlFor={`external-${factor.toLowerCase().replace(/\s+/g, '-')}`} className="text-[11px] text-slate-600 cursor-pointer">{factor}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </RadioGroup>
                  </div>

                  {/* 6. Contributions Filter */}
                  <div>
                    <p className="text-xs font-medium text-slate-700 mb-2">To contribute the following to the community</p>
                    <div className="space-y-2">
                      {contributionsList.map((contribution) => (
                        <div key={contribution.singular} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`contribution-${contribution.singular.toLowerCase().replace(/\s+/g, '-')}`}
                            checked={selectedContributions.includes(contribution.singular)}
                            onCheckedChange={() => handleContributionToggle(contribution.singular)}
                          />
                          <Label htmlFor={`contribution-${contribution.singular.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs text-slate-700 cursor-pointer">{contribution.singular}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleFindCommunities}
                  disabled={selectedContributions.length === 0}
                  className={`w-full text-xs font-medium py-2.5 rounded transition-colors text-center block ${
                    selectedContributions.length === 0
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-slate-900 text-white hover:bg-brand-red"
                  }`}
                >
                  Find Communities
                </button>
                {selectedContributions.length === 0 && (
                  <p className="text-[10px] text-slate-500 text-center mt-1">Please select at least one contribution</p>
                )}
              </div>
            )}

            {step === "searching" && (
              <div className="flex gap-3 animate-fade-in mt-4">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
                  <FontAwesomeIcon icon={faSpinner} className="text-xs animate-spin" />
                </div>
                <div className="bg-white border border-gray-100 p-3 rounded-lg rounded-tl-none text-sm text-slate-700 shadow-sm">
                  <p>Finding communities...</p>
                </div>
              </div>
            )}

            {step === "results" && (
              <>
                <div className="flex gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
                    <FontAwesomeIcon icon={faUsers} className="text-xs" />
                  </div>
                  <div className="bg-white border border-gray-100 p-3 rounded-lg rounded-tl-none text-sm text-slate-700 shadow-sm">
                    <p>I found {communities.length} communities matching your criteria.</p>
                  </div>
                </div>

                {/* Active Criteria Recap */}
                <div className="pl-11 mt-2 animate-fade-in">
                  <div className="bg-brand-red/10 border border-brand-red/20 rounded-md p-3">
                    <p className="text-xs text-brand-red leading-relaxed">
                      {buildRecapSummary()}
                    </p>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="pl-11 mt-3 animate-fade-in flex items-center gap-3">
                  <button
                    onClick={resetWidget}
                    className="text-xs text-slate-500 hover:text-brand-red transition-colors"
                  >
                    New search
                  </button>
                </div>

                {/* Communities Section - Same layout as ChatWidget */}
                <div className="flex flex-col gap-3 pl-11 mt-2 animate-fade-in pb-4">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Communities</p>
                  {communities.map((community, index) => (
                    <div
                      key={index}
                      className="bg-white border border-slate-200 rounded-md p-3 shadow-sm hover:border-brand-red transition-colors"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">{community.name}</p>
                          <p className="text-[10px] text-slate-500">{community.description}</p>
                          <div className="flex flex-col gap-1.5 mt-1.5">
                            {community.theme && (
                              <span className="inline-block w-fit px-2 py-0.5 bg-brand-red/10 text-brand-red text-[10px] font-medium rounded">
                                {community.theme}
                              </span>
                            )}
                            {community.tags && community.tags.length > 0 && (
                              <div className="flex gap-1">
                                {community.tags.slice(0, 2).map((tag, j) => (
                                  <span key={j} className="px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <FontAwesomeIcon icon={faUsers} className="text-[9px]" />
                          {community.members.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                        <div className="flex items-center space-x-1.5">
                          <Checkbox 
                            id={`bookmark-community-${community.name}`}
                            checked={bookmarkedCommunities.includes(community.name)}
                            onCheckedChange={() => handleCommunityBookmark(community.name)}
                          />
                          <Label htmlFor={`bookmark-community-${community.name}`} className="text-[10px] text-slate-500 cursor-pointer">Bookmark</Label>
                        </div>
                        <button 
                          onClick={() => window.open('/community/prof-services-research', '_blank')}
                          className="flex items-center gap-1.5 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded hover:bg-brand-red transition-colors"
                        >
                          Join <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[8px]" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Create Community Button */}
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <button
                      disabled={true}
                      className="w-full py-2.5 px-4 bg-slate-200 text-slate-400 text-xs font-medium rounded cursor-not-allowed"
                      title="Available after 30 days of registration"
                    >
                      Create community
                    </button>
                    <p className="text-[10px] text-slate-400 text-center mt-1.5">
                      Available after 30 days of registration
                    </p>
                  </div>
                </div>
              </>
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
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-brand-red focus:bg-white transition-all"
                disabled={step !== "topic" && step !== "results"}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-red transition-colors p-2"
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
