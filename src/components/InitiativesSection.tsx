const initiatives = [
  {
    title: "Annual state of professional services report",
    description:
      "The Centre publishes a flagship annual report providing an objective overview of performance, trends and structural shifts across the sector, including productivity, talent, innovation and regulation as recurring chapters. It is used by government departments, investors and leadership teams as a shared reference point.",
  },
  {
    title: "Quarterly insight briefings for policy and leadership",
    description:
      "Short, focused briefings translate current research and member contributions into implications for policy, regulation and firm strategy, covering immediate challenges like AI adoption or regulatory divergence. These are designed to be read and used in boardrooms and policy discussions.",
  },
  {
    title: "Credible voices market place",
    description:
      "The Centre maintains a curated pool of researchers and practitioners willing to contribute to consultations, panels and media commentary. Selection is based on evidence of sustained, high quality contribution rather than seniority or profile.",
  },
  {
    title: "Peer led research projects",
    description:
      "Each year the Centre sponsors a small number of collaborative research projects led by mixed teams of academics and practitioners. Outputs are formally published under the Centre banner and presented at open events.",
  },
  {
    title: "Centre seminars and public lectures",
    description:
      "The Centre runs a programme of in person and hybrid events where new research findings are presented and debated. These events are open to members and invited external audiences, supporting visibility and informed dialogue.",
  },
  {
    title: "Collaborative commissions on priority topics",
    description:
      "Where there is clear sector wide interest, the Centre brings together funders and contributors to commission independent research on a defined issue. The Centre oversees scope, quality and dissemination to ensure neutrality.",
  },
];

const InitiativesSection = () => {
  return (
    <section id="initiatives" className="py-24 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-medium text-slate-900">Key initiatives</h2>
          <p className="text-slate-500 mt-2 font-light">Concrete application of our research goals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {initiatives.map((initiative, index) => (
            <div key={index} className="initiative-card group">
              <h3 className="text-2xl font-serif font-medium text-slate-900 mb-4 group-hover:text-brand-red transition-colors duration-300">
                {initiative.title}
              </h3>
              <p className="text-slate-600 font-light text-base mt-auto">
                {initiative.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InitiativesSection;
