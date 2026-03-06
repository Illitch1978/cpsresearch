import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUsers,
  faComments,
  faFolderOpen,
  faCalendarDays,
  faCircleInfo,
  faBell,
  faThumbsUp,
  faReply,
  faBookmark as faBookmarkSolid,
  faEllipsisH,
  faPlus,
  faPaperPlane,
  faGlobe,
  faMapMarkerAlt,
  faTag,
  faCrown,
  faShieldHalved,
  faLink,
  faFileAlt,
  faVideo,
  faDownload,
  faChartLine,
  faLightbulb,
  faHandshake,
  faSearch,
  faTimes,
  faEnvelope,
  faBuilding,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular, faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import cpsrLogo from "@/assets/cpsr-logo.jpg";
import UserAvatar from "@/components/UserAvatar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// ─── Mock Data ───────────────────────────────────────────────

interface Member {
  id: string;
  name: string;
  role: string;
  firm: string;
  avatar?: string;
  badge?: "founder" | "moderator" | "contributor";
  joinedDate: string;
  expertise: string[];
  bio?: string;
  email?: string;
  linkedin?: string;
  publications?: number;
  location?: string;
}

interface Discussion {
  id: string;
  title: string;
  author: Member;
  content: string;
  date: string;
  replies: number;
  likes: number;
  tags: string[];
  pinned?: boolean;
}

interface Resource {
  id: string;
  title: string;
  type: "paper" | "report" | "presentation" | "video" | "link";
  author: string;
  date: string;
  downloads?: number;
  description: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "webinar" | "meetup" | "conference" | "workshop";
  attendees: number;
  description: string;
  speaker?: string;
}

const mockMembers: Member[] = [
  { id: "1", name: "Prof. Sarah Mitchell", role: "Director of Research", firm: "London Business School", badge: "founder", joinedDate: "Jan 2025", expertise: ["Strategy", "Governance", "Leadership"], bio: "Sarah leads the Centre's research agenda on professional services governance and has published over 40 peer-reviewed papers. She previously served as a non-executive director at two FTSE 250 firms and is a Fellow of the Academy of Management.", email: "s.mitchell@lbs.ac.uk", linkedin: "sarahmitchell", publications: 43, location: "London, UK" },
  { id: "2", name: "Dr. James Hargreaves", role: "Senior Partner", firm: "Deloitte", badge: "moderator", joinedDate: "Feb 2025", expertise: ["Audit", "Risk Management", "AI in Assurance"], bio: "James combines 20 years of audit practice with academic research on technology-driven assurance. He chairs the CPSR working group on AI adoption in professional services and regularly advises regulators.", email: "jhargreaves@deloitte.co.uk", linkedin: "jameshargreaves", publications: 18, location: "London, UK" },
  { id: "3", name: "Emma Richardson", role: "Research Fellow", firm: "Oxford Saïd", badge: "contributor", joinedDate: "Mar 2025", expertise: ["Innovation", "Professional Services", "Diversity"], bio: "Emma's doctoral research at Saïd Business School examines diversity pipelines in Big Four firms. Her recent working paper on the 'frozen middle' has been cited by the FRC and featured in the Financial Times.", email: "emma.richardson@sbs.ox.ac.uk", linkedin: "emmarichardson", publications: 7, location: "Oxford, UK" },
  { id: "4", name: "Michael Chen", role: "Managing Director", firm: "McKinsey & Company", joinedDate: "Apr 2025", expertise: ["Consulting", "Transformation", "Impact Measurement"], bio: "Michael leads McKinsey's internal research function and is passionate about measuring and demonstrating consulting impact. He holds an MBA from Wharton and a PhD from MIT Sloan.", email: "michael_chen@mckinsey.com", linkedin: "michaelchen", publications: 12, location: "New York, US" },
  { id: "5", name: "Dr. Aisha Patel", role: "Associate Professor", firm: "Imperial College", badge: "contributor", joinedDate: "May 2025", expertise: ["Data Analytics", "AI in Services", "Machine Learning"], bio: "Aisha researches the application of machine learning techniques in professional services delivery. She co-leads Imperial's AI & Professional Services Lab and has secured £2.1M in UKRI funding.", email: "a.patel@imperial.ac.uk", linkedin: "aishapatel", publications: 29, location: "London, UK" },
  { id: "6", name: "Thomas Wright", role: "Partner", firm: "PwC", joinedDate: "Jun 2025", expertise: ["Tax", "Regulation", "Policy"], bio: "Thomas advises multinational firms on regulatory strategy and is a recognised authority on professional services regulation in the UK and EU. He sits on the Law Society's regulatory policy committee.", email: "thomas.wright@pwc.com", linkedin: "thomaswright", publications: 8, location: "London, UK" },
  { id: "7", name: "Dr. Claire Dubois", role: "Lecturer", firm: "INSEAD", joinedDate: "Sep 2025", expertise: ["Organisational Behaviour", "Culture", "Leadership Development"], bio: "Claire's research explores organisational culture in global professional services firms, with particular focus on cross-cultural leadership challenges. She previously worked at Bain & Company in Paris.", email: "claire.dubois@insead.edu", linkedin: "clairedubois", publications: 15, location: "Fontainebleau, France" },
  { id: "8", name: "Robert Kimani", role: "Principal", firm: "BCG", joinedDate: "Nov 2025", expertise: ["Digital", "Operations", "Emerging Markets"], bio: "Robert leads BCG's Africa practice and researches the growth of professional services in emerging markets. He is a regular contributor to Harvard Business Review and sits on the board of the African Management Institute.", email: "kimani.robert@bcg.com", linkedin: "robertkimani", publications: 11, location: "Nairobi, Kenya" },
];

