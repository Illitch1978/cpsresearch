const initiatives = [
  {
    title: "Quarterly professional services trend analysis",
    description:
      "The Centre publishes a quarterly trend analysis examining key themes and topics shaping the professional services sector, including shifts in client demand, competitive dynamics, talent markets and regulatory developments. It is used by leadership teams, investors and policymakers as a timely, evidence based reference point. Each edition draws on a blend of proprietary research, practitioner insight and public data to surface the trends that matter most to firms navigating an evolving landscape.",
  },
  {
    title: "Credible voices marketplace",
    description:
      "The Centre maintains a curated pool of researchers and practitioners willing to contribute to consultations, panels and media commentary. Selection is based on evidence of sustained, high quality contribution rather than seniority or profile. The marketplace connects organisations seeking credible, independent expertise with voices who bring both rigour and practical insight, ensuring public and policy debate is informed by those closest to the work.",
  },
  {
    title: "Peer led research projects",
    description:
      "Each year the Centre sponsors a small number of collaborative research projects led by mixed teams of academics and practitioners. These projects address practical questions facing the sector and produce findings grounded in both rigorous method and real world experience. Outputs are formally published under the Centre banner and presented at open events.",
  },
  {
    title: "Learning and development in professional services",
    description:
      "The Centre investigates how professional services firms develop talent, build capabilities and foster continuous learning. Research covers emerging models for skills development, knowledge sharing and career progression that respond to changing client expectations and workforce dynamics. Work in this area draws on evidence from across the sector to identify what distinguishes firms that consistently build deep, adaptable expertise from those that rely on traditional approaches alone.",
  },
  {
    title: "Innovation across professional services",
    description:
      "The Centre examines how firms across the sector approach innovation in service delivery, business models and client engagement. Work in this area surfaces practical examples, identifies barriers and shares frameworks that help firms move from experimentation to sustained, scalable change.",
  },
  {
    title: "AI in professional services",
    description:
      "The Centre connects leading initiatives, surfaces practical use cases and addresses risk management challenges as AI reshapes professional services. Research covers adoption strategies, governance frameworks and the evolving boundary between human expertise and machine capability.",
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
              <h3 className="text-xl font-serif font-medium text-slate-900 mb-3 group-hover:text-brand-red transition-colors duration-300">
                {initiative.title}
              </h3>
              <p className="text-slate-600 font-light text-sm leading-relaxed mt-auto">
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
