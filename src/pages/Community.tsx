import { useState, useMemo, useRef, useEffect } from "react";
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
  faLayerGroup,
  faFilter,
  faStar,
  faUserPlus,
  faClock,
  faArrowRight,
  faUserShield,
  faTrashAlt,
  faBan,
  faCopy,
  faCheck,
  faChevronDown,
  faRightFromBracket,
  faPoll,
  faRepeat,
  faLock,
  faListAlt,
  faShareAlt,
  faHeart,
  faEye,
  faVials,
  faUserMinus,
  faFileExport,
  faHome,
  faSort,
  faThumbtack,
  faPen,
  faCalendar as faCalendarSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular, faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import cpsrLogo from "@/assets/cpsr-logo.jpg";
import communityBannerDefault from "@/assets/community-banner-default.jpg";
import { faCamera, faImage } from "@fortawesome/free-solid-svg-icons";
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
  posts?: number;
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
  repliesDisabled?: boolean;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  author: Member;
  items: Resource[];
  shared: boolean;
  createdDate: string;
  likes: number;
}

interface Resource {
  id: string;
  title: string;
  type: "paper" | "report" | "presentation" | "video" | "link";
  author: string;
  date: string;
  downloads?: number;
  likes?: number;
  description: string;
  url?: string;
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
  recurring?: "weekly" | "biweekly" | "monthly";
  nextOccurrences?: string[];
  city?: string;
  country?: string;
  eligible?: boolean;
}

interface Poll {
  id: string;
  question: string;
  options: { id: string; label: string; votes: number }[];
  totalVotes: number;
  author: Member;
  endsDate: string;
  tags: string[];
}

const mockMembers: Member[] = [
  { id: "1", name: "Prof. Sarah Mitchell", role: "Director of Research", firm: "London Business School", badge: "founder", joinedDate: "Jan 2025", expertise: ["Strategy", "Governance", "Leadership"], bio: "Sarah leads the Centre's research agenda on professional services governance and has published over 40 peer-reviewed papers. She previously served as a non-executive director at two FTSE 250 firms and is a Fellow of the Academy of Management.", email: "s.mitchell@lbs.ac.uk", linkedin: "sarahmitchell", publications: 43, posts: 28, location: "London, UK" },
  { id: "2", name: "Dr. James Hargreaves", role: "Senior Partner", firm: "Deloitte", badge: "moderator", joinedDate: "Feb 2025", expertise: ["Audit", "Risk Management", "AI in Assurance"], bio: "James combines 20 years of audit practice with academic research on technology-driven assurance. He chairs the CPSR working group on AI adoption in professional services and regularly advises regulators.", email: "jhargreaves@deloitte.co.uk", linkedin: "jameshargreaves", publications: 18, posts: 15, location: "London, UK" },
  { id: "3", name: "Emma Richardson", role: "Research Fellow", firm: "Oxford Saïd", badge: "contributor", joinedDate: "Mar 2025", expertise: ["Innovation", "Professional Services", "Diversity"], bio: "Emma's doctoral research at Saïd Business School examines diversity pipelines in Big Four firms. Her recent working paper on the 'frozen middle' has been cited by the FRC and featured in the Financial Times.", email: "emma.richardson@sbs.ox.ac.uk", linkedin: "emmarichardson", publications: 7, posts: 11, location: "Oxford, UK" },
  { id: "4", name: "Michael Chen", role: "Managing Director", firm: "McKinsey & Company", joinedDate: "Apr 2025", expertise: ["Consulting", "Transformation", "Impact Measurement"], bio: "Michael leads McKinsey's internal research function and is passionate about measuring and demonstrating consulting impact. He holds an MBA from Wharton and a PhD from MIT Sloan.", email: "michael_chen@mckinsey.com", linkedin: "michaelchen", publications: 12, posts: 9, location: "New York, US" },
  { id: "5", name: "Dr. Aisha Patel", role: "Associate Professor", firm: "Imperial College", badge: "contributor", joinedDate: "May 2025", expertise: ["Data Analytics", "AI in Services", "Machine Learning"], bio: "Aisha researches the application of machine learning techniques in professional services delivery. She co-leads Imperial's AI & Professional Services Lab and has secured £2.1M in UKRI funding.", email: "a.patel@imperial.ac.uk", linkedin: "aishapatel", publications: 29, posts: 19, location: "London, UK" },
  { id: "6", name: "Thomas Wright", role: "Partner", firm: "PwC", joinedDate: "Jun 2025", expertise: ["Tax", "Regulation", "Policy"], bio: "Thomas advises multinational firms on regulatory strategy and is a recognised authority on professional services regulation in the UK and EU. He sits on the Law Society's regulatory policy committee.", email: "thomas.wright@pwc.com", linkedin: "thomaswright", publications: 8, posts: 4, location: "London, UK" },
  { id: "7", name: "Dr. Claire Dubois", role: "Lecturer", firm: "INSEAD", joinedDate: "Sep 2025", expertise: ["Organisational Behaviour", "Culture", "Leadership Development"], bio: "Claire's research explores organisational culture in global professional services firms, with particular focus on cross-cultural leadership challenges. She previously worked at Bain & Company in Paris.", email: "claire.dubois@insead.edu", linkedin: "clairedubois", publications: 15, posts: 7, location: "Fontainebleau, France" },
  { id: "8", name: "Robert Kimani", role: "Principal", firm: "BCG", joinedDate: "Nov 2025", expertise: ["Digital", "Operations", "Emerging Markets"], bio: "Robert leads BCG's Africa practice and researches the growth of professional services in emerging markets. He is a regular contributor to Harvard Business Review and sits on the board of the African Management Institute.", email: "kimani.robert@bcg.com", linkedin: "robertkimani", publications: 11, posts: 3, location: "Nairobi, Kenya" },
];

