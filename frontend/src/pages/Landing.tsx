import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Globe, Brain, Zap, Users, Lock, ArrowRight, Quote, ChevronDown, CheckCircle } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useEffect, useRef, useState } from "react";

const features = [
  { icon: Globe, title: "Real-Time Retrieval", description: "Live data fetched from UGC, AICTE, and Ministry of Education websites." },
  { icon: Brain, title: "RAG-Powered Analysis", description: "Retrieval-Augmented Generation ensures accurate, source-grounded responses." },
  { icon: Zap, title: "Always Up-to-Date", description: "Policies are scraped in real-time so you never work with outdated info." },
  { icon: BookOpen, title: "Source Citations", description: "Every answer links directly to the original policy document or PDF." },
  { icon: Users, title: "Built for Everyone", description: "Students, faculty, and researchers can query in plain English." },
  { icon: Lock, title: "Trustworthy & Secure", description: "Your data is private. No queries are stored without your consent." },
];

const steps = [
  { num: "01", title: "Ask in plain English", desc: "No need for specific circular IDs or legal terms. Just type your query naturally." },
  { num: "02", title: "AI searches policies", desc: "Our engine crawls verified government repositories to find the exact clause." },
  { num: "03", title: "Get clear, sourced answer", desc: "Receive a simplified summary with direct links to the official PDF sources." },
];

const stats = [
  { value: "3+", label: "Live Gov. Sources" },
  { value: "Real‑time", label: "Policy Scraping" },
  { value: "Gemini AI", label: "Powered Engine" },
  { value: "Free", label: "to Try" },
];

const sources = [
  { abbr: "UGC", name: "University Grants Commission", url: "https://www.ugc.gov.in" },
  { abbr: "AICTE", name: "All India Council for Technical Education", url: "https://www.aicte-india.org" },
  { abbr: "MoE", name: "Ministry of Education", url: "https://www.education.gov.in" },
];

const sampleQuestions = [
  "What is NEP 2020 and its key reforms?",
  "What are AICTE approval requirements for colleges?",
  "How does UGC regulate deemed universities?",
  "What are UGC NET eligibility criteria?",
  "What is RUSA scheme and who benefits from it?",
];

const testimonials = [
  { quote: "Finally I can understand NEP 2020 without reading 66 pages. This tool is a game changer for faculty.", name: "Prof. A. Mehta", role: "Principal, Engineering College, Pune" },
  { quote: "I used DocIntel to check PhD regulations and affiliation norms. The answers are accurate and sourced.", name: "Dr. R. Krishnan", role: "Research Fellow, IIT Delhi" },
  { quote: "As a student navigating college applications, this helped me understand AICTE rules instantly.", name: "Priya S.", role: "UG Student, Delhi University" },
];

const faqs = [
  {
    q: "Where does DocIntel get its information?",
    a: "DocIntel fetches live data directly from official government websites — UGC (ugc.gov.in), AICTE (aicte-india.org), and the Ministry of Education (education.gov.in) — every time you submit a query. No pre-cached PDFs or stale documents are used.",
  },
  {
    q: "How accurate are the answers?",
    a: "Answers are generated using Retrieval-Augmented Generation (RAG), which means the AI reads actual policy text sourced from government pages before composing a response. Every answer includes a direct source URL so you can independently verify the information.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Guest queries are not stored on our servers at all. For logged-in users, your query history is saved to your account only, and is never shared with third parties or used to train AI models.",
  },
  {
    q: "How long does a query take?",
    a: "Typically 30–90 seconds per query. This is because DocIntel fetches live data from government websites in real time on every request — rather than serving cached results — which ensures freshness but takes slightly longer than a standard search engine.",
  },
  {
    q: "Can I use this without an account?",
    a: "Yes — guests receive 3 free queries with no sign-up required. Create a free account for unlimited searches, saved query history, and a personalised experience.",
  },
  {
    q: "What types of questions can I ask?",
    a: "You can ask about any policy, regulation, circular, or guideline governed by UGC, AICTE, or the Ministry of Education. Examples include: eligibility criteria for UGC NET, AICTE approval norms for colleges, NEP 2020 provisions, scholarship guidelines, affiliation rules, and more.",
  },
  {
    q: "Does DocIntel cover state-level education policies?",
    a: "Currently, DocIntel focuses on central government education bodies — UGC, AICTE, and the Ministry of Education. State-level policies (e.g., Maharashtra's higher education department) are not yet covered but are on our roadmap.",
  },
  {
    q: "How often is the document database updated?",
    a: "There is no static database — DocIntel scrapes the source websites live on every query. This means you always get the most current information available on the official government portal at the time of your search.",
  },
  {
    q: "Can I download or share answers?",
    a: "You can copy any answer text directly from the screen. A one-click copy and PDF export feature is planned for a future update. Logged-in users can also revisit past answers from their History page.",
  },
  {
    q: "What if the answer seems incorrect or outdated?",
    a: "Each answer includes a source link to the original government page. We recommend cross-checking the source directly. If you believe there is an error in how DocIntel is retrieving or interpreting the data, please use the feedback option so we can investigate and fix it.",
  },
];


