import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Globe, Brain, Zap, Users, Lock, ArrowRight, ChevronDown, CheckCircle, Sparkles, FileText, GraduationCap, Award } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useEffect, useRef, useState, useCallback } from "react";

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
  { value: "3+",       label: "Live Gov. Sources",  end: 3 },
  { value: "Real‑time", label: "Policy Scraping",   end: null },
  { value: "Gemini AI", label: "Powered Engine",    end: null },
  { value: "Free",      label: "to Try",            end: null },
];

const sources = [
  { abbr: "UGC",   name: "University Grants Commission",         url: "https://www.ugc.gov.in" },
  { abbr: "AICTE", name: "All India Council for Technical Education", url: "https://www.aicte-india.org" },
  { abbr: "MoE",   name: "Ministry of Education",                url: "https://www.education.gov.in" },
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
  { q: "Where does DocIntel get its information?", a: "DocIntel fetches live data directly from official government websites — UGC (ugc.gov.in), AICTE (aicte-india.org), and the Ministry of Education (education.gov.in) — every time you submit a query. No pre-cached PDFs or stale documents are used." },
  { q: "How accurate are the answers?", a: "Answers are generated using Retrieval-Augmented Generation (RAG), which means the AI reads actual policy text sourced from government pages before composing a response. Every answer includes a direct source URL so you can independently verify the information." },
  { q: "Is my data private?", a: "Yes. Guest queries are not stored on our servers at all. For logged-in users, your query history is saved to your account only, and is never shared with third parties or used to train AI models." },
  { q: "How long does a query take?", a: "Typically 30–90 seconds per query. This is because DocIntel fetches live data from government websites in real time on every request — rather than serving cached results — which ensures freshness but takes slightly longer than a standard search engine." },
  { q: "Can I use this without an account?", a: "Yes — guests receive 3 free queries with no sign-up required. Create a free account for unlimited searches, saved query history, and a personalised experience." },
  { q: "What types of questions can I ask?", a: "You can ask about any policy, regulation, circular, or guideline governed by UGC, AICTE, or the Ministry of Education. Examples include: eligibility criteria for UGC NET, AICTE approval norms for colleges, NEP 2020 provisions, scholarship guidelines, affiliation rules, and more." },
  { q: "Does DocIntel cover state-level education policies?", a: "Currently, DocIntel focuses on central government education bodies — UGC, AICTE, and the Ministry of Education. State-level policies (e.g., Maharashtra's higher education department) are not yet covered but are on our roadmap." },
  { q: "How often is the document database updated?", a: "There is no static database — DocIntel scrapes the source websites live on every query. This means you always get the most current information available on the official government portal at the time of your search." },
  { q: "Can I download or share answers?", a: "You can copy any answer text directly from the screen. A one-click copy and PDF export feature is planned for a future update. Logged-in users can also revisit past answers from their History page." },
  { q: "What if the answer seems incorrect or outdated?", a: "Each answer includes a source link to the original government page. We recommend cross-checking the source directly. If you believe there is an error in how DocIntel is retrieving or interpreting the data, please use the feedback option so we can investigate and fix it." },
];

/* ─── Hooks ─── */

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const pct = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setProgress(Math.min(100, pct));
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return progress;
}

function useTypingEffect(text: string, speed = 50, startDelay = 800) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          setDone(true);
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timer);
  }, [text, speed, startDelay]);
  return { displayed, done };
}

function useParallax() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * 0.3);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return offset;
}

function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return pos;
}

const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(27, 64%, 46%, ${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} id="particles-canvas" className="hidden md:block" />;
};

const FloatingIcons = () => (
  <>
    <div className="floating-icon floating-icon-1 hidden lg:block" style={{ top: "15%", right: "10%" }}>
      <FileText className="h-16 w-16 text-accent" />
    </div>
    <div className="floating-icon floating-icon-2 hidden lg:block" style={{ top: "60%", right: "5%" }}>
      <GraduationCap className="h-12 w-12 text-primary" />
    </div>
    <div className="floating-icon floating-icon-3 hidden lg:block" style={{ top: "30%", left: "5%" }}>
      <Award className="h-14 w-14 text-gold" />
    </div>
    <div className="floating-icon floating-icon-4 hidden lg:block" style={{ bottom: "20%", left: "12%" }}>
      <BookOpen className="h-10 w-10 text-accent" />
    </div>
  </>
);

