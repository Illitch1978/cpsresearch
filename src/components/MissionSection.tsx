const MissionSection = () => {
  return (
    <section id="about" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sticky Header Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <h2 className="text-4xl font-serif font-medium text-slate-900 mb-8 leading-tight">
                Our mission <br />and purpose
              </h2>
              <div className="pl-6 border-l-2 border-brand-red">
                <p className="text-lg text-slate-600 font-serif italic leading-relaxed">
                  "To provide a trusted, independent space where evidence, expertise and experience
                  are brought together."
                </p>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="lg:col-span-8">
            <div className="prose-lg text-slate-700 font-light leading-loose text-justify space-y-8">
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-slate-900 first-letter:mr-2 first-letter:float-left">
                The <strong>Centre for Professional Services Research</strong> exists to improve the
                quality of understanding about the professional services sector and its contribution to
                the economy and society. Its purpose is to provide a trusted, independent space where
                evidence, expertise and experience are brought together to inform better decisions by
                firms, policymakers, investors and educators.
              </p>
              <p>
                The Centre acts as a bridge between research and practice. It curates and produces
                accessible, peer reviewed insight on the structure, performance and evolution of
                professional services, with a particular focus on growth, productivity, talent,
                innovation and regulation. By doing so, it helps reduce fragmentation, challenge
                assumptions and raise the standard of debate about the sector.
              </p>
              <p>
                The Centre is a public interest, method led initiative with independent governance. It does not advocate for
                individual firms or promote opinion driven commentary. Instead, it champions rigorous
                methods, transparency and collaboration across professional firms, business schools,
                professional bodies and independent researchers. A strong emphasis is placed on
                diversity of voices and on supporting emerging researchers alongside established
                experts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
