import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie, faUsers, faTrash, faArrowLeft, faEnvelope, faPhone, faChevronDown, faChevronUp, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { faFileLines, faAddressCard } from "@fortawesome/free-regular-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface BookmarkedExpert {
  id: string;
  name: string;
  firm: string;
  tag: string;
  location?: string;
  email?: string;
  phone?: string;
  division?: string;
  primaryGroup?: string;
  bio?: string;
  officialBioUrl?: string;
  linkedInUrl?: string;
  score: number;
  pubs: number;
}

interface BookmarkedCommunity {
  id: string;
  name: string;
  members: number;
  description: string;
  url: string;
}

interface BookmarkedPublication {
  id: string;
  title: string;
  author: string;
  date: string;
  qualityScore: number;
}

const ExpertProfileModal = ({ 
  expert, 
  isOpen, 
  onClose 
}: { 
  expert: BookmarkedExpert | null; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const [bioExpanded, setBioExpanded] = useState(false);

  if (!expert) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white border-0 shadow-2xl">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-red to-red-700 flex items-center justify-center text-white text-lg font-serif shadow-lg">
              {expert.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-xl font-semibold">{expert.name}</h3>
              <p className="text-slate-300 text-sm">{expert.firm}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 bg-white/10 text-white/90 text-xs rounded-full backdrop-blur-sm">
                {expert.tag}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Score and Publications */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-serif font-bold text-brand-red">{expert.score}%</div>
              <span className="text-xs text-slate-500">Match Score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-serif font-bold text-slate-700">{expert.pubs}</div>
              <span className="text-xs text-slate-500">Publications</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            {expert.email && (
              <div className="flex items-center gap-3 text-sm">
                <FontAwesomeIcon icon={faEnvelope} className="text-slate-400 w-4" />
                <a href={`mailto:${expert.email}`} className="text-brand-red hover:underline">{expert.email}</a>
              </div>
            )}
            {expert.phone && (
              <div className="flex items-center gap-3 text-sm">
                <FontAwesomeIcon icon={faPhone} className="text-slate-400 w-4" />
                <a href={`tel:${expert.phone}`} className="text-slate-700 hover:text-brand-red">{expert.phone}</a>
              </div>
            )}
          </div>

          {/* Division & Group */}
          {(expert.division || expert.primaryGroup) && (
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              {expert.division && (
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Division</p>
                  <p className="text-sm text-slate-700 font-medium">{expert.division}</p>
                </div>
              )}
              {expert.primaryGroup && (
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Primary Group</p>
                  <p className="text-sm text-slate-700 font-medium">{expert.primaryGroup}</p>
                </div>
              )}
            </div>
          )}

          {/* Bio */}
          {expert.bio && (
            <div className="pt-3 border-t border-slate-100">
              <button 
                onClick={() => setBioExpanded(!bioExpanded)}
                className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 transition-colors mb-2"
              >
                <FontAwesomeIcon icon={bioExpanded ? faChevronUp : faChevronDown} />
                {bioExpanded ? "Hide biography" : "Show biography"}
              </button>
              {bioExpanded && (
                <p className="text-sm text-slate-600 leading-relaxed">{expert.bio}</p>
              )}
            </div>
          )}

          {/* External Links */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            {expert.officialBioUrl && (
              <a 
                href={expert.officialBioUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-brand-red hover:underline"
              >
                <FontAwesomeIcon icon={faAddressCard} />
                Official bio
              </a>
            )}
            {expert.linkedInUrl && (
              <a 
                href={expert.linkedInUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#0A66C2] hover:underline"
              >
                <FontAwesomeIcon icon={faLinkedin} />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Bookmarks = () => {
  const navigate = useNavigate();
  const [selectedExpert, setSelectedExpert] = useState<BookmarkedExpert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [experts, setExperts] = useState<BookmarkedExpert[]>([
    { 
      id: "1", 
      name: "Dr. Elena Voreas", 
      firm: "Clifford Chance", 
      tag: "Corporate Law",
      location: "London, United Kingdom",
      email: "elena.voreas@cliffordchance.com",
      phone: "+44 20 7006 1234",
      division: "Corporate M&A",
      primaryGroup: "Private Equity",
      bio: "Dr. Elena Voreas is a leading expert in corporate law with over 20 years of experience in cross-border M&A transactions.",
      officialBioUrl: "https://www.cliffordchance.com/people/elena-voreas",
      score: 98,
      pubs: 14
    },
    { 
      id: "2", 
      name: "Sarah Jenkins", 
      firm: "Allen & Overy", 
      tag: "Digital Transformation",
      location: "London, United Kingdom",
      email: "sarah.jenkins@allenovery.com",
      division: "Technology & Innovation",
      linkedInUrl: "https://www.linkedin.com/in/sarah-jenkins",
      score: 91,
      pubs: 11
    },
  ]);

  const [communities, setCommunities] = useState<BookmarkedCommunity[]>([
    { id: "1", name: "Legal Tech Innovators", members: 2340, description: "Digital transformation in legal services", url: "https://community.legaltech.io" },
  ]);

  const [publications, setPublications] = useState<BookmarkedPublication[]>([
    { id: "1", title: "The Future of M&A in European Markets", author: "Dr. Elena Voreas", date: "Jan 2024", qualityScore: 94 },
    { id: "2", title: "Fintech Regulation: A Comprehensive Guide", author: "Prof. James Sterling", date: "Dec 2023", qualityScore: 87 },
  ]);

  const removeExpert = (id: string) => setExperts(experts.filter(e => e.id !== id));
  const removeCommunity = (id: string) => setCommunities(communities.filter(c => c.id !== id));
  const removePublication = (id: string) => setPublications(publications.filter(p => p.id !== id));

  const openExpertModal = (expert: BookmarkedExpert) => {
    setSelectedExpert(expert);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div>
              <h1 className="font-serif text-2xl font-semibold text-white">My Bookmarks</h1>
              <p className="text-sm text-slate-400">Your curated collection of experts, communities & research</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Tabs defaultValue="experts" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-800/50 border border-slate-700/50 p-1 rounded-xl">
            <TabsTrigger 
              value="experts" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-red data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 rounded-lg transition-all"
            >
              <FontAwesomeIcon icon={faUserTie} className="text-xs" />
              Experts ({experts.length})
            </TabsTrigger>
            <TabsTrigger 
              value="communities" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-red data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 rounded-lg transition-all"
            >
              <FontAwesomeIcon icon={faUsers} className="text-xs" />
              Communities ({communities.length})
            </TabsTrigger>
            <TabsTrigger 
              value="publications" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-red data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 rounded-lg transition-all"
            >
              <FontAwesomeIcon icon={faFileLines} className="text-xs" />
              Publications ({publications.length})
            </TabsTrigger>
          </TabsList>

          {/* Experts Tab */}
          <TabsContent value="experts">
            {experts.length === 0 ? (
              <EmptyState icon={faUserTie} message="No bookmarked experts yet" />
            ) : (
              <div className="space-y-4">
                {experts.map((expert) => (
                  <div 
                    key={expert.id} 
                    className="group bg-gradient-to-r from-slate-800/80 to-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 hover:border-brand-red/30 hover:shadow-lg hover:shadow-brand-red/5 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-red to-red-700 flex items-center justify-center text-white text-sm font-serif shadow-lg">
                          {expert.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <button
                            onClick={() => openExpertModal(expert)}
                            className="font-serif font-medium text-white hover:text-brand-red transition-colors text-left group-hover:underline decoration-brand-red/50"
                          >
                            {expert.name}
                          </button>
                          <p className="text-sm text-slate-400 mt-0.5">{expert.firm}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="px-2 py-0.5 bg-slate-700/50 text-slate-300 text-xs rounded-full">
                              {expert.tag}
                            </span>
                            <span className="text-xs text-slate-500">
                              Score: <span className="text-brand-red font-medium">{expert.score}%</span>
                            </span>
                            <span className="text-xs text-slate-500">
                              {expert.pubs} pubs
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeExpert(expert.id)}
                        className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Remove bookmark"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Communities Tab */}
          <TabsContent value="communities">
            {communities.length === 0 ? (
              <EmptyState icon={faUsers} message="No bookmarked communities yet" />
            ) : (
              <div className="space-y-4">
                {communities.map((community) => (
                  <div 
                    key={community.id} 
                    className="group bg-gradient-to-r from-slate-800/80 to-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 hover:border-brand-red/30 hover:shadow-lg hover:shadow-brand-red/5 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
                          <FontAwesomeIcon icon={faUsers} className="text-sm" />
                        </div>
                        <div className="flex-1">
                          <a
                            href={community.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-serif font-medium text-white hover:text-brand-red transition-colors inline-flex items-center gap-2 group-hover:underline decoration-brand-red/50"
                          >
                            {community.name}
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs text-slate-500 group-hover:text-brand-red" />
                          </a>
                          <p className="text-sm text-slate-400 mt-0.5">{community.description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-slate-500">
                              <span className="text-emerald-400 font-medium">{community.members.toLocaleString()}</span> members
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeCommunity(community.id)}
                        className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Remove bookmark"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Publications Tab */}
          <TabsContent value="publications">
            {publications.length === 0 ? (
              <EmptyState icon={faFileLines} message="No bookmarked publications yet" />
            ) : (
              <div className="space-y-4">
                {publications.map((pub) => (
                  <div 
                    key={pub.id} 
                    className="group bg-gradient-to-r from-slate-800/80 to-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 hover:border-brand-red/30 hover:shadow-lg hover:shadow-brand-red/5 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                          <FontAwesomeIcon icon={faFileLines} className="text-sm" />
                        </div>
                        <div className="flex-1">
                          <p className="font-serif font-medium text-white">{pub.title}</p>
                          <p className="text-sm text-slate-400 mt-0.5">{pub.author} · {pub.date}</p>
                          
                          {/* Quality Score */}
                          <div className="mt-3 flex items-center gap-3">
                            <div className="flex-1 max-w-32">
                              <Progress 
                                value={pub.qualityScore} 
                                className="h-1.5 bg-slate-700"
                              />
                            </div>
                            <span className="text-xs font-medium text-brand-red">
                              {pub.qualityScore}% Quality
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removePublication(pub.id)}
                        className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Remove bookmark"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Expert Profile Modal */}
      <ExpertProfileModal 
        expert={selectedExpert}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

const EmptyState = ({ icon, message }: { icon: any; message: string }) => (
  <div className="text-center py-16 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50">
    <FontAwesomeIcon icon={icon} className="text-5xl text-slate-600 mb-4" />
    <p className="text-slate-400 font-medium">{message}</p>
    <p className="text-sm text-slate-500 mt-1">Items you bookmark will appear here</p>
  </div>
);

export default Bookmarks;
