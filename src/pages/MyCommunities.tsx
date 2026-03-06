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
} from "@fortawesome/free-solid-svg-icons";
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
  },
];

const MyCommunities = () => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<CommunityItem[]>(initialCommunities);
  const [showArchived, setShowArchived] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Create form state
  const [formName, setFormName] = useState("");
  const [formSummary, setFormSummary] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAccess, setFormAccess] = useState<"open" | "private">("open");
  const [formFrontline, setFormFrontline] = useState(false);
  const [formOfficial, setFormOfficial] = useState(false);
  const [formSaving, setFormSaving] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeCommunities = communities.filter(c => !c.archived);
  const archivedCommunities = communities.filter(c => c.archived);

  const toggleArchive = (id: string) => {
    setCommunities(prev =>
      prev.map(c => c.id === id ? { ...c, archived: !c.archived } : c)
    );
    setMenuOpen(null);
  };

  const handleCreate = () => {
    if (!formName.trim() || !formSummary.trim()) return;
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
      setFormName("");
      setFormSummary("");
      setFormDescription("");
      setFormAccess("open");
      setFormFrontline(false);
      setFormOfficial(false);
      setFormSaving(false);
      setCreateOpen(false);
    }, 800);
  };

  const resetForm = () => {
    setFormName("");
    setFormSummary("");
    setFormDescription("");
    setFormAccess("open");
    setFormFrontline(false);
    setFormOfficial(false);
  };

  const renderCommunityCard = (community: CommunityItem) => (
    <div
      key={community.id}
      className={`w-full text-left bg-card border border-border rounded-sm p-5 sm:p-6 transition-all ${community.archived ? "opacity-60" : "hover:border-primary/30 hover:shadow-md"}`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
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
            {community.archived && (
              <Badge variant="outline" className="text-[10px] text-muted-foreground border-muted-foreground/30">
                Archived
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {community.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-5 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faUsers} className="text-[10px]" />
              {community.members} members
            </span>
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faComments} className="text-[10px]" />
              {community.discussions} discussions
            </span>
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faFile} className="text-[10px]" />
              {community.resources} resources
            </span>
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faCalendar} className="text-[10px]" />
              {community.events} events
            </span>
          </div>

          <p className="text-[11px] text-muted-foreground mt-2">
            Active {community.lastActive}
          </p>
        </div>

        {/* Actions Menu */}
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
                <button
                  onClick={() => toggleArchive(community.id)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center gap-2 text-muted-foreground"
                >
                  <FontAwesomeIcon icon={faBoxArchive} className="text-[10px]" /> Archive community
                </button>
              ) : (
                <button
                  onClick={() => toggleArchive(community.id)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center gap-2 text-primary"
                >
                  <FontAwesomeIcon icon={faRotateLeft} className="text-[10px]" /> Restore community
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            Back to home
          </button>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-card-foreground">
                My Communities
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Communities you are a member of. Click to enter and participate.
              </p>
            </div>
            <button
              onClick={() => { resetForm(); setCreateOpen(true); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="text-xs" /> Add Community
            </button>
          </div>
        </div>

        {/* Active Communities */}
        <div className="space-y-4">
          {activeCommunities.map(renderCommunityCard)}
          {activeCommunities.length === 0 && (
            <div className="text-center py-12 bg-card border border-border rounded-sm">
              <FontAwesomeIcon icon={faUsers} className="text-3xl text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No active communities.</p>
              <button
                onClick={() => { resetForm(); setCreateOpen(true); }}
                className="text-sm text-primary font-medium hover:underline mt-2"
              >
                Create your first community →
              </button>
            </div>
          )}
        </div>

        {/* Archived Section */}
        {archivedCommunities.length > 0 && (
          <div className="mt-8">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <FontAwesomeIcon icon={faBoxArchive} className="text-xs" />
              Archived ({archivedCommunities.length})
              <span className="text-[10px]">{showArchived ? "▲" : "▼"}</span>
            </button>
            {showArchived && (
              <div className="space-y-4">
                {archivedCommunities.map(renderCommunityCard)}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create Community Dialog */}
      <Dialog open={createOpen} onOpenChange={(open) => { if (!open) setCreateOpen(false); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif">Add Community</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Once a community has been saved, changes can only be made to its name or access by admins.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Name */}
            <div>
              <label className="text-xs font-medium text-card-foreground mb-1.5 block">
                Name <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value.slice(0, 100))}
                  placeholder="Community name…"
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">{formName.length}/100</span>
              </div>
            </div>

            {/* Theme / Access */}
            <div>
              <label className="text-xs font-medium text-card-foreground mb-1.5 block">
                Access <span className="text-destructive">*</span>
              </label>
              <div className="flex items-center gap-0 border border-border rounded-lg overflow-hidden w-fit">
                <button
                  onClick={() => setFormAccess("open")}
                  className={`px-4 py-2 text-xs font-medium flex items-center gap-1.5 transition-colors ${formAccess === "open" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                >
                  <FontAwesomeIcon icon={faGlobe} className="text-[10px]" /> Open
                </button>
                <button
                  onClick={() => setFormAccess("private")}
                  className={`px-4 py-2 text-xs font-medium flex items-center gap-1.5 transition-colors ${formAccess === "private" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                >
                  <FontAwesomeIcon icon={faLock} className="text-[10px]" /> Private
                </button>
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="text-xs font-medium text-card-foreground mb-1.5 block">
                Thumbnail
              </label>
              <button className="flex items-center gap-2 text-xs text-muted-foreground border border-dashed border-border rounded-lg px-4 py-3 hover:border-primary/30 hover:bg-muted/50 transition-all w-full">
                <FontAwesomeIcon icon={faImage} className="text-sm text-muted-foreground/50" />
                <span>Choose image (max 500KB)</span>
              </button>
            </div>

            {/* Frontline content */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFormFrontline(!formFrontline)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${formFrontline ? "bg-primary border-primary text-primary-foreground" : "border-border bg-background"}`}
              >
                {formFrontline && <FontAwesomeIcon icon={faCheck} className="text-[8px]" />}
              </button>
              <label className="text-xs text-card-foreground font-medium cursor-pointer" onClick={() => setFormFrontline(!formFrontline)}>
                Frontline content
              </label>
            </div>

            {/* Summary */}
            <div>
              <label className="text-xs font-medium text-card-foreground mb-1.5 block">
                Summary <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <textarea
                  value={formSummary}
                  onChange={e => setFormSummary(e.target.value.slice(0, 250))}
                  placeholder="Brief summary of the community…"
                  rows={2}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none"
                />
                <span className="absolute right-3 bottom-2 text-[10px] text-muted-foreground">{formSummary.length}/250</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-medium text-card-foreground mb-1.5 block">
                Description
              </label>
              <div className="relative">
                <textarea
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value.slice(0, 1000))}
                  placeholder="Detailed description of the community's purpose and goals…"
                  rows={4}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none"
                />
                <span className="absolute right-3 bottom-2 text-[10px] text-muted-foreground">{formDescription.length}/1000</span>
              </div>
            </div>

            {/* Official Community */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFormOfficial(!formOfficial)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${formOfficial ? "bg-primary border-primary text-primary-foreground" : "border-border bg-background"}`}
              >
                {formOfficial && <FontAwesomeIcon icon={faCheck} className="text-[8px]" />}
              </button>
              <label className="text-xs text-card-foreground font-medium cursor-pointer" onClick={() => setFormOfficial(!formOfficial)}>
                Official Community
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button
                onClick={() => setCreateOpen(false)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!formName.trim() || !formSummary.trim() || formSaving}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${formName.trim() && formSummary.trim() && !formSaving ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground"}`}
              >
                {formSaving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer
        onShowHome={() => navigate("/")}
        onShowContribute={() => navigate("/")}
        onNavigateToSection={() => {}}
      />
    </div>
  );
};

export default MyCommunities;