const mockDiscussions: Discussion[] = [
  {
    id: "1", pinned: true,
    title: "Welcome to the Professional Services Research Community",
    author: mockMembers[0],
    content: "Welcome to all new members. This community is dedicated to advancing rigorous, evidence-based research across the professional services sector. Please introduce yourselves and share your research interests.",
    date: "15 Feb 2026", replies: 24, likes: 47, tags: ["Welcome", "Community"],
  },
  {
    id: "2",
    title: "The evolving role of AI in audit and assurance — call for perspectives",
    author: mockMembers[1],
    content: "As regulators begin to address AI use in audit, I'd like to gather perspectives from researchers and practitioners. How are your firms approaching this? What methodological frameworks are you seeing?",
    date: "4 Mar 2026", replies: 12, likes: 31, tags: ["AI", "Audit", "Methods"],
  },
  {
    id: "3",
    title: "New working paper: Diversity metrics in Big Four leadership pipelines",
    author: mockMembers[2],
    content: "I've just published a new working paper examining diversity data across the Big Four's leadership pipelines from 2020-2026. Key finding: while entry-level diversity has improved significantly, the 'frozen middle' persists. Happy to share the full paper with community members.",
    date: "3 Mar 2026", replies: 8, likes: 22, tags: ["Diversity", "Research", "Big Four"],
  },
  {
    id: "4",
    title: "Upcoming CPSR methods workshop — expressions of interest",
    author: mockMembers[0],
    content: "We're planning a half-day workshop on mixed-methods research design for professional services studies. If you'd be interested in attending or presenting, please comment below.",
    date: "1 Mar 2026", replies: 15, likes: 19, tags: ["Events", "Methods", "Workshop"],
  },
  {
    id: "5",
    title: "Transparency in consulting: are clients getting what they pay for?",
    author: mockMembers[3],
    content: "A provocative question, but one that deserves rigorous examination. I'm seeing growing demand from clients for evidence of impact. What frameworks exist for measuring consulting effectiveness?",
    date: "25 Feb 2026", replies: 31, likes: 56, tags: ["Consulting", "Transparency", "Impact"],
  },
];