const SparkleEffect = ({ style }: { style: React.CSSProperties }) => (
  <div className="sparkle sparkle-anim" style={{ ...style, width: 12, height: 12 }}>
    <div className="sparkle" style={{ width: 12, height: 12 }} />
  </div>
);

/* ─── FAQ Item ─── */
const FAQItem = ({ q, a, idx }: { q: string; a: string; idx: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b border-border last:border-0"
      style={{ animationDelay: `${idx * 0.05}s` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="font-display font-semibold text-foreground text-base md:text-lg group-hover:text-primary transition-colors duration-200">
          {q}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-400 ${
            open ? "rotate-180 text-accent" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-[420ms] cubic-bezier(0.22,1,0.36,1) ${
          open ? "max-h-56 pb-5 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-muted-foreground font-sans text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
};

/* ─── Animated Number ─── */
const AnimatedNumber = ({ target, label }: { target: number | null; label: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    if (target === null) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = () => {
          start += 1;
          setCount(start);
          if (start < target) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <div ref={ref}>{target !== null ? count : null}</div>;
};

/* ─── Main Component ─── */
const Landing = () => {
  const featuresRef  = useScrollReveal();
  const stepsRef     = useScrollReveal();
  const statsRef     = useScrollReveal();
  const sourcesRef   = useScrollReveal();
  const testimonialsRef = useScrollReveal();
  const faqRef       = useScrollReveal();
  const ctaRef       = useScrollReveal();
  const scrollPct    = useScrollProgress();
  const parallaxOffset = useParallax();
  const mousePos = useMousePosition();
  const heroText = "Instant Answers from India's Education Policies";
  const { displayed: typedText, done: typingDone } = useTypingEffect(heroText, 45, 600);

  return (
    <div className="flex flex-col">

      {/* ── SCROLL PROGRESS BAR ── */}
      <div id="scroll-progress" style={{ width: `${scrollPct}%` }} />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb orb-1 parallax-bg" style={{ transform: `translateY(${parallaxOffset * 0.5}px)` }} />
          <div className="orb orb-2 parallax-bg" style={{ transform: `translateY(${parallaxOffset * 0.3}px)` }} />
          <div className="orb orb-3 parallax-bg" style={{ transform: `translateY(${parallaxOffset * 0.4}px)` }} />
          <div className="orb orb-4 parallax-bg" style={{ transform: `translateY(${parallaxOffset * 0.6}px)` }} />
          <Particles />
          <FloatingIcons />
        </div>
        <div className="absolute inset-0 bg-cover bg-center opacity-10 parallax-bg" style={{ backgroundImage: `url(${heroBg})`, transform: `translateY(${parallaxOffset * 0.2}px)` }} />

        {/* Sparkles */}
        <SparkleEffect style={{ top: "20%", left: "15%" }} />
        <SparkleEffect style={{ top: "35%", right: "20%" }} />
        <SparkleEffect style={{ bottom: "30%", left: "25%" }} />

        <div className="relative container py-28 md:py-48 flex flex-col items-center text-center z-10">
          {/* Glowing badge */}
          <div className="glow-badge mb-6 hero-kicker glow-pulse">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
            </span>
            Policy Intelligence System
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary leading-tight max-w-4xl hero-heading">
            {!typingDone ? (
              <>
                <span>Instant Answers from India&apos;s</span>
                <span> </span>
                <span className="accent-italic animated-underline">Education Policies</span>
                <span className="typing-caret" />
              </>
            ) : (
              <span className="word-reveal">
                Instant Answers from India&apos;s Education Policies
              </span>
            )}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl font-body hero-subtitle">
            Every policy that shapes your academic life lives inside documents most people never finish reading.
            DocIntel reads them all — and answers your question in seconds.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center hero-cta">
            <Button asChild size="lg" className="bg-sienna hover:bg-sienna/90 text-sienna-foreground font-sans font-semibold px-8 gap-2 btn-lift magnetic-btn glow-pulse">
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

          <p className="mt-6 text-xs text-muted-foreground font-sans hero-cta flex items-center gap-4 flex-wrap justify-center" style={{ animationDelay: "0.85s" }}>
            {["No credit card needed", "3 free guest queries", "Instant sourced answers"].map((t, i) => (
              <span key={t} className="flex items-center gap-1.5" style={{ animationDelay: `${0.9 + i * 0.1}s` }}>
                <CheckCircle className="h-3.5 w-3.5 text-primary" />{t}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-y border-border bg-secondary/40 py-12">
        <div className="container reveal-section" ref={statsRef}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <div key={s.label} style={{ animationDelay: `${i * 0.1}s` }}>
                <p className="font-display text-2xl md:text-3xl font-bold text-primary mb-1 stat-value">
                  {s.end !== null ? (
                    <span className="tabular-nums">{s.value}</span>
                  ) : (
                    s.value
                  )}
                </p>
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
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20">
            {sources.map((src, i) => (
              <a
                key={src.abbr}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 source-logo"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center border border-border group-hover:border-accent/50 group-hover:bg-accent/5 transition-all duration-300">
                  <span className="font-display text-lg font-bold text-primary group-hover:text-accent transition-colors">{src.abbr}</span>
                </div>
                <span className="text-xs text-muted-foreground font-sans text-center max-w-[160px] leading-tight">{src.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="text-center mb-16 reveal-section" ref={featuresRef}>
            <p className="kicker-text mb-3">Capabilities</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary">
              What Makes DocIntel{" "}
              <span className="accent-italic animated-underline">Different</span>
            </h2>
            <p className="mt-4 text-muted-foreground font-sans max-w-xl mx-auto text-sm">
              Built from the ground up for India's higher education ecosystem.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="feature-card bg-card border rounded-xl p-8"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="icon-bounce icon-glow-wrap mb-5 inline-block">
                  <f.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold text-primary mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm font-sans leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-secondary/40 py-20 md:py-32">
        <div className="container">
          <div className="text-center mb-16 reveal-section" ref={stepsRef}>
            <p className="kicker-text mb-3">Process</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary italic">
              The Research <span className="accent-italic">Journey</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector lines (desktop) */}
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-border via-accent/40 to-border" aria-hidden />
            {steps.map((s, i) => (
              <div
                key={s.num}
                className="step-card text-center flex flex-col items-center"
                style={{ animationDelay: `${i * 0.18}s` }}
              >
                <div className="step-circle h-16 w-16 rounded-full bg-background border-2 border-border shadow-md flex items-center justify-center mb-6">
                  <span className="step-number font-display text-xl font-bold text-foreground">{s.num}</span>
                </div>
                <h3 className="font-display text-lg md:text-xl font-bold text-foreground mb-3">{s.title}</h3>
                <p className="text-muted-foreground font-sans text-sm max-w-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-14 reveal-section" ref={testimonialsRef}>
            <p className="kicker-text mb-3">Used by Educators</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
              What People Are <span className="accent-italic">Saying</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-7">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="testimonial-card bg-card border rounded-xl p-7 flex flex-col gap-4"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <Sparkles className="h-5 w-5 text-gold" />
                <p className="font-body text-sm text-foreground leading-relaxed flex-1">"{t.quote}"</p>
                <div className="border-t pt-4 mt-auto">
                  <p className="font-display font-semibold text-primary text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground font-sans mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── CTA ── */}
      <section className="py-20 md:py-32 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-1" style={{ opacity: 0.5 }} />
          <div className="orb orb-2" style={{ opacity: 0.4 }} />
        </div>
        <div className="container text-center reveal-section relative" ref={ctaRef}>
          <p className="kicker-text mb-5">Get started today</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-4">
            Ready to simplify your policy research?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-10 font-sans">
            Start asking questions and let DocIntel AI illuminate the answers hidden in government documents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-sienna hover:bg-sienna/90 text-sienna-foreground font-sans font-semibold px-10 btn-lift gap-2">
              <Link to="/search">
                <Search className="h-4 w-4" />
                Start Your First Search
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-sans font-medium px-8">
              <Link to="/signup">Create Free Account →</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
