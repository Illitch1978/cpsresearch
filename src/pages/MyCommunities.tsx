import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faArrowLeft,
  faComments,
  faFile,
  faCalendar,
  faPlus,
  faBoxArchive,
  faRotateLeft,
  faEllipsisV,
  faTimes,
  faGlobe,
  faLock,
  faImage,
  faCheck,
  faBold,
  faItalic,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify,
  faListUl,
  faListOl,
  faLink as faLinkIcon,
  faImage as faImageIcon,
  faRightFromBracket,
  faStar as faStarSolid,
  faShieldHalved,
  faClock,
  faEnvelope,
  faTrophy,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  continents,
  countriesByContinent,
  sectorsByCategory,
  sectors,
  orgTypes,
  managementExpertiseList,
  leadershipExpertiseList,
  contributionsList,
  externalFactorsList,
} from "@/lib/communityFilterData";

interface CommunityItem {
  id: string;
  name: string;
  description: string;
  members: number;
  discussions: number;
  resources: number;
  events: number;
  role: string;
  lastActive: string;
  avatar: string;
  archived?: boolean;
  isPrivate?: boolean;
  isFavourite?: boolean;
  isOfficial?: boolean;
  lastVisited?: string;
  isResearchPanel?: boolean;
}

const initialCommunities: CommunityItem[] = [
  {
    id: "prof-services-research",
    name: "Professional Services Research Network",
    description: "A global community of researchers, analysts and consultants focused on professional services market intelligence.",
    members: 234,
    discussions: 47,
    resources: 18,
    events: 3,
    role: "Member",
    lastActive: "2 hours ago",
    avatar: "PSR",
    isPrivate: false,
    isFavourite: true,
    isOfficial: true,
    lastVisited: "2 hours ago",
    isResearchPanel: true,
  },
  {
    id: "legal-market-intel",
    name: "Legal Market Intelligence",
    description: "Sharing research methodologies and findings related to the global legal services market.",
    members: 156,
    discussions: 32,
    resources: 24,
    events: 1,
    role: "Contributor",
    lastActive: "Yesterday",
    avatar: "LMI",
    isPrivate: true,
    isFavourite: false,
    isOfficial: false,
    lastVisited: "Yesterday",
  },
  {
    id: "consulting-trends",
    name: "Management Consulting Trends",
    description: "Tracking and analysing emerging trends in the management consulting industry worldwide.",
    members: 312,
    discussions: 89,
    resources: 41,
    events: 5,
    role: "Member",
    lastActive: "3 days ago",
    avatar: "MCT",
    isPrivate: false,
    isFavourite: true,
    isOfficial: true,
    lastVisited: undefined,
  },
];

// Owner rankings mock data
const ownerRankings = [
  { name: "Richard Chaplin", communities: 4, members: 702, resources: 83, conversations: 168 },
  { name: "Sarah Mitchell", communities: 3, members: 534, resources: 62, conversations: 124 },
  { name: "James Thornton", communities: 2, members: 389, resources: 47, conversations: 98 },
  { name: "Anna Kowalski", communities: 2, members: 278, resources: 31, conversations: 76 },
  { name: "David Chen", communities: 1, members: 156, resources: 24, conversations: 32 },
];