const mockResources: Resource[] = [
  { id: "1", title: "Professional Services Research Methods Handbook (2026 Edition)", type: "paper", author: "Prof. Sarah Mitchell et al.", date: "Jan 2026", downloads: 342, description: "Comprehensive guide to research methodologies specific to studying professional service firms." },
  { id: "2", title: "AI Adoption in Audit: A Systematic Review", type: "report", author: "Dr. James Hargreaves", date: "Feb 2026", downloads: 189, description: "Systematic review of 152 papers on AI adoption patterns in audit firms across 18 jurisdictions." },
  { id: "3", title: "CPSR Annual Conference 2025 — Keynote Recordings", type: "video", author: "CPSR", date: "Dec 2025", downloads: 94, description: "Full recordings of all keynote presentations from the 2025 annual conference." },
  { id: "4", title: "Diversity Pipeline Analysis: Methodology & Dataset", type: "paper", author: "Emma Richardson", date: "Mar 2026", downloads: 67, description: "Open-access dataset and methodology documentation for the Big Four diversity pipeline study." },
  { id: "5", title: "Regulatory Landscape for Professional Services (EU & UK)", type: "link", author: "Thomas Wright", date: "Mar 2026", description: "Living document tracking regulatory changes affecting professional services in Europe." },
];

const mockEvents: Event[] = [
  { id: "1", title: "Mixed-Methods Research Design Workshop", date: "28 Mar 2026", time: "14:00 GMT", type: "workshop", attendees: 32, description: "Half-day workshop on applying mixed-methods approaches to professional services research.", speaker: "Prof. Sarah Mitchell" },
  { id: "2", title: "AI in Professional Services — Monthly Webinar", date: "10 Apr 2026", time: "12:00 BST", type: "webinar", attendees: 78, description: "Monthly discussion on the latest developments in AI across consulting, audit, and legal services.", speaker: "Dr. Aisha Patel" },
  { id: "3", title: "CPSR Spring Research Symposium", date: "15 May 2026", time: "09:00 BST", type: "conference", attendees: 120, description: "Full-day symposium featuring 20 paper presentations and 3 panel discussions on current research." },
  { id: "4", title: "London Meetup: Emerging Researchers Network", date: "22 Apr 2026", time: "18:30 BST", type: "meetup", attendees: 25, description: "Informal networking event for early-career researchers studying professional services." },
];

const communityData = {
  "prof-services-research": {
    name: "Professional Services Research",
    description: "A community dedicated to advancing rigorous, evidence-based research across the professional services sector. We bring together academics, practitioners, and policymakers to champion transparency, methodological excellence, and impactful collaboration.",
    members: 247,
    discussions: 89,
    resources: 34,
    tags: ["Research", "Professional Services", "Methods", "Governance"],
    location: "Global",
    founded: "January 2025",
    website: "cpsr.uk",
  },
};

// ─── Sub-components ──────────────────────────────────────────

const BadgeIcon = ({ badge }: { badge?: string }) => {
  if (!badge) return null;
  const config = {
    founder: { icon: faCrown, color: "text-amber-500", label: "Founder" },
    moderator: { icon: faShieldHalved, color: "text-blue-500", label: "Moderator" },
    contributor: { icon: faLightbulb, color: "text-emerald-500", label: "Contributor" },
  }[badge];
  if (!config) return null;
  return (
    <span title={config.label} className={`${config.color} ml-1.5`}>
      <FontAwesomeIcon icon={config.icon} className="text-xs" />
    </span>
  );
};

const ResourceIcon = ({ type }: { type: string }) => {
  const icon = { paper: faFileAlt, report: faChartLine, presentation: faFileAlt, video: faVideo, link: faLink }[type] || faFileAlt;
  return <FontAwesomeIcon icon={icon} />;
};

