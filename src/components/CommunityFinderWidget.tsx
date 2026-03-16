import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faTimes, faPaperPlane, faSpinner, faArrowUpRightFromSquare, faSearch, faLockOpen, faCircleInfo, faClock, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  continents,
  countriesByContinent,
  sectorsByCategory,
  sectors,
  orgTypes,
  orgSizes,
  managementExpertiseList,
  leadershipExpertiseList,
  contributionsList,
  externalFactorsList,
} from "@/lib/communityFilterData";

interface Community {
  name: string;
  members: number;
  description: string;
  url: string;
  tags: string[];
  theme?: string;
  requiresApproval?: boolean;
}

const communities: Community[] = [
  { name: "Legal Tech Innovators", members: 2340, description: "Digital transformation in legal services. Open community for legal professionals exploring technology-driven change across contracts, compliance, and case management.", url: "#", tags: ["Technology", "Innovation"], theme: "Digital Transformation", requiresApproval: false },
  { name: "CEO Roundtable UK", members: 890, description: "Strategic discussions for chief executives. A peer-to-peer forum for CEOs to exchange insights on leadership, growth strategy, and board governance.", url: "#", tags: ["CEO", "Leadership"], theme: "Executive Leadership", requiresApproval: true },
  { name: "Future Leaders Network", members: 4120, description: "Emerging talent in professional services. Designed for early-to-mid career professionals seeking mentorship, peer learning, and career development resources.", url: "#", tags: ["Millennial", "Mentor"], theme: "Career Development", requiresApproval: false },
  { name: "Sustainability Champions", members: 1560, description: "ESG and CSR best practices forum. Collaborative space for sustainability officers and consultants sharing frameworks, case studies, and regulatory updates.", url: "#", tags: ["Sustainability", "DEI"], theme: "ESG & Sustainability", requiresApproval: false },
  { name: "High Net Worth Advisors", members: 720, description: "Wealth management and advisory network. For financial advisors, family offices, and private bankers discussing investment strategies and client engagement.", url: "#", tags: ["High Net Worth", "Finance"], theme: "Wealth Management", requiresApproval: true },
  { name: "NED Connect", members: 1890, description: "Non-executive director community. A network for NEDs and aspiring board members to share governance best practices and board-level insights.", url: "#", tags: ["NED", "Governance"], theme: "Corporate Governance", requiresApproval: false },
  { name: "Entrepreneurship Hub", members: 3450, description: "Founders and startup enthusiasts. Open community connecting entrepreneurs with mentors, investors, and fellow founders to accelerate venture growth.", url: "#", tags: ["Entrepreneur", "Innovation"], theme: "Entrepreneurship", requiresApproval: false },
  { name: "SME Growth Forum", members: 2100, description: "Scaling strategies for mid-market firms. Practical discussions on operations, funding, talent, and technology for growing businesses.", url: "#", tags: ["SME", "Business development"], theme: "Business Growth", requiresApproval: false },
];

const MAX_COMMUNITIES = 20;

type ChatStep = "topic" | "filters" | "searching" | "results";

interface CommunityFinderWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

