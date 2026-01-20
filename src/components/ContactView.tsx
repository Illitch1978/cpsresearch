import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const ContactView = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you. Your message has been sent.");
    setFormSubmitted(true);
  };

  return (
    <div className="fade-in">
      {/* Contact Header */}
      <header className="bg-[#1a202c] py-24 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 font-serif">
            Contact us
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            We welcome inquiries from researchers, practitioners, and policymakers.
          </p>
        </div>
      </header>

      {/* Contact Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Info */}
            <div>
              <h2 className="text-4xl font-serif font-medium text-slate-900 mb-6">To learn more</h2>
              <p className="text-lg text-slate-600 font-light mb-8 leading-relaxed">
                Please contact us directly or use the form to get in touch. We are always interested in
                hearing from those who share our commitment to high-quality professional services research.
              </p>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-700">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wider font-medium">Contact us at</p>
                  <a
                    href="mailto:richard.chaplin@pmint.co.uk"
                    className="text-lg text-brand-red hover:text-slate-900 transition font-medium"
                  >
                    richard.chaplin@pmint.co.uk
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Clean Form */}
            <div className="bg-white p-8 md:p-10 shadow-lg border-t-4 border-brand-red rounded-sm">
              <h3 className="text-xl font-serif font-medium text-slate-900 mb-6">Send us a message</h3>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                      First Name
                    </label>
                    <input type="text" className="form-input" placeholder="Jane" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                      Last Name
                    </label>
                    <input type="text" className="form-input" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                    Email Address
                  </label>
                  <input type="email" className="form-input" placeholder="jane@company.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                    Organization
                  </label>
                  <input type="text" className="form-input" placeholder="Your Company or Institution" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                    Message
                  </label>
                  <textarea
                    className="form-input h-32 resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white font-medium py-3 hover:bg-brand-red transition-colors duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactView;
