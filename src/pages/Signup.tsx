import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faEye, faEyeSlash, faUser, faBuilding, faBriefcase, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import cpsrLogo from "@/assets/cpsr-logo.jpg";

const expertiseOptions = [
  "Strategy", "Leadership", "Innovation", "Tax", "Advisory", "Audit",
  "Consulting", "Legal", "Technology", "ESG", "People & Culture", "Finance",
];

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 — Profile
  const [fullName, setFullName] = useState("");
  const [firm, setFirm] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);

  const toggleExpertise = (e: string) => {
    setSelectedExpertise(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  const handleGoogleSignup = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-[hsl(var(--hero-bg))] relative overflow-hidden flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <img src={cpsrLogo} alt="CPSR" className="h-10 w-auto brightness-200" />
            <div className="h-8 w-px bg-white/20" />
            <div className="leading-tight">
              <span className="font-serif text-white/90 text-sm block">Centre for</span>
              <span className="font-serif text-white/90 text-sm block">Professional Services Research</span>
            </div>
          </div>
          <h1 className="font-serif text-white text-4xl leading-tight mb-6">
            Join a community<br />of experts.
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-md">
            Create your profile and connect with researchers, practitioners, and thought leaders across professional services.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-white/10 text-white/40"}`}>1</div>
            <span className={`text-sm ${step >= 1 ? "text-white/90" : "text-white/40"}`}>Create account</span>
          </div>
          <div className="ml-4 w-px h-4 bg-white/20" />
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-white/10 text-white/40"}`}>2</div>
            <span className={`text-sm ${step >= 2 ? "text-white/90" : "text-white/40"}`}>Build your profile</span>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-4">
            <img src={cpsrLogo} alt="CPSR" className="h-9 w-auto" />
            <div className="h-7 w-px bg-border" />
            <div className="leading-tight">
              <span className="font-serif text-foreground text-xs block">Centre for</span>
              <span className="font-serif text-foreground text-xs block">Professional Services Research</span>
            </div>
          </div>

          {step === 1 ? (
            <>
              <div className="text-center lg:text-left">
                <h2 className="font-serif text-2xl font-semibold text-card-foreground">Create your account</h2>
                <p className="text-sm text-muted-foreground mt-1">Get started with CPSR communities</p>
              </div>

              <button
                onClick={handleGoogleSignup}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-card-foreground bg-background hover:bg-muted transition-colors disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faGoogle} className="text-base" />
                Sign up with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or use email</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-card-foreground">Email</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com" required
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-card-foreground">Password</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                    <input
                      type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 characters" required minLength={8}
                      className="w-full pl-9 pr-10 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-muted-foreground/60"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-xs" />
                    </button>
                  </div>
                </div>

                <button
                  type="submit" disabled={isLoading || !email || !password}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Continue
                </button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
              </p>
            </>
          ) : (
            <>
              <div className="text-center lg:text-left">
                <h2 className="font-serif text-2xl font-semibold text-card-foreground">Build your profile</h2>
                <p className="text-sm text-muted-foreground mt-1">Help others in the community get to know you</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-card-foreground">Full name *</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                    <input
                      type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                      placeholder="Dr. Jane Smith" required
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-card-foreground">Firm / Organisation</label>
                    <div className="relative">
                      <FontAwesomeIcon icon={faBuilding} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                      <input
                        type="text" value={firm} onChange={e => setFirm(e.target.value)}
                        placeholder="Deloitte"
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-muted-foreground/60"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-card-foreground">Role / Title</label>
                    <div className="relative">
                      <FontAwesomeIcon icon={faBriefcase} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                      <input
                        type="text" value={role} onChange={e => setRole(e.target.value)}
                        placeholder="Senior Researcher"
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-muted-foreground/60"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-card-foreground">Short bio</label>
                  <textarea
                    value={bio} onChange={e => setBio(e.target.value)}
                    placeholder="A few words about your research interests…"
                    rows={2}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-muted-foreground/60 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-card-foreground">Areas of expertise</label>
                  <div className="flex flex-wrap gap-1.5">
                    {expertiseOptions.map(e => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => toggleExpertise(e)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border ${
                          selectedExpertise.includes(e)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-border hover:border-primary/30"
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !fullName}
                    className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Creating account…" : "Complete signup"}
                  </button>
                </div>
              </form>

              <button
                onClick={() => { navigate("/"); }}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip for now — I'll complete my profile later
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
