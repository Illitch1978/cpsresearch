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
                  "Our mission is to bring together evidence, expertise and experience in a
                  trusted, independent environment that supports better decision-making by
                  professional firms, policymakers, investors, educators and researchers."
                </p>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="lg:col-span-8">
            <div className="prose-lg text-slate-700 font-light leading-loose text-justify space-y-8">
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-slate-900 first-letter:mr-2 first-letter:float-left">
                The <strong>Centre for Professional Services Research</strong> is an independent,
                public-interest initiative dedicated to improving understanding of the professional
                services sector and its contribution to the economy and society.
              </p>

              <h3 className="text-2xl font-serif font-medium text-slate-900 text-left">
                Bridging research and practice
              </h3>
              <p>
                The Centre acts as a bridge between research and practice. It curates, commissions
                and publishes accessible, rigorous insight into the structure, performance and
                evolution of professional services, with particular emphasis on growth,
                productivity, talent, innovation and regulation.
              </p>
              <p>
                By bringing together professional firms, business schools, professional bodies and
                independent researchers, the Centre seeks to reduce fragmentation, challenge
                assumptions and raise the standard of debate across the sector.
              </p>
              <p>
                The Centre is method-led rather than opinion-led. It does not advocate for
                individual firms or promote commercial viewpoints. Instead, it champions rigorous
                methods, transparency and collaboration. A particular emphasis is placed on
                encouraging diversity of voices and supporting emerging researchers alongside
                established experts.
              </p>

              <h3 className="text-2xl font-serif font-medium text-slate-900 text-left">
                The intellectual anchor of Credible Voices
              </h3>
              <p>
                The Centre is the intellectual anchor of Credible Voices, the overarching brand for
                an evidence-based approach to measuring, understanding and applying expertise.
              </p>
              <p>
                The Centre develops and promotes rigorous methods and independent research. These
                provide an intellectual foundation for the wider Credible Voices ecosystem:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-left">
                <li>
                  <strong>The Centre for Professional Services Research (“the Centre”)</strong>{" "}
                  develops and promotes rigorous methods and independent research.
                </li>
                <li>
                  <strong>The Credible Voices Expertise Intelligence Platform (“the Platform”)</strong>{" "}
                  operationalises those methods at scale, using structured assessment, tightly
                  controlled AI and a deterministic evidence database to create defensible evidence
                  of expertise.
                </li>
                <li>
                  <strong>The Credible Voices Marketplace® (“the Marketplace”)</strong> applies the
                  resulting evidence to connect buyers with experts and communities.
                </li>
              </ul>
              <p>
                Through this relationship, rigorous methods and independent research can be
                translated into practical tools that help organisations measure, benchmark,
                discover and develop expertise using defensible evidence rather than opinion or
                reputation alone.
              </p>
              <p>
                The Centre’s role is not to promote individual organisations, experts or commercial
                viewpoints. Its contribution is to strengthen the methods, research and
                public-interest principles that underpin the wider Credible Voices approach.
              </p>

              <h3 className="text-2xl font-serif font-medium text-slate-900 text-left">
                Supporting public-interest research
              </h3>
              <p>
                Thirty per cent of buyer fees from the Credible Voices Marketplace® are allocated
                to the Centre to support its independent public-interest activities.
              </p>
              <p>
                This funding supports research, collaboration, the development of emerging
                researchers and initiatives that improve understanding of professional services and
                their contribution to the economy and society.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
