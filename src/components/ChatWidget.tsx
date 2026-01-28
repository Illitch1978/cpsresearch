import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faTimes, faUserTie, faPaperPlane, faSpinner, faEnvelope, faPhone, faPencil, faChevronDown, faChevronUp, faBookmark, faUsers, faArrowUpRightFromSquare, faLink } from "@fortawesome/free-solid-svg-icons";
import { faFileLines, faAddressCard } from "@fortawesome/free-regular-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Expert {
  name: string;
  firm: string;
  score: number;
  pubs: number;
  tag?: string;
  location?: string;
  email?: string;
  phone?: string;
  division?: string;
  primaryGroup?: string;
  bio?: string;
  officialBioUrl?: string;
  linkedInUrl?: string;
  communityType?: string;
}

interface Community {
  name: string;
  members: number;
  description: string;
  url: string;
}

const communities: Community[] = [
  { name: "Legal Tech Innovators", members: 2340, description: "Digital transformation in legal services", url: "#" },
  { name: "Corporate Law Network", members: 5120, description: "Global corporate practice discussions", url: "#" },
  { name: "ESG & Sustainability Forum", members: 1890, description: "Environmental, social & governance insights", url: "#" },
];

const experts: Expert[] = [
  { 
    name: "Dr. Elena Voreas", 
    firm: "Clifford Chance", 
    score: 98, 
    pubs: 14,
    tag: "Corporate Law",
    location: "London, United Kingdom",
    email: "elena.voreas@cliffordchance.com",
    phone: "+44 20 7006 1234",
    division: "Corporate M&A",
    primaryGroup: "Private Equity",
    bio: "Dr. Elena Voreas is a leading expert in corporate law with over 20 years of experience in cross-border M&A transactions. She has advised on some of the largest deals in the European market and is frequently cited in academic journals for her innovative approaches to complex regulatory challenges.",
    officialBioUrl: "https://www.cliffordchance.com/people/elena-voreas",
    communityType: "Entrepreneur"
  },
  { 
    name: "Prof. James Sterling", 
    firm: "Linklaters", 
    score: 94, 
    pubs: 9,
    tag: "Financial Regulation",
    location: "London, United Kingdom",
    email: "james.sterling@linklaters.com",
    phone: "+44 20 7456 5678",
    division: "Financial Markets",
    primaryGroup: "Banking & Finance",
    bio: "Professor James Sterling specializes in financial regulation and has been instrumental in shaping policy discussions around fintech and digital assets. He combines academic rigor with practical legal expertise gained from advising major financial institutions.",
    linkedInUrl: "https://www.linkedin.com/in/james-sterling",
    communityType: "Guru"
  },
  { 
    name: "Sarah Jenkins", 
    firm: "Allen & Overy", 
    score: 91, 
    pubs: 11,
    tag: "Digital Transformation",
    location: "London, United Kingdom",
    email: "sarah.jenkins@allenovery.com",
    phone: "+44 20 3088 4567",
    division: "Technology & Innovation",
    primaryGroup: "Not set",
    bio: "Sarah Jenkins is at the forefront of legal innovation, helping organizations navigate digital transformation. Her expertise spans data privacy, AI governance, and emerging technology regulations across multiple jurisdictions.",
    officialBioUrl: "https://www.allenovery.com/people/sarah-jenkins",
    communityType: "Technologist"
  },
  { 
    name: "David Thorne", 
    firm: "Freshfields", 
    score: 89, 
    pubs: 7,
    tag: "Dispute Resolution",
    location: "London, United Kingdom",
    email: "david.thorne@freshfields.com",
    phone: "+44 20 7936 8901",
    division: "Litigation",
    primaryGroup: "International Arbitration",
    bio: "David Thorne has built a reputation as one of the most effective dispute resolution specialists in the City. His strategic approach to complex commercial litigation has resulted in favorable outcomes for clients in high-stakes international disputes.",
    linkedInUrl: "https://www.linkedin.com/in/david-thorne",
    communityType: "Advocate"
  },
  { 
    name: "Marcus Alistair", 
    firm: "Slaughter and May", 
    score: 85, 
    pubs: 12,
    tag: "Tax Strategy",
    location: "London, United Kingdom",
    email: "marcus.alistair@slaughterandmay.com",
    phone: "+44 20 7600 2345",
    division: "Tax Advisory",
    primaryGroup: "Corporate Tax",
    bio: "Marcus Alistair is a recognized authority on international tax strategy, with particular expertise in structuring cross-border investments and M&A transactions. His publications on tax efficiency have become essential reading for corporate counsel.",
    communityType: "Mentor"
  },
];

