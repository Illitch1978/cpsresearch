import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faTimes, faUserTie, faPaperPlane, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";

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

const firms = [
  "Clifford Chance",
  "Linklaters",
  "Allen & Overy",
  "Freshfields",
  "Slaughter and May",
  "DLA Piper",
  "Hogan Lovells",
  "Herbert Smith Freehills",
];

type ChatStep = "topic" | "scope" | "firms" | "searching" | "results";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<ChatStep>("topic");
  const [topic, setTopic] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "bot" }>>([]);

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
      setMessages((prev) => [...prev, { text: "Where should we look for experts?", sender: "bot" }]);
      setStep("scope");
    }, 600);
  };

  const handleScopeClick = (type: "all" | "select" | "specific") => {
    if (type === "select" || type === "specific") {
      setStep("firms");
    } else {
      startSearch();
    }
  };

  const startSearch = () => {
    setStep("searching");
    setTimeout(() => {
      setStep("results");
    }, 1000);
  };

  return (
    <>
      {/* Chat Widget Button - Adjusted for mobile */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 bg-brand-red hover:bg-red-800 text-white py-3 px-4 sm:py-4 sm:px-6 rounded-full shadow-lg flex items-center gap-2 sm:gap-3 transition-colors duration-300 group"
      >
        <FontAwesomeIcon icon={faCommentDots} className="text-lg sm:text-xl" />
        <span className="font-medium text-xs sm:text-sm tracking-wide hidden sm:inline">Find an expert</span>
      </button>

      {/* Chat Widget Panel - Responsive */}
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

          {/* Scope Options */}
          {step === "scope" && (
            <div className="pl-11 flex flex-col gap-2 animate-fade-in">
              <label
                className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded-md cursor-pointer hover:border-brand-red transition-all group"
                onClick={() => handleScopeClick("all")}
              >
                <input
                  type="radio"
                  name="firm_scope"
                  className="w-3 h-3 text-brand-red focus:ring-brand-red border-gray-300"
                />
                <span className="text-xs text-slate-700 group-hover:text-slate-900">
                  All firms / Marketplace
                </span>
              </label>
              <label
                className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded-md cursor-pointer hover:border-brand-red transition-all group"
                onClick={() => handleScopeClick("select")}
              >
                <input
                  type="radio"
                  name="firm_scope"
                  className="w-3 h-3 text-brand-red focus:ring-brand-red border-gray-300"
                />
                <span className="text-xs text-slate-700 group-hover:text-slate-900">Selection of firms</span>
              </label>
              <label
                className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded-md cursor-pointer hover:border-brand-red transition-all group"
                onClick={() => handleScopeClick("specific")}
              >
                <input
                  type="radio"
                  name="firm_scope"
                  className="w-3 h-3 text-brand-red focus:ring-brand-red border-gray-300"
                />
                <span className="text-xs text-slate-700 group-hover:text-slate-900">Specific firm</span>
              </label>
            </div>
          )}

          {/* Firm Selector */}
          {step === "firms" && (
            <div className="pl-11 mt-2 animate-fade-in">
              <div className="bg-white border border-gray-200 rounded-md p-3 mb-2">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Select Firms</p>
                <div className="h-32 overflow-y-auto space-y-2">
                  {firms.map((firm, index) => (
                    <label key={index} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-brand-red" />
                      <span className="text-xs text-slate-700">{firm}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                onClick={startSearch}
                className="w-full bg-slate-900 text-white text-xs font-medium py-2 rounded hover:bg-brand-red transition-colors text-center block"
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
