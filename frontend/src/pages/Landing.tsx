import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Globe, Brain, Shield, Zap, Users, Lock, ArrowRight, CheckCircle, Star } from "lucide-react";

const features = [
  { icon: Globe, title: "Real-Time Retrieval", description: "Live data fetched from UGC, AICTE, and Ministry of Education websites every time you ask.", color: "from-emerald-500 to-teal-600" },
  { icon: Brain, title: "RAG-Powered Analysis", description: "Retrieval-Augmented Generation ensures accurate, source-grounded responses from real policy text.", color: "from-violet-500 to-purple-600" },
  { icon: Zap, title: "Always Up-to-Date", description: "Policies are scraped in real-time so you never work with outdated or stale information.", color: "from-amber-500 to-orange-600" },
  { icon: BookOpen, title: "Source Citations", description: "Every answer links directly to the original policy document or official PDF source.", color: "from-rose-500 to-pink-600" },
  { icon: Users, title: "Built for Everyone", description: "Students, faculty, researchers, and administrators can query in plain, everyday English.", color: "from-sky-500 to-blue-600" },
  { icon: Lock, title: "Trustworthy & Secure", description: "Your queries are private. We never share your data with third parties.", color: "from-green-500 to-emerald-600" },
];

const steps = [
  { num: "01", title: "Ask in plain English", desc: "No circular IDs or legal jargon needed. Just type what you want to know.", icon: "💬" },
  { num: "02", title: "AI searches live policies", desc: "Our engine crawls verified government repositories to find the exact clause in real-time.", icon: "🔍" },
  { num: "03", title: "Get clear, sourced answers", desc: "Receive a plain-language summary with direct links to the official PDF sources.", icon: "✅" },
];

const stats = [
  { value: "3+", label: "Gov. Sources" },
  { value: "Real-time", label: "Data Fetch" },
  { value: "AI-Powered", label: "RAG Engine" },
  { value: "Free", label: "to Try" },
];

const testimonials = [
  { quote: "Finally I can understand NEP 2020 without reading 66 pages!", name: "Priya S.", role: "PhD Scholar, Delhi University" },
  { quote: "Searches AICTE approval rules in seconds. Game changer for our college.", name: "Prof. Mehta", role: "Principal, Engineering College" },
  { quote: "Used it to check UGC PhD regulations. Incredibly accurate.", name: "Rahul K.", role: "Research Fellow" },
];

const Landing = () => (
  <div className="flex flex-col overflow-hidden">

    {/* ────────── HERO ────────── */}
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Dark neutral background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f1117] via-[#14181f] to-[#0c0f14]" />
      {/* Subtle orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/8 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-slate-400/5 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-blue-500/5 blur-[80px]" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: "60px 60px"
      }} />

      <div className="relative z-10 container text-center px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-300 text-xs font-semibold uppercase tracking-widest mb-8 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-ping" />
          Live Policy Intelligence
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-white mb-6 tracking-tight">
          India's Education
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Policy, Decoded
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Instant AI-powered answers from UGC, AICTE & Ministry of Education.
          No more reading 60-page policy PDFs — just ask in plain English.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/search">
            <button className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-base hover:from-emerald-400 hover:to-teal-400 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02]">
              <Search className="h-5 w-5" />
              Start Searching Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link to="/login">
            <button className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-semibold text-base hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
              Login / Sign Up
            </button>
          </Link>
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F2EBE0] to-transparent" />
    </section>

    {/* ────────── FEATURES ────────── */}
    <section className="py-24 md:py-32 bg-[#F2EBE0]">
      <div className="container px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700 mb-3">Why DocIntel</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Everything you need to understand
            <br />
            <span className="text-emerald-700">India's education policies</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity blur-2xl" />
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${f.color} mb-5 shadow-lg`}>
                <f.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ────────── HOW IT WORKS ────────── */}
    <section className="py-24 md:py-32 bg-gradient-to-br from-gray-900 to-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: "40px 40px"
      }} />
      <div className="container px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400 mb-3">Simple Process</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">How it works</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0" />

          {steps.map((s, i) => (
            <div key={s.num} className="flex flex-col items-center text-center relative">
              <div className="relative mb-6">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl backdrop-blur-sm">
                  {s.icon}
                </div>
                <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </div>
              </div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">{s.num}</div>
              <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ────────── TESTIMONIALS ────────── */}
    <section className="py-24 md:py-32 bg-[#F2EBE0]">
      <div className="container px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700 mb-3">Loved By Researchers</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">What users say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">"{t.quote}"</p>
              <div>
                <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                <div className="text-gray-500 text-xs">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ────────── CTA ────────── */}
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f1117] via-[#14181f] to-[#0c0f14]" />
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: "32px 32px"
      }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-indigo-500/5 blur-[100px]" />

      <div className="relative z-10 container px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Stop guessing.
          <br />
          <span className="text-slate-300">Start knowing.</span>
        </h2>
        <p className="text-gray-300 max-w-lg mx-auto mb-10 text-lg">
          Ask any question about India's education policies and get an instant, accurate, sourced answer.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link to="/search">
            <button className="group flex items-center gap-3 px-10 py-4 rounded-xl bg-white text-gray-900 font-bold text-base hover:bg-gray-100 transition-all duration-300 shadow-xl hover:scale-[1.02]">
              <Search className="h-5 w-5" />
              Try for Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm text-gray-400 flex-wrap">
          {["No credit card needed", "3 free queries as guest", "Instant results"].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Landing;