const MyCommunities = () => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<CommunityItem[]>(initialCommunities);
  const [showArchived, setShowArchived] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [confirmLeave, setConfirmLeave] = useState<string | null>(null);

  // Create form state
  const [formName, setFormName] = useState("");
  const [formSummary, setFormSummary] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAccess, setFormAccess] = useState<"open" | "private">("open");
  const [formFrontline, setFormFrontline] = useState(false);
  const [formSaving, setFormSaving] = useState(false);
  const [formThumbnail, setFormThumbnail] = useState<string | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Form filter states (matching Find a Community)
  const [formLocationFilter, setFormLocationFilter] = useState("any");
  const [formSelectedContinents, setFormSelectedContinents] = useState<string[]>([]);
  const [formSelectedCountries, setFormSelectedCountries] = useState<string[]>([]);
  const [formSourceFilter, setFormSourceFilter] = useState("all");
  const [formSelectedSectors, setFormSelectedSectors] = useState<string[]>([]);
  const [formExpandedSectors, setFormExpandedSectors] = useState<string[]>([]);
  const [formOrgTypeFilter, setFormOrgTypeFilter] = useState("any");
  const [formSelectedOrgTypes, setFormSelectedOrgTypes] = useState<string[]>([]);
  const [formExpertiseFilter, setFormExpertiseFilter] = useState("any");
  const [formSelectedExpertise, setFormSelectedExpertise] = useState<string[]>([]);
  const [formExternalFactorFilter, setFormExternalFactorFilter] = useState("any");
  const [formSelectedExternalFactors, setFormSelectedExternalFactors] = useState<string[]>([]);
  const [formSelectedContributions, setFormSelectedContributions] = useState<string[]>([]);

  // Rules state
  const [formMembershipRule, setFormMembershipRule] = useState<"anyone" | "criteria" | "approval">("anyone");
  const [formPostReview, setFormPostReview] = useState<"none" | "criteria" | "all">("none");
  const [formContentReview, setFormContentReview] = useState<"none" | "criteria" | "all">("none");
  const [formInviteExpiry, setFormInviteExpiry] = useState("90");
  const [formCommunityRules, setFormCommunityRules] = useState("Open community with no pre-approval of posts and content items.");
  const [rulesExpanded, setRulesExpanded] = useState(false);
  // Messages state
  const [messagesExpanded, setMessagesExpanded] = useState(false);
  const [activeMessageTemplate, setActiveMessageTemplate] = useState("welcome");
  const [messageTemplates, setMessageTemplates] = useState<Record<string, string>>({
    welcome: "Welcome to the Community! We're delighted to have you join us.\n\n• Introduce yourself in the Discussions tab\n• Browse Resources to see what's been shared\n• Click on the 'Content' link in the Community Analytics box on the Community page\n\n• Message fellow members\n  Click on a name on the Members page, and then click on the message icon.",
    decline: "Thank you for your interest in joining our community. Unfortunately, your request to join has not been approved at this time.\n\nIf you believe this was in error, please contact the community administrators.",
    "block-post": "Your post has been blocked by a community moderator as it does not meet our community guidelines.\n\nPlease review the community rules and feel free to resubmit a revised version.",
    "block-content": "Content you shared has been blocked by a community moderator. This may be because it does not meet our quality or relevance standards.\n\nPlease review the community guidelines for acceptable content.",
    "block-playlist": "A playlist you shared has been blocked by a community moderator as it does not align with the community's focus areas.",
    invitation: "You've been invited to join our community! We think you'd be a great fit based on your expertise and interests.\n\nClick the link below to accept the invitation and get started.",
    leave: "We're sorry to see you go. Your contributions to the community have been valued.\n\nIf you change your mind, you're always welcome to rejoin.",
  });

  // Contributions per community
  const [communityContributions, setCommunityContributions] = useState<Record<string, string[]>>({
    "prof-services-research": ["Research", "Publications"],
    "legal-market-intel": ["Case studies", "Thought leadership"],
    "consulting-trends": ["Add/comment on posts"],
  });
  const [editingContributions, setEditingContributions] = useState<string | null>(null);
  const [editContributionsList, setEditContributionsList] = useState<string[]>([]);

  // Owner rankings visibility
  const [showOwnerRankings, setShowOwnerRankings] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Filter state
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterPrivate, setFilterPrivate] = useState(false);
  const [filterFavourites, setFilterFavourites] = useState(false);
  const [filterOfficial, setFilterOfficial] = useState(false);
  const [filterRecentlyVisited, setFilterRecentlyVisited] = useState(false);
  const [filterResearchPanels, setFilterResearchPanels] = useState(false);

  const activeCommunities = communities.filter(c => {
    if (c.archived) return false;
    if (filterOpen && c.isPrivate) return false;
    if (filterPrivate && !c.isPrivate) return false;
    if (filterFavourites && !c.isFavourite) return false;
    if (filterOfficial && !c.isOfficial) return false;
    if (filterRecentlyVisited && !c.lastVisited) return false;
    if (filterResearchPanels && !c.isResearchPanel) return false;
    return true;
  });
  const archivedCommunities = communities.filter(c => c.archived);

  const toggleFavourite = (id: string) => {
    setCommunities(prev => prev.map(c => c.id === id ? { ...c, isFavourite: !c.isFavourite } : c));
  };

  const toggleArchive = (id: string) => {
    setCommunities(prev => prev.map(c => c.id === id ? { ...c, archived: !c.archived } : c));
    setMenuOpen(null);
  };

  const hasAnyFilterSelection = () => {
    return formSelectedContributions.length > 0;
  };

  const handleCreate = () => {
    if (!formName.trim() || !formSummary.trim() || !hasAnyFilterSelection()) return;
    setFormSaving(true);
    setTimeout(() => {
      const newId = formName.toLowerCase().replace(/\s+/g, "-").slice(0, 30) + "-" + Date.now();
      const newCommunity: CommunityItem = {
        id: newId,
        name: formName.trim(),
        description: formSummary.trim(),
        members: 1,
        discussions: 0,
        resources: 0,
        events: 0,
        role: "Founder",
        lastActive: "Just now",
        avatar: formName.trim().split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase(),
      };
      setCommunities(prev => [newCommunity, ...prev]);
      setCommunityContributions(prev => ({ ...prev, [newId]: formSelectedContributions }));
      resetForm();
      setFormSaving(false);
      setCreateOpen(false);
    }, 800);
  };

  const resetForm = () => {
    setFormName(""); setFormSummary(""); setFormDescription("");
    setFormAccess("open"); setFormFrontline(false);
    setFormThumbnail(null);
    setFormLocationFilter("any"); setFormSelectedContinents([]); setFormSelectedCountries([]);
    setFormSourceFilter("all"); setFormSelectedSectors([]); setFormExpandedSectors([]);
    setFormOrgTypeFilter("any"); setFormSelectedOrgTypes([]);
    setFormExpertiseFilter("any"); setFormSelectedExpertise([]);
    setFormExternalFactorFilter("any"); setFormSelectedExternalFactors([]);
    setFormSelectedContributions([]);
    setFormMembershipRule("anyone"); setFormPostReview("none"); setFormContentReview("none");
    setFormInviteExpiry("90");
    setFormCommunityRules("Open community with no pre-approval of posts and content items.");
    setRulesExpanded(false); setMessagesExpanded(false); setActiveMessageTemplate("welcome");
    setMessageTemplates({
      welcome: "Welcome to the Community! We're delighted to have you join us.\n\n• Introduce yourself in the Discussions tab\n• Browse Resources to see what's been shared\n• Click on the 'Content' link in the Community Analytics box on the Community page\n\n• Message fellow members\n  Click on a name on the Members page, and then click on the message icon.",
      decline: "Thank you for your interest in joining our community. Unfortunately, your request to join has not been approved at this time.\n\nIf you believe this was in error, please contact the community administrators.",
      "block-post": "Your post has been blocked by a community moderator as it does not meet our community guidelines.\n\nPlease review the community rules and feel free to resubmit a revised version.",
      "block-content": "Content you shared has been blocked by a community moderator. This may be because it does not meet our quality or relevance standards.\n\nPlease review the community guidelines for acceptable content.",
      "block-playlist": "A playlist you shared has been blocked by a community moderator as it does not align with the community's focus areas.",
      invitation: "You've been invited to join our community! We think you'd be a great fit based on your expertise and interests.\n\nClick the link below to accept the invitation and get started.",
      leave: "We're sorry to see you go. Your contributions to the community have been valued.\n\nIf you change your mind, you're always welcome to rejoin.",
    });
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) { alert("Image must be less than 500KB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { setFormThumbnail(ev.target?.result as string); };
    reader.readAsDataURL(file);
  };

  const renderCommunityCard = (community: CommunityItem) => {
    const contributions = communityContributions[community.id] || [];
    const isEditingThis = editingContributions === community.id;

    return (
      <div
        key={community.id}
        className={`w-full text-left bg-card border border-border rounded-sm p-5 sm:p-6 transition-all ${community.archived ? "opacity-60" : "hover:border-primary/30 hover:shadow-md"}`}
      >
        <div className="flex items-start gap-4">
          <button
            onClick={() => !community.archived && navigate(`/community/${community.id}`)}
            className="w-12 h-12 rounded-sm bg-primary/10 text-primary font-serif font-semibold text-sm flex items-center justify-center flex-shrink-0"
          >
            {community.avatar}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => !community.archived && navigate(`/community/${community.id}`)}
                className="font-serif font-medium text-card-foreground text-base sm:text-lg hover:text-primary transition-colors text-left"
              >
                {community.name}
              </button>
              <span className="text-[10px] uppercase tracking-wider font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-sm">
                {community.role}
              </span>
              {community.isPrivate && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <FontAwesomeIcon icon={faLock} className="text-[9px]" /> Private
                </span>
              )}
              {community.isOfficial && (
                <span className="flex items-center gap-1 text-[10px] text-primary">
                  <FontAwesomeIcon icon={faShieldHalved} className="text-[9px]" /> Official
                </span>
              )}
              {community.lastVisited && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <FontAwesomeIcon icon={faClock} className="text-[9px]" /> Visited {community.lastVisited}
                </span>
              )}
              {community.archived && (
                <Badge variant="outline" className="text-[10px] text-muted-foreground border-muted-foreground/30">Archived</Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{community.description}</p>

            {/* Stats */}
            <div className="flex items-center gap-5 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faUsers} className="text-[10px]" />{community.members} members</span>
              <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faComments} className="text-[10px]" />{community.discussions} discussions</span>
              <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faFile} className="text-[10px]" />{community.resources} resources</span>
              <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faCalendar} className="text-[10px]" />{community.events} events</span>
            </div>

            <p className="text-[11px] text-muted-foreground mt-2">Active {community.lastActive}</p>

            {/* My contribution */}
            {!community.archived && (
              <div className="mt-3 pt-3 border-t border-border">
                {isEditingThis ? (
                  <div className="space-y-2">
                    <p className="text-[11px] font-medium text-card-foreground">Update your contributions:</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {contributionsList.map((c) => (
                        <div key={c.singular} className="flex items-center space-x-1.5">
                          <Checkbox
                            id={`edit-contrib-${community.id}-${c.singular}`}
                            checked={editContributionsList.includes(c.singular)}
                            onCheckedChange={() => setEditContributionsList(prev =>
                              prev.includes(c.singular) ? prev.filter(x => x !== c.singular) : [...prev, c.singular]
                            )}
                          />
                          <Label htmlFor={`edit-contrib-${community.id}-${c.singular}`} className="text-[10px] text-muted-foreground cursor-pointer">{c.singular}</Label>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          setCommunityContributions(prev => ({ ...prev, [community.id]: editContributionsList }));
                          setEditingContributions(null);
                        }}
                        disabled={editContributionsList.length === 0}
                        className={`text-[10px] font-medium px-3 py-1 rounded transition-colors ${editContributionsList.length > 0 ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground"}`}
                      >
                        Save
                      </button>
                      <button onClick={() => setEditingContributions(null)} className="text-[10px] text-muted-foreground">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-medium text-card-foreground">My contribution:</span>
                    {contributions.length > 0 ? (
                      contributions.map(c => (
                        <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{c}</span>
                      ))
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic">None set</span>
                    )}
                    <button
                      onClick={() => { setEditingContributions(community.id); setEditContributionsList(contributions); }}
                      className="text-[10px] text-primary font-medium hover:underline flex items-center gap-1 ml-1"
                    >
                      <FontAwesomeIcon icon={faPen} className="text-[8px]" /> Update
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Favourite + Actions */}
          <div className="flex items-start gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavourite(community.id); }}
              className={`p-1.5 rounded-md transition-colors ${community.isFavourite ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground/40 hover:text-amber-400"}`}
              title={community.isFavourite ? "Remove from favourites" : "Add to favourites"}
            >
              <FontAwesomeIcon icon={community.isFavourite ? faStarSolid : faStarRegular} className="text-sm" />
            </button>
            <div className="relative" ref={menuOpen === community.id ? menuRef : undefined}>
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === community.id ? null : community.id); }}
                className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted"
              >
                <FontAwesomeIcon icon={faEllipsisV} className="text-sm" />
              </button>
              {menuOpen === community.id && (
                <div className="absolute right-0 mt-1 w-44 bg-card rounded-lg shadow-xl border border-border z-50 py-1">
                  {!community.archived ? (
                    <>
                      {community.role !== "Founder" && (
                        <button
                          onClick={() => { setConfirmLeave(community.id); setMenuOpen(null); }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-destructive/5 transition-colors flex items-center gap-2 text-destructive"
                        >
                          <FontAwesomeIcon icon={faRightFromBracket} className="text-[10px]" /> Leave community
                        </button>
                      )}
                    </>
                  ) : (
                    <span className="px-3 py-2 text-xs text-muted-foreground block">
                      Contact HQ to restore
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navigation
        onShowHome={() => navigate("/")}
        onShowContribute={() => navigate("/")}
        onShowContact={() => navigate("/")}
        onNavigateToSection={() => {}}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 mb-4 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" /> Back to home
          </button>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-card-foreground">My Communities</h1>
              <p className="text-muted-foreground mt-2 text-sm">Communities you are a member of. Click to enter and participate.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOwnerRankings(!showOwnerRankings)}
                className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg text-sm font-medium transition-colors ${showOwnerRankings ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"}`}
              >
                <FontAwesomeIcon icon={faTrophy} className="text-xs" /> Owner Rankings
              </button>
              <button
                onClick={() => { resetForm(); setCreateOpen(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} className="text-xs" /> Add Community
              </button>
            </div>
          </div>
        </div>

        {/* Owner Rankings Panel */}
        {showOwnerRankings && (
          <div className="bg-card border border-border rounded-sm p-5 mb-6">
            <h2 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faTrophy} className="text-primary text-xs" /> Community Owner Rankings
            </h2>
            <p className="text-xs text-muted-foreground mb-4">Aggregate data across all communities owned by each leader.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground">#</th>
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Owner</th>
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Communities</th>
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Members</th>
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Resources</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Conversations</th>
                  </tr>
                </thead>
                <tbody>
                  {ownerRankings.map((owner, i) => (
                    <tr key={owner.name} className="border-b border-border/50 last:border-0">
                      <td className="py-2 pr-4 font-semibold text-card-foreground">{i + 1}</td>
                      <td className="py-2 pr-4 font-medium text-card-foreground">{owner.name}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{owner.communities}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{owner.members}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{owner.resources}</td>
                      <td className="py-2 text-muted-foreground">{owner.conversations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Personal Involvement Rules */}
        <div className="bg-card border border-border rounded-sm p-5 mb-6">
          <h2 className="text-sm font-semibold text-card-foreground mb-2">Personal involvement</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            You may join up to <span className="font-semibold text-card-foreground">20</span> open Communities and an unlimited number of private Communities.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-medium text-card-foreground">{activeCommunities.filter(c => c.role !== "Founder").length}</span> / 20 open communities joined
            </div>
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100, (activeCommunities.filter(c => c.role !== "Founder").length / 20) * 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Filter Checkboxes */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5">
          <span className="text-xs font-medium text-muted-foreground mr-1">Filter:</span>
          {[
            { label: "Open", state: filterOpen, setter: setFilterOpen },
            { label: "Private", state: filterPrivate, setter: setFilterPrivate },
            { label: "Favourites", state: filterFavourites, setter: setFilterFavourites },
            { label: "Official", state: filterOfficial, setter: setFilterOfficial },
            { label: "Recently visited", state: filterRecentlyVisited, setter: setFilterRecentlyVisited },
            { label: "Research panels", state: filterResearchPanels, setter: setFilterResearchPanels },
          ].map(f => (
            <label key={f.label} className="flex items-center gap-1.5 text-xs text-card-foreground cursor-pointer select-none">
              <input type="checkbox" checked={f.state} onChange={() => f.setter(!f.state)} className="accent-[hsl(var(--primary))] w-3.5 h-3.5 rounded cursor-pointer" />
              {f.label}
            </label>
          ))}
        </div>

        {/* Active Communities */}
        <div className="space-y-4">
          {activeCommunities.map(renderCommunityCard)}
          {activeCommunities.length === 0 && (
            <div className="text-center py-12 bg-card border border-border rounded-sm">
              <FontAwesomeIcon icon={faUsers} className="text-3xl text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No active communities.</p>
              <button onClick={() => { resetForm(); setCreateOpen(true); }} className="text-sm text-primary font-medium hover:underline mt-2">Create your first community →</button>
            </div>
          )}
        </div>

        {/* Archived Section */}
        {archivedCommunities.length > 0 && (
          <div className="mt-8">
            <button onClick={() => setShowArchived(!showArchived)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
              <FontAwesomeIcon icon={faBoxArchive} className="text-xs" /> Archived ({archivedCommunities.length})
              <span className="text-[10px]">{showArchived ? "▲" : "▼"}</span>
            </button>
            {showArchived && (
              <div className="space-y-4">{archivedCommunities.map(renderCommunityCard)}</div>
            )}
          </div>
        )}
      </main>

      {/* Create Community Dialog */}
      <Dialog open={createOpen} onOpenChange={(open) => { if (!open) setCreateOpen(false); }}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-lg font-serif">Add Community</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Once a community has been saved, changes can only be made to its name or access by admins.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2 overflow-y-auto flex-1 pr-1">
            {/* Name */}
            <div>
              <label className="text-xs font-medium text-card-foreground mb-1.5 block">Name <span className="text-destructive">*</span></label>
              <div className="relative">
                <input type="text" value={formName} onChange={e => setFormName(e.target.value.slice(0, 100))} placeholder="Community name…" className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">{formName.length}/100</span>
              </div>
            </div>

            {/* Access */}
            <div>
              <label className="text-xs font-medium text-card-foreground mb-1.5 block">Access <span className="text-destructive">*</span></label>
              <div className="flex items-center gap-0 border border-border rounded-lg overflow-hidden w-fit">
                <button onClick={() => setFormAccess("open")} className={`px-4 py-2 text-xs font-medium flex items-center gap-1.5 transition-colors ${formAccess === "open" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}>
                  <FontAwesomeIcon icon={faGlobe} className="text-[10px]" /> Open
                </button>
                <button onClick={() => setFormAccess("private")} className={`px-4 py-2 text-xs font-medium flex items-center gap-1.5 transition-colors ${formAccess === "private" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}>
                  <FontAwesomeIcon icon={faLock} className="text-[10px]" /> Private
                </button>
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="text-xs font-medium text-card-foreground mb-1.5 block">Thumbnail</label>
              <input ref={thumbnailInputRef} type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
              {formThumbnail ? (
                <div className="flex items-center gap-3">
                  <img src={formThumbnail} alt="Thumbnail preview" className="w-16 h-16 rounded-lg object-cover border border-border" />
                  <div className="flex flex-col gap-1">
                    <button onClick={() => thumbnailInputRef.current?.click()} className="text-xs text-primary font-medium hover:underline text-left">Change image</button>
                    <button onClick={() => setFormThumbnail(null)} className="text-xs text-muted-foreground hover:text-destructive transition-colors text-left">Remove</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => thumbnailInputRef.current?.click()} className="flex items-center gap-2 text-xs text-muted-foreground border border-dashed border-border rounded-lg px-4 py-3 hover:border-primary/30 hover:bg-muted/50 transition-all w-full">
                  <FontAwesomeIcon icon={faImage} className="text-sm text-muted-foreground/50" /> <span>Choose image (max 500KB)</span>
                </button>
              )}
            </div>

            {/* Frontline content */}
            <div className="flex items-center gap-2">
              <button onClick={() => setFormFrontline(!formFrontline)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${formFrontline ? "bg-primary border-primary text-primary-foreground" : "border-border bg-background"}`}>
                {formFrontline && <FontAwesomeIcon icon={faCheck} className="text-[8px]" />}
              </button>
              <label className="text-xs text-card-foreground font-medium cursor-pointer" onClick={() => setFormFrontline(!formFrontline)}>Frontline content</label>
            </div>

            {/* Summary */}
            <div>
              <label className="text-xs font-medium text-card-foreground mb-1.5 block">Summary <span className="text-destructive">*</span></label>
              <div className="relative">
                <textarea value={formSummary} onChange={e => setFormSummary(e.target.value.slice(0, 250))} placeholder="Brief summary of the community…" rows={2} className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none" />
                <span className="absolute right-3 bottom-2 text-[10px] text-muted-foreground">{formSummary.length}/250</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-medium text-card-foreground mb-1.5 block">Description</label>
              <div className="relative">
                <textarea value={formDescription} onChange={e => setFormDescription(e.target.value.slice(0, 1000))} placeholder="Detailed description of the community's purpose and goals…" rows={4} className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none" />
                <span className="absolute right-3 bottom-2 text-[10px] text-muted-foreground">{formDescription.length}/1000</span>
              </div>
            </div>

            {/* Official Community - HQ only */}
            <div className="bg-muted/30 border border-border rounded-lg p-3">
              <p className="text-xs font-medium text-card-foreground mb-1">Official Community Status</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Official status can only be granted by HQ. To request official status for your community, please{" "}
                <a href="mailto:hq@cpsr.uk?subject=Request%20Official%20Community%20Status" className="text-primary font-medium hover:underline">
                  <FontAwesomeIcon icon={faEnvelope} className="text-[10px] mr-0.5" />email HQ
                </a>.
              </p>
            </div>

            {/* ─── Community Filters (matching Find a Community) ─── */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-muted/30">
                <span className="text-xs font-semibold text-card-foreground">Community Criteria</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">Select at least one contribution. Filters match the Community Finder.</p>
              </div>
              <div className="px-4 py-4 space-y-5 border-t border-border">

                {/* Location */}
                <div>
                  <p className="text-xs font-medium text-card-foreground mb-2">Location</p>
                  <RadioGroup value={formLocationFilter} onValueChange={setFormLocationFilter} className="space-y-2">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="any" id="form-loc-any" /><Label htmlFor="form-loc-any" className="text-xs text-card-foreground cursor-pointer">Any location</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="specific-continents" id="form-loc-cont" /><Label htmlFor="form-loc-cont" className="text-xs text-card-foreground cursor-pointer">Specific continents</Label></div>
                    {formLocationFilter === "specific-continents" && (
                      <div className="ml-5 grid grid-cols-2 gap-1.5 border-l-2 border-border pl-3">
                        {continents.map(c => (
                          <div key={c} className="flex items-center space-x-1.5">
                            <Checkbox id={`form-cont-${c}`} checked={formSelectedContinents.includes(c)} onCheckedChange={() => setFormSelectedContinents(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])} />
                            <Label htmlFor={`form-cont-${c}`} className="text-[11px] text-muted-foreground cursor-pointer">{c}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center space-x-2"><RadioGroupItem value="specific-countries" id="form-loc-country" /><Label htmlFor="form-loc-country" className="text-xs text-card-foreground cursor-pointer">Specific countries</Label></div>
                    {formLocationFilter === "specific-countries" && (
                      <div className="ml-5 max-h-40 overflow-y-auto space-y-2 border-l-2 border-border pl-3">
                        {continents.map(cont => (
                          <div key={cont}>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">{cont}</p>
                            <div className="grid grid-cols-2 gap-1 mb-2">
                              {countriesByContinent[cont]?.map(country => (
                                <div key={country} className="flex items-center space-x-1.5">
                                  <Checkbox id={`form-country-${country}`} checked={formSelectedCountries.includes(country)} onCheckedChange={() => setFormSelectedCountries(prev => prev.includes(country) ? prev.filter(x => x !== country) : [...prev, country])} />
                                  <Label htmlFor={`form-country-${country}`} className="text-[11px] text-muted-foreground cursor-pointer">{country}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </RadioGroup>
                </div>

                {/* Sectors */}
                <div>
                  <p className="text-xs font-medium text-card-foreground mb-2">Sectors</p>
                  <RadioGroup value={formSourceFilter} onValueChange={setFormSourceFilter} className="space-y-2">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="all" id="form-sec-all" /><Label htmlFor="form-sec-all" className="text-xs text-card-foreground cursor-pointer">Any sector</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="specific-sectors" id="form-sec-spec" /><Label htmlFor="form-sec-spec" className="text-xs text-card-foreground cursor-pointer">Specific sectors</Label></div>
                    {formSourceFilter === "specific-sectors" && (
                      <div className="ml-5 max-h-40 overflow-y-auto space-y-1.5 border-l-2 border-border pl-3">
                        {sectors.map(sector => (
                          <div key={sector}>
                            <div className="flex items-center space-x-1.5">
                              <Checkbox id={`form-sec-${sector}`} checked={formSelectedSectors.includes(sector)} onCheckedChange={() => setFormSelectedSectors(prev => prev.includes(sector) ? prev.filter(x => x !== sector) : [...prev, sector])} />
                              <Label htmlFor={`form-sec-${sector}`} className="text-[11px] text-muted-foreground cursor-pointer flex-1">{sector}</Label>
                              <button type="button" onClick={() => setFormExpandedSectors(prev => prev.includes(sector) ? prev.filter(x => x !== sector) : [...prev, sector])} className="text-[10px] text-muted-foreground hover:text-card-foreground">{formExpandedSectors.includes(sector) ? "−" : "+"}</button>
                            </div>
                            {formExpandedSectors.includes(sector) && sectorsByCategory[sector] && (
                              <div className="ml-5 mt-1 grid grid-cols-2 gap-0.5 pl-2 border-l border-border">
                                {sectorsByCategory[sector].map(sub => <span key={sub} className="text-[10px] text-muted-foreground">{sub}</span>)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </RadioGroup>
                </div>

                {/* Org Types */}
                <div>
                  <p className="text-xs font-medium text-card-foreground mb-2">Org Type</p>
                  <RadioGroup value={formOrgTypeFilter} onValueChange={setFormOrgTypeFilter} className="space-y-2">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="any" id="form-org-any" /><Label htmlFor="form-org-any" className="text-xs text-card-foreground cursor-pointer">Any org type</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="specific" id="form-org-spec" /><Label htmlFor="form-org-spec" className="text-xs text-card-foreground cursor-pointer">Specific org types</Label></div>
                    {formOrgTypeFilter === "specific" && (
                      <div className="ml-5 flex flex-col flex-wrap gap-1.5 border-l-2 border-border pl-3 max-h-36">
                        {orgTypes.map(item => (
                          <div key={item} className="flex items-center space-x-1.5 w-[45%]">
                            <Checkbox id={`form-org-${item}`} checked={formSelectedOrgTypes.includes(item)} onCheckedChange={() => setFormSelectedOrgTypes(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item])} />
                            <Label htmlFor={`form-org-${item}`} className="text-[11px] text-muted-foreground cursor-pointer">{item}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </RadioGroup>
                </div>

                {/* Expertise */}
                <div>
                  <p className="text-xs font-medium text-card-foreground mb-2">Expertise</p>
                  <RadioGroup value={formExpertiseFilter} onValueChange={setFormExpertiseFilter} className="space-y-2">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="any" id="form-exp-any" /><Label htmlFor="form-exp-any" className="text-xs text-card-foreground cursor-pointer">Any expertise</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="specific" id="form-exp-spec" /><Label htmlFor="form-exp-spec" className="text-xs text-card-foreground cursor-pointer">Specific expertise</Label></div>
                    {formExpertiseFilter === "specific" && (
                      <div className="ml-5 space-y-3 border-l-2 border-border pl-3 max-h-40 overflow-y-auto">
                        <div>
                          <p className="text-[11px] font-semibold text-card-foreground mb-1">Management</p>
                          <div className="space-y-1 ml-2">
                            {managementExpertiseList.map(exp => (
                              <div key={exp} className="flex items-center space-x-1.5">
                                <Checkbox id={`form-mgmt-${exp}`} checked={formSelectedExpertise.includes(exp)} onCheckedChange={() => setFormSelectedExpertise(prev => prev.includes(exp) ? prev.filter(x => x !== exp) : [...prev, exp])} />
                                <Label htmlFor={`form-mgmt-${exp}`} className="text-[11px] text-muted-foreground cursor-pointer">{exp}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-card-foreground mb-1">Leadership & Governance</p>
                          <div className="space-y-1 ml-2">
                            {leadershipExpertiseList.map(exp => (
                              <div key={exp} className="flex items-center space-x-1.5">
                                <Checkbox id={`form-lead-${exp}`} checked={formSelectedExpertise.includes(exp)} onCheckedChange={() => setFormSelectedExpertise(prev => prev.includes(exp) ? prev.filter(x => x !== exp) : [...prev, exp])} />
                                <Label htmlFor={`form-lead-${exp}`} className="text-[11px] text-muted-foreground cursor-pointer">{exp}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </RadioGroup>
                </div>

                {/* External Factors */}
                <div>
                  <p className="text-xs font-medium text-card-foreground mb-2">External Factors</p>
                  <RadioGroup value={formExternalFactorFilter} onValueChange={setFormExternalFactorFilter} className="space-y-2">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="any" id="form-ext-any" /><Label htmlFor="form-ext-any" className="text-xs text-card-foreground cursor-pointer">Any external factor</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="specific" id="form-ext-spec" /><Label htmlFor="form-ext-spec" className="text-xs text-card-foreground cursor-pointer">Specific factors</Label></div>
                    {formExternalFactorFilter === "specific" && (
                      <div className="ml-5 space-y-3 border-l-2 border-border pl-3">
                        {Object.entries(externalFactorsList).map(([cat, factors]) => (
                          <div key={cat}>
                            <p className="text-[11px] font-semibold text-card-foreground mb-1">{cat}</p>
                            <div className="space-y-1 ml-2">
                              {factors.map(f => (
                                <div key={f} className="flex items-center space-x-1.5">
                                  <Checkbox id={`form-ext-${f}`} checked={formSelectedExternalFactors.includes(f)} onCheckedChange={() => setFormSelectedExternalFactors(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])} />
                                  <Label htmlFor={`form-ext-${f}`} className="text-[11px] text-muted-foreground cursor-pointer">{f}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </RadioGroup>
                </div>

                {/* Contributions (mandatory) */}
                <div>
                  <p className="text-xs font-medium text-card-foreground mb-2">Anticipated contributions <span className="text-destructive">*</span></p>
                  <div className="space-y-1.5">
                    {contributionsList.map(c => (
                      <div key={c.singular} className="flex items-center space-x-1.5">
                        <Checkbox id={`form-contrib-${c.singular}`} checked={formSelectedContributions.includes(c.singular)} onCheckedChange={() => setFormSelectedContributions(prev => prev.includes(c.singular) ? prev.filter(x => x !== c.singular) : [...prev, c.singular])} />
                        <Label htmlFor={`form-contrib-${c.singular}`} className="text-xs text-card-foreground cursor-pointer">{c.singular}</Label>
                      </div>
                    ))}
                  </div>
                  {formSelectedContributions.length === 0 && (
                    <p className="text-[10px] text-destructive mt-1">Please select at least one contribution</p>
                  )}
                </div>
              </div>
            </div>

            {/* ─── Rules Section (Collapsible) ─── */}
            <div className="border border-border rounded-lg overflow-hidden">
              <button onClick={() => setRulesExpanded(!rulesExpanded)} className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                <span className="text-xs font-semibold text-card-foreground">Rules (optional)</span>
                <span className="text-[10px] text-muted-foreground">{rulesExpanded ? "▲" : "▼"}</span>
              </button>
              {rulesExpanded && (
                <div className="px-4 py-4 space-y-5 border-t border-border">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">The default settings are 'Anyone can join' and 'No review required'. If alternative settings are adopted, please update the guidance in the 'Community rules' box.</p>

                  {/* Membership rules */}
                  <div>
                    <label className="text-xs font-medium text-card-foreground mb-2 block">Rules for approval of membership applications <span className="text-destructive">*</span></label>
                    <div className="space-y-2">
                      {([["anyone", "Anyone can join"], ["criteria", "Anyone meeting criteria"], ["approval", "Approval required"]] as const).map(([value, label]) => (
                        <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                          <span onClick={() => setFormMembershipRule(value)} className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${formMembershipRule === value ? "border-primary bg-primary" : "border-slate-300 group-hover:border-slate-400"}`}>
                            {formMembershipRule === value && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <span className="text-xs text-card-foreground font-medium" onClick={() => setFormMembershipRule(value)}>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Post review */}
                  <div>
                    <label className="text-xs font-medium text-card-foreground mb-2 block">Rules for review of posts added by members <span className="text-destructive">*</span></label>
                    <div className="space-y-2">
                      {([["none", "No review required"], ["criteria", "Posts that meet criteria require review"], ["all", "Review required for all posts"]] as const).map(([value, label]) => (
                        <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                          <span onClick={() => setFormPostReview(value)} className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${formPostReview === value ? "border-primary bg-primary" : "border-slate-300 group-hover:border-slate-400"}`}>
                            {formPostReview === value && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <span className="text-xs text-card-foreground font-medium" onClick={() => setFormPostReview(value)}>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Content review */}
                  <div>
                    <label className="text-xs font-medium text-card-foreground mb-2 block">Rules for review of content items added by members <span className="text-destructive">*</span></label>
                    <div className="space-y-2">
                      {([["none", "No review required"], ["criteria", "Content items that meet criteria require review"], ["all", "Review required for all content items"]] as const).map(([value, label]) => (
                        <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                          <span onClick={() => setFormContentReview(value)} className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${formContentReview === value ? "border-primary bg-primary" : "border-slate-300 group-hover:border-slate-400"}`}>
                            {formContentReview === value && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <span className="text-xs text-card-foreground font-medium" onClick={() => setFormContentReview(value)}>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Invite expiry */}
                  <div>
                    <label className="text-xs font-medium text-card-foreground mb-1.5 block">Invite expiry date <span className="text-destructive">*</span></label>
                    <div className="flex items-center gap-2">
                      <select value={formInviteExpiry} onChange={e => setFormInviteExpiry(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-card-foreground">
                        <option value="30">30</option><option value="60">60</option><option value="90">90</option><option value="120">120</option><option value="180">180</option>
                      </select>
                      <span className="text-xs text-muted-foreground">days after being sent.</span>
                    </div>
                  </div>

                  {/* Community rules */}
                  <div>
                    <label className="text-xs font-medium text-card-foreground mb-1.5 block">Community rules <span className="text-destructive">*</span></label>
                    <div className="relative">
                      <textarea value={formCommunityRules} onChange={e => setFormCommunityRules(e.target.value.slice(0, 500))} placeholder="Describe the community rules and guidelines…" rows={4} className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none" />
                      <span className="absolute right-3 bottom-2 text-[10px] text-muted-foreground">{formCommunityRules.length}/500</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ─── Messages Section (Collapsible) ─── */}
            <div className="border border-border rounded-lg overflow-hidden">
              <button onClick={() => setMessagesExpanded(!messagesExpanded)} className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                <span className="text-xs font-semibold text-card-foreground">Messages (optional)</span>
                <span className="text-[10px] text-muted-foreground">{messagesExpanded ? "▲" : "▼"}</span>
              </button>
              {messagesExpanded && (
                <div className="border-t border-border">
                  <p className="text-[11px] text-muted-foreground leading-relaxed px-4 pt-3 pb-2">Salutations and valedictions are system-generated so please include just the body of your message in the box.</p>
                  <div className="px-4 pb-3">
                    <select value={activeMessageTemplate} onChange={e => setActiveMessageTemplate(e.target.value)} className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-card-foreground">
                      <option value="welcome">Welcome to the Community</option>
                      <option value="decline">Decline request to join the Community</option>
                      <option value="block-post">Block post to the Community</option>
                      <option value="block-content">Block content shared to the Community</option>
                      <option value="block-playlist">Block playlist shared to the Community</option>
                      <option value="invitation">Invitation to join the Community</option>
                      <option value="leave">Leave the Community</option>
                    </select>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-0.5 border border-border border-b-0 rounded-t-lg bg-muted/30 px-2 py-1.5">
                      {[{ icon: faBold, title: "Bold" }, { icon: faItalic, title: "Italic" }].map(btn => (
                        <button key={btn.title} title={btn.title} className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-card-foreground hover:bg-muted rounded transition-colors">
                          <FontAwesomeIcon icon={btn.icon} className="text-xs" />
                        </button>
                      ))}
                      <div className="w-px h-4 bg-border mx-1" />
                      {[{ icon: faAlignLeft, title: "Align left" }, { icon: faAlignCenter, title: "Align centre" }, { icon: faAlignRight, title: "Align right" }, { icon: faAlignJustify, title: "Justify" }].map(btn => (
                        <button key={btn.title} title={btn.title} className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-card-foreground hover:bg-muted rounded transition-colors">
                          <FontAwesomeIcon icon={btn.icon} className="text-xs" />
                        </button>
                      ))}
                      <div className="w-px h-4 bg-border mx-1" />
                      {[{ icon: faListUl, title: "Bullet list" }, { icon: faListOl, title: "Numbered list" }].map(btn => (
                        <button key={btn.title} title={btn.title} className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-card-foreground hover:bg-muted rounded transition-colors">
                          <FontAwesomeIcon icon={btn.icon} className="text-xs" />
                        </button>
                      ))}
                      <div className="w-px h-4 bg-border mx-1" />
                      <button title="Insert link" className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-card-foreground hover:bg-muted rounded transition-colors"><FontAwesomeIcon icon={faLinkIcon} className="text-xs" /></button>
                      <button title="Insert image" className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-card-foreground hover:bg-muted rounded transition-colors"><FontAwesomeIcon icon={faImageIcon} className="text-xs" /></button>
                    </div>
                    <div className="relative">
                      <textarea
                        value={messageTemplates[activeMessageTemplate] || ""}
                        onChange={e => setMessageTemplates(prev => ({ ...prev, [activeMessageTemplate]: e.target.value.slice(0, 2000) }))}
                        rows={8}
                        className="w-full text-sm border border-border rounded-b-lg rounded-t-none px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none leading-relaxed"
                      />
                      <span className="absolute right-3 bottom-2 text-[10px] text-muted-foreground">{(messageTemplates[activeMessageTemplate] || "").length}/2000</span>
                    </div>
                    <div className="flex justify-end mt-2">
                      <button className="text-xs font-medium text-primary border border-primary/30 rounded-md px-3 py-1.5 hover:bg-primary/5 transition-colors">Send me an example email</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button onClick={() => setCreateOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors">Cancel</button>
              <button
                onClick={handleCreate}
                disabled={!formName.trim() || !formSummary.trim() || formSelectedContributions.length === 0 || formSaving}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${formName.trim() && formSummary.trim() && formSelectedContributions.length > 0 && !formSaving ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground"}`}
              >
                {formSaving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Leave Community Confirmation */}
      <Dialog open={!!confirmLeave} onOpenChange={(open) => { if (!open) setConfirmLeave(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-serif">Leave Community</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to leave <span className="font-semibold text-card-foreground">{communities.find(c => c.id === confirmLeave)?.name}</span>? You will lose access to discussions, resources, and events. You can request to rejoin later.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={() => setConfirmLeave(null)} className="flex-1 text-sm font-medium border border-border rounded-lg py-2 hover:bg-muted transition-colors">Stay</button>
            <button
              onClick={() => { if (confirmLeave) { setCommunities(prev => prev.filter(c => c.id !== confirmLeave)); setConfirmLeave(null); } }}
              className="flex-1 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg py-2 hover:bg-destructive/90 transition-colors flex items-center justify-center gap-1.5"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="text-xs" /> Leave
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer onShowHome={() => navigate("/")} onShowContribute={() => navigate("/")} onNavigateToSection={() => {}} />
    </div>
  );
};

export default MyCommunities;
