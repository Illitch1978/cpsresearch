import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie, faUsers, faFileLines, faTrash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BookmarkedExpert {
  id: string;
  name: string;
  firm: string;
  tag: string;
}

interface BookmarkedCommunity {
  id: string;
  name: string;
  members: number;
  description: string;
}

interface BookmarkedPublication {
  id: string;
  title: string;
  author: string;
  date: string;
}

const Bookmarks = () => {
  const navigate = useNavigate();
  
  const [experts, setExperts] = useState<BookmarkedExpert[]>([
    { id: "1", name: "Dr. Elena Voreas", firm: "Clifford Chance", tag: "Corporate Law" },
    { id: "2", name: "Sarah Jenkins", firm: "Allen & Overy", tag: "Digital Transformation" },
  ]);

  const [communities, setCommunities] = useState<BookmarkedCommunity[]>([
    { id: "1", name: "Legal Tech Innovators", members: 2340, description: "Digital transformation in legal services" },
  ]);

  const [publications, setPublications] = useState<BookmarkedPublication[]>([
    { id: "1", title: "The Future of M&A in European Markets", author: "Dr. Elena Voreas", date: "Jan 2024" },
    { id: "2", title: "Fintech Regulation: A Comprehensive Guide", author: "Prof. James Sterling", date: "Dec 2023" },
  ]);

  const removeExpert = (id: string) => setExperts(experts.filter(e => e.id !== id));
  const removeCommunity = (id: string) => setCommunities(communities.filter(c => c.id !== id));
  const removePublication = (id: string) => setPublications(publications.filter(p => p.id !== id));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div>
              <h1 className="font-serif text-xl font-semibold text-slate-900">My Bookmarks</h1>
              <p className="text-sm text-slate-500">Manage your saved experts, communities, and publications</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="experts" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="experts" className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUserTie} className="text-xs" />
              Experts ({experts.length})
            </TabsTrigger>
            <TabsTrigger value="communities" className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="text-xs" />
              Communities ({communities.length})
            </TabsTrigger>
            <TabsTrigger value="publications" className="flex items-center gap-2">
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
                  <div key={expert.id} className="bg-white rounded-lg border border-slate-200 p-4 flex justify-between items-center hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-500 text-sm font-serif">
                        {expert.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{expert.name}</p>
                        <p className="text-sm text-slate-500">{expert.firm} · {expert.tag}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeExpert(expert.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove bookmark"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
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
                  <div key={community.id} className="bg-white rounded-lg border border-slate-200 p-4 flex justify-between items-center hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-red/20 to-brand-red/30 flex items-center justify-center text-brand-red">
                        <FontAwesomeIcon icon={faUsers} className="text-sm" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{community.name}</p>
                        <p className="text-sm text-slate-500">{community.members.toLocaleString()} members · {community.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeCommunity(community.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove bookmark"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
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
                  <div key={pub.id} className="bg-white rounded-lg border border-slate-200 p-4 flex justify-between items-center hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500">
                        <FontAwesomeIcon icon={faFileLines} className="text-sm" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{pub.title}</p>
                        <p className="text-sm text-slate-500">{pub.author} · {pub.date}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removePublication(pub.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove bookmark"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
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
