import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const commercialServices = [
  {
    service: "Find an Expert",
    noteNum: 1,
    hasAccess: true,
    renewsStart: "September 2026",
  },
  {
    service: "Audit own Website",
    noteNum: 2,
    hasAccess: true,
    renewsStart: "N/a (one-off fee)",
  },
  {
    service: "Marketplace Management Toolkit",
    noteNum: 3,
    hasAccess: false,
    renewsStart: null,
  },
  {
    service: "Strategic Planning Toolkit",
    noteNum: 4,
    hasAccess: false,
    renewsStart: null,
  },
  {
    service: "Upgrade own website search",
    noteNum: 5,
    hasAccess: true,
    renewsStart: "January 2027",
  },
];

const notes = [
  {
    num: 1,
    title: "Find an Expert",
    text: "Anyone at any organisation worldwide can find experts on the Credible Voices Marketplace℠. Procurement specialists, NEDs, journalists, academics, association managers, philanthropists, charities, policymakers and regulators enjoy free access. Others pay an annual fee of £5k to £20k, based on global FTE headcount.",
  },
  {
    num: 2,
    title: "Audit own Website",
    text: "Making manual adjustments on your firm's website for low quality items enhances the experience of website users and your firm's position in our open rankings by quality score. This service identifies which of your content items are worthy of extra promotion and which require attention. It also indicates which of your firm's authors are more likely to surface on the Credible Voices Marketplace℠. Initially, your firm's website is processed in a few hours to generate a quality score for each of your content items, with re-processing conducted fortnightly. Once processed, tools are provided to drill down your URL folders to view individual items; assess individual author performance; track overall in/out movements between runs; and compare your website KPIs with sector benchmarks. An equivalent manual exercise would take many months. A one-off fee of £500 is payable by Stripe for the service, which is available to any firm with no membership obligations.",
  },
  {
    num: 3,
    title: "Marketplace Management Toolkit",
    text: "A suite of tools to help firms manage their presence and expert profiles on the Credible Voices Marketplace℠, including analytics dashboards, content quality tracking and team management features.",
  },
  {
    num: 4,
    title: "Strategic Planning Toolkit",
    text: "A comprehensive planning toolkit designed for professional services leaders, providing frameworks, benchmarking data and scenario modelling to support strategic decision-making.",
  },
  {
    num: 5,
    title: "Upgrade own website search",
    text: "An enhanced search capability for your firm's website, powered by quality-scored content indexing. Delivers more relevant results for visitors by prioritising high-quality, authoritative content.",
  },
];

const PersonalAccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation
        onShowHome={() => navigate("/")}
        onShowContribute={() => navigate("/")}
        onShowContact={() => navigate("/")}
        onNavigateToSection={() => {}}
        isLoggedIn={true}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand-red transition-colors mb-8"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          Back
        </button>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 sm:px-8 py-6 border-b border-slate-100">
            <h1 className="text-2xl font-serif font-semibold text-slate-900">Personal access</h1>
            <p className="text-sm text-slate-500 mt-1">
              Summary of your access to commercial services provided by the Centre for Professional Services Research.
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-6 sm:px-8 py-3 font-semibold text-slate-700">Commercial service</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-700 w-16">Note</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-700 w-24">Access</th>
                  <th className="text-left px-4 sm:px-6 py-3 font-semibold text-slate-700">Renews start of</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {commercialServices.map((item) => (
                  <tr key={item.service} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 sm:px-8 py-4 font-medium text-slate-800">{item.service}</td>
                    <td className="px-4 py-4 text-center text-slate-500">{item.noteNum}</td>
                    <td className="px-4 py-4 text-center">
                      {item.hasAccess ? (
                        <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 text-base" />
                      ) : (
                        <FontAwesomeIcon icon={faTimesCircle} className="text-slate-300 text-base" />
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-slate-600">
                      {item.hasAccess ? item.renewsStart : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CTA */}
          <div className="px-6 sm:px-8 py-5 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={() => window.open("mailto:info@cpsresearch.org?subject=Demo%20or%20subscription%20enquiry", "_blank")}
              className="text-sm font-medium text-brand-red hover:text-red-800 hover:underline transition-colors cursor-pointer"
            >
              Click here to book a demo or subscribe to any of these services →
            </button>
          </div>

          {/* Notes */}
          <div className="px-6 sm:px-8 py-6 border-t border-slate-200 space-y-5">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Notes</h2>
            {notes.map((note) => (
              <div key={note.num} className="text-sm">
                <p className="text-slate-800">
                  <span className="font-semibold">Note {note.num} — {note.title}:</span>{" "}
                  <span className="text-slate-600 leading-relaxed">{note.text}</span>
                </p>
              </div>
            ))}
          </div>
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

export default PersonalAccess;