function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="font-display font-semibold text-foreground text-base md:text-lg group-hover:text-primary transition-colors">{q}</span>
        <ChevronDown className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-accent" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-400 ease-in-out ${open ? "max-h-48 pb-5" : "max-h-0"}`}>
        <p className="text-muted-foreground font-sans text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
};

const Landing = () => {
  const featuresRef = useScrollReveal();
  const stepsRef = useScrollReveal();
  const statsRef = useScrollReveal();
  const sourcesRef = useScrollReveal();
  const testimonialsRef = useScrollReveal();
  const faqRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  return (
    <div className="flex flex-col">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url(${heroBg})` }} />

        <div className="relative container py-28 md:py-44 flex flex-col items-center text-center">
          <p className="kicker-text mb-4 hero-kicker">Policy Intelligence System</p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary leading-tight max-w-4xl hero-heading">
            Instant Answers from India's{" "}
            <span className="accent-italic animated-underline">Education Policies</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl font-body hero-subtitle">
            Every policy that shapes your academic life lives inside documents most people never finish reading.
            DocIntel reads them all — and answers your question in seconds.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center hero-cta">
            <Button asChild size="lg" className="bg-sienna hover:bg-sienna/90 text-sienna-foreground font-sans font-semibold px-8 gap-2 btn-lift">
              <Link to="/search">
                <Search className="h-4 w-4" />
                Start Searching Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors font-sans underline-offset-4 hover:underline">
              Sign in for history →
            </Link>
          </div>
          <p className="mt-5 text-xs text-muted-foreground font-sans hero-cta flex items-center gap-4 flex-wrap justify-center" style={{ animationDelay: "0.75s" }}>
            {["No credit card needed", "3 free guest queries", "Instant sourced answers"].map(t => (
              <span key={t} className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-primary" />{t}</span>
            ))}
          </p>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-y border-border bg-secondary/30 py-10">
        <div className="container reveal-section" ref={statsRef}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl md:text-3xl font-bold text-primary mb-1">{s.value}</p>
                <p className="text-xs text-muted-foreground font-sans uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUSTED SOURCES ── */}
      <section className="py-16 border-b border-border">
        <div className="container reveal-section" ref={sourcesRef}>
          <p className="kicker-text text-center mb-10">Data sourced directly from</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            {sources.map((src) => (
              <a
                key={src.abbr}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 hover:opacity-70 transition-opacity"
              >
                <span className="font-display text-3xl font-bold text-primary group-hover:text-accent transition-colors">{src.abbr}</span>
                <span className="text-xs text-muted-foreground font-sans text-center max-w-[180px]">{src.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-16 reveal-section" ref={featuresRef}>
            <p className="kicker-text mb-3">Capabilities</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary">
              What Makes DocIntel <span className="accent-italic">Different</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="feature-card bg-card border rounded-lg p-8"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="icon-bounce mb-4 inline-block">
                  <f.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold text-primary mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm font-sans">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-secondary/40 py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-16 reveal-section" ref={stepsRef}>
            <p className="kicker-text mb-3">Process</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary italic">
              The Research <span className="accent-italic">Journey</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((s, i) => (
              <div
                key={s.num}
                className="step-card text-center flex flex-col items-center"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="step-circle h-16 w-16 rounded-full bg-background border shadow-md flex items-center justify-center mb-6">
                  <span className="font-display text-xl font-bold text-foreground">{s.num}</span>
                </div>
                <h3 className="font-display text-lg md:text-xl font-bold text-foreground mb-3">{s.title}</h3>
                <p className="text-muted-foreground font-sans text-sm max-w-xs">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container text-center reveal-section" ref={ctaRef}>
          <p className="kicker-text mb-4">Get started today</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-4">
            Ready to simplify your policy research?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8 font-sans">
            Start asking questions and let DocIntel AI illuminate the answers hidden in government documents.
          </p>
          <Button asChild size="lg" className="bg-sienna hover:bg-sienna/90 text-sienna-foreground font-sans font-semibold px-10 btn-lift">
            <Link to="/search">Start Your First Search →</Link>
          </Button>
        </div>
      </section>

    </div>
  );
};

export default Landing;
