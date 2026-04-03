import { Link } from "react-router-dom";
import { Search, Globe, Brain, Zap, BookOpen, Users, Lock, ArrowRight } from "lucide-react";

const features = [
  { icon: Globe, title: "Real-Time Retrieval", description: "Fetches live data from UGC, AICTE, and Ministry of Education on every query." },
  { icon: Brain, title: "RAG-Powered Analysis", description: "Retrieval-Augmented Generation grounds every answer in actual policy text." },
  { icon: Zap, title: "Always Current", description: "No stale cached documents. Policies are scraped fresh at query time." },
  { icon: BookOpen, title: "Source Citations", description: "Every response links to the original government PDF or circular." },
  { icon: Users, title: "Plain Language", description: "Ask in everyday English — no need for circular numbers or legal jargon." },
  { icon: Lock, title: "Private & Secure", description: "Your queries are never shared or stored without your explicit consent." },
];

const steps = [
  { num: "01", title: "Ask your question", desc: "Type any education policy question in plain English." },
  { num: "02", title: "AI searches live sources", desc: "We crawl UGC, AICTE, and MoE in real-time to find relevant clauses." },
  { num: "03", title: "Receive a sourced answer", desc: "Get a clear summary with direct links to official government documents." },
];

const Landing = () => (
  <div className="flex flex-col">

    {/* ── HERO ── */}
    <section className="border-b border-border">
      <div className="container py-28 md:py-40 max-w-5xl">
        <p className="kicker-text mb-6">India · Education · Policy Intelligence</p>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-[1.1] max-w-3xl mb-8">
          Understand any
          <br />
          education policy
          <br />
          <span className="accent-italic">in seconds.</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-xl font-sans leading-relaxed mb-12">
          DocIntel reads UGC circulars, AICTE guidelines, and Ministry of Education documents so you don't have to.
          Ask a question. Get a direct, sourced answer.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-sans font-semibold text-sm rounded-md hover:bg-primary/90 transition-colors"
          >
            <Search className="h-4 w-4" />
            Start Searching
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-foreground font-sans font-semibold text-sm rounded-md hover:bg-secondary/60 transition-colors"
          >
            Sign in for full access
          </Link>
        </div>
      </div>
    </section>

    {/* ── FEATURES ── */}
    <section className="py-24 md:py-32 border-b border-border">
      <div className="container max-w-5xl">
        <div className="mb-16">
          <p className="kicker-text mb-3">Capabilities</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground max-w-lg">
            Built for serious policy research
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {features.map((f) => (
            <div key={f.title} className="bg-background p-8 hover:bg-secondary/30 transition-colors">
              <f.icon className="h-5 w-5 text-muted-foreground mb-5" />
              <h3 className="font-sans font-semibold text-foreground text-base mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── HOW IT WORKS ── */}
    <section className="py-24 md:py-32 bg-secondary/20 border-b border-border">
      <div className="container max-w-5xl">
        <div className="mb-16">
          <p className="kicker-text mb-3">Process</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Three steps to clarity
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-4 left-full w-full h-px bg-border -translate-x-8" />
              )}
              <p className="font-sans text-4xl font-bold text-border mb-6">{s.num}</p>
              <h3 className="font-sans font-semibold text-foreground text-base mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── SOURCES STRIP ── */}
    <section className="py-16 border-b border-border">
      <div className="container max-w-5xl">
        <p className="kicker-text mb-8 text-center">Trusted Government Sources</p>
        <div className="flex flex-wrap items-center justify-center gap-12">
          {[
            { abbr: "UGC", full: "University Grants Commission" },
            { abbr: "AICTE", full: "All India Council for Technical Education" },
            { abbr: "MoE", full: "Ministry of Education" },
          ].map((src) => (
            <div key={src.abbr} className="text-center">
              <p className="font-display text-2xl font-bold text-primary mb-1">{src.abbr}</p>
              <p className="text-xs text-muted-foreground font-sans">{src.full}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA ── */}
    <section className="py-24 md:py-32">
      <div className="container max-w-5xl">
        <div className="max-w-2xl">
          <p className="kicker-text mb-4">Get started today</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Policy clarity,
            <br />
            <span className="accent-italic">on demand.</span>
          </h2>
          <p className="text-muted-foreground text-lg font-sans leading-relaxed mb-10 max-w-lg">
            Three free queries as a guest. Create an account to unlock full search history and unlimited access.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-sans font-semibold text-sm rounded-md hover:bg-primary/90 transition-colors"
          >
            <Search className="h-4 w-4" />
            Start Your First Search
          </Link>
        </div>
      </div>
    </section>

  </div>
);

export default Landing;
