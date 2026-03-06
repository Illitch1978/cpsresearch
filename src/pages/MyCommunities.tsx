import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faArrowLeft, faComments, faFile, faCalendar } from "@fortawesome/free-solid-svg-icons";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const myCommunities = [
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
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-card-foreground">
            My Communities
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Communities you are a member of. Click to enter and participate.
          </p>
        </div>

        {/* Community Cards */}
        <div className="space-y-4">
          {myCommunities.map((community) => (
            <button
              key={community.id}
              onClick={() => navigate(`/community/${community.id}`)}
              className="w-full text-left bg-card border border-border rounded-sm p-5 sm:p-6 hover:border-primary/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-sm bg-primary/10 text-primary font-serif font-semibold text-sm flex items-center justify-center flex-shrink-0">
                  {community.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="font-serif font-medium text-card-foreground text-base sm:text-lg group-hover:text-primary transition-colors">
                      {community.name}
                    </h2>
                    <span className="text-[10px] uppercase tracking-wider font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-sm">
                      {community.role}
                    </span>
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
              </div>
            </button>
          ))}
        </div>
      </main>

      <Footer
        onShowHome={() => navigate("/")}
        onShowContribute={() => navigate("/")}
        onNavigateToSection={() => {}}
      />
    </div>
  );
};

export default MyCommunities;