const mockDiscussions: Discussion[] = [
  {
    id: "1", pinned: true,
    title: "Welcome to the Professional Services Research Community",
    author: mockMembers[0],
    content: "Welcome to all new members. This community is dedicated to advancing rigorous, evidence-based research across the professional services sector. Please introduce yourselves and share your research interests.",
    date: "15 Feb 2026", replies: 24, likes: 47, tags: ["Welcome", "Community"],
    repliesDisabled: true,
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
    repliesDisabled: true,
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
  { id: "1", title: "Professional Services Research Methods Handbook (2026 Edition)", type: "paper", author: "Prof. Sarah Mitchell et al.", date: "Jan 2026", downloads: 342, likes: 56, description: "Comprehensive guide to research methodologies specific to studying professional service firms." },
  { id: "2", title: "AI Adoption in Audit: A Systematic Review", type: "report", author: "Dr. James Hargreaves", date: "Feb 2026", downloads: 189, likes: 38, description: "Systematic review of 152 papers on AI adoption patterns in audit firms across 18 jurisdictions." },
  { id: "3", title: "CPSR Annual Conference 2025 — Keynote Recordings", type: "video", author: "CPSR", date: "Dec 2025", downloads: 94, likes: 21, description: "Full recordings of all keynote presentations from the 2025 annual conference." },
  { id: "4", title: "Diversity Pipeline Analysis: Methodology & Dataset", type: "paper", author: "Emma Richardson", date: "Mar 2026", downloads: 67, likes: 15, description: "Open-access dataset and methodology documentation for the Big Four diversity pipeline study." },
  { id: "5", title: "Regulatory Landscape for Professional Services (EU & UK)", type: "link", author: "Thomas Wright", date: "Mar 2026", likes: 9, description: "Living document tracking regulatory changes affecting professional services in Europe." },
];

const mockEvents: Event[] = [
  { id: "1", title: "Mixed-Methods Research Design Workshop", date: "28 Mar 2026", time: "14:00 GMT", type: "workshop", attendees: 32, description: "Half-day workshop on applying mixed-methods approaches to professional services research.", speaker: "Prof. Sarah Mitchell", city: "London", country: "United Kingdom", eligible: true },
  { id: "2", title: "AI in Professional Services — Monthly Webinar", date: "10 Apr 2026", time: "12:00 BST", type: "webinar", attendees: 78, description: "Monthly discussion on the latest developments in AI across consulting, audit, and legal services.", speaker: "Dr. Aisha Patel", recurring: "monthly", nextOccurrences: ["8 May 2026", "12 Jun 2026", "10 Jul 2026"], eligible: true },
  { id: "3", title: "CPSR Spring Research Symposium", date: "15 May 2026", time: "09:00 BST", type: "conference", attendees: 120, description: "Full-day symposium featuring 20 paper presentations and 3 panel discussions on current research.", city: "Edinburgh", country: "United Kingdom", eligible: false },
  { id: "4", title: "London Meetup: Emerging Researchers Network", date: "22 Apr 2026", time: "18:30 BST", type: "meetup", attendees: 25, description: "Informal networking event for early-career researchers studying professional services.", city: "London", country: "United Kingdom", eligible: true },
  { id: "5", title: "Weekly Research Round-Up — Live Session", date: "Every Friday", time: "16:00 BST", type: "webinar", attendees: 45, description: "A weekly 30-minute live session where members share research updates, ask questions, and discuss trending topics in professional services.", speaker: "Prof. Sarah Mitchell", recurring: "weekly", nextOccurrences: ["14 Mar 2026", "21 Mar 2026", "28 Mar 2026", "4 Apr 2026"], eligible: true },
  { id: "6", title: "Peer Review Circle — Fortnightly Feedback Session", date: "Every other Tuesday", time: "11:00 BST", type: "workshop", attendees: 18, description: "Bring your draft papers and working documents for constructive peer review in a supportive, structured session.", recurring: "biweekly", nextOccurrences: ["18 Mar 2026", "1 Apr 2026", "15 Apr 2026"], city: "Manchester", country: "United Kingdom", eligible: true },
];

const mockPolls: Poll[] = [
  {
    id: "p1",
    question: "What should be the focus of our next research workshop?",
    options: [
      { id: "o1", label: "AI governance in professional services", votes: 34 },
      { id: "o2", label: "Measuring consulting impact", votes: 28 },
      { id: "o3", label: "Diversity & inclusion metrics", votes: 19 },
      { id: "o4", label: "Cross-border regulatory challenges", votes: 12 },
    ],
    totalVotes: 93,
    author: mockMembers[0],
    endsDate: "20 Mar 2026",
    tags: ["Research", "Workshop"],
  },
  {
    id: "p2",
    question: "Preferred time for the weekly live session?",
    options: [
      { id: "o5", label: "Fridays 12:00 BST", votes: 22 },
      { id: "o6", label: "Fridays 16:00 BST", votes: 31 },
      { id: "o7", label: "Thursdays 14:00 BST", votes: 15 },
    ],
    totalVotes: 68,
    author: mockMembers[1],
    endsDate: "15 Mar 2026",
    tags: ["Events", "Scheduling"],
  },
  {
    id: "p3",
    question: "Should we open the community to undergraduate researchers?",
    options: [
      { id: "o8", label: "Yes, fully open", votes: 14 },
      { id: "o9", label: "Yes, with mentor pairing", votes: 41 },
      { id: "o10", label: "No, postgraduate and above only", votes: 23 },
    ],
    totalVotes: 78,
    author: mockMembers[0],
    endsDate: "25 Mar 2026",
    tags: ["Membership", "Policy"],
  },
];

const mockPlaylists: Playlist[] = [
  {
    id: "pl1",
    name: "AI & Professional Services — Essential Reading",
    description: "A curated collection of the most impactful papers and resources on AI adoption across consulting, audit, and legal services.",
    author: mockMembers[1],
    items: [mockResources[1], mockResources[0], mockResources[2]],
    shared: true,
    createdDate: "Feb 2026",
    likes: 34,
  },
  {
    id: "pl2",
    name: "Diversity Research Collection",
    description: "Key papers and datasets examining diversity, equity, and inclusion in professional services leadership.",
    author: mockMembers[2],
    items: [mockResources[3], mockResources[0]],
    shared: true,
    createdDate: "Mar 2026",
    likes: 19,
  },
  {
    id: "pl3",
    name: "Regulatory Watch — EU & UK",
    description: "Living collection tracking regulatory changes and analysis relevant to professional services firms.",
    author: mockMembers[5],
    items: [mockResources[4], mockResources[1]],
    shared: true,
    createdDate: "Mar 2026",
    likes: 12,
  },
];

interface WorkingGroup {
  id: string;
  name: string;
  description: string;
  avatar: string;
  members: Member[];
  discussions: number;
  resources: number;
  lastActive: string;
  tags: string[];
  lead: Member;
  formed: string;
}

const mockWorkingGroups: WorkingGroup[] = [
  {
    id: "ai-in-audit",
    name: "AI in Audit & Assurance",
    description: "Examining how artificial intelligence is transforming audit methodologies, regulatory frameworks, and assurance quality across the profession.",
    avatar: "AIA",
    members: [mockMembers[1], mockMembers[4], mockMembers[0], mockMembers[5]],
    discussions: 23,
    resources: 11,
    lastActive: "2 hours ago",
    tags: ["AI", "Audit", "Regulation", "Technology"],
    lead: mockMembers[1],
    formed: "Feb 2025",
  },
  {
    id: "diversity-research",
    name: "Diversity Research Initiative",
    description: "Collaborative research programme tracking diversity, equity and inclusion metrics across professional services firms globally.",
    avatar: "DRI",
    members: [mockMembers[2], mockMembers[0], mockMembers[6], mockMembers[3]],
    discussions: 15,
    resources: 8,
    lastActive: "Yesterday",
    tags: ["Diversity", "Inclusion", "Research", "Big Four"],
    lead: mockMembers[2],
    formed: "Mar 2025",
  },
  {
    id: "consulting-impact",
    name: "Measuring Consulting Impact",
    description: "Developing rigorous frameworks and methodologies for measuring and demonstrating the value and impact of management consulting engagements.",
    avatar: "MCI",
    members: [mockMembers[3], mockMembers[7], mockMembers[0]],
    discussions: 18,
    resources: 6,
    lastActive: "3 days ago",
    tags: ["Consulting", "Impact", "Methodology", "Transparency"],
    lead: mockMembers[3],
    formed: "May 2025",
  },
  {
    id: "emerging-markets",
    name: "Professional Services in Emerging Markets",
    description: "Studying the growth, challenges, and opportunities for professional services firms operating in Africa, Asia, and Latin America.",
    avatar: "EM",
    members: [mockMembers[7], mockMembers[6], mockMembers[4]],
    discussions: 9,
    resources: 4,
    lastActive: "1 week ago",
    tags: ["Emerging Markets", "Growth", "Africa", "Asia"],
    lead: mockMembers[7],
    formed: "Sep 2025",
  },
];

// ─── Mock Activity Feed ──────────────────────────────────────

interface ActivityItem {
  id: string;
  type: "post" | "reply" | "join" | "resource" | "event";
  actor: Member;
  target?: string;
  timestamp: string;
  read: boolean;
}

const mockActivity: ActivityItem[] = [
  { id: "a1", type: "post", actor: mockMembers[1], target: "The evolving role of AI in audit and assurance", timestamp: "2 hours ago", read: false },
  { id: "a2", type: "reply", actor: mockMembers[2], target: "Welcome to the Professional Services Research Community", timestamp: "4 hours ago", read: false },
  { id: "a3", type: "resource", actor: mockMembers[4], target: "AI Adoption in Audit: A Systematic Review", timestamp: "Yesterday", read: false },
  { id: "a4", type: "join", actor: mockMembers[7], timestamp: "Yesterday", read: true },
  { id: "a5", type: "event", actor: mockMembers[0], target: "Mixed-Methods Research Design Workshop", timestamp: "2 days ago", read: true },
  { id: "a6", type: "reply", actor: mockMembers[3], target: "Transparency in consulting: are clients getting what they pay for?", timestamp: "3 days ago", read: true },
];

// ─── Mock Replies for Discussion Threading ───────────────────

interface Reply {
  id: string;
  author: Member;
  content: string;
  date: string;
  likes: number;
  parentId?: string;
}

const mockReplies: Record<string, Reply[]> = {
  "1": [
    { id: "r1", author: mockMembers[1], content: "Thank you Sarah. Excited to be part of this community. My primary interest is in how AI is reshaping audit methodology — looking forward to cross-pollinating ideas with researchers from other disciplines.", date: "15 Feb 2026", likes: 12 },
    { id: "r2", author: mockMembers[2], content: "Great to be here! I'm currently working on diversity metrics in Big Four leadership pipelines and would love to connect with others studying organisational culture in professional services.", date: "16 Feb 2026", likes: 8 },
    { id: "r3", author: mockMembers[3], content: "Michael Chen here from McKinsey. Very much looking forward to collaborative research on measuring consulting impact. This community fills a real gap.", date: "16 Feb 2026", likes: 15, parentId: "r1" },
    { id: "r4", author: mockMembers[4], content: "Hello everyone. My focus is on AI and machine learning applications in professional services. Happy to share our lab's latest working papers with the community.", date: "17 Feb 2026", likes: 9 },
    { id: "r5", author: mockMembers[6], content: "Bonjour from INSEAD! I research organisational culture in global PS firms. Would love to collaborate on cross-cultural leadership studies.", date: "18 Feb 2026", likes: 6, parentId: "r2" },
  ],
  "2": [
    { id: "r6", author: mockMembers[4], content: "James, we've been developing a framework at Imperial for evaluating AI readiness in audit firms. Happy to present at the next webinar if useful.", date: "4 Mar 2026", likes: 18 },
    { id: "r7", author: mockMembers[5], content: "From a regulatory perspective, the FRC is watching this space closely. I can share some insights on what they're considering for guidance.", date: "4 Mar 2026", likes: 14 },
    { id: "r8", author: mockMembers[0], content: "Excellent contributions. I'd suggest we formalise this into a working paper — there's clearly enough expertise in this group to produce something impactful.", date: "5 Mar 2026", likes: 22, parentId: "r6" },
  ],
  "3": [
    { id: "r9", author: mockMembers[0], content: "Fascinating research, Emma. The 'frozen middle' concept resonates with what we've seen in our governance studies. Would you consider presenting this at the Spring Symposium?", date: "3 Mar 2026", likes: 11 },
    { id: "r10", author: mockMembers[6], content: "The cross-cultural dimension of this is really interesting. In my research at INSEAD, I've found similar patterns in French and German professional services firms.", date: "4 Mar 2026", likes: 7 },
  ],
  "5": [
    { id: "r11", author: mockMembers[0], content: "This is perhaps the central question for consulting as a profession. I'd be keen to co-author a review paper on existing impact measurement frameworks.", date: "26 Feb 2026", likes: 19 },
    { id: "r12", author: mockMembers[7], content: "In emerging markets, this question is even more acute. Clients often have fewer benchmarks to evaluate consulting value. We need culturally-informed frameworks.", date: "26 Feb 2026", likes: 13 },
    { id: "r13", author: mockMembers[1], content: "There are parallels with audit quality indicators. The profession went through a similar transparency journey. Happy to share lessons learned.", date: "27 Feb 2026", likes: 16, parentId: "r11" },
  ],
};

// Collect all unique discussion tags
const allDiscussionTags = Array.from(new Set(mockDiscussions.flatMap(d => d.tags))).sort();

const communityData = {
  "prof-services-research": {
    name: "Professional Services Research",
    description: "A community dedicated to advancing rigorous, evidence-based research across the professional services sector. We bring together academics, practitioners, and policymakers to champion transparency, methodological excellence, and impactful collaboration.",
    members: 247,
    researchPanelMembers: 42,
    discussions: 89,
    resources: 34,
    events: 5,
    tags: ["Research", "Professional Services", "Methods", "Governance"],
    location: "Global",
    founded: "January 2025",
    website: "cpsr.uk",
    governance: {
      membership: "approval",
      postReview: "criteria",
      contentReview: "all",
      inviteExpiry: 90,
    } as { membership: string; postReview: string; contentReview: string; inviteExpiry: number },
    rules: [
      { title: "Original research only.", detail: "All shared papers and reports must be original work or have proper permissions from the rights holder." },
      { title: "No promotional content.", detail: "Posts advertising products, services, or events without prior manager approval will be removed." },
      { title: "Cite your sources.", detail: "When referencing external data, always include a link or full citation so others can verify." },
      { title: "Peer review encouraged.", detail: "Members are encouraged to offer constructive feedback on draft papers shared in the Resources tab." },
      { title: "Chatham House Rule applies.", detail: "Participants may use information received, but the identity of the speaker may not be revealed outside the community." },
    ],
  },
};

// ─── Sub-components ──────────────────────────────────────────

/** Get initials from a name, skipping titles like Dr., Prof., etc. */
const getInitials = (name: string): string => {
  const titles = new Set(["dr.", "dr", "prof.", "prof", "mr.", "mr", "mrs.", "mrs", "ms.", "ms", "sir"]);
  const parts = name.split(" ").filter(n => !titles.has(n.toLowerCase()));
  return parts.map(n => n[0]).join("").slice(0, 2);
};

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
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [threadReplies, setThreadReplies] = useState<Record<string, Reply[]>>({});
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<Reply | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Leave community state
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  // Poll voting state
  const [pollVotes, setPollVotes] = useState<Record<string, string>>({});

  // Playlist state
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDesc, setNewPlaylistDesc] = useState("");
  const [newPlaylistItems, setNewPlaylistItems] = useState<string[]>([]);
  const [viewPlaylistId, setViewPlaylistId] = useState<string | null>(null);
  // Research panel state
  const [isInResearchPanel, setIsInResearchPanel] = useState(false);
  // Resource state
  const [communityResources, setCommunityResources] = useState<Resource[]>(mockResources);
  const [showAddResource, setShowAddResource] = useState(false);
  const [playlistEnabledResources, setPlaylistEnabledResources] = useState<Set<string>>(new Set());
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [newResourceType, setNewResourceType] = useState<Resource["type"]>("link");
  const [newResourceUrl, setNewResourceUrl] = useState("");
  const [newResourceAuthor, setNewResourceAuthor] = useState("");
  const [newResourceDate, setNewResourceDate] = useState("");
  const [newResourceDesc, setNewResourceDesc] = useState("");
  // Member action menu in admin
  const [memberMenuOpen, setMemberMenuOpen] = useState<string | null>(null);

  type ViewRole = "member" | "manager" | "hq";
  const [viewRole, setViewRole] = useState<ViewRole>("hq");
  const isAdmin = viewRole === "manager" || viewRole === "hq";
  const isHQ = viewRole === "hq";
  const [inviteEmail, setInviteEmail] = useState("");
  const [bulkEmails, setBulkEmails] = useState("");
  const [showBulkInvite, setShowBulkInvite] = useState(false);
  const [bulkInviteSent, setBulkInviteSent] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [memberRoles, setMemberRoles] = useState<Record<string, string>>(
    Object.fromEntries(mockMembers.map(m => [m.id, m.badge || "member"]))
  );
  const [roleDropdownOpen, setRoleDropdownOpen] = useState<string | null>(null);
  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const [adminFilterRole, setAdminFilterRole] = useState<string>("all");
  const [adminFilterExpertise, setAdminFilterExpertise] = useState<string>("all");
  const [confirmRemove, setConfirmRemove] = useState<Member | null>(null);
  const [removedMembers, setRemovedMembers] = useState<Set<string>>(new Set());
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // Enhanced admin state
  const [adminStatusTab, setAdminStatusTab] = useState<"members" | "management" | "invited" | "requested" | "blocked">("members");
  const [adminFilterFirm, setAdminFilterFirm] = useState("all");
  const [adminFilterCountry, setAdminFilterCountry] = useState("all");
  const [adminFilterCity, setAdminFilterCity] = useState("all");
  const [adminPage, setAdminPage] = useState(1);
  const [adminPerPage, setAdminPerPage] = useState(10);
  const [adminSelected, setAdminSelected] = useState<Set<string>>(new Set());
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactFirstName, setNewContactFirstName] = useState("");
  const [newContactLastName, setNewContactLastName] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactFirm, setNewContactFirm] = useState("");
  const [newContactCity, setNewContactCity] = useState("");
  const [newContactCountry, setNewContactCountry] = useState("");
  const [newContactJobTitle, setNewContactJobTitle] = useState("");
  const [showExpiredInvites, setShowExpiredInvites] = useState(false);
  const [showAddedByManagement, setShowAddedByManagement] = useState(false);
  const [showResearchPanelMembers, setShowResearchPanelMembers] = useState(false);
  const [researchPanelMemberIds, setResearchPanelMemberIds] = useState<Set<string>>(new Set(["1", "3", "5"]));
  // Multiple status tabs selected (checkboxes)
  const [adminStatusChecked, setAdminStatusChecked] = useState<Set<string>>(new Set(["members"]));

  // Add Event state
  const [showAddEvent, setShowAddEvent] = useState(false);
  // Manage community details state
  const [showManageDetails, setShowManageDetails] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventType, setNewEventType] = useState<Event["type"]>("webinar");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventSpeaker, setNewEventSpeaker] = useState("");
  const [newEventRecurring, setNewEventRecurring] = useState<"" | "weekly" | "biweekly" | "monthly">("");
  const [communityEvents, setCommunityEvents] = useState<Event[]>(mockEvents);
  const [eventRegistrations, setEventRegistrations] = useState<Set<string>>(new Set());
  const [eventSearch, setEventSearch] = useState("");
  const [eventSort, setEventSort] = useState<"name" | "presenter" | "date" | "delegates" | "city" | "country">("date");
  const [eventSortDir, setEventSortDir] = useState<"asc" | "desc">("asc");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const [eventStatusFilter, setEventStatusFilter] = useState<string>("all");

  // Discussion sort/search state
  const [discussionSearch, setDiscussionSearch] = useState("");
  const [discussionSort, setDiscussionSort] = useState<"date" | "name" | "author" | "pinned" | "replies" | "likes">("date");
  const [discussionSortDir, setDiscussionSortDir] = useState<"asc" | "desc">("desc");
  const [pinnedDiscussions, setPinnedDiscussions] = useState<Set<string>>(new Set(mockDiscussions.filter(d => d.pinned).map(d => d.id)));

  // Resource sort/search/pin state
  const [resourceSearch, setResourceSearch] = useState("");
  const [resourceSort, setResourceSort] = useState<"date" | "name" | "author" | "downloads" | "pinned" | "likes">("date");
  const [resourceSortDir, setResourceSortDir] = useState<"asc" | "desc">("desc");
  const [pinnedResources, setPinnedResources] = useState<Set<string>>(new Set());
  const [resourceLikes, setResourceLikes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    mockResources.forEach(r => { initial[r.id] = r.likes || 0; });
    return initial;
  });
  const [likedResources, setLikedResources] = useState<Set<string>>(new Set());

  // Playlist search/sort state
  const [playlistSearch, setPlaylistSearch] = useState("");
  const [playlistSort, setPlaylistSort] = useState<"name" | "curator" | "date" | "likes">("date");
  const [playlistSortDir, setPlaylistSortDir] = useState<"asc" | "desc">("desc");

  // Members tab sort/search state
  // Groups tab state
  const [groupSearch, setGroupSearch] = useState("");
  const [groupSort, setGroupSort] = useState<"name" | "leader" | "formed" | "activity" | "members">("name");
  const [groupSortDir, setGroupSortDir] = useState<"asc" | "desc">("asc");
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set(["ai-in-audit"]));
  const [viewingGroup, setViewingGroup] = useState<WorkingGroup | null>(null);
  const [memberSearch, setMemberSearch] = useState("");
  const [memberSort, setMemberSort] = useState<"name" | "firm" | "posts" | "role" | "joined">("name");
  const [memberSortDir, setMemberSortDir] = useState<"asc" | "desc">("asc");

  // MM playlist import state
  const [selectedMMPlaylist, setSelectedMMPlaylist] = useState("");

  // Admin independent checkboxes
  const [adminShowMembers, setAdminShowMembers] = useState(true);
  const [adminShowManagement, setAdminShowManagement] = useState(true);
  const [adminShowInvited, setAdminShowInvited] = useState(true);
  const [adminShowRequested, setAdminShowRequested] = useState(true);
  const [adminShowBlocked, setAdminShowBlocked] = useState(true);
  const [adminShowProspects, setAdminShowProspects] = useState(true);
  const [bulkUploadCount, setBulkUploadCount] = useState(0);
  const [prospectContacts, setProspectContacts] = useState<(Member & { _source?: string })[]>([]);
  const [communityIcon, setCommunityIcon] = useState<string | null>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) return; // 500KB limit
    const reader = new FileReader();
    reader.onload = (ev) => setCommunityIcon(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const allExpertise = useMemo(() => Array.from(new Set(mockMembers.flatMap(m => m.expertise))).sort(), []);
  const allFirms = useMemo(() => Array.from(new Set(mockMembers.map(m => m.firm))).sort(), []);
  const allCountries = useMemo(() => Array.from(new Set(mockMembers.map(m => m.location?.split(", ").pop()).filter(Boolean) as string[])).sort(), []);
  const citiesByCountry = useMemo(() => {
    const map: Record<string, string[]> = {};
    mockMembers.forEach(m => {
      if (!m.location) return;
      const parts = m.location.split(", ");
      if (parts.length >= 2) {
        const country = parts[parts.length - 1];
        const city = parts.slice(0, -1).join(", ");
        if (!map[country]) map[country] = [];
        if (!map[country].includes(city)) map[country].push(city);
      }
    });
    Object.values(map).forEach(arr => arr.sort());
    return map;
  }, []);
  const allCities = useMemo(() => {
    if (adminFilterCountry === "all") return Array.from(new Set(mockMembers.map(m => m.location?.split(", ").slice(0, -1).join(", ")).filter(Boolean) as string[])).sort();
    return citiesByCountry[adminFilterCountry] || [];
  }, [adminFilterCountry, citiesByCountry]);

  // Mock invited/requested/blocked members
  const mockInvited = useMemo(() => [
    { id: "inv1", name: "Dr. Laura Stevens", role: "Professor", firm: "Cambridge Judge", joinedDate: "Invited 1 Mar 2026", location: "Cambridge, UK", expertise: ["Strategy"], email: "l.stevens@jbs.cam.ac.uk", expired: false },
    { id: "inv2", name: "Mark Thompson", role: "Director", firm: "EY", joinedDate: "Invited 25 Feb 2026", location: "London, UK", expertise: ["Tax", "Advisory"], email: "mark.thompson@ey.com", expired: true },
    { id: "inv3", name: "Sarah Coleman", role: "Independent Consultant", firm: "", joinedDate: "Invited 10 Jan 2026", location: "Manchester, UK", expertise: ["Change Management"], email: "sarah@colemanconsulting.co.uk", expired: true },
  ] as (Member & { expired?: boolean })[], []);
  const mockRequested = useMemo(() => [
    { id: "req1", name: "Yuki Tanaka", role: "Researcher", firm: "Waseda University", joinedDate: "Requested 4 Mar 2026", location: "Tokyo, Japan", expertise: ["Innovation"], email: "y.tanaka@waseda.jp" },
  ] as Member[], []);
  const mockBlocked = useMemo(() => [
    { id: "blk1", name: "Spam Account", role: "Unknown", firm: "N/A", joinedDate: "Blocked 20 Feb 2026", location: "Unknown", expertise: [], email: "spam@example.com" },
  ] as Member[], []);

  // Mock Marketplace Management playlists
  const mockMMPlaylists = useMemo(() => [
    { id: "mm1", name: "Professional Services Strategy Toolkit", items: [
      { id: "mm-r1", title: "Strategy Frameworks for PS Firms", type: "paper" as const, author: "CPSR HQ", date: "Jan 2026", description: "Core strategy frameworks." },
      { id: "mm-r2", title: "Client Relationship Management Guide", type: "report" as const, author: "CPSR HQ", date: "Feb 2026", description: "Best practices for managing client relationships." },
    ]},
    { id: "mm2", name: "Research Methods Collection", items: [
      { id: "mm-r3", title: "Qualitative Research in Professional Services", type: "paper" as const, author: "Prof. Sarah Mitchell", date: "Dec 2025", description: "Guide to qualitative methods." },
      { id: "mm-r4", title: "Survey Design for PS Research", type: "report" as const, author: "Dr. Claire Dubois", date: "Nov 2025", description: "Practical survey design." },
    ]},
    { id: "mm3", name: "Governance & Compliance Pack", items: [
      { id: "mm-r5", title: "FRC Governance Standards 2026", type: "link" as const, author: "Financial Reporting Council", date: "Mar 2026", description: "Latest FRC governance standards." },
    ]},
  ], []);

  const adminStatusMembers = useMemo(() => {
    const combined: (Member & { _source?: string })[] = [];
    const seenIds = new Set<string>();
    if (adminShowMembers) {
      mockMembers.filter(m => !removedMembers.has(m.id)).forEach(m => {
        if (!seenIds.has(m.id)) { seenIds.add(m.id); combined.push({ ...m, _source: "members" }); }
      });
    }
    if (adminShowManagement) {
      mockMembers.filter(m => !removedMembers.has(m.id) && (memberRoles[m.id] === "founder" || memberRoles[m.id] === "moderator")).forEach(m => {
        if (!seenIds.has(m.id)) { seenIds.add(m.id); combined.push({ ...m, _source: "management" }); }
      });
    }
    if (adminShowInvited) {
      mockInvited.forEach(m => {
        if (!seenIds.has(m.id)) { seenIds.add(m.id); combined.push({ ...m, _source: "invited" }); }
      });
    }
    if (adminShowProspects) {
      prospectContacts.forEach(m => {
        if (!seenIds.has(m.id)) { seenIds.add(m.id); combined.push({ ...m, _source: "prospect" }); }
      });
    }
    if (false) { // Requested contacts hidden — reserved for future use
      mockRequested.forEach(m => {
        if (!seenIds.has(m.id)) { seenIds.add(m.id); combined.push({ ...m, _source: "requested" }); }
      });
    }
    if (adminShowBlocked) {
      mockBlocked.forEach(m => {
        if (!seenIds.has(m.id)) { seenIds.add(m.id); combined.push({ ...m, _source: "blocked" }); }
      });
    }
    return combined;
  }, [adminShowMembers, adminShowManagement, adminShowInvited, adminShowProspects, adminShowRequested, adminShowBlocked, removedMembers, memberRoles, mockInvited, mockRequested, mockBlocked, prospectContacts]);

  const filteredAdminMembers = useMemo(() => {
    return adminStatusMembers.filter(m => {
      // Hide expired invites unless "Show expired invites" is checked
      if ((m as any)._source === "invited" && !showExpiredInvites && (m as any).expired) return false;
      const q = adminSearchQuery.toLowerCase();
      const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.firm.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q);
      const matchesRole = adminFilterRole === "all" || memberRoles[m.id] === adminFilterRole;
      const matchesFirm = adminFilterFirm === "all" || m.firm === adminFilterFirm;
      const matchesCountry = adminFilterCountry === "all" || (m.location && m.location.endsWith(adminFilterCountry));
      const matchesCity = adminFilterCity === "all" || (m.location && m.location.startsWith(adminFilterCity));
      const matchesLocation = matchesCountry && matchesCity;
      const matchesExpertise = adminFilterExpertise === "all" || m.expertise.includes(adminFilterExpertise);
      const matchesResearchPanel = !showResearchPanelMembers || researchPanelMemberIds.has(m.id);
      return matchesSearch && matchesRole && matchesFirm && matchesLocation && matchesExpertise && matchesResearchPanel;
    });
  }, [adminSearchQuery, adminFilterRole, adminFilterExpertise, adminFilterFirm, adminFilterCountry, adminFilterCity, adminStatusMembers, memberRoles, showExpiredInvites, showResearchPanelMembers, researchPanelMemberIds]);

  // Sorted members for Members tab
  const sortedMembers = useMemo(() => {
    let list = [...mockMembers];
    if (memberSearch.trim()) {
      const q = memberSearch.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q) || m.firm.toLowerCase().includes(q));
    }
    const monthOrder: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const parseJoinedDate = (d: string) => {
      const parts = d.split(" ");
      const month = monthOrder[parts[0]] ?? 0;
      const year = parseInt(parts[1] || "2025", 10);
      return year * 12 + month;
    };
    const sortFn = (a: Member, b: Member) => {
      let cmp = 0;
      if (memberSort === "name") {
        const aLast = a.name.split(" ").slice(-1)[0];
        const bLast = b.name.split(" ").slice(-1)[0];
        cmp = aLast.localeCompare(bLast);
      } else if (memberSort === "firm") cmp = a.firm.localeCompare(b.firm);
      else if (memberSort === "role") cmp = a.role.localeCompare(b.role);
      else if (memberSort === "joined") cmp = parseJoinedDate(a.joinedDate) - parseJoinedDate(b.joinedDate);
      else if (memberSort === "posts") cmp = (a.posts || 0) - (b.posts || 0);
      return memberSortDir === "asc" ? cmp : -cmp;
    };
    list.sort(sortFn);
    return list;
  }, [memberSearch, memberSort, memberSortDir]);

  const adminTotalPages = Math.max(1, Math.ceil(filteredAdminMembers.length / adminPerPage));
  const paginatedAdminMembers = filteredAdminMembers.slice((adminPage - 1) * adminPerPage, adminPage * adminPerPage);

  const toggleAdminSelect = (id: string) => {
    setAdminSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const invitedOnPage = paginatedAdminMembers.filter(m => (m as any)._source === "invited" || (m as any)._source === "prospect");
  const toggleSelectAll = () => {
    if (adminSelected.size === invitedOnPage.length && invitedOnPage.length > 0) {
      setAdminSelected(new Set());
    } else {
      setAdminSelected(new Set(invitedOnPage.map(m => m.id)));
    }
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    setInviteSent(true);
    setTimeout(() => { setInviteSent(false); setInviteEmail(""); }, 2500);
  };

  const parseBulkEmails = (text: string) => {
    return text.split(/[\n,;]+/).map(e => e.trim()).filter(e => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  };

  const handleBulkInvite = () => {
    const emails = parseBulkEmails(bulkEmails);
    if (emails.length === 0) return;
    setBulkInviteSent(true);
    setTimeout(() => { setBulkInviteSent(false); setBulkEmails(""); setShowBulkInvite(false); }, 3000);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const emails = text.split(/[\n,;]+/).map(l => l.trim()).filter(l => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l));
      setBulkEmails(prev => prev ? prev + "\n" + emails.join("\n") : emails.join("\n"));
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://cpsr.uk/community/prof-services-research/invite?token=abc123`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleChangeRole = (memberId: string, newRole: string) => {
    setMemberRoles(prev => ({ ...prev, [memberId]: newRole }));
    setRoleDropdownOpen(null);
  };

  const handleRemoveMember = (member: Member) => {
    setRemovedMembers(prev => new Set(prev).add(member.id));
    setConfirmRemove(null);
  };

  // Close role dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleLike = (itemId: string) => {
    setLikedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const handleSubmitReply = () => {
    if (!replyText.trim() || !selectedDiscussion) return;
    const newReply: Reply = {
      id: `user-${Date.now()}`,
      author: { id: "self", name: "Richard Chaplin", role: "Managing Director", firm: "PM Intelligence", joinedDate: "Jan 2025", expertise: ["Strategy", "Governance"] },
      content: replyText.trim(),
      date: "Just now",
      likes: 0,
      parentId: replyingTo?.id,
    };
    setThreadReplies(prev => ({
      ...prev,
      [selectedDiscussion.id]: [...(prev[selectedDiscussion.id] || []), newReply],
    }));
    setReplyText("");
    setReplyingTo(null);
  };

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDiscussions = useMemo(() => {
    let list = [...mockDiscussions];
    // Tag filter
    if (selectedTag) list = list.filter(d => d.tags.includes(selectedTag));
    // Search filter
    if (discussionSearch.trim()) {
      const q = discussionSearch.toLowerCase();
      list = list.filter(d => d.title.toLowerCase().includes(q) || d.author.name.toLowerCase().includes(q) || d.date.toLowerCase().includes(q));
    }
    // Sort
    if (discussionSort === "pinned") {
      // Pinned first, then unpinned
      const pinned = list.filter(d => pinnedDiscussions.has(d.id));
      const unpinned = list.filter(d => !pinnedDiscussions.has(d.id));
      return discussionSortDir === "asc" ? [...pinned, ...unpinned] : [...unpinned, ...pinned];
    }
    // For other sorts, pinned still float to top
    const pinned = list.filter(d => pinnedDiscussions.has(d.id));
    const unpinned = list.filter(d => !pinnedDiscussions.has(d.id));
    const sortFn = (a: Discussion, b: Discussion) => {
      let cmp = 0;
      if (discussionSort === "name") cmp = a.title.localeCompare(b.title);
      else if (discussionSort === "author") cmp = a.author.name.localeCompare(b.author.name);
      else if (discussionSort === "replies") cmp = a.replies - b.replies;
      else if (discussionSort === "likes") cmp = a.likes - b.likes;
      else cmp = new Date(b.date).getTime() - new Date(a.date).getTime();
      return discussionSortDir === "asc" ? -cmp : cmp;
    };
    pinned.sort(sortFn);
    unpinned.sort(sortFn);
    return [...pinned, ...unpinned];
  }, [selectedTag, discussionSearch, discussionSort, discussionSortDir, pinnedDiscussions]);

  // Sorted/filtered resources
  const sortedResources = useMemo(() => {
    let list = [...communityResources];
    if (resourceSearch.trim()) {
      const q = resourceSearch.toLowerCase();
      list = list.filter(r => r.title.toLowerCase().includes(q) || r.author.toLowerCase().includes(q) || r.date.toLowerCase().includes(q));
    }
    if (resourceSort === "pinned") {
      const pinned = list.filter(r => pinnedResources.has(r.id));
      const unpinned = list.filter(r => !pinnedResources.has(r.id));
      return resourceSortDir === "asc" ? [...pinned, ...unpinned] : [...unpinned, ...pinned];
    }
    const pinned = list.filter(r => pinnedResources.has(r.id));
    const unpinned = list.filter(r => !pinnedResources.has(r.id));
    const sortFn = (a: Resource, b: Resource) => {
      let cmp = 0;
      if (resourceSort === "name") cmp = a.title.localeCompare(b.title);
      else if (resourceSort === "author") cmp = a.author.localeCompare(b.author);
      else if (resourceSort === "downloads") cmp = (a.downloads || 0) - (b.downloads || 0);
      else if (resourceSort === "likes") cmp = (resourceLikes[a.id] || 0) - (resourceLikes[b.id] || 0);
      else cmp = new Date(b.date).getTime() - new Date(a.date).getTime();
      return resourceSortDir === "asc" ? -cmp : cmp;
    };
    pinned.sort(sortFn);
    unpinned.sort(sortFn);
    return [...pinned, ...unpinned];
  }, [communityResources, resourceSearch, resourceSort, resourceSortDir, pinnedResources, resourceLikes]);

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
                <FontAwesomeIcon icon={faHome} className="text-base" />
              </button>
              <div className="h-5 w-px bg-gray-200" />
              <button
                onClick={() => navigate("/my-communities")}
                className="text-slate-500 hover:text-brand-red transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span className="hidden sm:inline">Communities</span>
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
              {/* Notifications Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`relative text-slate-500 hover:text-slate-700 transition-colors p-1.5 rounded-md ${notificationsOpen ? "bg-primary/10 text-primary" : ""}`}
                >
                  <FontAwesomeIcon icon={faBell} className="text-lg" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
                    {mockActivity.filter(a => !a.read).length}
                  </span>
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-card-foreground">Activity</h3>
                      <button className="text-xs text-primary hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
                      {mockActivity.map(item => (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (item.type === "post" || item.type === "reply") {
                              const disc = mockDiscussions.find(d => d.title === item.target);
                              if (disc) { setSelectedDiscussion(disc); setNotificationsOpen(false); }
                            }
                            if (item.type === "join") { setSelectedMember(item.actor); setNotificationsOpen(false); }
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 ${!item.read ? "bg-primary/[0.02]" : ""}`}
                        >
                          <Avatar className="h-8 w-8 mt-0.5 shrink-0">
                            <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-medium">
                              {item.actor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-slate-700 leading-relaxed">
                              <span className="font-semibold">{item.actor.name}</span>
                              {item.type === "post" && <> started a discussion: <span className="font-medium text-card-foreground">"{item.target}"</span></>}
                              {item.type === "reply" && <> replied to <span className="font-medium text-card-foreground">"{item.target}"</span></>}
                              {item.type === "join" && <> joined the community</>}
                              {item.type === "resource" && <> shared a resource: <span className="font-medium text-card-foreground">"{item.target}"</span></>}
                              {item.type === "event" && <> created an event: <span className="font-medium text-card-foreground">"{item.target}"</span></>}
                            </p>
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                              <FontAwesomeIcon icon={faClock} className="text-[9px]" /> {item.timestamp}
                            </span>
                          </div>
                          {!item.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-gray-100 text-center">
                      <button className="text-xs text-primary font-medium hover:underline">View all activity</button>
                    </div>
                  </div>
                )}
              </div>
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
          {/* Banner Background */}
          <div className="relative overflow-hidden border-b border-gray-100">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${communityBannerDefault})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/40" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    {/* Community Icon — uploadable by owner/manager */}
                    <div className="relative group">
                      <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden shadow-lg">
                        {communityIcon ? (
                          <img src={communityIcon} alt="Community icon" className="w-full h-full object-cover" />
                        ) : (
                          <FontAwesomeIcon icon={faHandshake} className="text-white/90 text-xl" />
                        )}
                      </div>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => iconInputRef.current?.click()}
                            className="absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                            title="Upload community icon"
                          >
                            <FontAwesomeIcon icon={faCamera} className="text-white text-sm" />
                          </button>
                          <input
                            ref={iconInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleIconUpload}
                            className="hidden"
                          />
                        </>
                      )}
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-serif font-semibold text-white leading-tight drop-shadow-sm">{community.name}</h1>
                      <div className="flex items-center gap-3 mt-1 text-xs text-white/70">
                        <span className="flex items-center gap-1"><FontAwesomeIcon icon={faGlobe} /> {community.location}</span>
                        <span>·</span>
                        <span>Founded {community.founded}</span>
                        <span>·</span>
                        <a href={`https://${community.website}`} className="text-white/90 hover:text-white hover:underline flex items-center gap-1">
                          <FontAwesomeIcon icon={faLink} className="text-[10px]" /> {community.website}
                        </a>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed max-w-2xl mt-3">{community.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {community.tags.map(tag => (
                      <span key={tag} className="text-xs font-normal px-2.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/15 backdrop-blur-sm">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-row md:flex-col gap-3 md:items-end shrink-0">
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-3 text-center md:text-right">
                    <div>
                      <div className="text-xl font-semibold text-white">{community.members}</div>
                      <div className="text-xs text-white/60">Members</div>
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-white">{community.researchPanelMembers}</div>
                      <div className="text-xs text-white/60 flex items-center justify-center md:justify-end gap-1"><FontAwesomeIcon icon={faVials} className="text-[10px]" /> Research panel</div>
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-white">{community.discussions}</div>
                      <div className="text-xs text-white/60">Discussions</div>
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-white">{community.resources}</div>
                      <div className="text-xs text-white/60">Resources</div>
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-white">{community.events}</div>
                      <div className="text-xs text-white/60">Events</div>
                    </div>
                  </div>

                  {/* Owner & Manager */}
                  <div className="border-t border-white/15 pt-3 mt-1 space-y-2 md:text-right">
                    <button onClick={() => setSelectedMember(mockMembers[0])} className="flex items-center gap-2 text-xs hover:text-white transition-colors md:ml-auto">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="bg-amber-50 text-amber-600 text-[8px] font-semibold">SM</AvatarFallback>
                      </Avatar>
                      <span className="text-white/70"><FontAwesomeIcon icon={faCrown} className="text-amber-400 text-[9px] mr-1" />Owner: <span className="font-medium text-white">{mockMembers[0].name}</span></span>
                    </button>
                    <button onClick={() => setSelectedMember(mockMembers[1])} className="flex items-center gap-2 text-xs hover:text-white transition-colors md:ml-auto">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="bg-blue-50 text-blue-600 text-[8px] font-semibold">JH</AvatarFallback>
                      </Avatar>
                      <span className="text-white/70"><FontAwesomeIcon icon={faShieldHalved} className="text-blue-400 text-[9px] mr-1" />Manager: <span className="font-medium text-white">{mockMembers[1].name}</span></span>
                    </button>
                  </div>

                  {isInResearchPanel && (
                    <span className="mt-2 text-[10px] text-white bg-white/15 border border-white/20 rounded-full px-2.5 py-0.5 inline-flex items-center gap-1 backdrop-blur-sm">
                      <FontAwesomeIcon icon={faVials} className="text-[8px]" /> Research panel member
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Role Preview Switcher */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border rounded-lg w-fit">
                <FontAwesomeIcon icon={faEye} className="text-muted-foreground text-xs" />
                <span className="text-[11px] font-medium text-muted-foreground mr-1">Viewing as:</span>
                {([
                  { key: "member" as ViewRole, label: "Member", icon: faUsers, color: "bg-muted text-muted-foreground" },
                  { key: "manager" as ViewRole, label: "Owner / Manager", icon: faShieldHalved, color: "bg-blue-50 text-blue-700 border-blue-200" },
                  { key: "hq" as ViewRole, label: "HQ", icon: faCrown, color: "bg-amber-50 text-amber-700 border-amber-200" },
                ]).map(r => (
                  <button
                    key={r.key}
                    onClick={() => { setViewRole(r.key); if (r.key === "member" && activeTab === "admin") setActiveTab("discussions"); }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all border ${
                      viewRole === r.key ? r.color + " shadow-sm" : "border-transparent text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <FontAwesomeIcon icon={r.icon} className="text-[10px]" /> {r.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsInResearchPanel(!isInResearchPanel)}
                  className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${isInResearchPanel ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground/60 hover:text-muted-foreground"}`}
                >
                  <FontAwesomeIcon icon={faVials} className="text-[10px]" /> {isInResearchPanel ? "Leave research panel" : "Join research panel"}
                </button>
                <button
                  onClick={() => setShowLeaveConfirm(true)}
                  className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60 hover:text-destructive transition-colors"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} className="text-[10px]" /> Leave community
                </button>
              </div>
            </div>
          </div>

          {/* Main Content with Tabs */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-background border border-border h-11 p-1 mb-6">
                <TabsTrigger value="discussions" className="gap-2 text-sm data-[state=active]:text-primary">
                  <FontAwesomeIcon icon={faComments} className="text-xs" /> Discussions
                </TabsTrigger>
                <TabsTrigger value="members" className="gap-2 text-sm data-[state=active]:text-primary">
                  <FontAwesomeIcon icon={faUsers} className="text-xs" /> Members
                </TabsTrigger>
                <TabsTrigger value="resources" className="gap-2 text-sm data-[state=active]:text-primary">
                  <FontAwesomeIcon icon={faFolderOpen} className="text-xs" /> Resources
                </TabsTrigger>
                <TabsTrigger value="playlists" className="gap-2 text-sm data-[state=active]:text-primary">
                  <FontAwesomeIcon icon={faListAlt} className="text-xs" /> Playlists
                </TabsTrigger>
                <TabsTrigger value="events" className="gap-2 text-sm data-[state=active]:text-primary">
                  <FontAwesomeIcon icon={faCalendarDays} className="text-xs" /> Events
                </TabsTrigger>
                <TabsTrigger value="groups" className="gap-2 text-sm data-[state=active]:text-primary">
                  <FontAwesomeIcon icon={faLayerGroup} className="text-xs" /> Groups
                </TabsTrigger>
                <TabsTrigger value="about" className="gap-2 text-sm data-[state=active]:text-primary">
                  <FontAwesomeIcon icon={faCircleInfo} className="text-xs" /> About
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="admin" className="gap-2 text-sm data-[state=active]:text-primary">
                    <FontAwesomeIcon icon={faUserShield} className="text-xs" /> Admin
                  </TabsTrigger>
                )}
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

                    {/* Approval Notice */}
                    <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                      <FontAwesomeIcon icon={faCircleInfo} className="text-amber-500 mt-0.5" />
                      <span>New discussions are subject to review by the community management team or HQ before appearing publicly. See <button onClick={() => setActiveTab("about")} className="text-primary underline font-medium">Rules</button> for details.</span>
                    </div>

                    {/* Search & Sort Controls */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative flex-1 min-w-[160px]">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                        <input
                          type="text"
                          value={discussionSearch}
                          onChange={e => setDiscussionSearch(e.target.value)}
                          placeholder="Search discussions…"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faSort} className="text-muted-foreground text-xs" />
                        <span className="text-xs text-muted-foreground mr-1">Sort:</span>
                        {(["date", "name", "author", "pinned", "replies", "likes"] as const).map(s => (
                          <button
                            key={s}
                            onClick={() => {
                              if (discussionSort === s) setDiscussionSortDir(d => d === "asc" ? "desc" : "asc");
                              else { setDiscussionSort(s); setDiscussionSortDir(s === "date" ? "desc" : "asc"); }
                            }}
                            className={`text-xs px-2 py-1 rounded-md transition-colors ${discussionSort === s ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}
                          >
                            {{ date: "Date", name: "Title", author: "Author", pinned: "Pinned", replies: "Replies", likes: "Likes" }[s]}
                            {discussionSort === s && <span className="ml-0.5">{discussionSortDir === "asc" ? "↑" : "↓"}</span>}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tag Filter Bar */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faFilter} className="text-[10px]" /> Filter:
                      </span>
                      <button
                        onClick={() => setSelectedTag(null)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${!selectedTag ? "bg-primary text-primary-foreground border-primary" : "bg-white text-muted-foreground border-border hover:border-primary/30"}`}
                      >
                        All
                      </button>
                      {allDiscussionTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${selectedTag === tag ? "bg-primary text-primary-foreground border-primary" : "bg-white text-muted-foreground border-border hover:border-primary/30"}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    {/* Discussion List */}
                    {filteredDiscussions.map(d => (
                      <article key={d.id} className={`bg-white border rounded-lg p-5 transition-all hover:shadow-sm ${pinnedDiscussions.has(d.id) ? "border-primary/20 bg-primary/[0.02]" : "border-gray-200"}`}>
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
                                {pinnedDiscussions.has(d.id) && <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0"><FontAwesomeIcon icon={faThumbtack} className="text-[8px] mr-1" />Pinned</Badge>}
                                {d.repliesDisabled && <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground border-muted-foreground/30 flex items-center gap-1"><FontAwesomeIcon icon={faLock} className="text-[8px]" />Replies closed</Badge>}
                                <button onClick={() => setSelectedDiscussion(d)} className="text-sm font-semibold text-card-foreground leading-snug hover:text-primary transition-colors text-left">{d.title}</button>
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
                          <div className="flex flex-col items-center gap-1 shrink-0">
                            <button
                              onClick={() => toggleBookmark(d.id)}
                              className="text-slate-300 hover:text-primary transition-colors mt-1"
                            >
                              <FontAwesomeIcon icon={bookmarkedDiscussions.includes(d.id) ? faBookmarkSolid : faBookmarkRegular} />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => setPinnedDiscussions(prev => {
                                  const next = new Set(prev);
                                  if (next.has(d.id)) next.delete(d.id); else next.add(d.id);
                                  return next;
                                })}
                                className={`text-xs transition-colors ${pinnedDiscussions.has(d.id) ? "text-primary" : "text-slate-300 hover:text-primary"}`}
                                title={pinnedDiscussions.has(d.id) ? "Unpin discussion" : "Pin discussion"}
                              >
                                <FontAwesomeIcon icon={faThumbtack} />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-5 mt-4 pt-3 border-t border-gray-50 text-xs text-muted-foreground">
                          <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                            <FontAwesomeIcon icon={faThumbsUp} /> {d.likes}
                          </button>
                          <button onClick={() => setSelectedDiscussion(d)} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                            <FontAwesomeIcon icon={faReply} /> {d.replies} replies
                          </button>
                          <button onClick={() => setSelectedDiscussion(d)} className="ml-auto flex items-center gap-1.5 text-primary font-medium hover:underline">
                            Open thread <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
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

                    {/* Featured Member Spotlight */}
                    <div className="bg-gradient-to-br from-primary/[0.04] to-primary/[0.01] border border-primary/15 rounded-lg p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <FontAwesomeIcon icon={faStar} className="text-amber-400 text-xs" />
                        <h3 className="text-sm font-semibold text-card-foreground">Member Spotlight</h3>
                      </div>
                      <button
                        onClick={() => setSelectedMember(mockMembers[2])}
                        className="w-full text-left group"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                              {mockMembers[2].name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors block">{mockMembers[2].name}</span>
                            <span className="text-xs text-muted-foreground">{mockMembers[2].role}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{mockMembers[2].bio}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {mockMembers[2].expertise.map(e => (
                            <span key={e} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary/80 border border-primary/10">{e}</span>
                          ))}
                        </div>
                        {mockMembers[2].publications && (
                          <p className="text-[11px] text-muted-foreground mt-3 pt-2 border-t border-primary/10">
                            <span className="font-semibold text-primary">{mockMembers[2].publications}</span> publications · {mockMembers[2].firm}
                          </p>
                        )}
                      </button>
                    </div>

                    {/* You Might Know */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <FontAwesomeIcon icon={faUserPlus} className="text-primary text-xs" />
                        <h3 className="text-sm font-semibold text-card-foreground">You Might Know</h3>
                      </div>
                      <div className="space-y-3">
                        {/* Suggest members who share expertise with topics the user interacts with */}
                        {[mockMembers[3], mockMembers[6], mockMembers[7]].map(m => (
                          <button
                            key={m.id}
                            onClick={() => setSelectedMember(m)}
                            className="flex items-start gap-3 w-full text-left hover:bg-slate-50 rounded-md p-1.5 -mx-1.5 transition-colors group"
                          >
                            <Avatar className="h-9 w-9 mt-0.5">
                              <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-medium group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-medium text-slate-700 group-hover:text-primary transition-colors block">{m.name}</span>
                              <span className="text-[11px] text-muted-foreground block">{m.role} · {m.firm}</span>
                              <span className="text-[10px] text-primary/70 mt-1 block">
                                {m.expertise.slice(0, 2).join(" · ")}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setActiveTab("members")}
                        className="text-xs text-primary font-medium mt-3 hover:underline block"
                      >
                        Discover more members →
                      </button>
                    </div>

                    {/* ─── Community Polls ─── */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <FontAwesomeIcon icon={faPoll} className="text-primary text-xs" />
                        <h3 className="text-sm font-semibold text-card-foreground">Active Polls</h3>
                      </div>
                      <div className="space-y-5">
                        {mockPolls.map(poll => {
                          const voted = pollVotes[poll.id];
                          const currentTotal = voted ? poll.totalVotes + 1 : poll.totalVotes;
                          return (
                            <div key={poll.id} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                              <p className="text-xs font-semibold text-card-foreground mb-2">{poll.question}</p>
                              <div className="space-y-1.5">
                                {poll.options.map(opt => {
                                  const optVotes = opt.votes + (voted === opt.id ? 1 : 0);
                                  const pct = Math.round((optVotes / currentTotal) * 100);
                                  return (
                                    <button
                                      key={opt.id}
                                      onClick={() => {
                                        if (!voted) setPollVotes(prev => ({ ...prev, [poll.id]: opt.id }));
                                      }}
                                      disabled={!!voted}
                                      className={`w-full text-left relative rounded-md overflow-hidden transition-all ${voted ? "cursor-default" : "hover:bg-primary/5 cursor-pointer"}`}
                                    >
                                      {voted && (
                                        <div
                                          className={`absolute inset-y-0 left-0 rounded-md transition-all ${voted === opt.id ? "bg-primary/15" : "bg-muted/50"}`}
                                          style={{ width: `${pct}%` }}
                                        />
                                      )}
                                      <div className="relative flex items-center justify-between px-2.5 py-1.5">
                                        <span className={`text-[11px] ${voted === opt.id ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                                          {voted === opt.id && <FontAwesomeIcon icon={faCheck} className="mr-1 text-[9px]" />}
                                          {opt.label}
                                        </span>
                                        {voted && <span className="text-[10px] font-medium text-muted-foreground">{pct}%</span>}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                              <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                                <span>{currentTotal} votes</span>
                                <span>Ends {poll.endsDate}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </aside>
                </div>
              </TabsContent>

              {/* ─── MEMBERS TAB ─── */}
              <TabsContent value="members">
                <div className="space-y-4">
                  {/* Search & Sort */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 min-w-[160px]">
                      <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                      <input
                        type="text"
                        value={memberSearch}
                        onChange={e => setMemberSearch(e.target.value)}
                        placeholder="Search by name or organisation…"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faSort} className="text-muted-foreground text-xs" />
                      <span className="text-xs text-muted-foreground mr-1">Sort:</span>
                      {([
                        { key: "name" as const, label: "Last name" },
                        { key: "firm" as const, label: "Organisation" },
                        { key: "posts" as const, label: "Posts" },
                        { key: "role" as const, label: "Job title" },
                        { key: "joined" as const, label: "Date joined" },
                      ]).map(s => (
                        <button
                          key={s.key}
                          onClick={() => {
                            if (memberSort === s.key) setMemberSortDir(d => d === "asc" ? "desc" : "asc");
                            else { setMemberSort(s.key); setMemberSortDir("asc"); }
                          }}
                          className={`text-xs px-2 py-1 rounded-md transition-colors ${memberSort === s.key ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}
                        >
                          {s.label}
                          {memberSort === s.key && <span className="ml-0.5">{memberSortDir === "asc" ? "↑" : "↓"}</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {sortedMembers.map(m => (
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
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-3 pt-3 border-t border-gray-50">
                          <span>Member since {m.joinedDate}</span>
                          <span className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faComments} className="text-[9px]" /> {m.posts || 0} posts
                          </span>
                        </div>
                      </button>
                    ))}
                    {sortedMembers.length === 0 && (
                      <div className="col-span-full text-center py-10">
                        <FontAwesomeIcon icon={faSearch} className="text-2xl text-muted-foreground/30 mb-2" />
                        <p className="text-sm text-muted-foreground">No members match your search.</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* ─── RESOURCES TAB ─── */}
              <TabsContent value="resources">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{communityResources.length} resources shared in this community</p>
                    <button
                      onClick={() => setShowAddResource(!showAddResource)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
                    >
                      <FontAwesomeIcon icon={faPlus} className="text-[10px]" /> Add Resource
                    </button>
                  </div>

                  {/* Approval Notice */}
                  <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                    <FontAwesomeIcon icon={faCircleInfo} className="text-amber-500 mt-0.5" />
                    <span>New resources are subject to review by the community management team or HQ before appearing publicly. See <button onClick={() => setActiveTab("about")} className="text-primary underline font-medium">Rules</button> for details.</span>
                  </div>

                  {/* Search & Sort Controls */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 min-w-[160px]">
                      <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                      <input
                        type="text"
                        value={resourceSearch}
                        onChange={e => setResourceSearch(e.target.value)}
                        placeholder="Search resources…"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faSort} className="text-muted-foreground text-xs" />
                      <span className="text-xs text-muted-foreground mr-1">Sort:</span>
                      {(["date", "name", "author", "downloads", "pinned", "likes"] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => {
                            if (resourceSort === s) setResourceSortDir(d => d === "asc" ? "desc" : "asc");
                            else { setResourceSort(s); setResourceSortDir(s === "date" || s === "downloads" || s === "likes" ? "desc" : "asc"); }
                          }}
                          className={`text-xs px-2 py-1 rounded-md transition-colors ${resourceSort === s ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}
                        >
                          {{ date: "Date", name: "Title", author: "Author", downloads: "Downloads", pinned: "Pinned", likes: "Likes" }[s]}
                          {resourceSort === s && <span className="ml-0.5">{resourceSortDir === "asc" ? "↑" : "↓"}</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add Resource Form */}
                  {showAddResource && (
                    <div className="bg-white border border-primary/20 rounded-lg p-5 space-y-3">
                      <h3 className="text-sm font-semibold text-card-foreground">Add a resource</h3>
                      <p className="text-[11px] text-muted-foreground">The item URL must have public access. Once processed, items may surface in the 'Find an Expert' interface.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-card-foreground mb-1 block">Title <span className="text-destructive">*</span></label>
                          <input type="text" value={newResourceTitle} onChange={e => setNewResourceTitle(e.target.value)} placeholder="Resource title…" className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-card-foreground mb-1 block">Type <span className="text-destructive">*</span></label>
                          <select value={newResourceType} onChange={e => setNewResourceType(e.target.value as Resource["type"])} className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-muted-foreground">
                            <option value="paper">Paper</option>
                            <option value="report">Report</option>
                            <option value="presentation">Presentation</option>
                            <option value="video">Video</option>
                            <option value="link">Link</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs font-medium text-card-foreground mb-1 block">URL <span className="text-destructive">*</span></label>
                          <input type="url" value={newResourceUrl} onChange={e => setNewResourceUrl(e.target.value)} placeholder="https://… (must be publicly accessible)" className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-card-foreground mb-1 block">Author <span className="text-destructive">*</span></label>
                          <input type="text" value={newResourceAuthor} onChange={e => setNewResourceAuthor(e.target.value)} placeholder="Author name…" className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-card-foreground mb-1 block">Date</label>
                          <input type="text" value={newResourceDate} onChange={e => setNewResourceDate(e.target.value)} placeholder="e.g. Mar 2026" className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs font-medium text-card-foreground mb-1 block">Description</label>
                          <textarea value={newResourceDesc} onChange={e => setNewResourceDesc(e.target.value)} placeholder="Brief description…" rows={2} className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none" />
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button onClick={() => { setShowAddResource(false); setNewResourceTitle(""); setNewResourceType("link"); setNewResourceUrl(""); setNewResourceAuthor(""); setNewResourceDate(""); setNewResourceDesc(""); }} className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5">Cancel</button>
                        <button
                          disabled={!newResourceTitle.trim() || !newResourceUrl.trim() || !newResourceAuthor.trim()}
                          onClick={() => {
                            const nr: Resource = { id: `r-${Date.now()}`, title: newResourceTitle.trim(), type: newResourceType, author: newResourceAuthor.trim(), date: newResourceDate.trim() || "Mar 2026", description: newResourceDesc.trim(), url: newResourceUrl.trim() };
                            setCommunityResources(prev => [nr, ...prev]);
                            setShowAddResource(false); setNewResourceTitle(""); setNewResourceType("link"); setNewResourceUrl(""); setNewResourceAuthor(""); setNewResourceDate(""); setNewResourceDesc("");
                          }}
                          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${newResourceTitle.trim() && newResourceUrl.trim() && newResourceAuthor.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground"}`}
                        >
                          Add Resource
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Resource List */}
                  {sortedResources.map(r => (
                    <div key={r.id} className={`bg-white border rounded-lg p-5 flex items-start gap-4 hover:shadow-sm transition-shadow ${pinnedResources.has(r.id) ? "border-primary/20 bg-primary/[0.02]" : "border-gray-200"}`}>
                      <div className="flex items-center gap-3 shrink-0">
                        <label className="flex items-center cursor-pointer" title="Make available for playlists">
                          <input
                            type="checkbox"
                            checked={playlistEnabledResources.has(r.id)}
                            onChange={() => setPlaylistEnabledResources(prev => { const next = new Set(prev); if (next.has(r.id)) next.delete(r.id); else next.add(r.id); return next; })}
                            className="accent-[hsl(var(--primary))] w-3.5 h-3.5 rounded cursor-pointer"
                          />
                        </label>
                        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                          <ResourceIcon type={r.type} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {pinnedResources.has(r.id) && <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0"><FontAwesomeIcon icon={faThumbtack} className="text-[8px] mr-1" />Pinned</Badge>}
                          <h3 className="text-sm font-semibold text-card-foreground">{r.title}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{r.author} · {r.date}</p>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{r.description}</p>
                        {playlistEnabledResources.has(r.id) && (
                          <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-primary bg-primary/5 border border-primary/15 rounded-full px-2 py-0.5">
                            <FontAwesomeIcon icon={faListAlt} className="text-[8px]" /> Available for playlists
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setLikedResources(prev => {
                                const next = new Set(prev);
                                if (next.has(r.id)) next.delete(r.id); else next.add(r.id);
                                return next;
                              });
                              setResourceLikes(prev => ({
                                ...prev,
                                [r.id]: (prev[r.id] || 0) + (likedResources.has(r.id) ? -1 : 1),
                              }));
                            }}
                            className={`text-xs flex items-center gap-1 transition-colors ${likedResources.has(r.id) ? "text-primary font-medium" : "text-muted-foreground hover:text-primary"}`}
                          >
                            <FontAwesomeIcon icon={faHeart} /> {resourceLikes[r.id] || 0}
                          </button>
                          {r.downloads != null && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <FontAwesomeIcon icon={faDownload} /> {r.downloads}
                            </span>
                          )}
                          <button className="text-primary hover:text-primary/80 transition-colors text-sm">
                            <FontAwesomeIcon icon={r.type === "link" ? faLink : faDownload} />
                          </button>
                        </div>
                        {isAdmin && (
                          <button
                            onClick={() => setPinnedResources(prev => {
                              const next = new Set(prev);
                              if (next.has(r.id)) next.delete(r.id); else next.add(r.id);
                              return next;
                            })}
                            className={`text-xs transition-colors ${pinnedResources.has(r.id) ? "text-primary" : "text-slate-300 hover:text-primary"}`}
                            title={pinnedResources.has(r.id) ? "Unpin resource" : "Pin resource"}
                          >
                            <FontAwesomeIcon icon={faThumbtack} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* ─── PLAYLISTS TAB ─── */}
              <TabsContent value="playlists">
                <div className="space-y-6">
                  {/* Create Playlist CTA */}
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                          <FontAwesomeIcon icon={faListAlt} className="text-primary text-xs" /> Create a Playlist
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">Curate resources into playlists and share them with the community.</p>
                      </div>
                      <button
                        onClick={() => setShowCreatePlaylist(!showCreatePlaylist)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
                      >
                        <FontAwesomeIcon icon={faPlus} className="text-[10px]" /> New Playlist
                      </button>
                    </div>

                    {showCreatePlaylist && (
                      <div className="mt-4 pt-4 border-t border-border space-y-3">
                        <div>
                          <label className="text-xs font-medium text-card-foreground mb-1 block">Playlist name</label>
                          <input
                            type="text"
                            value={newPlaylistName}
                            onChange={e => setNewPlaylistName(e.target.value.slice(0, 80))}
                            placeholder="e.g. Essential AI Reading…"
                            className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-card-foreground mb-1 block">Description</label>
                          <textarea
                            value={newPlaylistDesc}
                            onChange={e => setNewPlaylistDesc(e.target.value.slice(0, 250))}
                            placeholder="What does this playlist cover?"
                            rows={2}
                            className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none"
                          />
                        </div>

                        {/* Import from Marketplace Management */}
                        <div>
                          <label className="text-xs font-medium text-card-foreground mb-1 block">Import from Marketplace Management Toolkit</label>
                          <select
                            value={selectedMMPlaylist}
                            onChange={e => {
                              setSelectedMMPlaylist(e.target.value);
                              if (e.target.value) {
                                const mmPl = mockMMPlaylists.find(p => p.id === e.target.value);
                                if (mmPl) {
                                  const newIds = mmPl.items.map(item => item.id);
                                  setCommunityResources(prev => {
                                    const existingIds = new Set(prev.map(r => r.id));
                                    const toAdd = mmPl.items.filter(item => !existingIds.has(item.id)).map(item => ({
                                      ...item, downloads: 0, url: "#",
                                    }));
                                    return [...toAdd, ...prev];
                                  });
                                  setNewPlaylistItems(prev => [...new Set([...prev, ...newIds])]);
                                }
                              }
                            }}
                            className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-muted-foreground"
                          >
                            <option value="">Select a toolkit playlist…</option>
                            {mockMMPlaylists.map(p => (
                              <option key={p.id} value={p.id}>{p.name} ({p.items.length} items)</option>
                            ))}
                          </select>
                          <p className="text-[10px] text-muted-foreground mt-1">Importing will auto-add resources and invite their authors as community members.</p>
                        </div>

                        <div>
                          {(() => {
                            const usedIds = new Set([
                              ...userPlaylists.flatMap(pl => pl.items.map(i => i.id)),
                              ...mockPlaylists.flatMap(pl => pl.items.map(i => i.id)),
                            ]);
                            const availableResources = communityResources.filter(r => !usedIds.has(r.id));
                            return (
                              <>
                                <div className="flex items-center justify-between mb-1.5">
                                  <label className="text-xs font-medium text-card-foreground">Available resources ({availableResources.length})</label>
                                  <div className="flex items-center gap-3">
                                    <button onClick={() => setNewPlaylistItems(availableResources.map(r => r.id))} className="text-[10px] text-primary hover:underline">Select all</button>
                                    <button onClick={() => setNewPlaylistItems([])} className="text-[10px] text-muted-foreground hover:underline">Select none</button>
                                  </div>
                                </div>
                                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                  {availableResources.length === 0 && (
                                    <p className="text-xs text-muted-foreground py-3 text-center">All resources are already in playlists.</p>
                                  )}
                                  {availableResources.map(r => (
                              <label key={r.id} className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-md hover:bg-muted/50 transition-colors">
                                <span
                                  onClick={() => setNewPlaylistItems(prev => prev.includes(r.id) ? prev.filter(i => i !== r.id) : [...prev, r.id])}
                                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${newPlaylistItems.includes(r.id) ? "bg-primary border-primary text-primary-foreground" : "border-border"}`}
                                >
                                  {newPlaylistItems.includes(r.id) && <FontAwesomeIcon icon={faCheck} className="text-[8px]" />}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <span className="text-xs font-medium text-card-foreground block truncate">{r.title}</span>
                                  <span className="text-[10px] text-muted-foreground">{r.author} · {r.date}</span>
                                </div>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize">{r.type}</span>
                              </label>
                            ))}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            onClick={() => { setShowCreatePlaylist(false); setNewPlaylistName(""); setNewPlaylistDesc(""); setNewPlaylistItems([]); setSelectedMMPlaylist(""); }}
                            className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5"
                          >
                            Cancel
                          </button>
                          <button
                            disabled={!newPlaylistName.trim() || newPlaylistItems.length === 0}
                            onClick={() => {
                              const newPl: Playlist = {
                                id: `pl-user-${Date.now()}`,
                                name: newPlaylistName.trim(),
                                description: newPlaylistDesc.trim(),
                                author: { id: "self", name: "Richard Chaplin", role: "Managing Director", firm: "PM Intelligence", joinedDate: "Jan 2025", expertise: ["Strategy", "Governance"] },
                                items: communityResources.filter(r => newPlaylistItems.includes(r.id)),
                                shared: true,
                                createdDate: "Mar 2026",
                                likes: 0,
                              };
                              setUserPlaylists(prev => [newPl, ...prev]);
                              setPlaylistEnabledResources(prev => {
                                const next = new Set(prev);
                                newPlaylistItems.forEach(id => next.delete(id));
                                return next;
                              });
                              setShowCreatePlaylist(false);
                              setNewPlaylistName("");
                              setNewPlaylistDesc("");
                              setNewPlaylistItems([]);
                              setSelectedMMPlaylist("");
                            }}
                            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${newPlaylistName.trim() && newPlaylistItems.length > 0 ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground"}`}
                          >
                            <FontAwesomeIcon icon={faShareAlt} className="mr-1" /> Create & Share
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* All Playlists */}
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Community Playlists ({mockPlaylists.length + userPlaylists.length})
                    </h3>

                    {/* Playlist Search & Sort */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <div className="relative flex-1 min-w-[160px]">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                        <input
                          type="text"
                          value={playlistSearch}
                          onChange={e => setPlaylistSearch(e.target.value)}
                          placeholder="Search playlists…"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faSort} className="text-muted-foreground text-xs" />
                        <span className="text-xs text-muted-foreground mr-1">Sort:</span>
                        {(["name", "curator", "date", "likes"] as const).map(s => (
                          <button
                            key={s}
                            onClick={() => {
                              if (playlistSort === s) setPlaylistSortDir(d => d === "asc" ? "desc" : "asc");
                              else { setPlaylistSort(s); setPlaylistSortDir(s === "date" || s === "likes" ? "desc" : "asc"); }
                            }}
                            className={`text-xs px-2 py-1 rounded-md transition-colors ${playlistSort === s ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}
                          >
                            {{ name: "Name", curator: "Curator", date: "Date", likes: "Likes" }[s]}
                            {playlistSort === s && <span className="ml-0.5">{playlistSortDir === "asc" ? "↑" : "↓"}</span>}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(() => {
                        const monthOrder: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
                        let allPl = [...userPlaylists, ...mockPlaylists];
                        if (playlistSearch.trim()) {
                          const q = playlistSearch.toLowerCase();
                          allPl = allPl.filter(pl => pl.name.toLowerCase().includes(q) || pl.author.name.toLowerCase().includes(q) || pl.description.toLowerCase().includes(q));
                        }
                        allPl.sort((a, b) => {
                          let cmp = 0;
                          if (playlistSort === "name") cmp = a.name.localeCompare(b.name);
                          else if (playlistSort === "curator") cmp = a.author.name.localeCompare(b.author.name);
                          else if (playlistSort === "likes") cmp = a.likes - b.likes;
                          else {
                            const parseDate = (d: string) => { const parts = d.split(" "); return (parseInt(parts[1] || "2026", 10) * 12) + (monthOrder[parts[0]] ?? 0); };
                            cmp = parseDate(a.createdDate) - parseDate(b.createdDate);
                          }
                          return playlistSortDir === "desc" ? -cmp : cmp;
                        });
                        if (allPl.length === 0) {
                          return <div className="col-span-2 text-center py-8 text-sm text-muted-foreground">No playlists match your search.</div>;
                        }
                        return allPl.map(pl => (
                        <div key={pl.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                                <FontAwesomeIcon icon={faListAlt} className="text-sm" />
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-card-foreground">{pl.name}</h4>
                                <p className="text-[11px] text-muted-foreground">
                                  by {pl.author.id === "self" ? <span className="text-primary font-medium">You</span> : pl.author.name} · {pl.createdDate}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <FontAwesomeIcon icon={faHeart} className="text-[10px]" /> {pl.likes}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{pl.description}</p>

                          {/* Collapsed view */}
                          {viewPlaylistId !== pl.id && (
                            <div className="space-y-1.5">
                              {pl.items.slice(0, 3).map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-md px-2.5 py-1.5">
                                  <ResourceIcon type={item.type} />
                                  <span className="truncate flex-1">{item.title}</span>
                                </div>
                              ))}
                              {pl.items.length > 3 && (
                                <p className="text-[10px] text-muted-foreground px-2.5">+ {pl.items.length - 3} more</p>
                              )}
                            </div>
                          )}

                          {/* Expanded: full resource details */}
                          {viewPlaylistId === pl.id && (
                            <div className="space-y-2">
                              {pl.items.map((item, i) => (
                                <div key={i} className="flex items-start gap-3 bg-muted/30 rounded-lg p-3 border border-border/50">
                                  <div className="w-8 h-8 rounded-md bg-background border border-border flex items-center justify-center text-muted-foreground shrink-0 text-xs">
                                    <ResourceIcon type={item.type} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="text-xs font-semibold text-card-foreground">{item.title}</h5>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.author} · {item.date}</p>
                                    {item.description && <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{item.description}</p>}
                                  </div>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize shrink-0">{item.type}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                            <span className="text-[10px] text-muted-foreground">{pl.items.length} {pl.items.length === 1 ? "resource" : "resources"}</span>
                            <button onClick={() => setViewPlaylistId(viewPlaylistId === pl.id ? null : pl.id)} className="text-xs font-medium text-primary hover:underline">{viewPlaylistId === pl.id ? "Close ↑" : "View resources →"}</button>
                          </div>
                        </div>
                      ));
                      })()}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ─── EVENTS TAB ─── */}
              <TabsContent value="events">
                {/* Search, Filter, Sort bar */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                      <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                      <input
                        type="text"
                        value={eventSearch}
                        onChange={e => setEventSearch(e.target.value)}
                        placeholder="Search by name, presenter, city…"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      {eventSearch && (
                        <button onClick={() => setEventSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          <FontAwesomeIcon icon={faTimes} className="text-xs" />
                        </button>
                      )}
                    </div>
                    {/* Type Filter */}
                    <select
                      value={eventTypeFilter}
                      onChange={e => setEventTypeFilter(e.target.value)}
                      className="text-xs border border-border rounded-lg px-3 py-2 bg-background text-foreground"
                    >
                      <option value="all">All types</option>
                      <option value="webinar">Webinar</option>
                      <option value="workshop">Workshop</option>
                      <option value="conference">Conference</option>
                      <option value="meetup">Meetup</option>
                    </select>
                    {/* Status Filter */}
                    <select
                      value={eventStatusFilter}
                      onChange={e => setEventStatusFilter(e.target.value)}
                      className="text-xs border border-border rounded-lg px-3 py-2 bg-background text-foreground"
                    >
                      <option value="all">All statuses</option>
                      <option value="registered">Registered</option>
                      <option value="eligible">Eligible</option>
                      <option value="ineligible">Ineligible</option>
                    </select>
                  </div>
                  {/* Sort buttons */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-xs text-muted-foreground mr-1">Sort:</span>
                    {(["name", "presenter", "date", "delegates", "city", "country"] as const).map(field => (
                      <button
                        key={field}
                        onClick={() => {
                          if (eventSort === field) setEventSortDir(d => d === "asc" ? "desc" : "asc");
                          else { setEventSort(field); setEventSortDir("asc"); }
                        }}
                        className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${eventSort === field ? "bg-primary/10 border-primary/30 text-primary font-semibold" : "border-border text-muted-foreground hover:bg-muted"}`}
                      >
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                        {eventSort === field && (
                          <FontAwesomeIcon icon={faSort} className="ml-1 text-[9px]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {(() => {
                  const monthOrder: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
                  const parseEventDate = (d: string) => {
                    const parts = d.split(" ");
                    if (parts.length >= 3) {
                      const day = parseInt(parts[0], 10);
                      const month = monthOrder[parts[1]] ?? 0;
                      const year = parseInt(parts[2], 10);
                      return year * 10000 + month * 100 + day;
                    }
                    return 99999999; // recurring / non-standard dates go last
                  };

                  const getEventStatus = (e: Event): "registered" | "eligible" | "ineligible" => {
                    if (eventRegistrations.has(e.id)) return "registered";
                    if (e.eligible === false) return "ineligible";
                    return "eligible";
                  };

                  let filtered = communityEvents.filter(e => {
                    const q = eventSearch.toLowerCase();
                    const matchesSearch = !q ||
                      e.title.toLowerCase().includes(q) ||
                      (e.speaker?.toLowerCase().includes(q)) ||
                      (e.city?.toLowerCase().includes(q)) ||
                      (e.country?.toLowerCase().includes(q)) ||
                      e.description.toLowerCase().includes(q);
                    const matchesType = eventTypeFilter === "all" || e.type === eventTypeFilter;
                    const status = getEventStatus(e);
                    const matchesStatus = eventStatusFilter === "all" || status === eventStatusFilter;
                    return matchesSearch && matchesType && matchesStatus;
                  });

                  filtered.sort((a, b) => {
                    let cmp = 0;
                    switch (eventSort) {
                      case "name": cmp = a.title.localeCompare(b.title); break;
                      case "presenter": cmp = (a.speaker || "").localeCompare(b.speaker || ""); break;
                      case "date": cmp = parseEventDate(a.date) - parseEventDate(b.date); break;
                      case "delegates": cmp = a.attendees - b.attendees; break;
                      case "city": cmp = (a.city || "").localeCompare(b.city || ""); break;
                      case "country": cmp = (a.country || "").localeCompare(b.country || ""); break;
                    }
                    return eventSortDir === "desc" ? -cmp : cmp;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-12 text-muted-foreground">
                        <FontAwesomeIcon icon={faCalendarDays} className="text-3xl mb-3 opacity-40" />
                        <p className="text-sm">No events match your filters.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filtered.map(e => {
                        const status = getEventStatus(e);
                        return (
                          <div key={e.id} className={`bg-white border rounded-lg p-5 hover:shadow-sm transition-shadow ${e.recurring ? "border-primary/20" : "border-border"}`}>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <EventTypeBadge type={e.type} />
                                {e.recurring && (
                                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                                    <FontAwesomeIcon icon={faRepeat} className="text-[8px]" />
                                    {e.recurring === "weekly" ? "Weekly" : e.recurring === "biweekly" ? "Fortnightly" : "Monthly"}
                                  </span>
                                )}
                                {/* Status badge */}
                                {status === "registered" && (
                                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">✓ Registered</span>
                                )}
                                {status === "ineligible" && (
                                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">Ineligible</span>
                                )}
                                {status === "eligible" && (
                                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">Eligible</span>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">{e.attendees} delegates</span>
                            </div>
                            <h3 className="text-sm font-semibold text-card-foreground mb-1">{e.title}</h3>
                            <p className="text-xs text-muted-foreground mb-1">
                              <FontAwesomeIcon icon={faCalendarDays} className="mr-1" /> {e.date} · {e.time}
                              {e.speaker && <> · Presenter: <button onClick={() => { const member = mockMembers.find(m => m.name === e.speaker); if (member) setSelectedMember(member); }} className="font-medium text-muted-foreground hover:text-primary transition-colors">{e.speaker}</button></>}
                            </p>
                            {(e.city || e.country) && (
                              <p className="text-xs text-muted-foreground mb-2">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                                {[e.city, e.country].filter(Boolean).join(", ")}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground leading-relaxed">{e.description}</p>
                            {e.nextOccurrences && e.nextOccurrences.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-border/50">
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Upcoming sessions</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {e.nextOccurrences.map((date, i) => (
                                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                                      {date}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {status === "registered" ? (
                              <span className="mt-4 text-xs font-medium text-emerald-600 flex items-center gap-1">
                                <FontAwesomeIcon icon={faCheck} className="text-[10px]" /> Registered
                              </span>
                            ) : status === "eligible" ? (
                              <button
                                onClick={() => setEventRegistrations(prev => new Set([...prev, e.id]))}
                                className="mt-4 text-xs font-medium text-primary hover:underline"
                              >
                                Register →
                              </button>
                            ) : (
                              <span className="mt-4 text-xs text-muted-foreground italic">Not eligible for this event</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </TabsContent>

              {/* ─── GROUPS TAB ─── */}
              <TabsContent value="groups">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">
                      {mockWorkingGroups.length} working groups within this community
                    </p>
                    {isAdmin && (
                      <button
                        onClick={() => setShowAddGroup(!showAddGroup)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
                      >
                        <FontAwesomeIcon icon={faPlus} className="text-[10px]" /> Add Group
                      </button>
                    )}
                  </div>

                  {/* Add Group Form */}
                  {showAddGroup && isAdmin && (
                    <div className="bg-white border border-primary/20 rounded-lg p-5 space-y-3">
                      <h3 className="text-sm font-semibold text-card-foreground">Create a working group</h3>
                      <input type="text" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="Group name *" className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      <textarea value={newGroupDesc} onChange={e => setNewGroupDesc(e.target.value)} placeholder="Description *" rows={2} className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setShowAddGroup(false); setNewGroupName(""); setNewGroupDesc(""); }} className="text-xs text-muted-foreground px-3 py-1.5">Cancel</button>
                        <button disabled={!newGroupName.trim() || !newGroupDesc.trim()} onClick={() => { setShowAddGroup(false); setNewGroupName(""); setNewGroupDesc(""); }} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${newGroupName.trim() && newGroupDesc.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground"}`}>Create Group</button>
                      </div>
                    </div>
                  )}

                  {/* Search & Sort */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 min-w-[160px]">
                      <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                      <input type="text" value={groupSearch} onChange={e => setGroupSearch(e.target.value)} placeholder="Search groups…" className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faSort} className="text-muted-foreground text-xs" />
                      <span className="text-xs text-muted-foreground mr-1">Sort:</span>
                      {(["name", "leader", "formed", "activity", "members"] as const).map(s => (
                        <button key={s} onClick={() => { if (groupSort === s) setGroupSortDir(d => d === "asc" ? "desc" : "asc"); else { setGroupSort(s); setGroupSortDir("asc"); } }} className={`text-xs px-2 py-1 rounded-md transition-colors ${groupSort === s ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}>
                          {{ name: "Group name", leader: "Leader", formed: "Formation date", activity: "Activity", members: "Members" }[s]}
                          {groupSort === s && <span className="ml-0.5">{groupSortDir === "asc" ? "↑" : "↓"}</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Viewing a specific group */}
                  {viewingGroup && (
                    <div className="bg-white border border-primary/20 rounded-lg p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-serif font-semibold text-card-foreground flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-serif font-semibold text-xs flex items-center justify-center">{viewingGroup.avatar}</span>
                          {viewingGroup.name}
                        </h3>
                        <button onClick={() => setViewingGroup(null)} className="text-xs text-muted-foreground hover:text-foreground"><FontAwesomeIcon icon={faTimes} className="mr-1" />Close</button>
                      </div>
                      <p className="text-xs text-muted-foreground">{viewingGroup.description}</p>
                      <div className="text-xs text-muted-foreground">Formed {viewingGroup.formed} · Led by <button onClick={() => setSelectedMember(viewingGroup.lead)} className="text-primary hover:underline font-medium">{viewingGroup.lead.name}</button></div>

                      {/* Group Members */}
                      <div>
                        <h4 className="text-xs font-semibold text-card-foreground mb-2">Members ({viewingGroup.members.length})</h4>
                        <div className="flex flex-wrap gap-2">
                          {viewingGroup.members.map(m => (
                            <button key={m.id} onClick={() => setSelectedMember(m)} className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg hover:bg-muted transition-colors">
                              <Avatar className="h-6 w-6"><AvatarFallback className="bg-slate-100 text-slate-600 text-[9px] font-medium">{getInitials(m.name)}</AvatarFallback></Avatar>
                              <span className="text-xs text-card-foreground">{m.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Group Discussions */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-semibold text-card-foreground">Discussions ({viewingGroup.discussions})</h4>
                          {isAdmin && <button className="text-[10px] text-primary font-medium hover:underline"><FontAwesomeIcon icon={faPlus} className="mr-1 text-[8px]" />Add discussion</button>}
                        </div>
                        <p className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">{viewingGroup.discussions} discussions in this group. Navigate to the Discussions tab to view them.</p>
                      </div>

                      {/* Group Resources */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-semibold text-card-foreground">Resources ({viewingGroup.resources})</h4>
                          {isAdmin && <button className="text-[10px] text-primary font-medium hover:underline"><FontAwesomeIcon icon={faPlus} className="mr-1 text-[8px]" />Add resource</button>}
                        </div>
                        <p className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">{viewingGroup.resources} resources shared in this group. Navigate to the Resources tab to view them.</p>
                      </div>
                    </div>
                  )}

                  {/* Group List */}
                  {(() => {
                    const monthOrder: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
                    let groups = [...mockWorkingGroups];
                    if (groupSearch.trim()) {
                      const q = groupSearch.toLowerCase();
                      groups = groups.filter(g => g.name.toLowerCase().includes(q) || g.lead.name.toLowerCase().includes(q) || g.tags.some(t => t.toLowerCase().includes(q)));
                    }
                    groups.sort((a, b) => {
                      let cmp = 0;
                      if (groupSort === "name") cmp = a.name.localeCompare(b.name);
                      else if (groupSort === "leader") cmp = a.lead.name.localeCompare(b.lead.name);
                      else if (groupSort === "members") cmp = a.members.length - b.members.length;
                      else if (groupSort === "activity") cmp = a.lastActive.localeCompare(b.lastActive);
                      else {
                        const parseDate = (d: string) => { const parts = d.split(" "); return (parseInt(parts[1] || "2025", 10) * 12) + (monthOrder[parts[0]] ?? 0); };
                        cmp = parseDate(a.formed) - parseDate(b.formed);
                      }
                      return groupSortDir === "desc" ? -cmp : cmp;
                    });
                    if (groups.length === 0) {
                      return <div className="text-center py-8 text-sm text-muted-foreground">No groups match your search.</div>;
                    }
                    return groups.map(group => (
                    <div key={group.id} className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 hover:shadow-md hover:border-primary/20 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-primary font-serif font-semibold text-sm flex items-center justify-center shrink-0">
                          {group.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-base font-serif font-semibold text-card-foreground">{group.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{group.description}</p>
                            </div>
                            {!joinedGroups.has(group.id) ? (
                              <button onClick={() => setJoinedGroups(prev => new Set([...prev, group.id]))} className="flex items-center gap-1.5 px-3 py-1.5 border border-primary/30 text-primary rounded-lg text-xs font-medium hover:bg-primary/5 transition-colors shrink-0">
                                <FontAwesomeIcon icon={faPlus} className="text-[10px]" /> Join
                              </button>
                            ) : (
                              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 shrink-0"><FontAwesomeIcon icon={faCheck} className="text-[9px]" /> Joined</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {group.tags.map(tag => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100">{tag}</span>
                            ))}
                          </div>
                          <div className="flex items-center gap-5 mt-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faUsers} className="text-[10px]" /> {group.members.length} members</span>
                            <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faComments} className="text-[10px]" /> {group.discussions} discussions</span>
                            <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faFolderOpen} className="text-[10px]" /> {group.resources} resources</span>
                            <span className="text-muted-foreground/60">·</span>
                            <span>Formed {group.formed}</span>
                            <span className="text-muted-foreground/60">·</span>
                            <span>Active {group.lastActive}</span>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                            <button onClick={() => setSelectedMember(group.lead)} className="flex items-center gap-2 text-xs hover:text-primary transition-colors">
                              <Avatar className="h-6 w-6"><AvatarFallback className="bg-primary/10 text-primary text-[9px] font-medium">{getInitials(group.lead.name)}</AvatarFallback></Avatar>
                              <span className="text-muted-foreground">Led by <span className="font-medium text-slate-700">{group.lead.name}</span></span>
                            </button>
                            <div className="flex items-center">
                              <div className="flex -space-x-2">
                                {group.members.slice(0, 4).map(m => (
                                  <Avatar key={m.id} className="h-7 w-7 border-2 border-white"><AvatarFallback className="bg-slate-100 text-slate-500 text-[9px] font-medium">{getInitials(m.name)}</AvatarFallback></Avatar>
                                ))}
                              </div>
                              <button onClick={() => setViewingGroup(group)} className="ml-3 text-xs font-medium text-primary hover:underline">View group →</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    ));
                  })()}
                </div>
              </TabsContent>

              {/* ─── ADMIN TAB ─── */}
              {isAdmin && (
                <TabsContent value="admin">
                  <div className="space-y-6">
                    {/* Manage Community Details */}
                    <div className="bg-background border border-border rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-serif font-semibold text-card-foreground flex items-center gap-2">
                          <FontAwesomeIcon icon={faCircleInfo} className="text-primary text-sm" /> Community Details
                        </h3>
                        <button
                          onClick={() => setShowManageDetails(!showManageDetails)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors border border-primary/30 text-primary hover:bg-primary/5"
                        >
                          <FontAwesomeIcon icon={faPen} className="text-[10px]" /> Manage community details
                        </button>
                      </div>
                    </div>

                    {/* Manage Community Details Dialog */}
                    <Dialog open={showManageDetails} onOpenChange={setShowManageDetails}>
                      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
                        <DialogHeader className="shrink-0">
                          <DialogTitle className="text-lg font-serif">Edit Community Details</DialogTitle>
                          <DialogDescription className="text-sm text-muted-foreground">
                            Update your community settings. Name and access status changes are restricted to HQ.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-2 overflow-y-auto flex-1 pr-1">
                          {/* HQ-only notice for non-HQ users */}
                          {!isHQ && (
                            <div className="flex items-start gap-2 px-3 py-2.5 bg-muted/50 rounded-lg border border-border text-xs text-muted-foreground">
                              <FontAwesomeIcon icon={faLock} className="text-[10px] mt-0.5" />
                              <span>Community name and access status can only be changed by HQ. To request changes, <a href="mailto:hq@cpsr.uk?subject=Community%20Details%20Change%20Request" className="text-primary hover:underline font-medium">contact HQ</a>.</span>
                            </div>
                          )}
                          {/* Name */}
                          <div>
                            <label className="text-xs font-medium text-card-foreground mb-1.5 block">Name {!isHQ && <span className="text-muted-foreground font-normal">(HQ only)</span>}</label>
                            <input type="text" defaultValue={community.name} disabled={!isHQ} className={`w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${!isHQ ? "opacity-60 cursor-not-allowed" : ""}`} />
                          </div>
                          {/* Access */}
                          <div>
                            <label className="text-xs font-medium text-card-foreground mb-1.5 block">Access {!isHQ && <span className="text-muted-foreground font-normal">(HQ only)</span>}</label>
                            <div className="flex items-center gap-0 border border-border rounded-lg overflow-hidden w-fit">
                              <button disabled={!isHQ} className={`px-4 py-2 text-xs font-medium flex items-center gap-1.5 transition-colors bg-primary text-primary-foreground ${!isHQ ? "opacity-60 cursor-not-allowed" : ""}`}>
                                <FontAwesomeIcon icon={faGlobe} className="text-[10px]" /> Open
                              </button>
                              <button disabled={!isHQ} className={`px-4 py-2 text-xs font-medium flex items-center gap-1.5 transition-colors bg-background text-muted-foreground ${!isHQ ? "opacity-60 cursor-not-allowed" : "hover:bg-muted"}`}>
                                <FontAwesomeIcon icon={faLock} className="text-[10px]" /> Private
                              </button>
                            </div>
                          </div>
                          {/* Official status */}
                          <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/50 rounded-lg border border-border">
                            <FontAwesomeIcon icon={faShieldHalved} className="text-[10px] text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              To request official status,{" "}
                              <a href="mailto:hq@cpsr.uk?subject=Request%20for%20Official%20Community%20Status" className="text-primary hover:underline font-medium">email HQ</a>.
                            </span>
                          </div>
                          {/* Thumbnail */}
                          <div>
                            <label className="text-xs font-medium text-card-foreground mb-1.5 block">Thumbnail</label>
                            <button className="flex items-center gap-2 text-xs text-muted-foreground border border-dashed border-border rounded-lg px-4 py-3 hover:border-primary/30 hover:bg-muted/50 transition-all w-full">
                              <FontAwesomeIcon icon={faCamera} className="text-sm text-muted-foreground/50" /> <span>Change thumbnail image (max 500KB)</span>
                            </button>
                          </div>
                          {/* Summary */}
                          <div>
                            <label className="text-xs font-medium text-card-foreground mb-1.5 block">Summary</label>
                            <textarea defaultValue={community.description.split('.')[0] + '.'} rows={2} className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none" />
                          </div>
                          {/* Description */}
                          <div>
                            <label className="text-xs font-medium text-card-foreground mb-1.5 block">Description</label>
                            <textarea defaultValue={community.description} rows={4} className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none" />
                          </div>
                          {/* Community criteria section */}
                          <div className="border border-border rounded-lg overflow-hidden">
                            <div className="px-4 py-3 bg-muted/30">
                              <span className="text-xs font-semibold text-card-foreground">Community criteria</span>
                            </div>
                            <div className="px-4 py-4 space-y-4 border-t border-border text-xs text-muted-foreground">
                              <p>Location, Sectors, Org Types, Expertise, and External Factors criteria can be edited here. These match the filters used when creating the community.</p>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/60" /> <span className="font-medium text-card-foreground">Location:</span> Global</div>
                                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/60" /> <span className="font-medium text-card-foreground">Sectors:</span> Any sector</div>
                                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/60" /> <span className="font-medium text-card-foreground">Org Types:</span> Any org type</div>
                                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/60" /> <span className="font-medium text-card-foreground">Expertise:</span> Any expertise</div>
                                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/60" /> <span className="font-medium text-card-foreground">External Factors:</span> Any</div>
                              </div>
                            </div>
                          </div>
                          {/* Rules section */}
                          <div className="border border-border rounded-lg overflow-hidden">
                            <div className="px-4 py-3 bg-muted/30">
                              <span className="text-xs font-semibold text-card-foreground">Rules</span>
                            </div>
                            <div className="px-4 py-4 space-y-3 border-t border-border">
                              <div>
                                <label className="text-xs font-medium text-card-foreground mb-1.5 block">Membership approval</label>
                                <select className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-card-foreground">
                                  <option>Anyone can join</option>
                                  <option>Anyone meeting criteria</option>
                                  <option selected>Approval required</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-card-foreground mb-1.5 block">Post review</label>
                                <select className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-card-foreground">
                                  <option>No review required</option>
                                  <option>Posts that meet criteria require review</option>
                                  <option selected>Review required for all posts</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-card-foreground mb-1.5 block">Invite expiry</label>
                                <div className="flex items-center gap-2">
                                  <select className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-card-foreground">
                                    <option>30</option><option>60</option><option selected>90</option><option>120</option><option>180</option>
                                  </select>
                                  <span className="text-xs text-muted-foreground">days after being sent.</span>
                                </div>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-card-foreground mb-1.5 block">Community rules</label>
                                <textarea defaultValue={community.rules.map(r => `${r.title} ${r.detail}`).join('\n')} rows={4} className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none" />
                              </div>
                            </div>
                          </div>
                          {/* Actions */}
                          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                            <button onClick={() => setShowManageDetails(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors">Cancel</button>
                            <button onClick={() => setShowManageDetails(false)} className="px-5 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Save changes</button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Add Contacts Card */}
                    <div className="bg-background border border-border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-base font-serif font-semibold text-card-foreground flex items-center gap-2">
                            <FontAwesomeIcon icon={faUserPlus} className="text-primary text-sm" /> Add Contacts
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">Add contacts individually or upload in bulk. They'll appear as prospects until you choose to invite them.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setShowBulkInvite(!showBulkInvite); setShowAddContact(false); }}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${showBulkInvite ? "bg-primary text-primary-foreground" : "border border-primary/30 text-primary hover:bg-primary/5"}`}
                          >
                            <FontAwesomeIcon icon={faUsers} className="text-[10px]" /> Bulk Upload
                          </button>
                          <button
                            onClick={() => { setShowAddContact(!showAddContact); setShowBulkInvite(false); }}
                            className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
                          >
                            <FontAwesomeIcon icon={faPlus} className="text-[10px]" /> Add Contact
                          </button>
                        </div>
                      </div>

                      {/* Add Contact Form */}
                      {showAddContact && !showBulkInvite && (
                        <div className="mb-4 p-4 bg-muted/30 rounded-lg border border-border space-y-3">
                          <h4 className="text-xs font-semibold text-card-foreground">Add a new contact</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input type="text" value={newContactFirstName} onChange={e => setNewContactFirstName(e.target.value)} placeholder="First name *" className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            <input type="text" value={newContactLastName} onChange={e => setNewContactLastName(e.target.value)} placeholder="Last name *" className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            <input type="email" value={newContactEmail} onChange={e => setNewContactEmail(e.target.value)} placeholder="Email *" className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            <input type="text" value={newContactFirm} onChange={e => setNewContactFirm(e.target.value)} placeholder="Firm / Organisation (optional)…" className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            <input type="text" value={newContactJobTitle} onChange={e => setNewContactJobTitle(e.target.value)} placeholder="Job title / Role *" className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            <input type="text" value={newContactCity} onChange={e => setNewContactCity(e.target.value)} placeholder="City *" className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            <input type="text" value={newContactCountry} onChange={e => setNewContactCountry(e.target.value)} placeholder="Country *" className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                          </div>
                          <p className="text-[10px] text-muted-foreground">Fields marked with * are required. Organisation is optional for independent consultants.</p>
                          <div className="flex justify-end gap-2">
                            <button onClick={() => { setShowAddContact(false); setNewContactFirstName(""); setNewContactLastName(""); setNewContactEmail(""); setNewContactFirm(""); setNewContactCity(""); setNewContactCountry(""); setNewContactJobTitle(""); }} className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 transition-colors">Cancel</button>
                            <button
                              disabled={!newContactFirstName.trim() || !newContactLastName.trim() || !newContactEmail.trim() || !newContactCity.trim() || !newContactCountry.trim() || !newContactJobTitle.trim()}
                              onClick={() => {
                                const newProspect: Member & { _source?: string } = {
                                  id: `prospect-${Date.now()}`,
                                  name: `${newContactFirstName.trim()} ${newContactLastName.trim()}`,
                                  role: newContactJobTitle.trim(),
                                  firm: newContactFirm.trim(),
                                  joinedDate: `Added ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`,
                                  expertise: [],
                                  email: newContactEmail.trim(),
                                  location: `${newContactCity.trim()}, ${newContactCountry.trim()}`,
                                  _source: "prospect",
                                };
                                setProspectContacts(prev => [newProspect, ...prev]);
                                setShowAddContact(false);
                                setNewContactFirstName(""); setNewContactLastName(""); setNewContactEmail(""); setNewContactFirm(""); setNewContactCity(""); setNewContactCountry(""); setNewContactJobTitle("");
                              }}
                              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${newContactFirstName.trim() && newContactLastName.trim() && newContactEmail.trim() && newContactCity.trim() && newContactCountry.trim() && newContactJobTitle.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground"}`}
                            >
                              <FontAwesomeIcon icon={faPlus} className="mr-1 text-[10px]" /> Add Contact
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Bulk Upload Panel */}
                      {showBulkInvite && (
                        <div className="mb-4 p-4 bg-muted/30 rounded-lg border border-border space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-semibold text-card-foreground">Bulk upload contacts via CSV</h4>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  const header = "Name,Email,Firm,Job Title,City,Country";
                                  const example = "Jane Smith,jane@example.com,Deloitte,Senior Manager,London,UK\nJohn Doe,john@company.org,,Independent Consultant,New York,US";
                                  const blob = new Blob([header + "\n" + example], { type: "text/csv" });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement("a");
                                  a.href = url;
                                  a.download = "community-contacts-template.csv";
                                  a.click();
                                  URL.revokeObjectURL(url);
                                }}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 border border-border rounded-lg text-[11px] font-medium text-primary hover:bg-primary/5 cursor-pointer transition-colors"
                              >
                                <FontAwesomeIcon icon={faDownload} className="text-[10px]" /> Download template
                              </button>
                              <label className="flex items-center gap-1.5 px-2.5 py-1.5 border border-border rounded-lg text-[11px] font-medium text-muted-foreground hover:bg-background cursor-pointer transition-colors">
                                <FontAwesomeIcon icon={faFileAlt} className="text-[10px]" /> Import CSV
                                <input type="file" accept=".csv,.txt" onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    const text = ev.target?.result as string;
                                    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
                                    // Skip header if present
                                    const startIdx = lines[0]?.toLowerCase().includes("name") && lines[0]?.toLowerCase().includes("email") ? 1 : 0;
                                    const newProspects: (Member & { _source?: string })[] = [];
                                    for (let i = startIdx; i < lines.length; i++) {
                                      const parts = lines[i].split(",").map(p => p.trim().replace(/^"|"$/g, ""));
                                      if (parts.length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parts[1])) {
                                        newProspects.push({
                                          id: `prospect-csv-${Date.now()}-${i}`,
                                          name: parts[0] || "Unknown",
                                          email: parts[1],
                                          firm: parts[2] || "",
                                          role: parts[3] || "",
                                          location: [parts[4], parts[5]].filter(Boolean).join(", "),
                                          joinedDate: `Added ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`,
                                          expertise: [],
                                          _source: "prospect",
                                        });
                                      }
                                    }
                                    if (newProspects.length > 0) {
                                      setProspectContacts(prev => [...newProspects, ...prev]);
                                      setBulkUploadCount(newProspects.length);
                                      setTimeout(() => setBulkUploadCount(0), 3000);
                                    }
                                  };
                                  reader.readAsText(file);
                                  e.target.value = "";
                                }} className="hidden" />
                              </label>
                            </div>
                          </div>
                          <p className="text-[10px] text-muted-foreground">Upload a CSV with name, email, firm, job title, city and country. Contacts will be added as prospects — you can then select and invite them from the member list below.</p>
                          {bulkUploadCount > 0 && (
                            <div className="bg-background border border-primary/20 rounded-lg p-3">
                              <p className="text-[11px] font-medium text-primary flex items-center gap-1.5">
                                <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                                {bulkUploadCount} contact{bulkUploadCount !== 1 ? "s" : ""} added as prospects
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-1">Select them in the member list below and click "Send invites" when ready.</p>
                            </div>
                          )}
                          <div className="flex items-center justify-end">
                            <button onClick={() => { setShowBulkInvite(false); setBulkUploadCount(0); }} className="text-xs text-muted-foreground px-3 py-1.5">Close</button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Event Management Card */}
                    <div className="bg-background border border-border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-base font-serif font-semibold text-card-foreground flex items-center gap-2">
                            <FontAwesomeIcon icon={faCalendarSolid} className="text-primary text-sm" /> Manage Events
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">Create and manage community events.</p>
                        </div>
                        <button
                          onClick={() => setShowAddEvent(!showAddEvent)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${showAddEvent ? "bg-primary text-primary-foreground" : "border border-primary/30 text-primary hover:bg-primary/5"}`}
                        >
                          <FontAwesomeIcon icon={faPlus} className="text-[10px]" /> Add Event
                        </button>
                      </div>

                      {showAddEvent && (
                        <div className="mb-4 p-4 bg-muted/30 rounded-lg border border-border space-y-3">
                          <h4 className="text-xs font-semibold text-card-foreground">Create new event</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={newEventTitle}
                              onChange={e => setNewEventTitle(e.target.value)}
                              placeholder="Event title *"
                              className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <select
                              value={newEventType}
                              onChange={e => setNewEventType(e.target.value as Event["type"])}
                              className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                              <option value="webinar">Webinar</option>
                              <option value="meetup">Meetup</option>
                              <option value="conference">Conference</option>
                              <option value="workshop">Workshop</option>
                            </select>
                            <input
                              type="date"
                              value={newEventDate}
                              onChange={e => setNewEventDate(e.target.value)}
                              className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <input
                              type="time"
                              value={newEventTime}
                              onChange={e => setNewEventTime(e.target.value)}
                              className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <input
                              type="text"
                              value={newEventSpeaker}
                              onChange={e => setNewEventSpeaker(e.target.value)}
                              placeholder="Speaker (optional)"
                              className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <select
                              value={newEventRecurring}
                              onChange={e => setNewEventRecurring(e.target.value as "" | "weekly" | "biweekly" | "monthly")}
                              className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                              <option value="">Not recurring</option>
                              <option value="weekly">Weekly</option>
                              <option value="biweekly">Fortnightly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                          </div>
                          <textarea
                            value={newEventDescription}
                            onChange={e => setNewEventDescription(e.target.value.slice(0, 500))}
                            placeholder="Event description *"
                            rows={3}
                            className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setShowAddEvent(false);
                                setNewEventTitle("");
                                setNewEventDate("");
                                setNewEventTime("");
                                setNewEventType("webinar");
                                setNewEventDescription("");
                                setNewEventSpeaker("");
                                setNewEventRecurring("");
                              }}
                              className="text-xs text-muted-foreground px-3 py-1.5"
                            >
                              Cancel
                            </button>
                            <button
                              disabled={!newEventTitle.trim() || !newEventDate || !newEventTime || !newEventDescription.trim()}
                              onClick={() => {
                                const newEvent: Event = {
                                  id: `event-${Date.now()}`,
                                  title: newEventTitle.trim(),
                                  date: new Date(newEventDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
                                  time: newEventTime,
                                  type: newEventType,
                                  attendees: 0,
                                  description: newEventDescription.trim(),
                                  speaker: newEventSpeaker.trim() || undefined,
                                  recurring: newEventRecurring || undefined,
                                };
                                setCommunityEvents(prev => [newEvent, ...prev]);
                                setShowAddEvent(false);
                                setNewEventTitle("");
                                setNewEventDate("");
                                setNewEventTime("");
                                setNewEventType("webinar");
                                setNewEventDescription("");
                                setNewEventSpeaker("");
                                setNewEventRecurring("");
                              }}
                              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                newEventTitle.trim() && newEventDate && newEventTime && newEventDescription.trim()
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              Create Event
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium text-card-foreground">{communityEvents.length}</span> events scheduled
                      </div>
                    </div>

                    {/* Member Management Card */}
                    <div className="bg-white border border-gray-200 rounded-lg">
                      {/* Status Tabs */}
                      <div className="px-6 pt-5 pb-0">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base font-serif font-semibold text-card-foreground flex items-center gap-2">
                            <FontAwesomeIcon icon={faUsers} className="text-primary text-sm" /> Manage Members
                          </h3>
                          {adminSelected.size > 0 && (
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
                              <FontAwesomeIcon icon={faPaperPlane} className="text-[10px]" /> Send invites to {adminSelected.size} selected
                            </button>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          {([
                            { key: "members", label: "Members", checked: adminShowMembers, toggle: () => setAdminShowMembers(v => !v), count: mockMembers.length - removedMembers.size },
                            { key: "management", label: "Management", checked: adminShowManagement, toggle: () => setAdminShowManagement(v => !v), count: Object.entries(memberRoles).filter(([id, r]) => (r === "founder" || r === "moderator") && !removedMembers.has(id)).length },
                            { key: "prospects", label: "Prospect", checked: adminShowProspects, toggle: () => setAdminShowProspects(v => !v), count: prospectContacts.length },
                            { key: "invited", label: "Invited", checked: adminShowInvited, toggle: () => setAdminShowInvited(v => !v), count: mockInvited.length },
                            { key: "blocked", label: "Blocked", checked: adminShowBlocked, toggle: () => setAdminShowBlocked(v => !v), count: mockBlocked.length },
                          ]).map(tab => (
                            <label key={tab.key} className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={tab.checked}
                                onChange={() => { tab.toggle(); setAdminPage(1); }}
                                className="accent-[hsl(var(--primary))] w-3.5 h-3.5 rounded cursor-pointer"
                              />
                              <span className={`font-medium ${tab.checked ? "text-primary" : "text-muted-foreground"}`}>
                                {tab.label}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab.checked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{tab.count}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                          <button onClick={() => { setAdminShowMembers(true); setAdminShowManagement(true); setAdminShowProspects(true); setAdminShowInvited(true); setAdminShowBlocked(true); setAdminPage(1); }} className="text-[10px] text-primary hover:underline font-medium">Select all</button>
                          <button onClick={() => { setAdminShowMembers(false); setAdminShowManagement(false); setAdminShowProspects(false); setAdminShowInvited(false); setAdminShowBlocked(false); setAdminPage(1); }} className="text-[10px] text-muted-foreground hover:underline font-medium">Select none</button>
                        </div>
                      </div>

                      {/* Filters Row */}
                      <div className="px-6 pb-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="relative flex-1 min-w-[180px]">
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                            <input
                              type="text"
                              value={adminSearchQuery}
                              onChange={e => { setAdminSearchQuery(e.target.value); setAdminPage(1); }}
                              placeholder="Search…"
                              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                            />
                          </div>
                          <select value={adminFilterFirm} onChange={e => { setAdminFilterFirm(e.target.value); setAdminPage(1); }} className="text-xs border border-border rounded-lg px-2.5 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-muted-foreground">
                            <option value="all">All firms</option>
                            {allFirms.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                          <select value={adminFilterCountry} onChange={e => { setAdminFilterCountry(e.target.value); setAdminFilterCity("all"); setAdminPage(1); }} className="text-xs border border-border rounded-lg px-2.5 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-muted-foreground">
                            <option value="all">All countries</option>
                            {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <select value={adminFilterCity} onChange={e => { setAdminFilterCity(e.target.value); setAdminPage(1); }} className="text-xs border border-border rounded-lg px-2.5 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-muted-foreground">
                            <option value="all">All cities</option>
                            {allCities.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <select value={adminFilterRole} onChange={e => { setAdminFilterRole(e.target.value); setAdminPage(1); }} className="text-xs border border-border rounded-lg px-2.5 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-muted-foreground">
                            <option value="all">All roles</option>
                            <option value="founder">Owner</option>
                            <option value="moderator">Manager</option>
                            <option value="contributor">Contributor</option>
                            <option value="member">Member</option>
                          </select>
                        </div>
                        {/* Extra Filters Row */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3">
                          <label className="flex items-center gap-1.5 text-[11px] text-card-foreground cursor-pointer select-none">
                            <input type="checkbox" checked={showExpiredInvites} onChange={() => setShowExpiredInvites(!showExpiredInvites)} className="accent-[hsl(var(--primary))] w-3.5 h-3.5 rounded cursor-pointer" />
                            Show expired invites
                          </label>
                          <label className="flex items-center gap-1.5 text-[11px] text-card-foreground cursor-pointer select-none">
                            <input type="checkbox" checked={showAddedByManagement} onChange={() => setShowAddedByManagement(!showAddedByManagement)} className="accent-[hsl(var(--primary))] w-3.5 h-3.5 rounded cursor-pointer" />
                            Contacts added by community management
                          </label>
                          <label className="flex items-center gap-1.5 text-[11px] text-card-foreground cursor-pointer select-none">
                            <input type="checkbox" checked={showResearchPanelMembers} onChange={() => setShowResearchPanelMembers(!showResearchPanelMembers)} className="accent-[hsl(var(--primary))] w-3.5 h-3.5 rounded cursor-pointer" />
                            Show research panel members
                          </label>
                          <button
                            onClick={() => {
                              const panelMembers = mockMembers.filter(m => researchPanelMemberIds.has(m.id));
                              const csv = "Name,Email,Firm,Role,Location\n" + panelMembers.map(m => `"${m.name}","${m.email || ""}","${m.firm}","${m.role}","${m.location || ""}"`).join("\n");
                              const blob = new Blob([csv], { type: "text/csv" });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url; a.download = "research-panel-members.csv"; a.click();
                              URL.revokeObjectURL(url);
                            }}
                            className="flex items-center gap-1.5 text-[11px] text-primary font-medium hover:underline cursor-pointer"
                          >
                            <FontAwesomeIcon icon={faFileExport} className="text-[10px]" /> Export research panel
                          </button>
                          <div className="ml-auto flex items-center gap-1.5">
                            <span className="text-[11px] text-muted-foreground">Show:</span>
                            <select value={adminPerPage} onChange={e => { setAdminPerPage(e.target.value === "all" ? 9999 : Number(e.target.value)); setAdminPage(1); }} className="text-[11px] border border-border rounded-md px-2 py-1 bg-background focus:outline-none text-muted-foreground">
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                              <option value="all">All</option>
                            </select>
                            <span className="text-[11px] text-muted-foreground">members</span>
                          </div>
                        </div>
                      </div>

                      {/* Table Header */}
                      <div className="border-t border-border">
                        <div className="grid grid-cols-[40px_1fr_100px_110px_1fr_120px_100px] items-center px-6 py-2.5 bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          <div className="flex items-center justify-center">
                            {invitedOnPage.length > 0 ? (
                              <button
                                onClick={toggleSelectAll}
                                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${adminSelected.size === invitedOnPage.length && invitedOnPage.length > 0 ? "bg-primary border-primary text-primary-foreground" : "border-border"}`}
                              >
                                {adminSelected.size === invitedOnPage.length && invitedOnPage.length > 0 && <FontAwesomeIcon icon={faCheck} className="text-[7px]" />}
                              </button>
                            ) : <div className="w-4 h-4" />}
                          </div>
                          <span>Name & Position</span>
                          <span>Involvement</span>
                          <span>Join date</span>
                          <span>Firm</span>
                          <span>Location</span>
                          <span className="text-right">Actions</span>
                        </div>

                        {/* Member Rows */}
                        <div className="divide-y divide-border">
                          {paginatedAdminMembers.map(m => (
                            <div key={m.id} className={`grid grid-cols-[40px_1fr_100px_110px_1fr_120px_100px] items-center px-6 py-3 hover:bg-muted/20 transition-colors group ${adminSelected.has(m.id) ? "bg-primary/[0.03]" : ""}`}>
                              <div className="flex items-center justify-center">
                                {((m as any)._source === "invited" || (m as any)._source === "prospect") ? (
                                  <button
                                    onClick={() => toggleAdminSelect(m.id)}
                                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${adminSelected.has(m.id) ? "bg-primary border-primary text-primary-foreground" : "border-border group-hover:border-primary/30"}`}
                                  >
                                    {adminSelected.has(m.id) && <FontAwesomeIcon icon={faCheck} className="text-[7px]" />}
                                  </button>
                                ) : <div className="w-4 h-4" />}
                              </div>
                              <div className="flex items-center gap-2.5 min-w-0">
                                <button onClick={() => setSelectedMember(m)} className="shrink-0">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-medium group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                      {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                </button>
                                <div className="min-w-0">
                                  <button onClick={() => setSelectedMember(m)} className="text-xs font-medium text-card-foreground hover:text-primary transition-colors truncate block">{m.name}</button>
                                  <span className="text-[10px] text-muted-foreground truncate block">{m.role}</span>
                                </div>
                              </div>
                              <div>
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                  (m as any)._source === "invited" && (m as any).expired ? "bg-red-50 text-red-600 border border-red-200" :
                                  (m as any)._source === "prospect" ? "bg-slate-50 text-slate-600 border border-slate-200" :
                                  memberRoles[m.id] === "founder" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                                  memberRoles[m.id] === "moderator" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                                  memberRoles[m.id] === "contributor" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                  "bg-muted text-muted-foreground border border-border"
                                }`}>
                                  {(m as any)._source === "prospect" ? "Prospect" :
                                   (m as any)._source === "invited" ? ((m as any).expired ? "Expired" : "Invited") :
                                   (m as any)._source === "requested" ? "Requested" :
                                   (m as any)._source === "blocked" ? "Blocked" :
                                   memberRoles[m.id] === "founder" ? "Owner" :
                                   memberRoles[m.id] === "moderator" ? "Manager" :
                                   (memberRoles[m.id] || "member").charAt(0).toUpperCase() + (memberRoles[m.id] || "member").slice(1)}
                                </span>
                              </div>
                              <span className="text-[11px] text-muted-foreground">{m.joinedDate}</span>
                              <span className="text-[11px] text-muted-foreground truncate">{m.firm || <span className="italic text-muted-foreground/50">Independent</span>}</span>
                              <span className="text-[11px] text-muted-foreground truncate">{m.location || "—"}</span>
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Role change button */}
                                {(m as any)._source !== "invited" && (m as any)._source !== "requested" && (m as any)._source !== "blocked" && memberRoles[m.id] !== "founder" && (
                                  <div className="relative" ref={roleDropdownOpen === m.id ? roleDropdownRef : undefined}>
                                    <button
                                      onClick={() => setRoleDropdownOpen(roleDropdownOpen === m.id ? null : m.id)}
                                      className="text-[10px] border border-primary/30 text-primary rounded-md px-2 py-1 hover:bg-primary/5 transition-colors font-medium"
                                    >
                                      {memberRoles[m.id] === "moderator" ? "Change role" : "Make manager"}
                                    </button>
                                    {roleDropdownOpen === m.id && (
                                      <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1">
                                        {/* Make owner option — transfers ownership */}
                                        <button
                                          onClick={() => {
                                            // Find current owner and demote to manager
                                            const currentOwner = Object.entries(memberRoles).find(([, r]) => r === "founder");
                                            if (currentOwner) handleChangeRole(currentOwner[0], "moderator");
                                            handleChangeRole(m.id, "founder");
                                          }}
                                          className={`w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center justify-between text-muted-foreground`}
                                        >
                                          <span><FontAwesomeIcon icon={faCrown} className="text-amber-500 text-[9px] mr-1.5" />Make owner</span>
                                        </button>
                                        <button onClick={() => handleChangeRole(m.id, "moderator")} className={`w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center justify-between ${memberRoles[m.id] === "moderator" ? "text-primary font-medium" : "text-muted-foreground"}`}>
                                          Manager {memberRoles[m.id] === "moderator" && <FontAwesomeIcon icon={faCheck} className="text-[10px]" />}
                                        </button>
                                        <button onClick={() => handleChangeRole(m.id, "contributor")} className={`w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center justify-between ${memberRoles[m.id] === "contributor" ? "text-primary font-medium" : "text-muted-foreground"}`}>
                                          Contributor {memberRoles[m.id] === "contributor" && <FontAwesomeIcon icon={faCheck} className="text-[10px]" />}
                                        </button>
                                        <button onClick={() => handleChangeRole(m.id, "member")} className={`w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center justify-between ${memberRoles[m.id] === "member" ? "text-primary font-medium" : "text-muted-foreground"}`}>
                                          Member {memberRoles[m.id] === "member" && <FontAwesomeIcon icon={faCheck} className="text-[10px]" />}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                                {/* Owner badge — no role change allowed */}
                                {memberRoles[m.id] === "founder" && (m as any)._source !== "invited" && (
                                  <span className="text-[10px] text-amber-600 font-medium flex items-center gap-1"><FontAwesomeIcon icon={faCrown} className="text-[9px]" /> Owner</span>
                                )}
                                {(m as any)._source === "invited" && (
                                  <button onClick={() => {}} className="text-[10px] border border-primary/30 text-primary rounded-md px-2 py-1 hover:bg-primary/5 transition-colors font-medium flex items-center gap-1">
                                    <FontAwesomeIcon icon={faRepeat} className="text-[9px]" /> Re-send
                                  </button>
                                )}
                                {(m as any)._source === "requested" && (
                                  <button className="text-[10px] border border-primary/30 text-primary rounded-md px-2 py-1 hover:bg-primary/5 transition-colors font-medium">Approve</button>
                                )}
                                {(m as any)._source === "blocked" && (
                                  <button className="text-[10px] border border-primary/30 text-primary rounded-md px-2 py-1 hover:bg-primary/5 transition-colors font-medium">Unblock</button>
                                )}
                                {/* Hamburger menu — hidden for owners */}
                                {memberRoles[m.id] !== "founder" && (
                                <div className="relative">
                                  <button
                                    onClick={() => setMemberMenuOpen(memberMenuOpen === m.id ? null : m.id)}
                                    className="text-muted-foreground/40 hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
                                    title="More actions"
                                  >
                                    <FontAwesomeIcon icon={faEllipsisH} className="text-xs" />
                                  </button>
                                  {memberMenuOpen === m.id && (
                                    <div className="absolute right-0 mt-1 w-52 bg-card rounded-lg shadow-xl border border-border z-50 py-1">
                                      {/* Make into member (for managers) */}
                                      {memberRoles[m.id] === "moderator" && (
                                        <button
                                          onClick={() => { handleChangeRole(m.id, "member"); setMemberMenuOpen(null); }}
                                          className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center gap-2 text-muted-foreground"
                                        >
                                          <FontAwesomeIcon icon={faUsers} className="text-[10px] text-primary" /> Make member
                                        </button>
                                      )}
                                      {/* Research panel */}
                                      {!researchPanelMemberIds.has(m.id) ? (
                                        <button
                                          onClick={() => { setResearchPanelMemberIds(prev => { const n = new Set(prev); n.add(m.id); return n; }); setMemberMenuOpen(null); }}
                                          className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center gap-2 text-muted-foreground"
                                        >
                                          <FontAwesomeIcon icon={faVials} className="text-[10px] text-primary" /> Add to research panel
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => { setResearchPanelMemberIds(prev => { const n = new Set(prev); n.delete(m.id); return n; }); setMemberMenuOpen(null); }}
                                          className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center gap-2 text-muted-foreground"
                                        >
                                          <FontAwesomeIcon icon={faUserMinus} className="text-[10px] text-amber-600" /> Remove from research panel
                                        </button>
                                      )}
                                      <div className="my-1 border-t border-border" />
                                      {/* Remove */}
                                      <button
                                        onClick={() => { setConfirmRemove(m); setMemberMenuOpen(null); }}
                                        className="w-full text-left px-3 py-2 text-xs hover:bg-destructive/5 transition-colors flex items-center gap-2 text-destructive"
                                      >
                                        <FontAwesomeIcon icon={faTrashAlt} className="text-[10px]" /> Remove from community
                                      </button>
                                      {/* Block */}
                                      <button
                                        onClick={() => { setMemberMenuOpen(null); }}
                                        className="w-full text-left px-3 py-2 text-xs hover:bg-destructive/5 transition-colors flex items-center gap-2 text-destructive"
                                      >
                                        <FontAwesomeIcon icon={faBan} className="text-[10px]" /> Block member
                                      </button>
                                    </div>
                                  )}
                                </div>
                                )}
                              </div>
                            </div>
                          ))}
                          {paginatedAdminMembers.length === 0 && (
                            <div className="text-center py-10">
                              <FontAwesomeIcon icon={faSearch} className="text-2xl text-muted-foreground/30 mb-2" />
                              <p className="text-sm text-muted-foreground">No members match your filters.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/20">
                        <span className="text-[11px] text-muted-foreground">
                          Showing {filteredAdminMembers.length > 0 ? (adminPage - 1) * adminPerPage + 1 : 0}–{Math.min(adminPage * adminPerPage, filteredAdminMembers.length)} of {filteredAdminMembers.length} entries
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            disabled={adminPage === 1}
                            onClick={() => setAdminPage(1)}
                            className={`text-[11px] px-2 py-1 rounded transition-colors ${adminPage === 1 ? "text-muted-foreground/40" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                          >
                            First
                          </button>
                          <button
                            disabled={adminPage === 1}
                            onClick={() => setAdminPage(p => Math.max(1, p - 1))}
                            className={`text-[11px] px-2 py-1 rounded transition-colors ${adminPage === 1 ? "text-muted-foreground/40" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                          >
                            Previous
                          </button>
                          {Array.from({ length: adminTotalPages }, (_, i) => i + 1).map(p => (
                            <button
                              key={p}
                              onClick={() => setAdminPage(p)}
                              className={`text-[11px] w-7 h-7 rounded transition-colors ${adminPage === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                            >
                              {p}
                            </button>
                          ))}
                          <button
                            disabled={adminPage === adminTotalPages}
                            onClick={() => setAdminPage(p => Math.min(adminTotalPages, p + 1))}
                            className={`text-[11px] px-2 py-1 rounded transition-colors ${adminPage === adminTotalPages ? "text-muted-foreground/40" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                          >
                            Next
                          </button>
                          <button
                            disabled={adminPage === adminTotalPages}
                            onClick={() => setAdminPage(adminTotalPages)}
                            className={`text-[11px] px-2 py-1 rounded transition-colors ${adminPage === adminTotalPages ? "text-muted-foreground/40" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                          >
                            Last
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Admin Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h3 className="text-sm font-semibold text-card-foreground mb-3">Role Summary</h3>
                        <div className="space-y-2.5">
                          {["founder", "moderator", "contributor", "member"].map(role => {
                            const count = Object.entries(memberRoles).filter(([id, r]) => r === role && !removedMembers.has(id)).length;
                            return (
                              <div key={role} className="flex items-center justify-between text-xs">
                                <span className="capitalize text-muted-foreground flex items-center gap-2">
                                  <BadgeIcon badge={role !== "member" ? role as any : undefined} />
                                  {role}
                                </span>
                                <span className="font-medium text-card-foreground">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h3 className="text-sm font-semibold text-card-foreground mb-3">Quick Actions</h3>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                          <li className="flex items-center gap-2"><FontAwesomeIcon icon={faUserPlus} className="text-primary text-[10px]" /> Invite via email or link</li>
                          <li className="flex items-center gap-2"><FontAwesomeIcon icon={faShieldHalved} className="text-primary text-[10px]" /> Assign roles</li>
                          <li className="flex items-center gap-2"><FontAwesomeIcon icon={faFilter} className="text-primary text-[10px]" /> Filter by role, firm, location</li>
                          <li className="flex items-center gap-2"><FontAwesomeIcon icon={faBan} className="text-primary text-[10px]" /> Remove or block members</li>
                        </ul>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                        <h3 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
                          <FontAwesomeIcon icon={faShieldHalved} className="text-xs" /> Admin Notice
                        </h3>
                        <p className="text-xs text-amber-700 leading-relaxed">
                          Only Founders and Moderators can access this panel. Role changes and removals are logged for transparency.
                        </p>
                      </div>
                    </div>

                    {/* HQ-level: Cross-community controls */}
                    {isHQ && (
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 space-y-4">
                        <h3 className="text-base font-serif font-semibold text-amber-900 flex items-center gap-2">
                          <FontAwesomeIcon icon={faCrown} className="text-amber-600 text-sm" /> HQ — Platform Controls
                        </h3>
                        <p className="text-xs text-amber-700">You have cross-community HQ admin access. Changes here affect all communities on the platform.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="bg-background border border-border rounded-lg p-4 space-y-2">
                            <h4 className="text-xs font-semibold text-card-foreground flex items-center gap-2">
                              <FontAwesomeIcon icon={faGlobe} className="text-primary text-[10px]" /> Cross-Community Access
                            </h4>
                            <ul className="text-[11px] text-muted-foreground space-y-1.5">
                              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> View & manage all 12 communities</li>
                              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Override any community settings</li>
                              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Access all member data across communities</li>
                              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> View analytics across all communities</li>
                            </ul>
                          </div>
                          <div className="bg-background border border-border rounded-lg p-4 space-y-2">
                            <h4 className="text-xs font-semibold text-card-foreground flex items-center gap-2">
                              <FontAwesomeIcon icon={faShieldHalved} className="text-primary text-[10px]" /> Quick Actions
                            </h4>
                            <div className="space-y-1.5">
                              <button className="w-full text-left text-[11px] px-3 py-2 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                <FontAwesomeIcon icon={faUsers} className="text-[10px] text-primary" /> View all platform members ({mockMembers.length * 3})
                              </button>
                              <button className="w-full text-left text-[11px] px-3 py-2 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                <FontAwesomeIcon icon={faBan} className="text-[10px] text-destructive" /> Platform-wide ban user
                              </button>
                              <button className="w-full text-left text-[11px] px-3 py-2 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                <FontAwesomeIcon icon={faChartLine} className="text-[10px] text-primary" /> Platform analytics dashboard
                              </button>
                              <button className="w-full text-left text-[11px] px-3 py-2 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                <FontAwesomeIcon icon={faStar} className="text-[10px] text-amber-500" /> Feature this community
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2 border-t border-amber-200">
                          <span className="text-[10px] text-amber-600 font-medium">AUDIT:</span>
                          <span className="text-[10px] text-amber-700">All HQ-level actions are logged with timestamp and operator ID.</span>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}

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
                    {/* Community-Specific Rules */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <FontAwesomeIcon icon={faShieldHalved} className="text-primary text-sm" />
                        <h3 className="text-lg font-serif font-semibold text-card-foreground">Community Rules</h3>
                      </div>

                      {/* Governance summary */}
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Membership</div>
                          <div className="text-xs font-medium text-slate-700">
                            {community.governance.membership === "anyone" ? "Open to anyone" : community.governance.membership === "criteria" ? "Criteria-based" : "Requires approval"}
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Post review</div>
                          <div className="text-xs font-medium text-slate-700">
                            {community.governance.postReview === "none" ? "No review" : community.governance.postReview === "criteria" ? "Criteria-based" : "All posts reviewed"}
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Content review</div>
                          <div className="text-xs font-medium text-slate-700">
                            {community.governance.contentReview === "none" ? "No review" : community.governance.contentReview === "criteria" ? "Criteria-based" : "All content reviewed"}
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Invite expiry</div>
                          <div className="text-xs font-medium text-slate-700">{community.governance.inviteExpiry} days</div>
                        </div>
                      </div>

                      <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                        {community.rules.map((rule, i) => (
                          <li key={i}><span className="font-medium text-slate-700">{rule.title}</span> {rule.detail}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Platform-Wide Rules */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <FontAwesomeIcon icon={faGlobe} className="text-muted-foreground text-sm" />
                        <h3 className="text-lg font-serif font-semibold text-card-foreground">Platform Rules</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">These rules apply to all communities on the platform.</p>
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

      {/* Discussion Thread Modal */}
      <Dialog open={!!selectedDiscussion} onOpenChange={(open) => { if (!open) { setSelectedDiscussion(null); setReplyingTo(null); setReplyText(""); } }}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="sr-only">{selectedDiscussion?.title}</DialogTitle>
            <DialogDescription className="sr-only">Discussion thread</DialogDescription>
          </DialogHeader>
          {selectedDiscussion && (() => {
            const allReplies = [...(mockReplies[selectedDiscussion.id] || []), ...(threadReplies[selectedDiscussion.id] || [])];
            const postLiked = likedItems.has(`post-${selectedDiscussion.id}`);
            return (
            <div className="flex flex-col gap-0 overflow-hidden -mt-2">
              {/* Original Post */}
              <div className="pb-4 border-b border-border">
                <div className="flex items-start gap-3">
                  <button onClick={() => { setSelectedMember(selectedDiscussion.author); }} className="shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {selectedDiscussion.author.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedDiscussion.pinned && <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0">Pinned</Badge>}
                      <h2 className="text-base font-serif font-semibold text-card-foreground">{selectedDiscussion.title}</h2>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                      <button onClick={() => setSelectedMember(selectedDiscussion.author)} className="font-medium text-slate-600 hover:text-primary transition-colors">{selectedDiscussion.author.name}</button>
                      <BadgeIcon badge={selectedDiscussion.author.badge} />
                      <span>·</span>
                      <span>{selectedDiscussion.author.firm}</span>
                      <span>·</span>
                      <span>{selectedDiscussion.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{selectedDiscussion.content}</p>
                    <div className="flex items-center gap-3 mt-3">
                      {selectedDiscussion.tags.map(tag => (
                        <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-5 mt-3 text-xs text-muted-foreground">
                      <button
                        onClick={() => toggleLike(`post-${selectedDiscussion.id}`)}
                        className={`flex items-center gap-1.5 transition-colors ${postLiked ? "text-primary font-medium" : "hover:text-primary"}`}
                      >
                        <FontAwesomeIcon icon={faThumbsUp} /> {selectedDiscussion.likes + (postLiked ? 1 : 0)}
                      </button>
                      <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faReply} /> {allReplies.length} replies
                      </span>
                      <button
                        onClick={() => toggleBookmark(selectedDiscussion.id)}
                        className={`ml-auto transition-colors ${bookmarkedDiscussions.includes(selectedDiscussion.id) ? "text-primary" : "text-slate-300 hover:text-primary"}`}
                      >
                        <FontAwesomeIcon icon={bookmarkedDiscussions.includes(selectedDiscussion.id) ? faBookmarkSolid : faBookmarkRegular} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Replies */}
              <div className="overflow-y-auto flex-1 pt-4 space-y-0">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  {allReplies.length} {allReplies.length === 1 ? "Reply" : "Replies"}
                </h3>
                {allReplies.map(reply => {
                  const isNested = !!reply.parentId;
                  const replyLiked = likedItems.has(`reply-${reply.id}`);
                  return (
                    <div key={reply.id} className={`${isNested ? "ml-10 border-l-2 border-primary/10 pl-4" : ""} pb-4 mb-4 ${isNested ? "" : "border-b border-gray-50"}`}>
                      <div className="flex items-start gap-3">
                        <button onClick={() => setSelectedMember(reply.author)} className="shrink-0">
                          <Avatar className={`${isNested ? "h-7 w-7" : "h-8 w-8"}`}>
                            <AvatarFallback className={`text-[10px] font-medium ${reply.author.id === "self" ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-600"}`}>
                              {reply.author.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <button onClick={() => setSelectedMember(reply.author)} className="font-medium text-slate-700 hover:text-primary transition-colors">{reply.author.name}</button>
                            <BadgeIcon badge={reply.author.badge} />
                            <span>·</span>
                            <span>{reply.date}</span>
                            {reply.author.id === "self" && <Badge className="bg-primary/10 text-primary border-0 text-[9px] px-1.5 py-0 ml-1">You</Badge>}
                          </div>
                          {reply.parentId && (() => {
                            const parent = allReplies.find(r => r.id === reply.parentId);
                            return parent ? (
                              <p className="text-[11px] text-muted-foreground/70 mt-0.5 flex items-center gap-1">
                                <FontAwesomeIcon icon={faReply} className="text-[9px]" /> Replying to {parent.author.name}
                              </p>
                            ) : null;
                          })()}
                          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{reply.content}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <button
                              onClick={() => toggleLike(`reply-${reply.id}`)}
                              className={`flex items-center gap-1 transition-colors ${replyLiked ? "text-primary font-medium" : "hover:text-primary"}`}
                            >
                              <FontAwesomeIcon icon={faThumbsUp} className="text-[10px]" /> {reply.likes + (replyLiked ? 1 : 0)}
                            </button>
                            <button
                              onClick={() => { setReplyingTo(reply); }}
                              className={`transition-colors ${replyingTo?.id === reply.id ? "text-primary font-medium" : "hover:text-primary"}`}
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {allReplies.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">No replies yet. Be the first to respond.</p>
                )}
              </div>

              {/* Reply Input */}
              {selectedDiscussion.repliesDisabled ? (
                <div className="pt-3 border-t border-border mt-auto">
                  <div className="flex items-center gap-2 justify-center py-2 text-xs text-muted-foreground bg-muted/50 rounded-lg">
                    <FontAwesomeIcon icon={faLock} className="text-[10px]" />
                    Replies have been disabled for this discussion
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-border mt-auto">
                  {replyingTo && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 bg-slate-50 rounded-md px-3 py-1.5">
                      <span>Replying to <span className="font-medium text-slate-700">{replyingTo.author.name}</span></span>
                      <button onClick={() => setReplyingTo(null)} className="text-muted-foreground hover:text-foreground transition-colors ml-2">
                        <FontAwesomeIcon icon={faTimes} className="text-xs" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">RC</AvatarFallback>
                    </Avatar>
                    <input
                      type="text"
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmitReply(); } }}
                      placeholder={replyingTo ? `Reply to ${replyingTo.author.name}…` : "Write a reply…"}
                      className="flex-1 text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    />
                    <button
                      onClick={handleSubmitReply}
                      disabled={!replyText.trim()}
                      className={`transition-colors ${replyText.trim() ? "text-primary hover:text-primary/80" : "text-muted-foreground/30"}`}
                    >
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation */}
      <Dialog open={!!confirmRemove} onOpenChange={(open) => { if (!open) setConfirmRemove(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-serif">Remove Member</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to remove <span className="font-semibold text-card-foreground">{confirmRemove?.name}</span> from this community? This action can be reversed by re-inviting them.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setConfirmRemove(null)}
              className="flex-1 text-sm font-medium border border-border rounded-lg py-2 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => confirmRemove && handleRemoveMember(confirmRemove)}
              className="flex-1 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg py-2 hover:bg-destructive/90 transition-colors flex items-center justify-center gap-1.5"
            >
              <FontAwesomeIcon icon={faBan} className="text-xs" /> Remove
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Leave Community Confirmation */}
      <Dialog open={showLeaveConfirm} onOpenChange={setShowLeaveConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-serif">Leave Community</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to leave <span className="font-semibold text-card-foreground">{community.name}</span>? You will lose access to discussions, resources, and events. You can request to rejoin later.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setShowLeaveConfirm(false)}
              className="flex-1 text-sm font-medium border border-border rounded-lg py-2 hover:bg-muted transition-colors"
            >
              Stay
            </button>
            <button
              onClick={() => { setShowLeaveConfirm(false); navigate("/my-communities"); }}
              className="flex-1 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg py-2 hover:bg-destructive/90 transition-colors flex items-center justify-center gap-1.5"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="text-xs" /> Leave
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="bg-footer-bg text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 font-light">
          &copy; 2026 Centre for Professional Services Research. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Community;
