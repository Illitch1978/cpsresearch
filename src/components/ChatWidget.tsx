import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faTimes, faUserTie, faPaperPlane, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Expert {
  name: string;
  firm: string;
  score: number;
  pubs: number;
}

const experts: Expert[] = [
  { name: "Dr. Elena Voreas", firm: "Clifford Chance", score: 98, pubs: 14 },
  { name: "Prof. James Sterling", firm: "Linklaters", score: 94, pubs: 9 },
  { name: "Sarah Jenkins", firm: "Allen & Overy", score: 91, pubs: 11 },
  { name: "David Thorne", firm: "Freshfields", score: 89, pubs: 7 },
  { name: "Marcus Alistair", firm: "Slaughter and May", score: 85, pubs: 12 },
];

const organisations = [
  "Clifford Chance",
  "Linklaters",
  "Allen & Overy",
  "Freshfields",
  "Slaughter and May",
  "DLA Piper",
  "Hogan Lovells",
  "Herbert Smith Freehills",
];

const sectors = [
  "Financial Services",
  "Technology",
  "Healthcare",
  "Energy",
  "Real Estate",
  "Manufacturing",
];

const countries = [
  "United Kingdom",
  "United States",
  "Germany",
  "France",
  "Singapore",
  "Australia",
];

type ChatStep = "topic" | "filters" | "searching" | "results";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<ChatStep>("topic");
  const [topic, setTopic] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "bot" }>>([]);

  // Filter states
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState("any");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [projectType, setProjectType] = useState("");
  const [roles, setRoles] = useState<string[]>([]);

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
      setMessages((prev) => [...prev, { text: "What type of expert are you looking for today?", sender: "bot" }]);
      setStep("filters");
    }, 600);
  };

  const handleOrgToggle = (org: string) => {
    setSelectedOrgs(prev => 
      prev.includes(org) ? prev.filter(o => o !== org) : [...prev, org]
    );
  };

  const handleSectorToggle = (sector: string) => {
    setSelectedSectors(prev => 
      prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]
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

  const startSearch = () => {
    setStep("searching");
    setTimeout(() => {
      setStep("results");
    }, 1000);
  };

  return (
    <>
      {/* Chat Widget Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 bg-brand-red hover:bg-red-800 text-white py-3 px-4 sm:py-4 sm:px-6 rounded-full shadow-lg flex items-center gap-2 sm:gap-3 transition-colors duration-300 group"
      >
        <FontAwesomeIcon icon={faCommentDots} className="text-lg sm:text-xl" />
        <span className="font-medium text-xs sm:text-sm tracking-wide hidden sm:inline">Find an expert</span>
      </button>

      {/* Chat Widget Panel */}
      <div
        className={`fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 flex-col overflow-hidden transition-all duration-300 origin-bottom-right transform font-sans ${
          isOpen 
            ? "flex scale-100 opacity-100" 
            : "hidden scale-95 opacity-0"
        } bottom-20 right-4 sm:bottom-28 sm:right-8 w-[calc(100vw-2rem)] sm:w-96 max-w-96`}
      >
        {/* Header */}
        <div className="bg-hero-bg p-4 flex justify-between items-center text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div>
              <h3 className="font-serif font-medium text-lg leading-none">Credible Voices</h3>
              <p className="text-xs text-slate-400 mt-1">Connect with verified experts</p>
            </div>
          </div>
          <button onClick={toggleChat} className="text-slate-400 hover:text-white transition-colors">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Chat Body */}
        <div className="h-[350px] sm:h-[450px] bg-slate-50 p-4 overflow-y-auto flex flex-col gap-4">
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
              <div className="bg-white border border-slate-200 rounded-md p-4 space-y-5">
                
                {/* Source Filter */}
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">An expert sourced from</p>
                  <RadioGroup value={sourceFilter} onValueChange={setSourceFilter} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="source-all" />
                      <Label htmlFor="source-all" className="text-xs text-slate-700 cursor-pointer">All organisations</Label>
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
                      <div className="ml-5 max-h-24 overflow-y-auto space-y-1.5 border-l-2 border-slate-100 pl-3">
                        {organisations.map((org) => (
                          <div key={org} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`org-${org}`} 
                              checked={selectedOrgs.includes(org)}
                              onCheckedChange={() => handleOrgToggle(org)}
                            />
                            <Label htmlFor={`org-${org}`} className="text-[11px] text-slate-600 cursor-pointer">{org}</Label>
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
                      <RadioGroupItem value="specific-countries" id="loc-specific-countries" />
                      <Label htmlFor="loc-specific-countries" className="text-xs text-slate-700 cursor-pointer">Specific countries</Label>
                    </div>
                  </RadioGroup>
                  
                  {locationFilter === "specific-countries" && (
                    <div className="mt-2 ml-5 max-h-24 overflow-y-auto space-y-1.5 border-l-2 border-slate-100 pl-3">
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
                </div>

                {/* Project Type */}
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">For</p>
                  <RadioGroup value={projectType} onValueChange={setProjectType} className="space-y-2">
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

                {/* Role */}
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

              <div className="flex flex-col gap-3 pl-11 mt-2 animate-fade-in pb-4">
                {experts.map((exp, index) => (
                  <div
                    key={index}
                    className="bg-white border border-slate-200 rounded-md p-3 shadow-sm hover:border-brand-red transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{exp.name}</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide">{exp.firm}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-brand-red">{exp.score}/100</span>
                        <p className="text-[9px] text-slate-400">Impact Score</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                      <span className="text-[10px] text-slate-600">
                        <FontAwesomeIcon icon={faFileLines} className="mr-1" /> {exp.pubs} Pubs (24m)
                      </span>
                      <button className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded hover:bg-brand-red transition-colors">
                        Contact
                      </button>
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
    </>
  );
};

export default ChatWidget;
