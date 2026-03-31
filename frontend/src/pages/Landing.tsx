import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Globe, Brain, Shield, Zap, Users, Lock } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

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

const Landing = () => (
  <div className="flex flex-col">
    {/* Hero */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url(${heroBg})` }} />
      <div className="relative container py-24 md:py-40 flex flex-col items-center text-center">
        <p className="kicker-text mb-4 animate-fade-in-up">Policy Intelligence System</p>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary leading-tight max-w-4xl animate-fade-in-up">
          Instant Answers from India's{" "}
          <span className="text-primary">Education Policies</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl font-body animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          Every policy that shapes your academic life lives inside documents most people never finish reading. DocIntel reads them all — and answers your question in seconds.
        </p>
        <div className="mt-10 flex gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <Button asChild size="lg" className="bg-sienna hover:bg-sienna/90 text-sienna-foreground font-sans font-semibold px-8 gap-2">
            <Link to="/search">
              <Search className="h-4 w-4" />
              Start Searching
            </Link>
          </Button>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="text-center mb-16">
          <p className="kicker-text mb-3">Capabilities</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary">
            What Makes DocIntel <span className="accent-italic">Different</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={f.title} className="bg-card border rounded-lg p-8 hover:shadow-lg transition-shadow animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <f.icon className="h-8 w-8 text-accent mb-4" />
              <h3 className="font-display text-xl font-semibold text-primary mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm font-sans">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary italic">
            The Research <span className="accent-italic">Journey</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((s) => (
            <div key={s.num} className="text-center flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-background border shadow-md flex items-center justify-center mb-6">
                <span className="font-display text-xl font-bold text-foreground">{s.num}</span>
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold text-foreground mb-3">{s.title}</h3>
              <p className="text-muted-foreground font-sans text-sm max-w-xs">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 md:py-28">
      <div className="container text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-4">
          Ready to simplify your policy research?
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto mb-8 font-sans">
          Start asking questions and let DocIntel AI illuminate the answers hidden in government documents.
        </p>
        <Button asChild size="lg" className="bg-sienna hover:bg-sienna/90 text-sienna-foreground font-sans font-semibold px-10">
          <Link to="/search">Start Your First Search</Link>
        </Button>
      </div>
    </section>
  </div>
);

export default Landing;
