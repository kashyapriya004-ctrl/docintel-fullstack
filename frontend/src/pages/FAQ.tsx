import { useState } from "react";
import { ChevronDown, Search, HelpCircle, BookOpen, Globe, Lock, Zap, Users, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

type FAQItem = { q: string; a: string };

const faqCategories = [
  {
    id: "general",
    label: "General",
    icon: HelpCircle,
    faqs: [
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
    ],
  },
  {
    id: "account",
    label: "Account & Privacy",
    icon: Lock,
    faqs: [
      { q: "Can I use DocIntel without an account?", a: "Yes — guests get 3 free queries with no sign-up required. Create a free account for unlimited searches, a saved query history, and personalized experience." },
      { q: "Is my data private?", a: "Yes. Guest queries are not stored on our servers. Logged-in users can review their own history, but queries are never shared with third parties or used to train models." },
      { q: "Do you store my queries permanently?", a: "For logged-in users, the last 50 queries are saved to your account so you can revisit past answers. You can delete your history at any time from the Account page." },
      { q: "How do I delete my account?", a: "Visit your Account page and use the 'Delete Account' option. All your data — including query history — is permanently removed within 24 hours." },
      { q: "Is the platform free to use?", a: "Yes, DocIntel is free for all users. Guests get 3 queries; registered accounts get unlimited access. We may introduce a Pro plan for team features in the future." },
    ],
  },
  {
    id: "ugc",
    label: "UGC",
    icon: BookOpen,
    faqs: [
      { q: "What is UGC and what does it regulate?", a: "The University Grants Commission (UGC) is a statutory body under the Ministry of Education that coordinates and maintains the standards of university education in India. It grants recognition to universities, disburses scholarships, frames academic regulations, and approves course curricula." },
      { q: "What is UGC NET and who should take it?", a: "UGC NET (National Eligibility Test) is a national exam for determining eligibility for the post of Assistant Professor and/or Junior Research Fellowship (JRF) in Indian universities and colleges. It is mandatory for faculty positions in most central and state universities." },
      { q: "How does UGC regulate deemed universities?", a: "Deemed universities are granted this status under Section 3 of the UGC Act, 1956. They must meet specific criteria for research output, infrastructure, and faculty quality. UGC conducts periodic reviews and can de-notify institutions that fail to maintain standards." },
      { q: "What is the UGC Choice Based Credit System (CBCS)?", a: "CBCS is a flexible course structure where students choose their subjects across Core, Elective, and Ability Enhancement categories. Grades are awarded on a 10-point scale. CBCS aligns Indian higher education with international standards and promotes student mobility." },
      { q: "What is UGC's SWAYAM policy?", a: "UGC mandates that universities allow students to earn a certain percentage of their credits through SWAYAM MOOCs (online courses). This typically ranges from 20–40% depending on the programme, and is aligned with NEP 2020's digital learning goals." },
    ],
  },
  {
    id: "aicte",
    label: "AICTE",
    icon: Globe,
    faqs: [
      { q: "Which institutions require AICTE approval?", a: "All technical institutions offering programmes in Engineering, Technology, Architecture, MBA, MCA, Hotel Management, and Pharmacy at diploma and undergraduate level require AICTE approval — except IITs, NITs, IISc, and other centrally funded institutions." },
      { q: "What are AICTE faculty qualification norms?", a: "For Engineering: minimum BE/BTech + ME/MTech (or PhD). For MCA: MCA/MSc (CS/IT) + PhD preferred. AICTE specifies detailed qualifications by discipline in its Approval Process Handbook, updated annually." },
      { q: "How often does AICTE renew institutional approvals?", a: "AICTE approvals are renewed annually. Institutions must submit self-disclosure and compliance documents each year, maintain prescribed student-teacher ratios, and meet infrastructure requirements per the Approval Process Handbook." },
      { q: "Can an AICTE-approved college increase its intake?", a: "Yes, institutions can apply to increase intake during the annual Approval Process. This requires demonstrating sufficient faculty, infrastructure, and academic performance. AICTE's Expert Committees verify claims through inspection visits." },
      { q: "What is AICTE's role in NBA accreditation?", a: "AICTE promotes NBA (National Board of Accreditation) accreditation for technical programmes. NBA accreditation is outcome-based and signals that a programme meets national quality benchmarks. It is optional but increasingly required for public sector jobs." },
    ],
  },
  {
    id: "nep",
    label: "NEP 2020",
    icon: Zap,
    faqs: [
      { q: "What is NEP 2020?", a: "The National Education Policy 2020 is India's most comprehensive education reform since 1986. It covers school, higher, and vocational education and aims to transform India into a global knowledge superpower by making education more holistic, flexible, multidisciplinary, and aligned with 21st century needs." },
      { q: "What is the 5+3+3+4 school structure in NEP?", a: "NEP 2020 introduces four stages: Foundational (Ages 3–8, 5 years), Preparatory (Ages 8–11, 3 years), Middle (Ages 11–14, 3 years), and Secondary (Ages 14–18, 4 years). This replaces the traditional 10+2 system and focuses on developmental milestones." },
      { q: "How does NEP 2020 change higher education?", a: "NEP proposes a 4-year multidisciplinary undergraduate degree with multiple entry/exit options. Students can leave with a Certificate (1 year), Diploma (2 years), Degree (3 years), or Honours Degree (4 years). An Academic Bank of Credits stores credits for re-entry." },
      { q: "What does NEP say about the medium of instruction?", a: "NEP recommends that the medium of instruction until at least Grade 5 — preferably Grade 8 — should be the home language or regional language. It promotes multilingual education and discourages a hard shift to English in early schooling." },
      { q: "What is NEP's stance on vocational education?", a: "NEP mandates integrating vocational education from Grade 6 onwards, including internships in local industries and craft traditions. By 2025, 50% of learners should have access to vocational education through the formal school and higher education system." },
      { q: "Will UGC and AICTE be merged under NEP?", a: "NEP 2020 proposes replacing UGC, AICTE, and NCTE with a single overarching body — the Higher Education Commission of India (HECI). HECI will have four independent verticals: NHERC (regulation), NAC (accreditation), HEGC (grants), and GEC (general education). This reform is still in progress." },
    ],
  },
  {
    id: "technical",
    label: "Technical",
    icon: Users,
    faqs: [
      { q: "What AI model powers DocIntel?", a: "DocIntel uses Google's Gemini API for answer generation, combined with a custom RAG pipeline that retrieves live policy text from government websites before generating the response." },
      { q: "Why does DocIntel cite URLs instead of PDF page numbers?", a: "DocIntel sources its information from live government web pages, not PDFs. Citations link to the specific page where the information was retrieved so you can verify in real time." },
      { q: "Can I use DocIntel for legal or official purposes?", a: "DocIntel is an AI research assistant and should be used for informational purposes only. Always verify critical information from the official government website or consult a legal/regulatory expert for decisions with legal consequence." },
      { q: "Does DocIntel work on mobile?", a: "Yes — the interface is fully responsive and works on smartphones and tablets. For best experience on long answers, desktop is recommended." },
    ],
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
        <span className="font-sans font-medium text-foreground text-sm md:text-base group-hover:text-primary transition-colors">{q}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-accent" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-64 pb-5" : "max-h-0"}`}>
        <p className="text-muted-foreground font-sans text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
};

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState("general");
  const [search, setSearch] = useState("");

  const activeGroup = faqCategories.find(c => c.id === activeCategory)!;

  const filteredFaqs = search.trim()
    ? faqCategories.flatMap(c => c.faqs).filter(f =>
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase())
      )
    : activeGroup.faqs;

  const isSearching = search.trim().length > 0;

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

          {/* Search input */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg font-sans text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      <div className="container py-12 md:py-16">
        <div className="flex flex-col md:flex-row gap-10">

          {/* ── Sidebar tab nav ── */}
          {!isSearching && (
            <aside className="md:w-52 flex-shrink-0">
              <nav className="space-y-1 sticky top-24">
                {faqCategories.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-left font-sans text-sm transition-all ${
                        activeCategory === cat.id
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {cat.label}
                    </button>
                  );
                })}

                <div className="pt-6 border-t border-border mt-4">
                  <p className="text-xs text-muted-foreground font-sans mb-2 px-1">Still have questions?</p>
                  <Link
                    to="/search"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-sans text-accent hover:text-primary transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Ask DocIntel directly
                  </Link>
                </div>
              </nav>
            </aside>
          )}

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            {isSearching ? (
              <>
                <p className="text-sm text-muted-foreground font-sans mb-6">
                  {filteredFaqs.length} result{filteredFaqs.length !== 1 ? "s" : ""} for "<span className="text-foreground font-medium">{search}</span>"
                </p>
                {filteredFaqs.length > 0 ? (
                  <div className="bg-card border border-border rounded-lg px-6">
                    {filteredFaqs.map(f => <AccordionItem key={f.q} q={f.q} a={f.a} />)}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="font-display text-lg text-foreground mb-2">No results found</p>
                    <p className="text-muted-foreground font-sans text-sm mb-6">Try a different search term, or ask DocIntel directly.</p>
                    <Link to="/search" className="inline-flex items-center gap-2 text-sm font-sans text-accent hover:underline">
                      <MessageCircle className="h-4 w-4" />Ask DocIntel
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Category heading */}
                <div className="flex items-center gap-3 mb-8">
                  {(() => { const Icon = activeGroup.icon; return <Icon className="h-5 w-5 text-accent" />; })()}
                  <h2 className="font-display text-xl md:text-2xl font-bold text-primary">{activeGroup.label}</h2>
                  <span className="text-xs text-muted-foreground font-sans ml-auto">{activeGroup.faqs.length} questions</span>
                </div>

                <div className="bg-card border border-border rounded-lg px-6">
                  {activeGroup.faqs.map(f => <AccordionItem key={f.q} q={f.q} a={f.a} />)}
                </div>

                {/* Cross-link to other categories */}
                <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {faqCategories.filter(c => c.id !== activeCategory).map(cat => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className="flex items-center gap-2 p-3 border border-border rounded-lg bg-card hover:border-accent/30 hover:bg-secondary/30 transition-all text-left group"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                        <span className="font-sans text-sm text-foreground">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default FAQPage;
