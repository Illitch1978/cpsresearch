import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface BenefitsSectionProps {
  onShowContribute: () => void;
}

const benefits = [
  {
    title: "Community of peers",
    description:
      "Be part of a trusted network of practitioners, researchers and institutions who share a commitment to evidence, quality and collaboration across professional services.",
  },
  {
    title: "Relevant insight",
    description:
      "Access research, analysis and practitioner thinking that is curated for usefulness, credibility and relevance to real decisions rather than trends or opinion.",
  },
  {
    title: "Expert interaction",
    description:
      "Engage directly with experienced researchers and practitioners through events, discussions and collaborative initiatives that encourage informed exchange and learning.",
  },
];

const impactAreas = [
  {
    title: "Shaping policy and regulation",
    description:
      "When departments and regulators need an independent view of how professional services are evolving, the Centre provides evidence drawn from longitudinal research and sector wide analysis. This helps ground policy discussions in data, comparison and context rather than anecdote or short term pressure.",
  },
  {
    title: "Setting firm strategy and investment",
    description:
      "Leadership teams use the Centre's reports and briefings to benchmark their firm against peers, identify emerging client needs, and test strategic assumptions before committing resources. The focus is on clarity, comparability and long term positioning.",
  },
  {
    title: "Informing public and media debate",
    description:
      "Journalists and commentators draw on the Centre's research and expert network to contextualise stories, compare trends across sub sectors, and surface credible voices for informed, balanced coverage.",
  },
  {
    title: "Evaluating sector performance and risk",
    description:
      "Investors and analysts use the Centre's datasets and sector reports to compare professional services with other industries and to understand structural issues shaping growth, resilience and productivity.",
  },
];

const BenefitsSection = ({ onShowContribute }: BenefitsSectionProps) => {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Benefits */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-medium text-slate-900">
              What are the benefits for Centre members?
            </h2>
            <div className="w-16 h-px bg-slate-300 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-8 bg-slate-50/50 border border-slate-100 rounded-sm hover:border-brand-red/30 transition-colors duration-300"
              >
                <h3 className="font-serif text-xl text-slate-900 mb-4">{benefit.title}</h3>
                <p className="text-sm text-slate-600 font-light leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Section */}
        <div>
          <div className="relative mt-24 bg-hero-bg rounded-sm -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
            {/* Decorative bg element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red opacity-5 rounded-full blur-3xl -mr-16 -mt-16"></div>

            <div className="relative px-8 py-20 sm:px-12 lg:px-16">
              <div className="max-w-3xl mb-16">
                <h2 className="text-3xl font-serif text-white mb-6 leading-tight">
                  Where the Centre is used in practice
                </h2>
                <div className="w-16 h-px bg-brand-red"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
                {impactAreas.map((area, index) => (
                  <div key={index} className="group">
                    <h3 className="text-xl font-serif text-white mb-4 flex items-center gap-3">
                      <span className="w-2 h-2 bg-brand-red rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></span>
                      {area.title}
                    </h3>
                    <p className="text-slate-400 font-light leading-relaxed text-sm">
                      {area.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom Highlights */}
              <div className="mt-20 pt-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-brand-red font-semibold mb-3 block">
                    Used in practice
                  </span>
                  <p className="text-slate-300 font-serif italic text-lg leading-relaxed">
                    "The Centre's work is referenced by leadership teams, policymakers, researchers
                    and journalists across professional services, law, consulting and finance."
                  </p>
                </div>
                <div className="flex flex-col justify-center border-l border-white/10 md:pl-12">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-3 block">
                    Call to Action
                  </span>
                  <h4 className="text-xl text-white font-serif mb-2">Engage with the Centre's work</h4>
                  <p className="text-slate-400 text-sm font-light mb-6">
                    Explore current research, upcoming events and opportunities to contribute.
                  </p>
                  <button
                    onClick={onShowContribute}
                    className="inline-flex items-center text-white text-sm font-medium hover:text-brand-red transition-colors gap-2 group"
                  >
                    Get Involved
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-xs transform group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
