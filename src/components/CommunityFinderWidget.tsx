import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faTimes, faPaperPlane, faSpinner, faBookmark, faArrowUpRightFromSquare, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Community {
  name: string;
  members: number;
  description: string;
  url: string;
  tags: string[];
}

const communities: Community[] = [
  { name: "Legal Tech Innovators", members: 2340, description: "Digital transformation in legal services", url: "#", tags: ["Technology", "Innovation"] },
  { name: "CEO Roundtable UK", members: 890, description: "Strategic discussions for chief executives", url: "#", tags: ["CEO", "Leadership"] },
  { name: "Future Leaders Network", members: 4120, description: "Emerging talent in professional services", url: "#", tags: ["Millennial", "Mentor"] },
  { name: "Sustainability Champions", members: 1560, description: "ESG and CSR best practices forum", url: "#", tags: ["Sustainability", "DEI"] },
  { name: "High Net Worth Advisors", members: 720, description: "Wealth management and advisory network", url: "#", tags: ["High Net Worth", "Finance"] },
  { name: "NED Connect", members: 1890, description: "Non-executive director community", url: "#", tags: ["NED", "Governance"] },
  { name: "Entrepreneurship Hub", members: 3450, description: "Founders and startup enthusiasts", url: "#", tags: ["Entrepreneur", "Innovation"] },
  { name: "SME Growth Forum", members: 2100, description: "Scaling strategies for mid-market firms", url: "#", tags: ["SME", "Business development"] },
];

const contactTypes = [
  "Entrepreneur", "Advocate", "NED", "Alumnus", "Millennial", "Gen Z", "CEO", 
  "Ghostwriter", "Guru", "High Net Worth", "Mentor", "Technologist"
];

const regions = ["Europe", "North America", "Asia Pacific", "Middle East", "Latin America", "Africa"];

const countries = [
  "United Kingdom", "United States", "Germany", "France", "Singapore", 
  "Australia", "UAE", "Canada", "Japan", "Netherlands"
];

const expertiseAreas = [
  "Legal", "Finance", "Technology", "Consulting", "Accounting", "Healthcare", "Real Estate", "Energy"
];

const orgSizes = ["SME", "Midmarket", "Large", "Very large"];

const managementExpertise = [
  "Business development", "Sales", "Marketing", "Sustainability", "Technology", 
  "Innovation", "Communication", "Human resources", "Facilities", 
  "Learning & Development", "Operations", "Finance", "Product development", 
  "Planning", "Performance management", "Government liaison", "Procurement", "Risk"
];

const leadershipExpertise = [
  "Firmwide Leadership", "Divisional Leadership", "Project leadership", 
  "Chairman", "NED", "Board Member", "Governance", "Chief of Staff", "Strategy"
];

type ChatStep = "topic" | "filters" | "searching" | "results";

const CommunityFinderWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<ChatStep>("topic");
  const [topic, setTopic] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "bot" }>>([]);

  // Filter states
  const [selectedContactTypes, setSelectedContactTypes] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState("any");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [selectedOrgSizes, setSelectedOrgSizes] = useState<string[]>([]);
  const [selectedManagement, setSelectedManagement] = useState<string[]>([]);
  const [selectedLeadership, setSelectedLeadership] = useState<string[]>([]);
  const [bookmarkedCommunities, setBookmarkedCommunities] = useState<string[]>([]);

  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState<string[]>(["contactTypes"]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setMessages([...messages, { text: inputValue, sender: "user" }]);
    setTopic(inputValue);
    setInputValue("");

    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "What type of community are you looking for?", sender: "bot" }]);
      setStep("filters");
    }, 600);
  };

  const handleContactTypeToggle = (type: string) => {
    setSelectedContactTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleRegionToggle = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const handleCountryToggle = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  const handleExpertiseToggle = (exp: string) => {
    setSelectedExpertise(prev => 
      prev.includes(exp) ? prev.filter(e => e !== exp) : [...prev, exp]
    );
  };

  const handleOrgSizeToggle = (size: string) => {
    setSelectedOrgSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
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
    setSelectedContactTypes([]);
    setLocationFilter("any");
    setSelectedRegions([]);
    setSelectedCountries([]);
    setSelectedExpertise([]);
    setSelectedOrgSizes([]);
    setSelectedManagement([]);
    setSelectedLeadership([]);
  };

  // Build recap summary
  const buildRecapSummary = () => {
    const contactLabel = selectedContactTypes.length > 0 
      ? selectedContactTypes.join(" + ") 
      : "Any contact type";
    
    const locationLabel = locationFilter === "any" 
      ? "any location" 
      : locationFilter === "region" && selectedRegions.length > 0
        ? selectedRegions.join(", ")
        : locationFilter === "country" && selectedCountries.length > 0
          ? selectedCountries.join(", ")
          : "any location";

    const expertiseLabel = selectedExpertise.length > 0 
      ? selectedExpertise.join(", ") 
      : "any expertise";

    const orgSizeLabel = selectedOrgSizes.length > 0 
      ? selectedOrgSizes.join(", ") 
      : "any org size";

    return `${contactLabel} communities on "${topic}"; ${locationLabel}; ${expertiseLabel}; ${orgSizeLabel}`;
  };

  const FilterSection = ({ 
    title, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    sectionKey: string; 
    children: React.ReactNode;
  }) => (
    <div className="border-b border-slate-100 pb-3">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between text-xs font-medium text-slate-700 py-2"
      >
        {title}
        <FontAwesomeIcon 
          icon={expandedSections.includes(sectionKey) ? faChevronUp : faChevronDown} 
          className="text-[10px] text-slate-400" 
        />
      </button>
      {expandedSections.includes(sectionKey) && (
        <div className="pt-2">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-50 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 sm:py-4 sm:px-6 rounded-full shadow-lg flex items-center gap-2 sm:gap-3 transition-colors duration-300"
        aria-label="Find a community"
      >
        <FontAwesomeIcon icon={faUsers} className="text-lg sm:text-xl" />
        <span className="font-medium text-xs sm:text-sm tracking-wide hidden sm:inline">Find a community</span>
      </button>

      {/* Widget Panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 sm:bottom-28 sm:left-8 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-96 bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} />
              <span className="font-medium text-sm">Find a Community</span>
            </div>
            <button onClick={toggleChat} className="text-white/80 hover:text-white transition-colors">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Content */}
          <div className="h-[480px] overflow-y-auto">
            {step === "topic" && (
              <div className="p-4">
                <div className="mb-4">
                  <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700">
                    Hello! I can help you find professional communities. What topic or interest are you looking to explore?
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g., Digital transformation, ESG..."
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
                  </button>
                </form>
              </div>
            )}

            {step === "filters" && (
              <div className="p-4 space-y-3">
                {/* Messages */}
                <div className="space-y-2 mb-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`text-sm p-2 rounded-lg ${msg.sender === "user" ? "bg-emerald-50 text-emerald-800 ml-8" : "bg-slate-50 text-slate-700 mr-8"}`}>
                      {msg.text}
                    </div>
                  ))}
                </div>

                {/* Contact Types */}
                <FilterSection title="Contact types" sectionKey="contactTypes">
                  <div className="grid grid-cols-2 gap-1.5">
                    {contactTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`contact-${type}`}
                          checked={selectedContactTypes.includes(type)}
                          onCheckedChange={() => handleContactTypeToggle(type)}
                        />
                        <Label htmlFor={`contact-${type}`} className="text-xs text-slate-600 cursor-pointer">{type}</Label>
                      </div>
                    ))}
                  </div>
                </FilterSection>

                {/* Location */}
                <FilterSection title="Location" sectionKey="location">
                  <RadioGroup value={locationFilter} onValueChange={setLocationFilter} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="any" id="loc-any" />
                      <Label htmlFor="loc-any" className="text-xs text-slate-700 cursor-pointer">Any location</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="region" id="loc-region" />
                      <Label htmlFor="loc-region" className="text-xs text-slate-700 cursor-pointer">Specific regions</Label>
                    </div>
                    {locationFilter === "region" && (
                      <div className="ml-5 grid grid-cols-2 gap-1.5 border-l-2 border-slate-100 pl-3">
                        {regions.map((region) => (
                          <div key={region} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`region-${region}`}
                              checked={selectedRegions.includes(region)}
                              onCheckedChange={() => handleRegionToggle(region)}
                            />
                            <Label htmlFor={`region-${region}`} className="text-xs text-slate-600 cursor-pointer">{region}</Label>
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

                {/* Expertise */}
                <FilterSection title="Expertise area" sectionKey="expertise">
                  <div className="grid grid-cols-2 gap-1.5">
                    {expertiseAreas.map((exp) => (
                      <div key={exp} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`exp-${exp}`}
                          checked={selectedExpertise.includes(exp)}
                          onCheckedChange={() => handleExpertiseToggle(exp)}
                        />
                        <Label htmlFor={`exp-${exp}`} className="text-xs text-slate-600 cursor-pointer">{exp}</Label>
                      </div>
                    ))}
                  </div>
                </FilterSection>

                {/* Org Size */}
                <FilterSection title="Organisation size" sectionKey="orgSize">
                  <div className="grid grid-cols-2 gap-1.5">
                    {orgSizes.map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`size-${size}`}
                          checked={selectedOrgSizes.includes(size)}
                          onCheckedChange={() => handleOrgSizeToggle(size)}
                        />
                        <Label htmlFor={`size-${size}`} className="text-xs text-slate-600 cursor-pointer">{size}</Label>
                      </div>
                    ))}
                  </div>
                </FilterSection>

                {/* Management Expertise */}
                <FilterSection title="Management expertise" sectionKey="management">
                  <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto">
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
                </FilterSection>

                {/* Leadership Expertise */}
                <FilterSection title="Leadership & governance expertise" sectionKey="leadership">
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
                </FilterSection>

                {/* Recap Summary */}
                {topic && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3 mt-4">
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      {buildRecapSummary()}
                    </p>
                  </div>
                )}

                {/* Find Button */}
                <button
                  onClick={handleFindCommunities}
                  className="w-full bg-emerald-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-emerald-700 transition-colors mt-4"
                >
                  Find Communities
                </button>
              </div>
            )}

            {step === "searching" && (
              <div className="p-8 flex flex-col items-center justify-center h-full">
                <FontAwesomeIcon icon={faSpinner} className="text-3xl text-emerald-600 animate-spin mb-4" />
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
                    className="text-xs text-emerald-600 hover:underline"
                  >
                    New search
                  </button>
                </div>

                <div className="space-y-3">
                  {communities.map((community, i) => (
                    <div 
                      key={i} 
                      className="bg-slate-50 rounded-lg p-3 border border-slate-100 hover:border-emerald-200 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white flex-shrink-0">
                          <FontAwesomeIcon icon={faUsers} className="text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <a 
                              href={community.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-slate-900 text-sm hover:text-emerald-600 transition-colors"
                            >
                              {community.name}
                            </a>
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px] text-slate-400" />
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{community.description}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs text-emerald-600 font-medium">
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
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() => handleCommunityBookmark(community.name)}
                              className={`text-xs flex items-center gap-1 transition-colors ${
                                bookmarkedCommunities.includes(community.name) 
                                  ? "text-emerald-600" 
                                  : "text-slate-400 hover:text-emerald-600"
                              }`}
                            >
                              <FontAwesomeIcon icon={faBookmark} />
                              {bookmarkedCommunities.includes(community.name) ? "Bookmarked" : "Bookmark"}
                            </button>
                            <a 
                              href={community.url}
                              className="text-xs text-emerald-600 hover:underline"
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
        </div>
      )}
    </>
  );
};

export default CommunityFinderWidget;