const organisationsBySector: Record<string, string[]> = {
  "Accounting": ["Deloitte", "PwC", "EY", "KPMG", "BDO", "Grant Thornton"],
  "Legal": ["Clifford Chance", "Linklaters", "Allen & Overy", "Freshfields", "Slaughter and May"],
  "Academic": ["London Business School", "Oxford Saïd", "Cambridge Judge", "Imperial Business School"],
  "Consulting": ["McKinsey", "BCG", "Bain", "Accenture"],
  "Financial Services": ["Goldman Sachs", "JP Morgan", "Morgan Stanley", "Barclays"],
};

const organisationSectors = Object.keys(organisationsBySector);

const sectors = [
  "Financial Services",
  "Technology",
  "Healthcare",
  "Energy",
  "Real Estate",
  "Manufacturing",
];

const continents = [
  "Africa", "Asia Pacific", "Europe", "Latin America", "Middle East", "North America"
].sort();

const countries = [
  "Australia", "Canada", "France", "Germany", "Japan", "Netherlands",
  "Singapore", "UAE", "United Kingdom", "United States"
].sort();

type ChatStep = "topic" | "filters" | "searching" | "results";

const ExpertProfileModal = ({ 
  expert, 
  isOpen, 
  onClose 
}: { 
  expert: Expert | null; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const [showFullBio, setShowFullBio] = useState(false);

  if (!expert) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 p-5 border-b border-slate-100">
          <div className="flex gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center flex-shrink-0 text-slate-500 text-2xl font-serif">
              {expert.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            
            {/* Name & Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-serif font-semibold text-lg text-slate-900 leading-tight">{expert.name}</h3>
              {expert.tag && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-brand-red/10 text-brand-red text-[10px] font-medium rounded">
                  {expert.tag}
                </span>
              )}
              <div className="mt-2 text-xs text-slate-500 space-y-0.5">
                <p className="font-medium text-slate-700">{expert.firm}</p>
                <p>{expert.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="p-5 grid grid-cols-2 gap-4 border-b border-slate-100">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Email</p>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="text-slate-400 text-xs" />
              <a 
                href={`mailto:${expert.email}`} 
                className="text-xs text-brand-red hover:underline truncate"
              >
                {expert.email}
              </a>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Phone</p>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone} className="text-slate-400 text-xs" />
              <a 
                href={`tel:${expert.phone}`} 
                className="text-xs text-slate-700 hover:text-brand-red"
              >
                {expert.phone}
              </a>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Division</p>
            <p className="text-xs text-slate-700">{expert.division}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Primary group</p>
            <p className="text-xs text-slate-700">{expert.primaryGroup || "Not set"}</p>
          </div>
        </div>

        {/* Bio */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase font-bold text-slate-400">Bio</p>
            <button className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-brand-red transition-colors">
              <FontAwesomeIcon icon={faPencil} className="text-[8px]" />
              Edit
            </button>
          </div>
          <p className={`text-xs text-slate-600 leading-relaxed ${!showFullBio ? 'line-clamp-3' : ''}`}>
            {expert.bio}
          </p>
          {expert.bio && expert.bio.length > 150 && (
            <button 
              onClick={() => setShowFullBio(!showFullBio)}
              className="mt-2 flex items-center gap-1 text-xs text-brand-red hover:underline"
            >
              {showFullBio ? 'Show less' : 'Show more'}
              <FontAwesomeIcon icon={showFullBio ? faChevronUp : faChevronDown} className="text-[10px]" />
            </button>
          )}
        </div>

        {/* Bookmark & View Pubs */}
        <div className="p-5 pt-0 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="modal-bookmark-expert" />
              <Label htmlFor="modal-bookmark-expert" className="text-xs text-slate-600 cursor-pointer">Bookmark expert</Label>
            </div>
            <button className="text-xs text-brand-red hover:underline flex items-center gap-1">
              <FontAwesomeIcon icon={faFileLines} className="text-[10px]" />
              View pubs ({expert.pubs})
            </button>
          </div>
          <button className="w-full bg-slate-900 text-white text-xs font-medium py-2.5 rounded hover:bg-brand-red transition-colors">
            Contact {expert.name.split(' ')[0]}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ChatWidget = ({ isOpen, onToggle }: ChatWidgetProps) => {
  const [step, setStep] = useState<ChatStep>("topic");
  const [topic, setTopic] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "bot" }>>([]);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Filter states
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
  const [selectedOrgSectors, setSelectedOrgSectors] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState("any");
  const [selectedContinents, setSelectedContinents] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [projectType, setProjectType] = useState("all");
  const [roles, setRoles] = useState<string[]>([]);
  const [bookmarkedExperts, setBookmarkedExperts] = useState<string[]>([]);
  const [bookmarkedCommunities, setBookmarkedCommunities] = useState<string[]>([]);
  const [contentPeriod, setContentPeriod] = useState("any");
  const [dateRangeFrom, setDateRangeFrom] = useState("");
  const [dateRangeTo, setDateRangeTo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setMessages([...messages, { text: inputValue, sender: "user" }]);
    setTopic(inputValue);
    setInputValue("");

    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "What type of expert are you looking for today?", sender: "bot" }]);
      setStep("filters");
    }, 600);
  };

  const handleOrgToggle = (org: string) => {
    setSelectedOrgs(prev => 
      prev.includes(org) ? prev.filter(o => o !== org) : [...prev, org]
    );
  };

  const handleOrgSectorToggle = (sector: string) => {
    setSelectedOrgSectors(prev => {
      if (prev.includes(sector)) {
        // Remove sector and all its orgs
        const orgsInSector = organisationsBySector[sector] || [];
        setSelectedOrgs(currentOrgs => currentOrgs.filter(o => !orgsInSector.includes(o)));
        return prev.filter(s => s !== sector);
      } else {
        return [...prev, sector];
      }
    });
  };

  const handleSectorToggle = (sector: string) => {
    setSelectedSectors(prev => 
      prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]
    );
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

  const handleRoleToggle = (role: string) => {
    setRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleExpertBookmark = (expertName: string) => {
    setBookmarkedExperts(prev => 
      prev.includes(expertName) ? prev.filter(n => n !== expertName) : [...prev, expertName]
    );
  };

  const handleCommunityBookmark = (communityName: string) => {
    setBookmarkedCommunities(prev => 
      prev.includes(communityName) ? prev.filter(n => n !== communityName) : [...prev, communityName]
    );
  };

  const startSearch = () => {
    setStep("searching");
    setTimeout(() => {
      setStep("results");
    }, 1000);
  };

  const handleNewSearch = () => {
    setStep("topic");
    setTopic("");
    setInputValue("");
    setMessages([]);
    setSourceFilter("all");
    setSelectedOrgs([]);
    setSelectedOrgSectors([]);
    setSelectedSectors([]);
    setLocationFilter("any");
    setSelectedContinents([]);
    setSelectedCountries([]);
    setProjectType("all");
    setRoles([]);
    setContentPeriod("any");
    setDateRangeFrom("");
    setDateRangeTo("");
  };

  const buildRecapSummary = () => {
    const roleText = roles.length > 0 
      ? roles.map(r => {
          if (r === "author") return "Author";
          if (r === "leader") return "Future Leader";
          if (r === "team") return "Team Member";
          if (r === "consultant") return "External Consultant";
          return r;
        }).join(" + ")
      : "Any role";

    let sourceText = "";
    if (sourceFilter === "all") sourceText = "any organisation";
    else if (sourceFilter === "my-org") sourceText = "my organisation";
    else if (sourceFilter === "other-orgs") sourceText = "all other organisations";
    else if (sourceFilter === "specific-orgs") sourceText = selectedOrgs.length > 0 ? selectedOrgs.slice(0, 2).join(", ") + (selectedOrgs.length > 2 ? ` +${selectedOrgs.length - 2} more` : "") : "specific organisations";
    else if (sourceFilter === "my-sector") sourceText = "my sector";
    else if (sourceFilter === "specific-sectors") sourceText = selectedSectors.length > 0 ? selectedSectors.slice(0, 2).join(", ") + (selectedSectors.length > 2 ? ` +${selectedSectors.length - 2} more` : "") : "specific sectors";

    let locationText = "";
    if (locationFilter === "any") locationText = "any location";
    else if (locationFilter === "my-city") locationText = "my city";
    else if (locationFilter === "my-country") locationText = "my country";
    else if (locationFilter === "my-continent") locationText = "my continent";
    else if (locationFilter === "specific-continents") locationText = selectedContinents.length > 0 ? selectedContinents.slice(0, 2).join(", ") + (selectedContinents.length > 2 ? ` +${selectedContinents.length - 2} more` : "") : "specific continents";
    else if (locationFilter === "specific-countries") locationText = selectedCountries.length > 0 ? selectedCountries.slice(0, 2).join(", ") + (selectedCountries.length > 2 ? ` +${selectedCountries.length - 2} more` : "") : "specific countries";

    let projectText = "";
    if (projectType === "all") projectText = "any project";
    else if (projectType === "client") projectText = "client projects";
    else if (projectType === "internal") projectText = "internal projects";

    let periodText = "";
    if (contentPeriod === "any") periodText = "any period";
    else if (contentPeriod === "6-months") periodText = "last 6 months";
    else if (contentPeriod === "12-months") periodText = "last 12 months";
    else if (contentPeriod === "2-years") periodText = "last 2 years";
    else if (contentPeriod === "5-years") periodText = "last 5 years";
    else if (contentPeriod === "5-plus-years") periodText = "5+ years ago";
    else if (contentPeriod === "date-range") periodText = dateRangeFrom || dateRangeTo ? `${dateRangeFrom || "?"} - ${dateRangeTo || "?"}` : "date range";

    return `${roleText} on "${topic}"; sourced from ${sourceText}; ${locationText}; ${projectText}; ${periodText}`;
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

      {/* Chat Widget Panel */}
      <div
        className={`fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 flex-col overflow-hidden transition-all duration-300 origin-bottom-left transform font-sans ${
          isOpen 
            ? "flex scale-100 opacity-100" 
            : "hidden scale-95 opacity-0"
        } bottom-20 left-4 sm:bottom-28 sm:left-8 w-[calc(100vw-2rem)] sm:w-96 max-w-96`}
      >
        {/* Header */}
        <div className="bg-slate-800 px-4 py-3 flex justify-between items-center text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faCommentDots} className="text-sm" />
            <div>
              <h3 className="font-medium text-sm">Credible Voices</h3>
              <p className="text-xs text-slate-400">Connect with verified experts</p>
            </div>
          </div>
          <button onClick={onToggle} className="text-slate-400 hover:text-white transition-colors">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Chat Body */}
        <div className="h-[400px] bg-slate-50 p-4 overflow-y-auto flex flex-col gap-4">
          {/* Bot Greeting */}
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
              <FontAwesomeIcon icon={faUserTie} className="text-xs" />
            </div>
            <div className="bg-white border border-gray-100 p-3 rounded-lg rounded-tl-none text-sm text-slate-700 shadow-sm">
              <p>Hello. I can help you identify accurate voices and experts for your next report or panel.</p>
            </div>
          </div>

          {/* Bot Question 1 */}
          <div className="flex gap-3 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
              <FontAwesomeIcon icon={faUserTie} className="text-xs" />
            </div>
            <div className="bg-white border border-gray-100 p-3 rounded-lg rounded-tl-none text-sm text-slate-700 shadow-sm">
              <p>What topic are you researching today?</p>
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
                  <FontAwesomeIcon icon={faUserTie} className="text-xs" />
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
              {/* Recap Summary - Below Question */}
              <div className="bg-brand-red/10 border border-brand-red/20 rounded-md p-3">
                <p className="text-xs text-brand-red leading-relaxed">
                  {buildRecapSummary()}
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-md p-4 space-y-5">
                
                {/* Source Filter */}
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">An expert sourced from</p>
                  <RadioGroup value={sourceFilter} onValueChange={setSourceFilter} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="source-all" />
                      <Label htmlFor="source-all" className="text-xs text-slate-700 cursor-pointer">Any organisation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="my-org" id="source-my-org" />
                      <Label htmlFor="source-my-org" className="text-xs text-slate-700 cursor-pointer">My organisation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other-orgs" id="source-other-orgs" />
                      <Label htmlFor="source-other-orgs" className="text-xs text-slate-700 cursor-pointer">All other organisations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="specific-orgs" id="source-specific-orgs" />
                      <Label htmlFor="source-specific-orgs" className="text-xs text-slate-700 cursor-pointer">Specific organisations</Label>
                    </div>
                    
                    {sourceFilter === "specific-orgs" && (
                      <div className="ml-5 max-h-48 overflow-y-auto space-y-2 border-l-2 border-slate-100 pl-3">
                        {organisationSectors.map((sector) => (
                          <div key={sector}>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id={`org-sector-${sector}`} 
                                checked={selectedOrgSectors.includes(sector)}
                                onCheckedChange={() => handleOrgSectorToggle(sector)}
                              />
                              <Label htmlFor={`org-sector-${sector}`} className="text-[11px] font-medium text-slate-700 cursor-pointer">{sector}</Label>
                            </div>
                            {selectedOrgSectors.includes(sector) && (
                              <div className="ml-5 mt-1.5 space-y-1.5 border-l-2 border-slate-100 pl-3">
                                {organisationsBySector[sector].map((org) => (
                                  <div key={org} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`org-${org}`} 
                                      checked={selectedOrgs.includes(org)}
                                      onCheckedChange={() => handleOrgToggle(org)}
                                    />
                                    <Label htmlFor={`org-${org}`} className="text-[10px] text-slate-600 cursor-pointer">{org}</Label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="my-sector" id="source-my-sector" />
                      <Label htmlFor="source-my-sector" className="text-xs text-slate-700 cursor-pointer">My sector</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="specific-sectors" id="source-specific-sectors" />
                      <Label htmlFor="source-specific-sectors" className="text-xs text-slate-700 cursor-pointer">Specific sectors</Label>
                    </div>

                    {sourceFilter === "specific-sectors" && (
                      <div className="ml-5 max-h-24 overflow-y-auto space-y-1.5 border-l-2 border-slate-100 pl-3">
                        {sectors.map((sector) => (
                          <div key={sector} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`sector-${sector}`} 
                              checked={selectedSectors.includes(sector)}
                              onCheckedChange={() => handleSectorToggle(sector)}
                            />
                            <Label htmlFor={`sector-${sector}`} className="text-[11px] text-slate-600 cursor-pointer">{sector}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </RadioGroup>
                </div>

                {/* Location Filter */}
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Based in</p>
                  <RadioGroup value={locationFilter} onValueChange={setLocationFilter} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="any" id="loc-any" />
                      <Label htmlFor="loc-any" className="text-xs text-slate-700 cursor-pointer">Any location</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="my-city" id="loc-my-city" />
                      <Label htmlFor="loc-my-city" className="text-xs text-slate-700 cursor-pointer">My city</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="my-country" id="loc-my-country" />
                      <Label htmlFor="loc-my-country" className="text-xs text-slate-700 cursor-pointer">My country</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="my-continent" id="loc-my-continent" />
                      <Label htmlFor="loc-my-continent" className="text-xs text-slate-700 cursor-pointer">My continent</Label>
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
                      <div className="ml-5 grid grid-cols-2 gap-1.5 border-l-2 border-slate-100 pl-3">
                        {countries.map((country) => (
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
                    )}
                  </RadioGroup>
                </div>

                {/* Project Type */}
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">For</p>
                  <RadioGroup value={projectType} onValueChange={setProjectType} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="proj-all" />
                      <Label htmlFor="proj-all" className="text-xs text-slate-700 cursor-pointer">Any project</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="client" id="proj-client" />
                      <Label htmlFor="proj-client" className="text-xs text-slate-700 cursor-pointer">Client projects</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="internal" id="proj-internal" />
                      <Label htmlFor="proj-internal" className="text-xs text-slate-700 cursor-pointer">Internal projects</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Content Published Period - Moved above As */}
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">For content published in</p>
                  <RadioGroup value={contentPeriod} onValueChange={setContentPeriod} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="any" id="period-any" />
                      <Label htmlFor="period-any" className="text-xs text-slate-700 cursor-pointer">Any period</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="6-months" id="period-6-months" />
                      <Label htmlFor="period-6-months" className="text-xs text-slate-700 cursor-pointer">Last 6 months</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="12-months" id="period-12-months" />
                      <Label htmlFor="period-12-months" className="text-xs text-slate-700 cursor-pointer">Last 12 months</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2-years" id="period-2-years" />
                      <Label htmlFor="period-2-years" className="text-xs text-slate-700 cursor-pointer">Last two years</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5-years" id="period-5-years" />
                      <Label htmlFor="period-5-years" className="text-xs text-slate-700 cursor-pointer">Last five years</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5-plus-years" id="period-5-plus-years" />
                      <Label htmlFor="period-5-plus-years" className="text-xs text-slate-700 cursor-pointer">More than five years ago</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="date-range" id="period-date-range" />
                      <Label htmlFor="period-date-range" className="text-xs text-slate-700 cursor-pointer">Date range in years</Label>
                    </div>
                  </RadioGroup>
                  
                  {contentPeriod === "date-range" && (
                    <div className="mt-2 ml-5 flex items-center gap-2 border-l-2 border-slate-100 pl-3">
                      <div className="flex items-center gap-1">
                        <Label htmlFor="date-from" className="text-[10px] text-slate-500">From</Label>
                        <input
                          type="text"
                          id="date-from"
                          placeholder="YYYY"
                          maxLength={4}
                          value={dateRangeFrom}
                          onChange={(e) => setDateRangeFrom(e.target.value.replace(/\D/g, ''))}
                          className="w-14 px-2 py-1 text-[11px] border border-slate-200 rounded focus:outline-none focus:border-brand-red"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Label htmlFor="date-to" className="text-[10px] text-slate-500">To</Label>
                        <input
                          type="text"
                          id="date-to"
                          placeholder="YYYY"
                          maxLength={4}
                          value={dateRangeTo}
                          onChange={(e) => setDateRangeTo(e.target.value.replace(/\D/g, ''))}
                          className="w-14 px-2 py-1 text-[11px] border border-slate-200 rounded focus:outline-none focus:border-brand-red"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Role - Now after Period */}
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">As</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="role-author" 
                        checked={roles.includes("author")}
                        onCheckedChange={() => handleRoleToggle("author")}
                      />
                      <Label htmlFor="role-author" className="text-xs text-slate-700 cursor-pointer">An author</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="role-leader" 
                        checked={roles.includes("leader")}
                        onCheckedChange={() => handleRoleToggle("leader")}
                      />
                      <Label htmlFor="role-leader" className="text-xs text-slate-700 cursor-pointer">A future leader</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="role-team" 
                        checked={roles.includes("team")}
                        onCheckedChange={() => handleRoleToggle("team")}
                      />
                      <Label htmlFor="role-team" className="text-xs text-slate-700 cursor-pointer">A team member</Label>
                    </div>
                    {sourceFilter !== "my-org" && (
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="role-consultant" 
                          checked={roles.includes("consultant")}
                          onCheckedChange={() => handleRoleToggle("consultant")}
                        />
                        <Label htmlFor="role-consultant" className="text-xs text-slate-700 cursor-pointer">An external consultant/advisor</Label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={startSearch}
                className="w-full bg-slate-900 text-white text-xs font-medium py-2.5 rounded hover:bg-brand-red transition-colors text-center block"
              >
                Find Experts
              </button>
            </div>
          )}

          {/* Searching UI */}
          {step === "searching" && (
            <div className="flex gap-3 animate-fade-in mt-4">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
                <FontAwesomeIcon icon={faSpinner} className="text-xs animate-spin" />
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-lg rounded-tl-none text-sm text-slate-700 shadow-sm">
                <p>Analyzing 1,240,400 documents...</p>
              </div>
            </div>
          )}

          {/* Results */}
          {step === "results" && (
            <>
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
                  <FontAwesomeIcon icon={faUserTie} className="text-xs" />
                </div>
                <div className="bg-white border border-gray-100 p-3 rounded-lg rounded-tl-none text-sm text-slate-700 shadow-sm">
                  <p>I found 5 top experts matching your criteria based on recent citations and impact.</p>
                </div>
              </div>

              {/* New Search Link */}
              <div className="pl-11 mt-2 animate-fade-in">
                <button
                  onClick={handleNewSearch}
                  className="text-xs text-brand-red hover:underline flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faLink} className="text-[10px]" />
                  New search
                </button>
              </div>

              {/* Experts Section */}
              <div className="flex flex-col gap-3 pl-11 mt-2 animate-fade-in">
                <p className="text-[10px] uppercase font-bold text-slate-400">Experts</p>
                {experts.map((exp, index) => (
                  <div
                    key={index}
                    className="bg-white border border-slate-200 rounded-md p-3 shadow-sm hover:border-brand-red transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <button 
                          onClick={() => {
                            setSelectedExpert(exp);
                            setIsProfileOpen(true);
                          }}
                          className="text-sm font-medium text-slate-800 hover:text-brand-red transition-colors text-left"
                        >
                          {exp.name}
                        </button>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide">{exp.firm}</p>
                        {exp.communityType && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-medium rounded">
                            {exp.communityType}
                          </span>
                        )}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {exp.officialBioUrl && (
                            <a 
                              href={exp.officialBioUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-brand-red hover:underline"
                            >
                              <FontAwesomeIcon icon={faAddressCard} className="text-[9px]" />
                              Official bio
                            </a>
                          )}
                          {exp.linkedInUrl && (
                            <a 
                              href={exp.linkedInUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-[#0A66C2] hover:underline"
                            >
                              <FontAwesomeIcon icon={faLinkedin} className="text-[11px]" />
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-brand-red">{exp.score}/100</span>
                        <p className="text-[9px] text-slate-400">Impact Score</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                      <div className="flex items-center gap-3">
                        <button className="text-[10px] text-slate-600 hover:text-brand-red transition-colors">
                          <FontAwesomeIcon icon={faFileLines} className="mr-1" /> {exp.pubs} Pubs (24m)
                        </button>
                        <div className="flex items-center space-x-1.5">
                          <Checkbox 
                            id={`bookmark-${exp.name}`}
                            checked={bookmarkedExperts.includes(exp.name)}
                            onCheckedChange={() => handleExpertBookmark(exp.name)}
                          />
                          <Label htmlFor={`bookmark-${exp.name}`} className="text-[10px] text-slate-500 cursor-pointer">Bookmark</Label>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedExpert(exp);
                          setIsProfileOpen(true);
                        }}
                        className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded hover:bg-brand-red transition-colors"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Communities Section */}
              <div className="flex flex-col gap-3 pl-11 mt-4 animate-fade-in pb-4">
                <p className="text-[10px] uppercase font-bold text-slate-400">Related communities</p>
                {communities.map((community, index) => (
                  <div
                    key={index}
                    className="bg-white border border-slate-200 rounded-md p-3 shadow-sm hover:border-brand-red transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{community.name}</p>
                        <p className="text-[10px] text-slate-500">{community.description}</p>
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
                      <a 
                        href={community.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded hover:bg-brand-red transition-colors"
                      >
                        Join <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[8px]" />
                      </a>
                    </div>
                  </div>
                ))}
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

      {/* Expert Profile Modal */}
      <ExpertProfileModal 
        expert={selectedExpert} 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </>
  );
};

export default ChatWidget;