const CommunityFinderWidget = ({ isOpen, onToggle }: CommunityFinderWidgetProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<ChatStep>("topic");
  const [topic, setTopic] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "bot" }>>([]);

  // Filter states
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

  // Join modal state
  const [joiningCommunity, setJoiningCommunity] = useState<Community | null>(null);
  const [joinContributions, setJoinContributions] = useState<string[]>([]);
  // Preview popup state
  const [previewCommunity, setPreviewCommunity] = useState<Community | null>(null);
  // Track joined/pending communities (mock: user has joined 17 communities)
  const [joinedCount] = useState(17);
  const [pendingCommunities, setPendingCommunities] = useState<string[]>([]);
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);
  const isAtMax = (joinedCount + joinedCommunities.length) >= MAX_COMMUNITIES;

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
    setSelectedContinents(prev => prev.includes(continent) ? prev.filter(c => c !== continent) : [...prev, continent]);
  };
  const handleCountryToggle = (country: string) => {
    setSelectedCountries(prev => prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]);
  };
  const handleSectorToggle = (sector: string) => {
    setSelectedSectors(prev => prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]);
  };
  const handleSectorExpand = (sector: string) => {
    setExpandedSectors(prev => prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]);
  };
  const handleExpertiseToggle = (expertise: string) => {
    setSelectedExpertise(prev => prev.includes(expertise) ? prev.filter(e => e !== expertise) : [...prev, expertise]);
  };
  const handleExternalFactorToggle = (factor: string) => {
    setSelectedExternalFactors(prev => prev.includes(factor) ? prev.filter(f => f !== factor) : [...prev, factor]);
  };
  const handleOrgTypeToggle = (item: string) => {
    setSelectedOrgTypes(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };
  const handleContributionToggle = (contribution: string) => {
    setSelectedContributions(prev => prev.includes(contribution) ? prev.filter(c => c !== contribution) : [...prev, contribution]);
  };
  const handleCommunityBookmark = (name: string) => {
    setBookmarkedCommunities(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };
  const handleFindCommunities = () => {
    setStep("searching");
    setTimeout(() => { setStep("results"); }, 1500);
  };
  const resetWidget = () => {
    setStep("topic"); setTopic(""); setInputValue(""); setMessages([]);
    setSourceFilter("all"); setSelectedSectors([]); setLocationFilter("any");
    setSelectedContinents([]); setSelectedCountries([]); setExpertiseFilter("any");
    setSelectedExpertise([]); setOrgTypeFilter("any"); setSelectedOrgTypes([]);
    setExternalFactorFilter("any"); setSelectedExternalFactors([]); setSelectedContributions([]);
  };

  const buildRecapSummary = () => {
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
    if (contributionsText) {
      return `Contributor of ${contributionsText} to "${topic}" communities for ${locationText}; ${sourceText}; ${orgTypeLabel}; ${expertiseText}; ${externalFactorsLabel}`;
    }
    return `Contributor to "${topic}" communities for ${locationText}; ${sourceText}; ${orgTypeLabel}; ${expertiseText}; ${externalFactorsLabel}`;
  };

  const handleJoinContributionToggle = (contribution: string) => {
    setJoinContributions(prev => prev.includes(contribution) ? prev.filter(c => c !== contribution) : [...prev, contribution]);
  };

  const handleConfirmJoin = () => {
    if (joinContributions.length === 0 || !joiningCommunity) return;
    if (isAtMax) {
      // At max — set as pending
      setPendingCommunities(prev => [...prev, joiningCommunity.name]);
    } else if (joiningCommunity.requiresApproval) {
      // Requires approval — set as pending
      setPendingCommunities(prev => [...prev, joiningCommunity.name]);
    } else {
      // Open and under limit — join immediately
      setJoinedCommunities(prev => [...prev, joiningCommunity.name]);
    }
    setJoiningCommunity(null);
    setPreviewCommunity(null);
    setJoinContributions([]);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
          onClick={onToggle}
        />
      )}

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
            <div className="flex items-center gap-2">
              <button
                onClick={() => { onToggle(); navigate("/my-communities"); }}
                className="flex items-center gap-1.5 text-[10px] text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 px-2.5 py-1.5 rounded transition-colors"
                title="Browse communities manually"
              >
                <FontAwesomeIcon icon={faSearch} className="text-[9px]" /> Manual search
              </button>
              <button onClick={onToggle} className="text-slate-400 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="h-[400px] overflow-y-auto bg-slate-50 p-4 flex flex-col gap-4">
            {/* Bot Greeting */}
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
                <FontAwesomeIcon icon={faUsers} className="text-xs" />
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-lg rounded-tl-none text-sm text-slate-700 shadow-sm">
                <p>Hello. I can help you identify free-to-join open communities where you can collaborate with peers on topics of mutual interest.</p>
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
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "gap-3"} animate-fade-in`}>
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
                    <FontAwesomeIcon icon={faUsers} className="text-xs" />
                  </div>
                )}
                <div className={`p-3 rounded-lg text-sm shadow-sm max-w-[80%] ${msg.sender === "user" ? "bg-brand-red text-white rounded-tr-none" : "bg-white border border-gray-100 rounded-tl-none text-slate-700"}`}>
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
                              <Checkbox id={`continent-${continent}`} checked={selectedContinents.includes(continent)} onCheckedChange={() => handleContinentToggle(continent)} />
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
                                    <Checkbox id={`country-${country}`} checked={selectedCountries.includes(country)} onCheckedChange={() => handleCountryToggle(country)} />
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
                                <Checkbox id={`sector-${sector}`} checked={selectedSectors.includes(sector)} onCheckedChange={() => handleSectorToggle(sector)} />
                                <Label htmlFor={`sector-${sector}`} className="text-[11px] text-slate-600 cursor-pointer flex-1">{sector}</Label>
                                <button type="button" onClick={() => handleSectorExpand(sector)} className="text-[10px] text-slate-400 hover:text-slate-600">
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
                              <Checkbox id={`orgtype-${item}`} checked={selectedOrgTypes.includes(item)} onCheckedChange={() => handleOrgTypeToggle(item)} />
                              <Label htmlFor={`orgtype-${item}`} className="text-[11px] text-slate-600 cursor-pointer">{item}</Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </RadioGroup>
                  </div>

                  {/* 4. Expertise Filter */}
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
                          <div>
                            <p className="text-[11px] font-semibold text-slate-700 mb-1.5">Management</p>
                            <div className="space-y-1.5 ml-2">
                              {managementExpertiseList.map((expertise) => (
                                <div key={expertise} className="flex items-center space-x-2">
                                  <Checkbox id={`mgmt-expertise-${expertise.toLowerCase().replace(/\s+/g, '-')}`} checked={selectedExpertise.includes(expertise)} onCheckedChange={() => handleExpertiseToggle(expertise)} />
                                  <Label htmlFor={`mgmt-expertise-${expertise.toLowerCase().replace(/\s+/g, '-')}`} className="text-[11px] text-slate-600 cursor-pointer">{expertise}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-slate-700 mb-1.5">Leadership & Governance</p>
                            <div className="space-y-1.5 ml-2">
                              {leadershipExpertiseList.map((expertise) => (
                                <div key={expertise} className="flex items-center space-x-2">
                                  <Checkbox id={`lead-expertise-${expertise.toLowerCase().replace(/\s+/g, '-')}`} checked={selectedExpertise.includes(expertise)} onCheckedChange={() => handleExpertiseToggle(expertise)} />
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
                                    <Checkbox id={`external-${factor.toLowerCase().replace(/\s+/g, '-')}`} checked={selectedExternalFactors.includes(factor)} onCheckedChange={() => handleExternalFactorToggle(factor)} />
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
                          <Checkbox id={`contribution-${contribution.singular.toLowerCase().replace(/\s+/g, '-')}`} checked={selectedContributions.includes(contribution.singular)} onCheckedChange={() => handleContributionToggle(contribution.singular)} />
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

                {/* Results info bar */}
                <div className="pl-11 mt-2 animate-fade-in">
                  <div className="bg-slate-100 border border-slate-200 rounded-md p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                      <FontAwesomeIcon icon={faLockOpen} className="text-emerald-500 text-[9px]" />
                      All communities listed are <span className="font-semibold">open to join</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">{joinedCount + joinedCommunities.length}/{MAX_COMMUNITIES} joined</span>
                  </div>
                  {isAtMax && (
                    <div className="mt-1.5 bg-amber-50 border border-amber-200 rounded-md p-2 flex items-start gap-1.5">
                      <FontAwesomeIcon icon={faCircleInfo} className="text-amber-500 text-[10px] mt-0.5" />
                      <p className="text-[10px] text-amber-700">You've reached the maximum of {MAX_COMMUNITIES} communities. New requests will be set as <strong>pending</strong>.</p>
                    </div>
                  )}
                </div>

                {/* Active Criteria Recap */}
                <div className="pl-11 mt-2 animate-fade-in">
                  <div className="bg-brand-red/10 border border-brand-red/20 rounded-md p-3">
                    <p className="text-xs text-brand-red leading-relaxed">{buildRecapSummary()}</p>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="pl-11 mt-3 animate-fade-in flex items-center gap-3">
                  <button onClick={resetWidget} className="text-xs text-slate-500 hover:text-brand-red transition-colors">New search</button>
                </div>

                {/* Communities Section */}
                <div className="flex flex-col gap-3 pl-11 mt-2 animate-fade-in pb-4">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Communities</p>
                  {communities.map((community, index) => {
                    const isJoined = joinedCommunities.includes(community.name);
                    const isPending = pendingCommunities.includes(community.name);
                    return (
                      <div
                        key={index}
                        className={`bg-white border rounded-md p-3 shadow-sm transition-colors ${isPending ? "border-amber-200 bg-amber-50/30 cursor-default" : "border-slate-200 hover:border-brand-red cursor-pointer"}`}
                        onClick={() => !isPending && setPreviewCommunity(community)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-medium text-slate-800">{community.name}</p>
                              {community.requiresApproval ? (
                                <span className="text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5"><FontAwesomeIcon icon={faUserShield} className="text-[7px]" /> Approval required</span>
                              ) : (
                                <span className="text-[8px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5"><FontAwesomeIcon icon={faLockOpen} className="text-[7px]" /> Open</span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 line-clamp-1">{community.description.split('.')[0]}.</p>
                            <div className="flex flex-col gap-1.5 mt-1.5">
                              {community.theme && (
                                <span className="inline-block w-fit px-2 py-0.5 bg-brand-red/10 text-brand-red text-[10px] font-medium rounded">{community.theme}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <FontAwesomeIcon icon={faUsers} className="text-[9px]" />
                            {community.members.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                          <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                            <Checkbox id={`bookmark-community-${community.name}`} checked={bookmarkedCommunities.includes(community.name)} onCheckedChange={() => handleCommunityBookmark(community.name)} />
                            <Label htmlFor={`bookmark-community-${community.name}`} className="text-[10px] text-slate-500 cursor-pointer">Bookmark</Label>
                          </div>
                          {isJoined ? (
                            <span className="text-[10px] text-emerald-600 font-medium">✓ Joined</span>
                          ) : isPending ? (
                            <span className="flex items-center gap-1 text-[10px] text-amber-600 font-medium">
                              <FontAwesomeIcon icon={faClock} className="text-[8px]" /> Pending approval
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Click to view & join →</span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Create Community Button */}
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <button disabled={true} className="w-full py-2.5 px-4 bg-slate-200 text-slate-400 text-xs font-medium rounded cursor-not-allowed" title="Available after 30 days of registration">
                      Create community
                    </button>
                    <p className="text-[10px] text-slate-400 text-center mt-1.5">Available after 30 days of registration</p>
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
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-red transition-colors p-2">
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Community Preview Popup */}
      {previewCommunity && !joiningCommunity && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setPreviewCommunity(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[calc(100vw-3rem)] sm:w-[420px] max-w-[420px] bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">{previewCommunity.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  {previewCommunity.requiresApproval ? (
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                      <FontAwesomeIcon icon={faUserShield} className="text-[7px]" /> Approval required
                    </span>
                  ) : (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                      <FontAwesomeIcon icon={faLockOpen} className="text-[7px]" /> Open community
                    </span>
                  )}
                  <span className="text-[9px] text-slate-400 flex items-center gap-1">
                    <FontAwesomeIcon icon={faUsers} className="text-[8px]" /> {previewCommunity.members.toLocaleString()} members
                  </span>
                </div>
              </div>
              <button onClick={() => setPreviewCommunity(null)} className="text-slate-400 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="p-4 max-h-[40vh] overflow-y-auto">
              <p className="text-xs text-slate-700 leading-relaxed mb-3">{previewCommunity.description}</p>
              {previewCommunity.theme && (
                <div className="mb-3">
                  <span className="text-[10px] font-medium text-slate-500">Theme:</span>
                  <span className="ml-1.5 px-2 py-0.5 bg-brand-red/10 text-brand-red text-[10px] font-medium rounded">{previewCommunity.theme}</span>
                </div>
              )}
              {previewCommunity.tags && previewCommunity.tags.length > 0 && (
                <div className="mb-3">
                  <span className="text-[10px] font-medium text-slate-500">Tags:</span>
                  <div className="flex gap-1 mt-1">
                    {previewCommunity.tags.map((tag, j) => (
                      <span key={j} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              {previewCommunity.requiresApproval && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-2 flex items-start gap-1.5 mb-3">
                  <FontAwesomeIcon icon={faCircleInfo} className="text-amber-500 text-[10px] mt-0.5" />
                  <p className="text-[10px] text-amber-700">Joining this community requires approval by the owner or manager. Your request will be reviewed.</p>
                </div>
              )}
              {!previewCommunity.requiresApproval && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-md p-2 flex items-start gap-1.5 mb-3">
                  <FontAwesomeIcon icon={faLockOpen} className="text-emerald-500 text-[10px] mt-0.5" />
                  <p className="text-[10px] text-emerald-700">This is an open community — you can join immediately without approval.</p>
                </div>
              )}
              {isAtMax && !joinedCommunities.includes(previewCommunity.name) && !pendingCommunities.includes(previewCommunity.name) && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-2 flex items-start gap-1.5 mb-3">
                  <FontAwesomeIcon icon={faClock} className="text-amber-500 text-[10px] mt-0.5" />
                  <p className="text-[10px] text-amber-700">You've reached {MAX_COMMUNITIES}/{MAX_COMMUNITIES} communities. This request will be set as <strong>pending</strong> until a spot opens.</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
              <button onClick={() => setPreviewCommunity(null)} className="text-xs text-slate-500 px-3 py-1.5 hover:text-slate-700">Close</button>
              {joinedCommunities.includes(previewCommunity.name) ? (
                <span className="text-xs text-emerald-600 font-medium px-3 py-1.5">✓ Joined</span>
              ) : pendingCommunities.includes(previewCommunity.name) ? (
                <span className="flex items-center gap-1 text-xs text-amber-600 font-medium px-3 py-1.5">
                  <FontAwesomeIcon icon={faClock} className="text-[10px]" /> Pending
                </span>
              ) : (
                <button
                  onClick={() => { setJoiningCommunity(previewCommunity); setJoinContributions([]); }}
                  className="flex items-center gap-1.5 bg-slate-900 text-white text-[11px] font-bold px-4 py-2 rounded hover:bg-brand-red transition-colors"
                >
                  {isAtMax ? "Request to Join" : previewCommunity.requiresApproval ? "Request to Join" : "Apply"} <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[8px]" />
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Join Community Modal - Contribution Selection */}
      {joiningCommunity && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setJoiningCommunity(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[calc(100vw-3rem)] sm:w-96 max-w-96 bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-800 text-white px-4 py-3">
              <h3 className="font-medium text-sm">{isAtMax || joiningCommunity.requiresApproval ? "Request to join" : "Apply to"} {joiningCommunity.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Select your anticipated contributions</p>
            </div>
            <div className="p-4 max-h-[50vh] overflow-y-auto">
              {(isAtMax || joiningCommunity.requiresApproval) && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-2 flex items-start gap-1.5 mb-3">
                  <FontAwesomeIcon icon={faCircleInfo} className="text-amber-500 text-[10px] mt-0.5" />
                  <p className="text-[10px] text-amber-700">
                    {isAtMax
                      ? `You've reached the maximum of ${MAX_COMMUNITIES} communities. This will be added as a pending request.`
                      : "This community requires approval. Your request will be reviewed by the owner/manager."}
                  </p>
                </div>
              )}
              <p className="text-xs font-medium text-slate-700 mb-3">What will you contribute to this community? <span className="text-destructive">*</span></p>
              <div className="space-y-2">
                {contributionsList.map((contribution) => (
                  <div key={contribution.singular} className="flex items-center space-x-2">
                    <Checkbox
                      id={`join-contribution-${contribution.singular.toLowerCase().replace(/\s+/g, '-')}`}
                      checked={joinContributions.includes(contribution.singular)}
                      onCheckedChange={() => handleJoinContributionToggle(contribution.singular)}
                    />
                    <Label htmlFor={`join-contribution-${contribution.singular.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs text-slate-700 cursor-pointer">{contribution.singular}</Label>
                  </div>
                ))}
              </div>
              {joinContributions.length === 0 && (
                <p className="text-[10px] text-slate-500 mt-2">Please select at least one contribution to join</p>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-slate-100">
              <button onClick={() => setJoiningCommunity(null)} className="text-xs text-slate-500 px-3 py-1.5">Cancel</button>
              <button
                onClick={handleConfirmJoin}
                disabled={joinContributions.length === 0}
                className={`flex items-center gap-1.5 text-[11px] font-bold px-4 py-2 rounded transition-colors ${
                  joinContributions.length === 0 ? "bg-slate-300 text-slate-500 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-brand-red"
                }`}
              >
                {isAtMax || joiningCommunity.requiresApproval ? "Submit Request" : "Submit Application"} <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[8px]" />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CommunityFinderWidget;
