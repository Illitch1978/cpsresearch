import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const contributions = [
  {
    title: "Research and publications",
    description:
      "Contribute to the Centre's research programme by proposing or participating in studies that advance understanding of the professional services sector. Contributions may include original research, collaborative projects, practitioner papers or essays that are evidence led and clearly argued. All contributions are reviewed for quality, relevance and alignment with the Centre's ethos.",
  },
  {
    title: "Events and discussions",
    description:
      "Take part in the Centre's programme of seminars, roundtables and public lectures. Contributors may present research, share practice based insight, or help shape discussion on priority topics facing the sector. Events are designed to encourage informed exchange rather than promotion.",
  },
  {
    title: "Peer research circles",
    description:
      "Join or help convene a peer led research circle focused on a defined question or challenge. These time bound groups bring together practitioners and academics to explore issues in depth and produce a short publication or briefing under the Centre's banner.",
  },
  {
    title: "Expert contribution and commentary",
    description:
      "Make yourself available as a contributor to panels, consultations or public commentary coordinated by the Centre. Selection is based on demonstrated expertise and quality of contribution, not seniority or profile.",
  },
  {
    title: "Supporting emerging researchers",
    description:
      "Experienced contributors can mentor or support early career researchers through co authored work, feedback and participation in Centre initiatives. This helps strengthen and diversify the research base over time.",
  },
];

const whoCanContribute = [
  "Professional services practitioners",
  "Academic researchers and doctoral students",
  "Professional and trade bodies",
  "Policy and regulatory specialists",
  "Independent experts and educators",
];

const ContributeView = () => {
  return (
    <div className="fade-in">
      {/* Contribute Header */}
      <header className="bg-[#1a202c] py-24 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 font-serif">
            Ways to contribute
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            The Centre is built on shared work. Here are practical ways to contribute.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-24 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {contributions.map((contribution, index) => (
              <div key={index}>
                <h3 className="text-2xl font-serif font-medium text-slate-900 mb-4 border-l-4 border-brand-red pl-4">
                  {contribution.title}
                </h3>
                <p className="text-slate-700 font-light leading-relaxed">
                  {contribution.description}
                </p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 my-16"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Who can contribute */}
            <div className="bg-white p-8 border border-slate-100 shadow-sm rounded-sm">
              <h3 className="text-xl font-serif font-medium text-slate-900 mb-6">Who can contribute</h3>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-4">
                The Centre welcomes contributions from:
              </p>
              <ul className="space-y-3 text-slate-700 font-light">
                {whoCanContribute.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faCheck} className="text-brand-red mt-1 text-xs" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-slate-500 italic border-t border-slate-100 pt-4">
                Contributors are expected to act in good faith and respect the Centre's commitment to
                independence and balance.
              </p>
            </div>

            {/* How contributions are used */}
            <div className="bg-slate-50 p-8 border border-slate-200 rounded-sm">
              <h3 className="text-xl font-serif font-medium text-slate-900 mb-6">
                How contributions are used
              </h3>
              <p className="text-slate-700 font-light leading-relaxed mb-4">
                Contributions inform the Centre's publications, events and briefings. Where appropriate,
                work is made publicly available to support better understanding of the sector among firms,
                policymakers, investors and the wider ecosystem.
              </p>
              <p className="text-slate-700 font-light leading-relaxed">
                The Centre does not promote individual firms or commercial services. Recognition is given
                through authorship, citation and participation rather than marketing exposure.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContributeView;