const EventTypeBadge = ({ type }: { type: string }) => {
  const colors: Record<string, string> = {
    webinar: "bg-blue-50 text-blue-700 border-blue-200",
    meetup: "bg-emerald-50 text-emerald-700 border-emerald-200",
    conference: "bg-purple-50 text-purple-700 border-purple-200",
    workshop: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${colors[type] || ""}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

// ─── Member Profile Modal ────────────────────────────────────

const MemberProfileModal = ({ member, open, onClose }: { member: Member | null; open: boolean; onClose: () => void }) => {
  if (!member) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="sr-only">{member.name}</DialogTitle>
          <DialogDescription className="sr-only">Profile details for {member.name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif font-semibold text-card-foreground">{member.name}</h2>
                <BadgeIcon badge={member.badge} />
              </div>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><FontAwesomeIcon icon={faBuilding} className="text-[10px]" /> {member.firm}</span>
                {member.location && (
                  <span className="flex items-center gap-1"><FontAwesomeIcon icon={faMapMarkerAlt} className="text-[10px]" /> {member.location}</span>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {member.bio && (
            <div>
              <h4 className="text-xs font-semibold text-card-foreground uppercase tracking-wider mb-2">About</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-card-foreground">{member.publications || 0}</div>
              <div className="text-[11px] text-muted-foreground">Publications</div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-card-foreground">{member.expertise.length}</div>
              <div className="text-[11px] text-muted-foreground">Expertise areas</div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-card-foreground">{member.joinedDate.split(" ")[1]?.slice(2) || ""}</div>
              <div className="text-[11px] text-muted-foreground">Joined {member.joinedDate.split(" ")[0]}</div>
            </div>
          </div>

          {/* Expertise */}
          <div>
            <h4 className="text-xs font-semibold text-card-foreground uppercase tracking-wider mb-2">Expertise</h4>
            <div className="flex flex-wrap gap-1.5">
              {member.expertise.map(e => (
                <Badge key={e} variant="secondary" className="text-xs font-normal">{e}</Badge>
              ))}
            </div>
          </div>

          {/* Contact Actions */}
          <div className="flex gap-2 pt-2 border-t border-border">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg py-2.5 transition-colors"
              >
                <FontAwesomeIcon icon={faEnvelope} className="text-xs" /> Email
              </a>
            )}
            {member.linkedin && (
              <a
                href={`https://linkedin.com/in/${member.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg py-2.5 transition-colors"
              >
                <FontAwesomeIcon icon={faLinkedin} className="text-xs" /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Main Component ──────────────────────────────────────────

const Community = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("discussions");
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [bookmarkedDiscussions, setBookmarkedDiscussions] = useState<string[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const community = communityData["prof-services-research"];

  const toggleBookmark = (discussionId: string) => {
    setBookmarkedDiscussions(prev =>
      prev.includes(discussionId) ? prev.filter(d => d !== discussionId) : [...prev, discussionId]
    );
  };

  // Universal search across all content
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return {
      discussions: mockDiscussions.filter(d =>
        d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q) || d.tags.some(t => t.toLowerCase().includes(q))
      ),
      members: mockMembers.filter(m =>
        m.name.toLowerCase().includes(q) || m.firm.toLowerCase().includes(q) || m.expertise.some(e => e.toLowerCase().includes(q))
      ),
      resources: mockResources.filter(r =>
        r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.author.toLowerCase().includes(q)
      ),
      events: mockEvents.filter(e =>
        e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || (e.speaker?.toLowerCase().includes(q))
      ),
    };
  }, [searchQuery]);

  const totalResults = searchResults
    ? searchResults.discussions.length + searchResults.members.length + searchResults.resources.length + searchResults.events.length
    : 0;

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="text-slate-500 hover:text-brand-red transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span className="hidden sm:inline">Back to Centre</span>
              </button>
              <div className="h-5 w-px bg-gray-200" />
              <div className="flex items-center gap-2.5">
                <img src={cpsrLogo} alt="CPSR" className="h-7 w-auto" />
                <span className="font-serif text-sm font-medium text-slate-800 hidden md:inline">Communities</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Search Toggle */}
              <button
                onClick={() => { setSearchOpen(!searchOpen); if (searchOpen) setSearchQuery(""); }}
                className={`text-slate-500 hover:text-slate-700 transition-colors p-1.5 rounded-md ${searchOpen ? "bg-primary/10 text-primary" : ""}`}
              >
                <FontAwesomeIcon icon={searchOpen ? faTimes : faSearch} className="text-base" />
              </button>
              <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
                <FontAwesomeIcon icon={faBell} className="text-lg" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-bold">3</span>
              </button>
              <UserAvatar />
            </div>
          </div>
        </div>
      </nav>

      {/* Search Bar (collapsible) */}
      {searchOpen && (
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search discussions, members, resources, events…"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <FontAwesomeIcon icon={faTimes} className="text-sm" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-xs text-muted-foreground mt-2">
                {totalResults} result{totalResults !== 1 ? "s" : ""} for "<span className="font-medium text-foreground">{searchQuery}</span>"
              </p>
            )}
          </div>
        </div>
      )}

      {/* Search Results Overlay */}
      {searchResults && searchQuery.trim() && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
          <div className="space-y-6">
            {/* Matching Discussions */}
            {searchResults.discussions.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faComments} /> Discussions ({searchResults.discussions.length})
                </h3>
                <div className="space-y-2">
                  {searchResults.discussions.map(d => (
                    <button
                      key={d.id}
                      onClick={() => { setSearchQuery(""); setSearchOpen(false); setActiveTab("discussions"); }}
                      className="w-full text-left bg-white border border-border rounded-lg p-4 hover:border-primary/30 hover:shadow-sm transition-all"
                    >
                      <h4 className="text-sm font-semibold text-card-foreground">{d.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{d.content}</p>
                      <span className="text-[11px] text-muted-foreground mt-1 block">{d.author.name} · {d.date}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Members */}
            {searchResults.members.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faUsers} /> Members ({searchResults.members.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {searchResults.members.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMember(m)}
                      className="text-left bg-white border border-border rounded-lg p-4 hover:border-primary/30 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-medium">
                            {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="text-sm font-medium text-card-foreground flex items-center">{m.name}<BadgeIcon badge={m.badge} /></span>
                          <span className="text-xs text-muted-foreground">{m.firm}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Resources */}
            {searchResults.resources.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faFolderOpen} /> Resources ({searchResults.resources.length})
                </h3>
                <div className="space-y-2">
                  {searchResults.resources.map(r => (
                    <button
                      key={r.id}
                      onClick={() => { setSearchQuery(""); setSearchOpen(false); setActiveTab("resources"); }}
                      className="w-full text-left bg-white border border-border rounded-lg p-4 hover:border-primary/30 hover:shadow-sm transition-all flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 text-xs">
                        <ResourceIcon type={r.type} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-card-foreground">{r.title}</h4>
                        <span className="text-[11px] text-muted-foreground">{r.author} · {r.date}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Events */}
            {searchResults.events.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendarDays} /> Events ({searchResults.events.length})
                </h3>
                <div className="space-y-2">
                  {searchResults.events.map(e => (
                    <button
                      key={e.id}
                      onClick={() => { setSearchQuery(""); setSearchOpen(false); setActiveTab("events"); }}
                      className="w-full text-left bg-white border border-border rounded-lg p-4 hover:border-primary/30 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-2 mb-1"><EventTypeBadge type={e.type} /><h4 className="text-sm font-semibold text-card-foreground">{e.title}</h4></div>
                      <span className="text-[11px] text-muted-foreground">{e.date} · {e.time}{e.speaker && ` · ${e.speaker}`}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {totalResults === 0 && (
              <div className="text-center py-12">
                <FontAwesomeIcon icon={faSearch} className="text-3xl text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No results found for "{searchQuery}"</p>
                <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Community Header — hide when searching */}
      {(!searchResults || !searchQuery.trim()) && (
        <>
          <div className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center">
                      <FontAwesomeIcon icon={faHandshake} className="text-primary text-lg" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-serif font-semibold text-card-foreground leading-tight">{community.name}</h1>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><FontAwesomeIcon icon={faGlobe} /> {community.location}</span>
                        <span>·</span>
                        <span>Founded {community.founded}</span>
                        <span>·</span>
                        <a href={`https://${community.website}`} className="text-primary hover:underline flex items-center gap-1">
                          <FontAwesomeIcon icon={faLink} className="text-[10px]" /> {community.website}
                        </a>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mt-3">{community.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {community.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-row md:flex-col gap-3 md:items-end shrink-0">
                  <div className="grid grid-cols-3 md:grid-cols-1 gap-3 text-center md:text-right">
                    <div>
                      <div className="text-xl font-semibold text-card-foreground">{community.members}</div>
                      <div className="text-xs text-muted-foreground">Members</div>
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-card-foreground">{community.discussions}</div>
                      <div className="text-xs text-muted-foreground">Discussions</div>
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-card-foreground">{community.resources}</div>
                      <div className="text-xs text-muted-foreground">Resources</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content with Tabs */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-white border border-gray-200 h-11 p-1 mb-6">
                <TabsTrigger value="discussions" className="gap-2 text-sm data-[state=active]:text-primary">
                  <FontAwesomeIcon icon={faComments} className="text-xs" /> Discussions
                </TabsTrigger>
                <TabsTrigger value="members" className="gap-2 text-sm data-[state=active]:text-primary">
                  <FontAwesomeIcon icon={faUsers} className="text-xs" /> Members
                </TabsTrigger>
                <TabsTrigger value="resources" className="gap-2 text-sm data-[state=active]:text-primary">
                  <FontAwesomeIcon icon={faFolderOpen} className="text-xs" /> Resources
                </TabsTrigger>
                <TabsTrigger value="events" className="gap-2 text-sm data-[state=active]:text-primary">
                  <FontAwesomeIcon icon={faCalendarDays} className="text-xs" /> Events
                </TabsTrigger>
                <TabsTrigger value="about" className="gap-2 text-sm data-[state=active]:text-primary">
                  <FontAwesomeIcon icon={faCircleInfo} className="text-xs" /> About
                </TabsTrigger>
              </TabsList>

              {/* ─── DISCUSSIONS TAB ─── */}
              <TabsContent value="discussions">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    {/* New Post CTA */}
                    <div
                      onClick={() => setNewPostOpen(!newPostOpen)}
                      className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">RC</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">Start a new discussion…</span>
                      <FontAwesomeIcon icon={faPaperPlane} className="ml-auto text-muted-foreground text-sm" />
                    </div>

                    {/* Discussion List */}
                    {mockDiscussions.map(d => (
                      <article key={d.id} className={`bg-white border rounded-lg p-5 transition-all hover:shadow-sm ${d.pinned ? "border-primary/20 bg-primary/[0.02]" : "border-gray-200"}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <button onClick={() => setSelectedMember(d.author)} className="shrink-0">
                              <Avatar className="h-9 w-9 mt-0.5">
                                <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-medium">
                                  {d.author.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                            </button>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                {d.pinned && <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0">Pinned</Badge>}
                                <h3 className="text-sm font-semibold text-card-foreground leading-snug">{d.title}</h3>
                              </div>
                              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                                <button onClick={() => setSelectedMember(d.author)} className="font-medium text-slate-600 hover:text-primary transition-colors">{d.author.name}</button>
                                <BadgeIcon badge={d.author.badge} />
                                <span>·</span>
                                <span>{d.author.firm}</span>
                                <span>·</span>
                                <span>{d.date}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">{d.content}</p>
                              <div className="flex items-center gap-4 mt-3">
                                <div className="flex gap-1.5">
                                  {d.tags.map(tag => (
                                    <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100">{tag}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleBookmark(d.id)}
                            className="text-slate-300 hover:text-primary transition-colors mt-1 shrink-0"
                          >
                            <FontAwesomeIcon icon={bookmarkedDiscussions.includes(d.id) ? faBookmarkSolid : faBookmarkRegular} />
                          </button>
                        </div>
                        <div className="flex items-center gap-5 mt-4 pt-3 border-t border-gray-50 text-xs text-muted-foreground">
                          <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                            <FontAwesomeIcon icon={faThumbsUp} /> {d.likes}
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                            <FontAwesomeIcon icon={faReply} /> {d.replies} replies
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Sidebar — Active Members */}
                  <aside className="space-y-5">
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                      <h3 className="text-sm font-semibold text-card-foreground mb-4">Active Members</h3>
                      <div className="space-y-3">
                        {mockMembers.slice(0, 5).map(m => (
                          <button key={m.id} onClick={() => setSelectedMember(m)} className="flex items-center gap-2.5 w-full text-left hover:bg-slate-50 rounded-md p-1 -m-1 transition-colors">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-medium">
                                {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="flex items-center">
                                <span className="text-xs font-medium text-slate-700 truncate">{m.name}</span>
                                <BadgeIcon badge={m.badge} />
                              </div>
                              <span className="text-[11px] text-muted-foreground truncate block">{m.firm}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setActiveTab("members")}
                        className="text-xs text-primary font-medium mt-4 hover:underline"
                      >
                        View all {community.members} members →
                      </button>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                      <h3 className="text-sm font-semibold text-card-foreground mb-3">Community Guidelines</h3>
                      <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                        <li>• Share evidence-based insights and cite sources</li>
                        <li>• Respect diverse perspectives and methodologies</li>
                        <li>• Maintain confidentiality of unpublished research</li>
                        <li>• Engage constructively and professionally</li>
                      </ul>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                      <h3 className="text-sm font-semibold text-card-foreground mb-3">Upcoming Event</h3>
                      <div className="text-xs">
                        <p className="font-medium text-slate-700">{mockEvents[0].title}</p>
                        <p className="text-muted-foreground mt-1">{mockEvents[0].date} · {mockEvents[0].time}</p>
                        <button onClick={() => setActiveTab("events")} className="text-primary font-medium mt-2 hover:underline">View details →</button>
                      </div>
                    </div>
                  </aside>
                </div>
              </TabsContent>

              {/* ─── MEMBERS TAB ─── */}
              <TabsContent value="members">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {mockMembers.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMember(m)}
                      className="text-left bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-primary/20 transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-11 w-11">
                          <AvatarFallback className="bg-slate-100 text-slate-600 text-sm font-medium group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-center">
                            <span className="text-sm font-semibold text-card-foreground truncate group-hover:text-primary transition-colors">{m.name}</span>
                            <BadgeIcon badge={m.badge} />
                          </div>
                          <span className="text-xs text-muted-foreground">{m.role}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{m.firm}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.expertise.map(e => (
                          <span key={e} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100">{e}</span>
                        ))}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-3 pt-3 border-t border-gray-50">
                        Member since {m.joinedDate}
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>

              {/* ─── RESOURCES TAB ─── */}
              <TabsContent value="resources">
                <div className="space-y-3">
                  {mockResources.map(r => (
                    <div key={r.id} className="bg-white border border-gray-200 rounded-lg p-5 flex items-start gap-4 hover:shadow-sm transition-shadow">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                        <ResourceIcon type={r.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-card-foreground">{r.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{r.author} · {r.date}</p>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{r.description}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {r.downloads && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <FontAwesomeIcon icon={faDownload} /> {r.downloads}
                          </span>
                        )}
                        <button className="text-primary hover:text-primary/80 transition-colors text-sm">
                          <FontAwesomeIcon icon={r.type === "link" ? faLink : faDownload} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* ─── EVENTS TAB ─── */}
              <TabsContent value="events">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockEvents.map(e => (
                    <div key={e.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <EventTypeBadge type={e.type} />
                        <span className="text-xs text-muted-foreground">{e.attendees} attending</span>
                      </div>
                      <h3 className="text-sm font-semibold text-card-foreground mb-1">{e.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        <FontAwesomeIcon icon={faCalendarDays} className="mr-1" /> {e.date} · {e.time}
                        {e.speaker && <> · Speaker: <button onClick={() => { const member = mockMembers.find(m => m.name === e.speaker); if (member) setSelectedMember(member); }} className="font-medium text-slate-600 hover:text-primary transition-colors">{e.speaker}</button></>}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{e.description}</p>
                      <button className="mt-4 text-xs font-medium text-primary hover:underline">Register →</button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* ─── ABOUT TAB ─── */}
              <TabsContent value="about">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-serif font-semibold text-card-foreground mb-4">About this Community</h3>
                      <div className="prose-sm text-muted-foreground space-y-3 text-sm leading-relaxed">
                        <p>{community.description}</p>
                        <p>Our community brings together researchers, practitioners, and policymakers from across the professional services ecosystem. We believe that better research leads to better practice, and that the sector's challenges — from AI adoption to diversity, from regulatory change to measuring impact — demand collaborative, rigorous inquiry.</p>
                        <p>Members benefit from access to shared resources, peer review of working papers, networking with leading scholars and practitioners, and early access to CPSR events and publications.</p>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-serif font-semibold text-card-foreground mb-4">Community Rules</h3>
                      <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                        <li><span className="font-medium text-slate-700">Evidence first.</span> Support claims with citations, data, or clearly-labelled professional experience.</li>
                        <li><span className="font-medium text-slate-700">Respect methodological diversity.</span> Quantitative, qualitative, and mixed-methods approaches are all welcome.</li>
                        <li><span className="font-medium text-slate-700">Maintain confidentiality.</span> Do not share unpublished work or private discussions outside the community.</li>
                        <li><span className="font-medium text-slate-700">Engage constructively.</span> Critique ideas, not individuals. Disagreement is welcome when professional.</li>
                        <li><span className="font-medium text-slate-700">Declare interests.</span> If you have a commercial interest in a topic, state it clearly.</li>
                      </ol>
                    </div>
                  </div>
                  <aside className="space-y-5">
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                      <h3 className="text-sm font-semibold text-card-foreground mb-3">Community Details</h3>
                      <dl className="space-y-3 text-xs">
                        <div>
                          <dt className="text-muted-foreground">Location</dt>
                          <dd className="font-medium text-slate-700 flex items-center gap-1.5 mt-0.5"><FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" /> {community.location}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Founded</dt>
                          <dd className="font-medium text-slate-700 mt-0.5">{community.founded}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Website</dt>
                          <dd className="font-medium text-primary mt-0.5"><a href={`https://${community.website}`} className="hover:underline">{community.website}</a></dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Topics</dt>
                          <dd className="mt-1.5 flex flex-wrap gap-1.5">
                            {community.tags.map(t => <Badge key={t} variant="secondary" className="text-[10px] font-normal">{t}</Badge>)}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                      <h3 className="text-sm font-semibold text-card-foreground mb-3">Moderators</h3>
                      <div className="space-y-3">
                        {mockMembers.filter(m => m.badge === "founder" || m.badge === "moderator").map(m => (
                          <button key={m.id} onClick={() => setSelectedMember(m)} className="flex items-center gap-2.5 w-full text-left hover:bg-slate-50 rounded-md p-1 -m-1 transition-colors">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-medium">
                                {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center">
                                <span className="text-xs font-medium text-slate-700">{m.name}</span>
                                <BadgeIcon badge={m.badge} />
                              </div>
                              <span className="text-[11px] text-muted-foreground">{m.badge === "founder" ? "Founder" : "Moderator"}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </aside>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}

      {/* Member Profile Modal */}
      <MemberProfileModal member={selectedMember} open={!!selectedMember} onClose={() => setSelectedMember(null)} />

      {/* Footer */}
      <footer className="bg-footer-bg text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 font-light">
          &copy; 2026 Centre for Professional Services Research. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Community;
