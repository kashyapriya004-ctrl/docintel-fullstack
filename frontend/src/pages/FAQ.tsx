import { useState } from "react";
import { ChevronDown, Search, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

type FAQItem = { q: string; a: string };

const faqs: FAQItem[] = [
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

const AccordionItem = ({ q, a }: FAQItem) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="font-sans font-medium text-foreground text-sm md:text-base group-hover:text-primary transition-colors">
          {q}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180 text-accent" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-64 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-muted-foreground font-sans text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
};

const FAQPage = () => {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? faqs.filter(
        (f) =>
          f.q.toLowerCase().includes(search.toLowerCase()) ||
          f.a.toLowerCase().includes(search.toLowerCase())
      )
    : faqs;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero header ── */}
      <div className="border-b border-border bg-secondary/20 py-14 md:py-20">
        <div className="container max-w-3xl text-center">
          <p className="kicker-text mb-3">Help Centre</p>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary mb-4">
            Frequently Asked <span className="accent-italic">Questions</span>
          </h1>
          <p className="text-muted-foreground font-sans text-sm md:text-base max-w-xl mx-auto mb-8">
            Everything you need to know about DocIntel, government policy data, and how our AI works.
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg font-sans text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── FAQ list ── */}
      <div className="container py-12 md:py-16 max-w-2xl">
        {search.trim() && (
          <p className="text-sm text-muted-foreground font-sans mb-6">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "
            <span className="text-foreground font-medium">{search}</span>"
          </p>
        )}

        {filtered.length > 0 ? (
          <div className="bg-card border border-border rounded-lg px-6">
            {filtered.map((f) => (
              <AccordionItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-display text-lg text-foreground mb-2">No results found</p>
            <p className="text-muted-foreground font-sans text-sm mb-6">
              Try a different term, or ask DocIntel directly.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 text-sm font-sans text-accent hover:underline"
            >
              <MessageCircle className="h-4 w-4" />
              Ask DocIntel
            </Link>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-10 flex items-center gap-3 p-5 border border-border rounded-lg bg-secondary/20">
          <MessageCircle className="h-5 w-5 text-accent flex-shrink-0" />
          <div>
            <p className="font-sans text-sm text-foreground font-medium">Still have a question?</p>
            <p className="text-xs text-muted-foreground font-sans mt-0.5">
              Ask DocIntel directly and get a sourced answer in seconds.{" "}
              <Link to="/search" className="text-accent hover:underline">
                Try it →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
