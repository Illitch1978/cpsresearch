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
  url?: string;
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
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white border border-slate-200 shadow-xl">
        {/* Header */}
        <div className="bg-slate-800 p-5 text-white">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-red to-red-700 flex items-center justify-center text-white font-serif shadow-md">
              {expert.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-semibold">{expert.name}</h3>
              <p className="text-slate-300 text-sm">{expert.firm}</p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-white/10 text-white/90 text-xs rounded-full">
                {expert.tag}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Score and Publications */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="text-xl font-serif font-bold text-brand-red">{expert.score}%</div>
              <span className="text-xs text-slate-500">Match</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xl font-serif font-bold text-slate-700">{expert.pubs}</div>
              <span className="text-xs text-slate-500">Pubs</span>
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
    { id: "1", title: "The Future of M&A in European Markets", author: "Dr. Elena Voreas", date: "Jan 2024", qualityScore: 94, url: "https://papers.ssrn.com/future-ma-european-markets" },
    { id: "2", title: "Fintech Regulation: A Comprehensive Guide", author: "Prof. James Sterling", date: "Dec 2023", qualityScore: 87, url: "https://papers.ssrn.com/fintech-regulation-guide" },
  ]);

  const removeExpert = (id: string) => setExperts(experts.filter(e => e.id !== id));
  const removeCommunity = (id: string) => setCommunities(communities.filter(c => c.id !== id));
  const removePublication = (id: string) => setPublications(publications.filter(p => p.id !== id));

  const openExpertModal = (expert: BookmarkedExpert) => {
    setSelectedExpert(expert);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div>
              <h1 className="font-serif text-xl font-semibold text-slate-900">My Bookmarks</h1>
              <p className="text-sm text-slate-500">Your saved experts, communities & publications</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="experts" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white border border-slate-200 p-1 rounded-lg shadow-sm">
            <TabsTrigger 
              value="experts" 
              className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-600 rounded-md transition-all"
            >
              <FontAwesomeIcon icon={faUserTie} className="text-xs" />
              Experts ({experts.length})
            </TabsTrigger>
            <TabsTrigger 
              value="communities" 
              className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-600 rounded-md transition-all"
            >
              <FontAwesomeIcon icon={faUsers} className="text-xs" />
              Communities ({communities.length})
            </TabsTrigger>
            <TabsTrigger 
              value="publications" 
              className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-600 rounded-md transition-all"
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
              <div className="space-y-3">
                {experts.map((expert) => (
                  <div 
                    key={expert.id} 
                    className="group bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white text-sm font-serif">
                          {expert.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <button
                            onClick={() => openExpertModal(expert)}
                            className="font-medium text-slate-900 hover:text-brand-red transition-colors text-left"
                          >
                            {expert.name}
                          </button>
                          <p className="text-sm text-slate-500">{expert.firm}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                              {expert.tag}
                            </span>
                            <span className="text-xs text-slate-400">
                              <span className="text-brand-red font-medium">{expert.score}%</span> match
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeExpert(expert.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
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
              <div className="space-y-3">
                {communities.map((community) => (
                  <div 
                    key={community.id} 
                    className="group bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                          <FontAwesomeIcon icon={faUsers} className="text-sm" />
                        </div>
                        <div className="flex-1">
                          <a
                            href={community.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-slate-900 hover:text-brand-red transition-colors inline-flex items-center gap-2"
                          >
                            {community.name}
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs text-slate-400" />
                          </a>
                          <p className="text-sm text-slate-500">{community.description}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            <span className="text-emerald-600 font-medium">{community.members.toLocaleString()}</span> members
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeCommunity(community.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
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
              <div className="space-y-3">
                {publications.map((pub) => (
                  <div 
                    key={pub.id} 
                    className="group bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
                          <FontAwesomeIcon icon={faFileLines} className="text-sm" />
                        </div>
                        <div className="flex-1">
                          <a
                            href={pub.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-slate-900 hover:text-brand-red transition-colors inline-flex items-center gap-2"
                          >
                            {pub.title}
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs text-slate-400" />
                          </a>
                          <p className="text-sm text-slate-500">{pub.author} · {pub.date}</p>
                          
                          {/* Quality Score */}
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 max-w-24">
                              <Progress 
                                value={pub.qualityScore} 
                                className="h-1.5 bg-slate-100"
                              />
                            </div>
                            <span className="text-xs font-medium text-brand-red">
                              {pub.qualityScore}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removePublication(pub.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
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
  <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
    <FontAwesomeIcon icon={icon} className="text-4xl text-slate-300 mb-3" />
    <p className="text-slate-500">{message}</p>
    <p className="text-sm text-slate-400 mt-1">Items you bookmark will appear here</p>
  </div>
);

export default Bookmarks;
